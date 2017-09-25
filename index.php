<?php
error_reporting(E_ALL);

if($_SERVER['HTTP_HOST'] != 'datapoliten.ru' && $_SERVER['HTTP_HOST'] != 'localhost' && $_SERVER['HTTP_HOST'] != 'datapoliten')
{
	header('location: http://datapoliten.ru'.$_SERVER['REQUEST_URI']);
	die();
}

define('START_TIME', microtime(true));

function time_calculator($str)
{
	return str_replace('<total_time/>', round(microtime(true) - START_TIME, 4), $str);
}

ob_start('time_calculator');

if(isset($_POST['S'])) session_id($_POST['S']); // для корректной работы SWFUpload

session_start();
header('content-type: text/html; charset=UTF-8');

chdir('core');
require('./config.php');
chdir('lib');
$dh = opendir('.');
$CLASSES = array(); /* list of links to all classes, that are used (to do extract($GLOBALS['CLASSES']); at the beginning of function) */
while($f = readdir($dh))
{
	if($f[0]=='.') continue;
	require('./'.$f);
}
closedir($dh);

mb_internal_encoding("UTF-8");
chdir(ROOT);

$parts = explode('/', $_SERVER['QUERY_STRING'] ? substr($_SERVER['REQUEST_URI'], 0, strlen($_SERVER['REQUEST_URI']) - 1 - strlen($_SERVER['QUERY_STRING'])) : $_SERVER['REQUEST_URI']);

