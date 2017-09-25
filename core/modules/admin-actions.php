<?php
switch($parts[2])
{
	case 'modify-files':
		
		$sel = $SQL->qw('SELECT `f`.*, `u`.`name` `uname`, `o`.`name` `oname`
						FROM `files` `f`
						LEFT JOIN `users` `u` ON ( `u`.`id` = `f`.`uid` )
						LEFT JOIN `users` `o` ON ( `o`.`id` = `f`.`oid` )
						');
		
		echo '<table border=1><tr><th>user</th><th>owner</th><th>name</th><th>date</th><th>size</th><th>inode</th><th>original_id</th></tr>';
		
		while($res = $SQL->fetch_assoc($sel))
		{
			$dir = $USER->get_dir($res['uid'], 'srv');
			
			$file = $dir.'/'.$res['name'];
			$s = lstat($file);
			
			$lnk_text = $owner = '';
			
			/*
			 if(is_link($file))
			{
				$lnk_text .= '&nbsp;<b>-&gt;</b>&nbsp;';
				$lnk_text .= htmlspecialchars($link = readlink($file));
				
				$owner = -1;
				$short = mb_basename($link);
				
				if($owner_tmp = $SQL->res('SELECT `id` FROM `files` WHERE `uid` = ? AND `oid` = ? AND `name` = ?', $res['oid'], $res['oid'], $short))
				{
					$owner = $owner_tmp['id'];
				}
			}
			
			echo '<tr><td>'.htmlspecialchars($res['uname']).'</td><td>'.htmlspecialchars($res['oname']).'</td><td>'.htmlspecialchars($res['name']).$lnk_text.'</td><td>'.$res['date'].' - '.$s['mtime'].'</td><td><nobr>'.$res['size'].' (base) </nobr><br><nobr> '.$s['size'].' (formal) </nobr><br><nobr> '.(512 * $s['blocks']).' (real)</nobr></td><td>'.$res['inode'].' - '.$s['ino'].'</td><td>'.$res['original_id'].($owner ? ' - '.($owner == -1 ? '<b>ERROR!</b>' : $owner) : '').'</td></tr>';
			
			*/
			
			if(false) $SQL->qw('UPDATE `files` SET `date`=?, `size`=?, `inode` = ?, `original_id` = ?  WHERE `id` = ?', $s['mtime'], $s['size'], $s['ino'], $owner, $res['id']);
			else      $SQL->qw('UPDATE `files` SET `size`=? WHERE `id` = ?', is_link($file) ? 0 : $s['size'], $res['id']);
			/*
			
			if(!$s || $owner == -1)
			{
				unlink($file);
				$SQL->qw('DELETE FROM `files` WHERE `id` = ?', $res['id']);
			}
			*/
		}
		
		$sel = $SQL->qw('SELECT SUM(`size`) as `sz`, `uid` FROM `files` GROUP BY `uid`');
		while($res = $SQL->fetch_assoc($sel))
		{
			$SQL->qw('UPDATE `users` SET `used` = ? WHERE `id` = ?', $res['sz'], $res['uid']);
		}
		
		echo '</table>';
		
		break;
	case 'check-folders':
		
		echo '<table><tr><th>id</th><th>name</th><th>dir</th></tr>';
		
		$sel = $SQL->qw('SELECT * FROM `users` ORDER BY `id`');
		
		while($res = $SQL->fetch_assoc($sel))
		{
			echo '<tr><td>'.$res['id'].'</td><td>'.$res['name'].'</td><td>'.$USER->get_dir($res['id']).'</td></tr>';
		}
		
		echo '</table>';
		
		break;
	case 'test-mail':
		
		if($MAIL->send($_SESSION['userdata'], 'message', array( 'someone-2' => get_declension($USER->name, 'UTF-8', 2), 'username' => $USER->name, 'address' => 'http://'.$_SERVER['HTTP_HOST'].'/?msg=in' ))) echo 'Письмо послано, проверьте почту';
		else echo 'Не удалось послать письмо';
		
		break;
	case 'retag':
		
		$SQL->qw('DELETE FROM `files_tags` WHERE `tid` NOT IN(SELECT `id` FROM `tags`)');
		
		$sel = $SQL->qw('SELECT `id` FROM `files`');
		
		while($res = $SQL->fetch_assoc($sel))
		{
			$tsel = $SQL->qw('SELECT `tid` FROM `files_tags` WHERE `fid` = ?', $res['id']);
			
			for($tags = array(); $tres = $SQL->fetch_assoc($tsel);) $tags[] = $tres['tid'];
			
			$SQL->qw('UPDATE `files` SET `tags` = ? WHERE `id` = ?', implode(',', $tags), $res['id']);
		}
		
		$SQL->qw('OPTIMIZE TABLE `files`');
		
		break;
	default:
		
		echo '<h3>Возможные действия:</h3>';
		
		echo '<ul>';
		
		function echo_action($link, $name)
		{
			echo '<li><a href="/admin-action/'.$link.'/">'.$name.'</a></li>';
		}
		
		echo_action('modify-files', 'Модифицировать базу файлов');
		echo_action('check-folders', 'Проверить базу данных пользователей');
		echo_action('test-mail', 'Проверить работу e-mail');
		echo_action('retag', 'Расставить все метки заново');
		
		echo '</ul>';
		
		break;
}
?>