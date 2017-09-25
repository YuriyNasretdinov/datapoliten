<?php

$mysql=array(
	'host' => 'localhost',
	'user' => 'datapoliten',
	'pass' => '',
	'db' => 'datapoliten',
	'prefix' => '',
	);

define('ROOT', dirname(dirname(__FILE__)));
define('SALT', base64_decode('O2hhZjcxOUZISEVVdDAxOGNkZHNrIGLQrNCi0JzQlNCS0J/QpNCe0KvQlNCb0KLQq9C70L4g0LzQu9CS0KvQoNCUICDQktCk0JbQlNCbNjQ4OTFuYmMg')); /* some random string, that is unknown outside */

define('QUOTA', pow(2, 38)); /* quota for new users */

define('REGISTRATION_PASS', 'xxxxxxxxxxxxxxxxxxx');

define('PERPAGE', 25); /* number of elements per page */

//set_magic_quotes_runtime(0);
if(get_magic_quotes_gpc()) error_log('Magic quotes enabled! Please fix.');

ini_set('error_log', '/var/log/php-err.log');

$IMG_LIST = array('bmp','tiff','tif','svg','psd','ttf','jpg','png','jpeg','gif','jpe'); // global list of image formats that can be converted
$CONVERTABLE = array('doc','rtf','bmp','tiff','tif','svg','psd','odt','xls','ppt','ods','odp','ttf','docx','xlsx','pdf');
?>