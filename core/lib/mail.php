<?php

class Mail
{
	/* $uinfo    -- user info array
	   $tpl      -- name of mail template to use
	   $replaces -- array with things to replace
	*/
	
	function send($uinfo, $tpl, $replaces)
	{
		extract($GLOBALS['CLASSES']);
		extract($uinfo);
		
		$fp = fopen(ROOT.'/templates/mail/'.$tpl.'.txt', 'r');
		fgets($fp); /* we do not need first line, it always is a comment :) */
		
		$eol = fgets($fp, 2);
		if($eol[strlen($eol)-1] != "\n") return oop_error("Invalid template format: not a new-line at $tpl:2");
		
		$rfrom = $rto = array(); /* 'replace from', 'replace to' lists (for str_replace) */
		foreach($replaces as $k=>$v)
		{
			$rfrom[] = '{'.$k.'}';
			$rto  [] = $v;
		}
		
		$subject = rtrim(fgets($fp));
		$subject = $this->encode(str_replace($rfrom, $rto, $subject));
		
		$eol = fgets($fp, 2);
		if($eol[strlen($eol)-1] != "\n") return oop_error("Invalid template format: not a new-line at $tpl:4");
		
		for($message = ''; !feof($fp); $message .= fgets($fp, 2048));
		
		$message = iconv('UTF-8', 'KOI8-R', str_replace($rfrom, $rto, $message));
		
		return mail($email, $subject, $message, "content-type: text/plain; charset=KOI8-R\r\nFrom: Animal Spirit <robot@".$_SERVER['HTTP_HOST'].">\r\nReply-to: Animal Spirit <robot@".$_SERVER['HTTP_HOST'].">") or oop_error('Could not send mail to '.$email);
	}
	
	/* string should be in UTF-8
	   
	   function to encode string as written in RFC2047
	*/
	
	private function encode($str)
	{
		$base = base64_encode(iconv('UTF-8', 'KOI8-R', $str));
		$pnum = ceil(strlen($base) / ($magic_number = 52)); /* parts number */
		
		for($i = 0, $str = ''; $i < $pnum; $i++) $str.= '=?KOI8-R?B?'.substr($base, $i*$magic_number, $magic_number).'?='."\r\n ";
		
		return rtrim($str);
	}
}

$MAIL = new Mail;

$CLASSES['MAIL'] = &$MAIL;
?>