<?php

class Files
{
	private function get_info($id)
	{
		extract($GLOBALS['CLASSES']);
		
		if(!$USER->is_logined()) return oop_error('File operation trial without being logined', 'Вы должны зайти в систему, чтобы выполнить это действие');
		if(!$res = $SQL->res('SELECT * FROM `files` WHERE `id` = ? AND `uid` = ?', $id, $USER->id)) return oop_error('No such file', 'Такого файла, принадлежащего Вам, не найдено');
		
		return $res;
	}
	
	function delete($id)
	{
		extract($GLOBALS['CLASSES']);
		
		if(!$res = $this->get_info($id)) return false;
		
		$f = $USER->srv_directory.'/'.$res['name'];
		$sz = $res['uid'] == $res['oid'] ? filesize($f) : 0;
		
		return ( $SQL->qw('DELETE FROM `files` WHERE `id` = ?', $id) &&
		
		/* we have already checked, that user owns that file, so no uid check anymore */
		
		(unlink($f) or oop_error('Cannot unlink '.$f, 'Не удалось удалить '.mb_basename($f))) &&
		
		/* commit changes */
		
		( ($USER->used -= $sz)!==false && ($USER->update_info()) )
		
		);
	}
	
	function comment($id, /* HTML Code of */ $comment)
	{
		extract($GLOBALS['CLASSES']);
		
		if(!$res = $this->get_info($id)) return false;
		
		return ( $SQL->qw('UPDATE `files` SET `comment` = ? WHERE `id` = ?', $comment, $id) );
	}
	
	function duplicate($id)
	{
		extract($GLOBALS['CLASSES']);
		
		if(!$res = $this->get_info($id)) return false;
		
		$from = $USER->srv_directory.'/'.$res['name'];
		$sz = filesize($from);
		
		if( $USER->used + $sz > $USER->quota ) return oop_error('Quota will be exceeded if operation is completed', 'Недостаточно места для осуществления этой операции');
		
		//if($res['oid'] != $USER->id) return oop_error('tried to duplicate foreign file');
		
		$newname = timestamp().' '.$res['name'];
		
		return (
				(copy($from, $to = $USER->srv_directory.'/'.$newname) or oop_error('Cannot copy '.$from.' to '.$to, 'Копирование файла не удалось')) &&
				
				$SQL->qw('INSERT INTO `files` SET `name`=?, `uid`=?, `oid`=?, `date`=?, `size`=?,`comment`=?, `inode` = ?, `tags`=?', $newname, $USER->id, $USER->id, $time = time(), $sz, 'дубликат '.$res['name'].($res['comment'] ? ' ('.$res['comment'].')' : ''), $ino = fileinode($to), $res['tags']) &&
				
				( ($USER->used += $sz)!==false && ($USER->update_info()) &&
				
				( empty($res['tags']) ? true :
				 
				 @extract($SQL->res('SELECT `id` FROM `files` WHERE `uid` = ? AND `date`=? AND `inode`=?', $USER->id, $time, $ino)) &&
				 
				 @$SQL->qw('INSERT INTO `files_tags`(`fid`,`uid`,`tid`) VALUES('.$id.','.$USER->id.','.str_replace(',','),('.$id.','.$USER->id.',',$res['tags']).')')
				 
				 ) )
				);
	}
	
	function share(/* file with id */ $id, /* with */ $user_id, /* HTML code of */ $comment)
	{
		extract($GLOBALS['CLASSES']);
		
		if(!$res = $this->get_info($id)) return false;
		
		/*if($res['oid'] != $USER->id)
		{
			return oop_error('tried to share foreign file', 'На данный момент запрещено разделять файлы, которые не принадлежат Вам. Вы можете дублировать чужой файл, и дать доступ к копии.');
		}*/
		
		$to_dir   = $USER->get_dir($user_id, 'srv');
		$from_dir = $USER->srv_directory;
		
		$newname = $res['name'];
		
		if(file_exists($to_dir.'/'.$newname)) $newname = timestamp().' '.$newname;
		
		return (
				(
				 (exec($cmd = 'ln -s '.escapeshellarg($from = $from_dir.'/'.$res['name']).' '.escapeshellarg($to = $to_dir.'/'.$newname), $out, $ret)!==false && $ret == 0) or oop_error('Cannot create symlink from '.$from.' to '.$to.' by command: "'.$cmd.'"', 'Извините, системная ошибка не позволила дать доступ к Вашему файлу')
				)
				
				&&
				
				$SQL->qw('INSERT INTO `files` SET `name`=?, `uid`=?, `oid`=?, `date`=?, `comment` = ?, `original_id` = ?, `inode` = ?', $newname, $user_id, $USER->id, time(), $comment, $id, fileinode($to) )
				);
	}
	
	function rename($id, $newname)
	{
		extract($GLOBALS['CLASSES']);
		
		if(!$res = $this->get_info($id)) return false;
		
		if($newname[0] == '.') return oop_error('The name of file cannot begin with dot [.]', 'Имена файлов не могут начинаться с точки [.]');
		
		//if($res['oid'] != $USER->id) return oop_error('Renaming of foreign file', 'Файлы, не принадлежащие Вам, запрещено переименовывать');
		
		$newname = mb_basename($newname);
		
		if(file_exists($USER->srv_directory.'/'.$newname)) $newname = timestamp().' '.$newname;
		
		return ( $SQL->qw('UPDATE `files` SET `name`=?, `date`=? WHERE `id`=?', $newname, time(), $id) &&
				
				(rename($from = $USER->srv_directory.'/'.$res['name'], $to = $USER->srv_directory.'/'.$newname) or oop_error('Cannot rename from '.$from.' to '.$to, 'Переименование не удалось из-за системной ошибки')) );
	}
}

$FILES = new Files;

$CLASSES['FILES'] = &$FILES;
?>