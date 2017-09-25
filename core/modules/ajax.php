<?php
$jshttprequest_object = new JsHttpRequest('UTF-8');
$r = $_REQUEST; // shortcut for $_REQUEST

switch($parts[2]) /* request should be like "POST /ajax/_some_action_/" */
{
	case 'list':
		
		$start   = 0;  // start with what?
		$num     = 50; // number of files to retrieve
		$sort    = 'id'; // sort field
		$order   = 'ASC';
		$filter  = isset($r['filter']) ? $r['filter'] : '';
		
		foreach( explode(' ', 'start num') as $v ) if(isset($r[$v])) $$v = intval($r[$v]);
		
		$sfields = array('id','name','date', 'size', 'oid');
		if(isset($r['sort']) && in_array($r['sort'], $sfields)) $sort = $r['sort'];
		if(isset($r['order'])) $order = strtoupper($r['order'])=='ASC' ? 'ASC' : 'DESC';
		
		$add_middle = ''; // add to WHERE ...'.$add_middle.' ORDER BY...
		
		if($filter && preg_match('/tag\:([0-9]+)/s', $filter, $pat))
		{
			$filter = preg_replace('/tag\:[0-9]+\s*/s', '', $filter);
			
			$add_middle = ' AND `id` IN(SELECT `fid` FROM `files_tags` WHERE `tid`='.sprintf('%d',$pat[1]).')';
		}
		
		$filter = trim($filter);
		
		$add_middle .= ($filter ? ' AND `name` LIKE \'%'.mysql_real_escape_string($filter).'%\'' : '');
		
		extract($SQL->res('SELECT COUNT(*) as `total` FROM `files` WHERE `uid`=?'.$add_middle, $USER->id));
		
		$_RESULT['total_human'] = declension($total,'файл файла файлов');
		$_RESULT['total'] = $total;
		$_RESULT['files'] = array();
		
		$exts = '
		doc:  doc docx rtf odt
		xl:   xls xlsx xlsb ods
		
		arc:  rar zip 7z gz tar bz2 arj
		db:   mdb odb sql dat db
		txt:  txt pdf php php5 pl php4 php3 py html js htm shtml shtm aspx asp cfm djvu
		
		pict: jpg jpe jpeg png gif tiff tif psd bmp svg cr2 eps ico ps ppt odp
		snd:  mp3 wma m4a ogg wav aac amr aif
		
		mov:  mov divx mpg avi mp4 3gpp flv wmv mpeg2 mpeg dv
		';
		
		$iexts = array(); // inverted list for extensions
		
		foreach(explode("\n", $exts) as $v)
		{
			if(!$v = trim($v)) continue;
			list($e, $el) = explode(':', $v);
			$e = trim($e);
			foreach(explode(' ', $el) as $vv) if(!empty($vv)) $iexts[$vv] = $e;
		}
		
		$convertable = $CONVERTABLE;

		
		$users = array();
		
		$sel = $SQL->qw($sql = 'SELECT * FROM `files` WHERE `uid`=?'.$add_middle.' ORDER BY `'.$sort.'` '.$order.' LIMIT '.$start.','.$num, $USER->id);
		
		while($res = $SQL->fetch_assoc($sel))
		{
			$res['hname'] = htmlspecialchars($res['name']);
			if($filter) $res['hname'] = preg_replace('/'.preg_quote($filter).'/usi', '<b><i>$0</i></b>', $res['hname']);
			$res['hdate'] = date('d.m.y',$res['date']);
			
			@$sizes[$res['id']] = show_size(1,1,$res['oid'] == $USER->id ? $res['size'] : filesize($USER->srv_directory.'/'.$res['name']));
			
			$res['hsize'] = &$sizes[$res['id']];
			
			$res['ename'] = rawurlencode($res['name']);
			
			$ext = strtolower(end(explode('.', $res['name'])));
			$res['icon'] = isset($iexts[$ext]) ? $iexts[$ext] : '-';
			
			$res['convertable'] = in_array($ext, $convertable);
			
			$_RESULT['files'][] = $res;
			
			$users[$res['oid']] = $res['oid'];
		}
		
		if(sizeof($users))
		{
			$sel = $SQL->qw('SELECT `id`,`name` FROM `users` WHERE `id` IN (?)', $users);
			while($res = $SQL->fetch_assoc($sel))
			{
				$users[$res['id']] = $res['name'];
			}
		}
		
		$_RESULT['udir'] = $USER->pub_directory;
		
		$_RESULT['users'] = $users;
		break;
	case 'mail':
		$where = '`to`='.intval($USER->id);
		$msg_folder = 'in';
		
		if(isset($r['msg']))
		{
			switch($r['msg'])
			{
				case 'in':
					$msg_folder = 'in';
					$where = '`to`='.intval($USER->id);
					break;
				case 'out':
					$msg_folder = 'out';
					$where = '`from`='.intval($USER->id);
					break;
			}
		}
		
		$muser_field = $msg_folder == 'in' ? 'from' : 'to';
		
		$messages = $users = array();
		
		$sel = $SQL->qw('SELECT * FROM `messages` WHERE '.$where.' ORDER BY `id` DESC');
		
		$i=-1;
		while($res = $SQL->fetch_assoc($sel))
		{
			$res['text'] = hrefActivate($res['text']);
			$res['date'] = date('d.m.Y H:i', $res['date']);
			
			if($i < 0 || $res['text']!=$messages[$i]['text']) $messages[++$i] = $res;
			else                                              $messages[$i][$muser_field].=','.$res[$muser_field];
			
			$users[$res[$muser_field]] = $res[$muser_field];
		}
		
		$SQL->free_result($sel);
		
		$new_msg = $MSG->get_new();
		
		$USER->other['last incoming visit'] = time();
		$USER->update_info();
		
		/* prevent from executing query with IN(), it results in MySQL error */
		
		if(sizeof($users))
		{
			$sel = $SQL->qw('SELECT * FROM `users` WHERE `id` IN (?)', $users);
			
			while($res = $SQL->fetch_assoc($sel))
			{
				$res['other'] = unserialize($res['other']);
				$users[$res['id']] = $res;
			}
			
			$SQL->free_result($sel);
		}
		
		$_RESULT = array( 'messages' => $messages, 'users' => $users, 'new' => $new_msg );
		break;
	case 'info':
		
		$info = $SQL->res('SELECT `id`,`name`,`comment`,`tags` FROM `files` WHERE `uid` = ? AND `id` = ?', $USER->id, $r['id']) or die('Такого файла нет');
		
		$sel = $SQL->qw('SELECT `uid` FROM `files` WHERE `original_id` = ? AND `oid` = ?', $r['id'], $USER->id);
		
		$shared_with = array();
		while($res = $SQL->fetch_assoc($sel)) $shared_with[$res['uid']] = $res['uid'];
		
		if(sizeof($shared_with))
		{
			$sel = $SQL->qw('SELECT `id`,`name` FROM `users` WHERE `id` IN(?)', $shared_with);
			while($res = $SQL->fetch_assoc($sel))
			{
				$t = array_filter(explode(' ',$res['name']));
				$shared_with[$res['id']] = '<u title="'.$res['name'].'">'.(sizeof($t)>1 ? $t[1] : $t[0]).'</u>';
			}
		}
		
		$tags = array_filter(explode(',',$info['tags']),'intval');
		$info['tags'] = array();
		
		if(sizeof($tags))
		{
			$sel = $SQL->qw('SELECT `id`,`name` FROM `tags` WHERE `id` IN(?)', $tags);
			while($res = $SQL->fetch_assoc($sel)) $info['tags'][] = $res['name'];
		}
		
		$info['ext'] = strtolower(end(explode('.', $info['name'])));
		$info['thumbnailable'] = in_array($info['ext'], $IMG_LIST) || $info['ext'] == 'pdf';
		
		$defw = $defh = 180;
		
		if(in_array($info['ext'], $IMG_LIST) && ( ($wh = getimagesize($USER->srv_directory.'/'.$info['name'])) || $info['ext'] == 'ttf'))
		{
			if($info['ext'] == 'ttf') $wh = array($defw,round($defh*(108/180)));
			list($w,$h) = array($wh[0],$wh[1]);
			$max = max($wh[0],$wh[1]);
			$wh[0] /= $max; $wh[1] /= $max;
			$wh[0] *= $defw;  $wh[1] *= $defh;
			$wh[0] = ceil($wh[0]); $wh[1] = ceil($wh[1]);
			
			if($info['ext'] != 'ttf') $info['img_dimensions'] = $w.'x'.$h;
		}
		
		if($info['thumbnailable']) $info['thumb_height'] = isset($wh) ? $wh[1] : $defh;
		
		$info['url'] = $USER->pub_directory.'/'.$info['name'];
		$info['eurl'] = $USER->pub_directory.'/'.rawurlencode($info['name']);
		
		if($info['ext'] == 'mp3') $info['playable'] = true;
		
		$info['ename'] = rawurlencode($info['name']);
		$info['hname'] = htmlspecialchars($info['name']);
		
		$_RESULT = array('info' => $info, 'shared_with' => array_values($shared_with));
		
		break;
	case 'rename':
		$FILES->rename($r['id'], $r['name']) or die('Не удалось переименовать файл: '.$ERROR_DESCRIPTION);
		break;
	case 'delete':
		$FILES->delete($r['id']) or die('Не удалось удалить файл: '.$ERROR_DESCRIPTION);
		break;
	case 'duplicate':
		$FILES->duplicate($r['id']) or die('Не удалось дублировать файл: '.$ERROR_DESCRIPTION);
		break;
	case 'comment':
		$FILES->comment($r['id'], htmlspecialchars($r['comment'])) or die('Не удалось прокоменнтировать файл: '.$ERROR_DESCRIPTION);
		break;
	case 'add-tag':
		$SQL->qw('INSERT INTO `tags` SET `uid`=?,`name`=?', $USER->id, htmlspecialchars($r['name']));
		break;
	case 'get-tags':
		list($_RESULT['out'], $_RESULT['t']) = print_tags(false);
		
		
		break;
	case 'delete-tag':
		$_RESULT = delete_tag(intval($r['id']));
		break;
}
?>