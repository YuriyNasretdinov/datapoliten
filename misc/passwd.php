<?
$p = $_GET['password'];
echo md5($p).':'.sha1($p);

?>