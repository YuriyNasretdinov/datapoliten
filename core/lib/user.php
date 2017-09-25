<?php
class User
{
	public $id       = false;
	
	public $name     = false;
	public $email    = false;
	public $password = false;
	
	public $other    = false;
	
	public $used     = false;
	public $quota    = false;
	
	public $pub_directory = false;
	public $srv_directory = false;
	
	function __construct()
	{
		//$_COOKIE['userdata'] = serialize(array('email' => 'nasretdinov@gmail.com'));
		
		if(isset($_COOKIE['userdata']))
		{
			if($tmp = unserialize($_COOKIE['userdata']))
			{
				$this->email = $tmp['email'];
				/*
				 possibly, other data
				*/
			}
		}
		
		$this->fill_info();
	}
	
	/*
	
	Get directory name for user with $id
	
	$type:
	   'pub' -- public address ( e.g. /files/ab/cd/... )
	   'srv' -- server address ( e.g. /home/yourock/www/files/ab/cd/... )
	   
	*/
	
	function get_dir($id, $type='pub' /* or 'srv' */)
	{
		$name = md5(SALT.$id);
		$dir = '/files/'.substr($name, 0, 2).'/'.substr($name, 2, 2).'/'.$name;
		
		if($type == 'srv') $dir = ROOT.$dir;
		
		return $dir;
	}
	
	private function fill_info()
	{
		if(empty($_SESSION['userdata'])) return;
		
		foreach($_SESSION['userdata'] as $k=>$v) $this->$k = $v;
		
		$this->pub_directory = $this->get_dir($this->id);
		$this->srv_directory = ROOT.$this->pub_directory;
		
		/* legacy code, will be removed some time :) */
		
		/* try to create user directory, if it does not exist */
		
		if(!is_dir($this->srv_directory))
		{
			@mkdir(dirname(dirname($this->srv_directory)));
			@mkdir(dirname($this->srv_directory));
			@mkdir($this->srv_directory);
		}
		
		if(!$this->quota || $this->quota != QUOTA)
		{
			$this->quota = QUOTA;
			
			$used = 0;
			
			$dh = opendir($this->srv_directory);
			
			while( false !== ($file = readdir($dh)) )
			{
				$f = $this->srv_directory.'/'.$file;
				if($file[0] == '.') continue;
				if(is_link( $f )) continue;
				
				$used += filesize($f);
			}
			
			closedir($dh);
			
			$this->used = $used;
			
			$this->update_info();
		}
	}
	
	/*
	 
	 checks $data for required fields and RETURNS FALSE ON SUCCESS,
	 or error string otherwise
	 
	 example:
	 
	 if($err = check_fields('field1 field2 field3', $data)) return oop_error($err);
	 extract($data);
	 
	*/
	
	private function check_fields($must, $data)
	{
		if(!is_array($must)) $must = explode(' ', $must);
		
		foreach($must as $v) if(!isset($data[$v])) return 'no key '.$v.' found';
		if(sizeof($data) != sizeof($must)) return 'invalid $data key count: '.sizeof($data).' instead of '.sizeof($must);
		
		return false;
	}
	
	/*
	
	 $data should be contain keys:
	    name, email, password, color
	
   */
	
	function add($data)
	{
		extract($GLOBALS['CLASSES']);

		if($err = $this->check_fields('name email password color', $data)) return oop_error($err, 'Системная ошибка не позволила добавить пользователя в базу данных');
		extract($data);
		
		$other = serialize( array('color' => $color, 'last incoming visit' => 0) );
		
		if(!$MAIL->send($data, 'registration-complete', array( 'username'  => $data['name']))) return oop_error('Could not send the confirmation mail', 'Не удалось отправить письмо с потверждением регистрации на указанный e-mail');
		
		if(!$SQL->qw('INSERT INTO `users`(`name`, `email`, `password`, `other`, `quota`, `used`) VALUES (?,?,?,?,?,0)', htmlspecialchars($name), $email, md5($password).':'.sha1($password), $other,QUOTA )) return oop_error('Could not execute query, which adds user', 'Не удалось добавить пользователя в базу данных');
		
		extract($SQL->res('SELECT `id` FROM `users` WHERE `email` = ?', $email)); /* should create $id :) */
		
		/* create user directory */
		
		$dir = $this->get_dir($id, 'srv');
		@mkdir(dirname(dirname($dir)));
		@mkdir(dirname($dir));
		@mkdir($dir);
		
		setcookie('userdata', serialize(array('email' => $email)), time() + 3*(24*3600*365) /* 3 years */);
		
		return true;
	}
	
	/*
	
	 $data should be contain keys:
	    email, password
	
   */
	
	function auth($data)
	{
		extract($GLOBALS['CLASSES']);
		
		if($err = $this->check_fields('email password', $data)) return oop_error($err);
		extract($data);
		
		$res = $SQL->res('SELECT * FROM `users` WHERE `email` = ?', $email);
		if(!$res) return oop_error('Login incorrect');
		
		if($res['password'] != md5($password).':'.sha1($password)) return oop_error('Auth failure');
		
		setcookie('userdata', serialize(array('email' => $email)), time() + 3*(24*3600*365) /* 3 years */);
		
		$res['other'] = unserialize($res['other']);
		$_SESSION['userdata'] = $res;
		
		$this->fill_info();
		
		return true;
	}
	
	function is_logined()
	{
		return !empty($_SESSION['userdata']);
	}
	
	/*
	
	The function to push user data in $USER array to:
	
	  1) $_SESSION['userdata'] -- user data cache
	
	  2) MySQL database
	
	*/
	
	function update_info()
	{
		extract($GLOBALS['CLASSES']);
		
		foreach($_SESSION['userdata'] as $k=>&$v) $v = $this->$k;
		
		$cache = $_SESSION['userdata'];
		$cache['other'] = serialize($cache['other']);
		
		call_user_func_array( array(&$SQL, 'qw'), array_merge(
		
			array('UPDATE `users` SET `'.implode('`=?,`', array_keys($cache)).'`=? WHERE `id` = ?' ),
			
			array_values($cache),
			
			array($this->id)
		
		) );
		
		return true;
	}
}

$USER=new User;

$CLASSES['USER'] = &$USER;
?>