switch($parts[1])
{
	case 'ajax':
		include('core/modules/ajax.php');
		break;
	case 'captcha':
		chdir('core/captcha');
		include('./index.php');
		break;
	case 'do-register':
		
		$err = array();
		
		if(empty($_POST['email'])) $err[] = 'введите e-mail';
		if(empty($_POST['name'])) $err[] = 'введите ФИО';
		if(empty($_POST['password']) || $_POST['password']!=$_POST['password2']) $err[] = 'пароли не совпадают (или они пустые)';
		if(! (isset($_SESSION['captcha_keystring']) && $_SESSION['captcha_keystring'] ==  $_POST['keystring']) ) $err[] = 'введите правильный код на картинке';
		
		unset($_SESSION['captcha_keystring']);
		
		if(sizeof($err) > 0)
		{
			die('Обнаружены ошибки: <ul><li>'.implode('</li><li>',$err).'</li></ul>');
		}else
		{
			//echo 'Ваши данные: ';
			//array_display($_POST);
			
			$color = sprintf("%02x%02x%02x", mt_rand(0, 255), mt_rand(0,255), mt_rand(0,255));
			
			//echo 'Ваш цвет: <div style="width: 16px; height: 16px; background: #'.$color.';"></div>';
			
			unset($_POST['password2']);
			unset($_POST['keystring']);
			$_POST['color'] = $color;
			
			if($USER->add($_POST))
			{
				echo 'Вы успешно зарегистрировались';
			}else
			{
				echo 'Регистрация не удалась. :(';
			}
		}
		
		
		break;
	case 'do-login':
		
		unset($_POST['x']);
		unset($_POST['y']);
		
		if($USER->auth($_POST))
		{
			if(empty($_SESSION['saved-location']) || $_SESSION['saved-location'] == '/' || $_SESSION['saved-location'] == '/login.html') header('Location: /work-area.html');
			else
			{
				header('Location: '.$_SESSION['saved-location']);
				$_SESSION['saved-location'] = null;
			}
		}else
		{
			echo '<!--',print_r($_POST),'-->';
			die('Данные авторизации указаны неверно');
		}
		
		break;
	case 'convert':
		if(!$USER->is_logined()) die('Вы должны войти в систему перед просмотром своих файлов');
		include('core/modules/convert.php');
		break;
	case 'do-logout':
		
		session_destroy();
		header('Location: /login.html');
		
		break;
	case 'do-operation':
		
		if(!$USER->is_logined()) die('Вы должны войти в систему перед выполнением операций над своими файлами');
		
		if(isset($_POST['id'])) $_POST['ids'] = array($_POST['id']);
		
		if(empty($_POST['ids']) || !is_array($_POST['ids'])) die('Выберите файлы, с которым требуется произвести это действие');
		foreach($_POST['ids'] as $v) if(!is_numeric($v)) die('Неправильный формат входных файлов');
		
		$ids = $_POST['ids'];
		
		switch($_POST['action'])
		{
			case 'delete':
				save_referer();
				foreach($ids as $v) $FILES->delete($v) or die($ERROR_DESCRIPTION);
				break;
			case 'duplicate':
				save_referer();
				foreach($ids as $v) $FILES->duplicate($v) or die($ERROR_DESCRIPTION);
				break;
			case 'comment':
				save_referer();
				foreach($ids as $v) $FILES->comment($v, nl2br(htmlspecialchars($_POST['newname']))) or die($ERROR_DESCRIPTION);
				break;
			case 'share':
				save_referer();
				
				$sel = $SQL->qw('SELECT * FROM `users` WHERE `id` <> ?', $USER->id);
				
				$users = array();
				
				while($res = $SQL->fetch_assoc($sel))
				{
					$res['other'] = unserialize($res['other']);
					$users[] = $res;
				}

				chdir(ROOT.'/templates/service');
				include('../indirect/share.html');
				
				die();
				
				break;
			case 'tag':
				save_referer();
				
				$sel = $SQL->qw('SELECT `id`,`tags` FROM `files` WHERE `id` IN(?)', $ids);
				
				$tags = array();
				
				while($res = $SQL->fetch_assoc($sel))
				{
					$tmp = explode(',', $res['tags']);
					foreach($tmp as $v) $tags[$v] = $v;
				}
				
				$sel = $SQL->qw('SELECT `id`,`name` FROM `tags` WHERE `uid`=? ORDER BY `id`', $USER->id);
				
				$tagnames = array();
				
				while($res = $SQL->fetch_assoc($sel)) $tagnames[$res['id']] = $res['name'];
				
				chdir(ROOT.'/templates/service');
				include('../indirect/tags.html');
				
				die();
				
				break;
			case 'do-tag':
				$tags = array();
				
				foreach($_POST['tag-ids'] as $v) $tags[] = intval($v);
				
				$tags_str = implode(',',$tags);
				
				$SQL->qw('UPDATE `files` SET `tags` = ? WHERE `uid` = ? AND `id` IN(?)', $tags_str, $USER->id, $ids);
				
				$SQL->qw('DELETE FROM `files_tags` WHERE `uid` = ? AND `fid` IN (?)', $USER->id, $ids);
				
				foreach($ids as $id)
				{
					foreach($tags as $tag)
					{
						$SQL->qw('INSERT INTO `files_tags` SET `uid`=?, `fid`=?, `tid`=?', $USER->id, $id, $tag);
					}
				}
				
				break;
			case 'do-share':
				if(empty($_POST['user-ids']) || !is_array($_POST['user-ids'])) die('Выберите, с кем поделиться файлом');
				
				foreach($_POST['user-ids'] as $uid)
				{
					foreach($ids as $v) $FILES->share($v, $uid, nl2br(htmlspecialchars($_POST['comment']))) or die($ERROR_DESCRIPTION);
				}
				break;
			case 'rename':
				save_referer();
				$FILES->rename($ids[0], $_POST['newname']) or die($ERROR_DESCRIPTION);
				break;
		}
		
		$ref = get_referer();
		
		if(substr($ref, -strlen('work-area.html')) == 'work-area.html')
		{
			die('
			<script>
				try{
					var id = window.opener.Fi.get_sfile()["id"];
					window.opener.$("file"+id).onclick();
					window.opener.$("file"+id).onclick();
					'.($_POST['action'] == 'do-tag' ? 'window.opener.Fi.refresh_tags(); window.opener.Fi.reload();' : '').'
				}catch(e){};
				
				window.close();
			</script>');
		}else
		{
			header('Location: '.get_referer());
		}
		
		//die('<script>window.location="'.addslashes($url).'";</script>');
		
		//header('Location: /');
		
		break;
	case 'do-upload':
		
		if(!$USER->is_logined())
		{
			error_log('upload trial without auth');
			die('Вы должны войти, чтобы добавлять файлы');
		}
		
		$send_answer = true;
		
		if(!empty($_FILES['Filedata']))
		{
			/* Means SWFUpload is in progress */
			
			$data = $_FILES['Filedata'];
			
			$_FILES = array( 'file' =>
				array(
					'name'     => $data['name'],
					'tmp_name' => $data['tmp_name'],	
				)
			);
			
			$send_answer = false;
		}
		
		if(!$_FILES['file']['tmp_name'])
		{
			if($send_answer) die('Пожалуйста, выберите файл для закачки');
			else
			{
				header('HTTP/1.1 500 File Upload Error');
				die();
			}
		}
		
		/*
		ob_start();
		print_r($_FILES);
		error_log('File info: '.ob_get_clean());
		*/
		
		$_FILES['file']['name'] = mb_basename($_FILES['file']['name']);
		
		
		
		if($_FILES['file']['name'][0] == '.')
		{
			if($send_answer) die('Загрузка файлов, начинающихся с точки [.], запрещена');
			else
			{
				header('HTTP/1.1 500 File Upload Error');
				die();
			}
		}
		
		if(filesize($_FILES['file']['tmp_name']) + $USER->used > $USER->quota)
		{
			if($send_answer) die('Превышена файловая квота');
			else
			{
				header('HTTP/1.1 500 File Upload Error');
				die();
			}
		}
		
		$to = $USER->srv_directory.'/'.$_FILES['file']['name'];
		
		if(file_exists($to))
		{
			$_FILES['file']['name'] = timestamp().' '.$_FILES['file']['name'];
			$to = $USER->srv_directory.'/'.$_FILES['file']['name'];
		}
		
		if(!move_uploaded_file($from = $_FILES['file']['tmp_name'], $to))
		{
			error_log('Upload failed: cannot move '.$from.' to '.$to);
			
			if($send_answer) die('Извините, произошла системная ошибка. Информация об ошибке уже отправлена администратору');
			else
			{
				header('HTTP/1.1 500 File Upload Error');
				die();
			}
		}
		
		$s = stat($to);
		
		if(!@$SQL->qw('INSERT INTO `files` SET `uid`=?, `oid`=?, `name`=?, `date`=?, `size` = ?, `inode` = ?', $USER->id, $USER->id, mb_basename($_FILES['file']['name']), time(), $s['size'], $s['ino']))
		{
			unlink($to);
			die('Произошла непредвиденная ошибка базы данных. Сожалеем, но Вам придется попробовать загрузить файлы через некоторое время.');
		}
		
		$USER->used += filesize($to);
		$USER->update_info();
		
		if($send_answer) echo '<script>window.opener.location.reload();</script>Файл добавлен успешно<br><br><a href="/upload.html">добавить еще один</a>';
		else die('good');
		
		break;
	case 'stats':
		if(!$USER->is_logined() || !in_array($USER->id, array(1,2,6))) die('Вам не дозволено находиться здесь');
		include('core/modules/stats.php');
		break;
	case 'admin-action':
		if(!$USER->is_logined() || $USER->id != 1) die('Вам не дозволено находиться здесь');
		include('core/modules/admin-actions.php');
		break;
	case 'new-message':
		
		chdir(ROOT.'/templates/service');
		
		$sel = $SQL->qw('SELECT * FROM `users` WHERE `id` <> ?', $USER->id);
		
		$users = array();
		
		while($res = $SQL->fetch_assoc($sel))
		{
			$res['other'] = unserialize($res['other']);
			$users[] = $res;
		}
		
		chdir(ROOT.'/templates/service');
		include('../indirect/new-message.html');
		
		die();
		
		break;
	case 'do-new-message':
		if(!$USER->is_logined()) die('Вы должны войти в систему, чтобы писать сообщения');
		if(empty($_POST['ids']) || !is_array($_POST['ids'])) die('Выберите, кому Вы хотите послать сообщение');
		
		foreach($_POST['ids'] as $v) $MSG->send($v, nl2br(htmlspecialchars($_POST['text'])));
		
		die('<script>if(window.opener && window.opener.Ma) { window.opener.Ma.load("out"); window.close(); } else window.location = "/?msg=out";</script>');
		header('location: /?msg=out');
		
		break;
	case 'do-delete-message':
		if(!$USER->is_logined()) die('Вы должны войти в систему, чтобы удалять сообщения');
		
		$MSG->delete($parts[2]);
		
		header('location: /?msg=in');
		
		break;
	case 'do-edit-profile':
		if(!$USER->is_logined()) die('Вы должны войти в систему, чтобы изменять свой профиль');
		
		$pass = $_POST['old-password'];
		$pass_hash = md5($pass).':'.sha1($pass);
		
		if($pass_hash == $USER->password && !empty($_POST['password']))
		{
			if($_POST['password'] != $_POST['password2'])
			{
				die('Введенные Вами новые пароли не совпадают');
			}
			
			$pass = $_POST['password'];
			$pass_hash = md5($pass).':'.sha1($pass);
			
			$USER->password = $pass_hash;
		}else if($pass && $pass_hash != $USER->password)
		{
			die('Введенный Вами старый пароль неверный');
		}
		
		$USER->name = htmlspecialchars($_POST['name']);
		
		if(!preg_match('/^#[a-z0-9]{6}$/s',$_POST['color']))
		{
			die('Цвет обязательно должен быть в формате #ffffff (в нижнем регистре, ровно 6 hex-чисел для цвета) !');
		}
		
		$USER->other['color'] = substr($_POST['color'], 1);
		
		$USER->update_info();
		
		echo 'Профиль обновлен успешно<script>window.opener.location.reload(); window.close();</script>';
		
		break;
	case 'do-add-tag':
		if(!$USER->is_logined()) die('Вы должны войти в систему, чтобы добавить метку');
		
		$SQL->qw('INSERT INTO `tags` SET `uid`=?,`name`=?', $USER->id, htmlspecialchars($_POST['name']));
		
		header('Location: /');
		break;
	case 'do-delete-tag':
		if(!$USER->is_logined()) die('Вы должны войти в систему, чтобы удалить метку');
		//$_GET['debug'] = true;
		
		
		$tid = intval($_POST['id']);
		
		delete_tag($tid);
		
		header('Location: /');
		break;
	case 'addressbook':
		if(!$USER->is_logined()) die('Вы должны войти в систему, чтобы просматривать адресную книгу');
		
		$friends = array();
		$sel = $SQL->qw('SELECT `friend` FROM `addressbook` WHERE `uid` = ?', $USER->id);
		while($res = $SQL->fetch_assoc($sel))
		{
			$friends[$res['friend']] = $res['friend'];
		}
		
		$users = array();
		$sel = $SQL->qw('SELECT `id`,`name`,`other` FROM `users` WHERE `id` NOT IN(?)', array($USER->id));
		while($res = $SQL->fetch_assoc($sel))
		{
			$res['other'] = unserialize($res['other']);
			$users[$res['id']] = $res;
		}
		
		chdir(ROOT.'/templates/service');
		include('../indirect/addressbook.html');
		
		die();
		break;
	case 'do-add-friend':
		if(!$USER->is_logined()) die('Вы должны войти в систему, чтобы добавить человека в адресную книгу');
		
		foreach($_POST['user-ids'] as $v) $SQL->qw('INSERT INTO `addressbook`(`uid`,`friend`) VALUES(?,?)', $USER->id, $v);
		
		header('location: /addressbook/');
		break;
	case 'do-delete-friend':
		if(!$USER->is_logined()) die('Вы должны войти в систему, чтобы добавить человека в адресную книгу');
		
		$SQL->qw('DELETE FROM `addressbook` WHERE `uid`=? AND `friend`=?', $USER->id, $parts[2]);
		
		header('location: /addressbook/');
		break;
	default:
		if(empty($_SESSION['saved-location'])) /* && strlen($_SERVER['REQUEST_URI']) > 1) */
		{
			/* save user location in case he was not logined, but clicked some link, e.g. in e-mail message */
			$_SESSION['saved-location'] = $_SERVER['REQUEST_URI'];
		}
		
		$tpl = $parts[1];
		
		if(empty($tpl))
		{
			$tpl = 'index.html';
			
			if($USER->is_logined())
			{
				/* a part of my filelist*/
				
				$list = $users =  array();
				
				if(!isset($_GET['msg']))
				{
					
					/* additions to SQL query */
					$add_middle = '';
					$add_end    = '';
					
					$files_folder = 'all';
					
					$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
					$limit = 'LIMIT '.(($page-1)*PERPAGE).','.PERPAGE;
					
					if(isset($_GET['files']))
					{
						$files_folder = $_GET['files'];
						switch($_GET['files'])
						{
							case 'all':
								$add_end = '';
								break;
							case 'no-tags':
								$add_middle = 'AND `tags`=\'\'';
								break;
							case 'with-tags':
								$add_middle = 'AND `tags`!=\'\'';
								break;
							case 'my':
								$add_middle = 'AND `oid`='.intval($USER->id);
								break;
							case 'foreign':
								$add_middle = 'AND `oid`<>'.intval($USER->id);
								break;
							default:
								$files_folder = 'all';
								break;
						}
					}
					
					if(isset($_GET['tag']))
					{
						$sel = $SQL->qw('SELECT `fid` FROM `files_tags` WHERE `tid` = ?', $_GET['tag']);
						
						$fids = array();
						while($res = $SQL->fetch_assoc($sel)) $fids[] = $res['fid'];
						
						if(sizeof($fids)) $add_middle = 'AND `id` IN('.implode(',',$fids).')';
						else $add_middle = 'AND `id` = -1';
					}
					
					list($total_files) = $SQL->res('SELECT COUNT(*) as `0` FROM `files` WHERE `uid` = ? '.$add_middle.' '.$add_end, $USER->id);
					$total_pages = ceil($total_files / PERPAGE);
					
					$sel = $SQL->qw('SELECT * FROM `files` WHERE `uid`=? '.$add_middle.' ORDER BY `date` DESC '.$add_end.' '.$limit, $USER->id);
					
					$file_ids = array(); /* IDs of files, that user owns */
					
					while($res = $SQL->fetch_assoc($sel))
					{
						$lres = $res; /* List RES */
						if($res['uid'] != $res['oid']) $lres['size'] = filesize($USER->srv_directory.'/'.$res['name']);
						$lres['tags'] = array_filter(explode(',',$res['tags']));
						
						$list[] = $lres;
						$users[$res['oid']] = $res['oid'];
						
						/*if($res['oid'] == $res['uid']) */$file_ids[] = $res['id'];
					}
					
					$SQL->free_result($sel);
					
					$tags = array();
					
					$sel = $SQL->qw('SELECT * FROM `tags` WHERE `uid`=? ORDER BY `id`', $USER->id, $tags);
					
					while($res = $SQL->fetch_assoc($sel)) $tags[$res['id']] = $res['name'];
					
					$SQL->free_result($sel);
					
					$shared_with = array(); /* array( file_id => array(user1, user2, ...) ) */
					
					if(sizeof($file_ids))
					{
						$sel = $SQL->qw('SELECT `uid`, `original_id` FROM `files` WHERE `original_id` IN(?)', $file_ids);
						
						while($res = $SQL->fetch_assoc($sel))
						{
							$shared_with[$res['original_id']][$res['uid']] = $res['uid'];
							$users[$res['uid']] = $res['uid'];
						}
						
						$SQL->free_result($sel);
					}
				}else
				{
					$where = '`to`='.intval($USER->id);
					$msg_folder = 'in';
					
					if(isset($_GET['msg']))
					{
						switch($_GET['msg'])
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
					
					$messages = array();
					
					$sel = $SQL->qw('SELECT * FROM `messages` WHERE '.$where.' ORDER BY `id` DESC');
					
					$i=-1;
					while($res = $SQL->fetch_assoc($sel))
					{
						$res['text'] = hrefActivate($res['text']);
						
						if($i < 0 || $res['text']!=$messages[$i]['text'])
						{
							$messages[++$i] = $res;
						}else
						{
							$messages[$i][$muser_field].=','.$res[$muser_field];
						}
						$users[$res[$muser_field]] = $res[$muser_field];
					}
					
					$SQL->free_result($sel);
					
					$USER->other['last incoming visit'] = time();
					$USER->update_info();
				}
				
				/* prevent from executing query with IN(), it results in MySQL error */
				
				if(sizeof($users))
				{
					$sel = $SQL->qw('SELECT * FROM `users` WHERE `id` IN (?)', $users);
					
					while($res = $SQL->fetch_assoc($sel))
					{
						$res['other'] = unserialize($res['other']);
						$tmp = explode(' ', $res['name']);
						if(!empty($tmp[1])) $name = $tmp[1];
						else $name = $res['name'];
						$res['short name'] = $name;
						$users[$res['id']] = $res;
					}
					
					$SQL->free_result($sel);
				}
			}
		}
		
		// chdir is for construction "include('some.html');" use path templates/service/some.html
		chdir('templates/service');
		
		if(preg_match('/^.*\.html$/s', $tpl) && file_exists('../'.$tpl))
		{
			if($tpl == 'register.html' && isset($_POST['code']))
			{
				if($_POST['code'] == REGISTRATION_PASS)
				{
					$_SESSION['allowed'] = true;
				}
				
				header('Location: /register.html');
			}
			
			$_SESSION['allowed'] = true; // всегда разрешать регистрацию
			
			if($tpl == 'register.html' && empty($_SESSION['allowed']))
			{
				die('Тестирование сайта в данный момент является закрытым. Вы должны ввести кодовое слово, чтобы получить возможность зарегистрироваться:<br><br>
					<form action="/register.html" method="POST"><input type="text" name="code"><input type="submit" value="подтвердить"></form>');
			}
			
			include('../'.$tpl);
		}else
		{
			die('Извините, такой страницы не существует');
		}
		break;
}

//echo '<!-- ', !print_r($_SESSION), '  -->';
?>