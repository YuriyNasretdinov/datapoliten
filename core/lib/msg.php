<?php

class Msg
{
	private $total = -1;
	private $new   = -1;
	
	function get_total()
	{
		extract($GLOBALS['CLASSES']);
		
		if($this->total >= 0) return $this->total;
		
		$res = $SQL->res('SELECT COUNT(*) as `cnt` FROM `messages` WHERE `to` = ?', $USER->id);
		
		return ($this->total = $res['cnt']);
	}
	
	function get_new()
	{
		extract($GLOBALS['CLASSES']);
		
		if($this->new >= 0) return $this->new;
		
		$res = $SQL->res('SELECT COUNT(*) as `cnt` FROM `messages` WHERE `to` = ? AND `date` > ?', $USER->id, $USER->other['last incoming visit']);
		
		return ($this->new = $res['cnt']);
	}
	
	function send($to, $text)
	{
		extract($GLOBALS['CLASSES']);
		if(!$USER->is_logined()) return oop_error('user not logined');
		
		return $SQL->qw('INSERT INTO `messages` SET `from` = ?, `to` = ?, `date` = ?, `text` = ?', $USER->id, $to, time(), $text) &&
	
		$MAIL->send($res = $SQL->res('SELECT * FROM `users` WHERE `id` = ?', $to), 'message',
			
			array( 'someone-2' => get_declension($USER->name, 'UTF-8', 2),
				   'username'  => $res['name'],
				   'address'   => 'http://'.$_SERVER['HTTP_HOST'].'/work-area.html#mail'
			)
		);
	}
	
	function delete($id)
	{
		extract($GLOBALS['CLASSES']);
		if(!$USER->is_logined()) return oop_error('user not logined');
		
		return $SQL->qw('DELETE FROM `messages` WHERE `id` = ? AND `to` = ?', $id, $USER->id);
	}
}

$MSG = new Msg;

$CLASSES['MSG'] = &$MSG;
?>