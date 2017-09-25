<?php
set_time_limit(0);

$tm = mktime(0,0,0,date('m'),date('d'),date('Y'));

$bt = $tm - 24*20*3600; // begin time
$et = $tm;                // end time

if(!empty($parts[2]))
{	
	switch($parts[2])
	{
		case 'volume.png':
			header('Content-type: image/png');
			
			
			$img = imagecreatetruecolor(920, 620);
			
			imageantialias($img, true);
			
			$white = imagecolorallocate($img, 255, 255, 255);
			$black = imagecolorallocate($img, 0, 0, 0);
			
			imagefill($img, 0, 0, $white);
			//imagerectangle($img, 0,0,399,299,$black);
			
			$gray = imagecolorallocate($img, 200, 200, 200);
			
			// extract($SQL->res('SELECT SUM(`size`) as `total` FROM `files` WHERE `original_id` = 0'));
			
			$bs = 0;     // begin size
			$es = &$sz;  // end size
			
			$sz = 0;
			
			// get all the points
			
			$sel = $SQL->qw('SELECT `size`, `date` FROM `files` WHERE `date` > ? ORDER BY `date`', $bt);
			while($res = $SQL->fetch_assoc($sel))
			{
				$sz += $res['size'];
				$point[$res['date']] = $sz;
			}
			
			$red = imagecolorallocate($img, 255, 0, 0);
			
			// graw grid and legend
			
			$num = 19;
			$xcoef = 890 / ($num+1);
			$ycoef = 590 / ($num+1);
			
			for($i = 0; $i <= $num + 1; $i++)
			{
				$x = (int)( 15 + $i * $xcoef);
				imageline( $img, $x, 5, $x, 595, $gray);
				imagestring($img, 1, $x - 10, 600, date( "d.m", $dt = $bt + $i * ($et - $bt) / ($num + 1) ), $black);
				imagestring($img, 1, $x - 10, 610, date("(D)", $dt), $black);
				
				$y = (int)( 5 + $i * $ycoef);
				imageline( $img, 15, $y, 905, $y, $gray);
				if($i != 0) imagestring($img, 1, 0, $y - 5, sprintf( '%.1f', ( ($num + 1 - $i) / ($num+1) ) * ($es - $bs) / (1024*1024*1024), 1), $black);
			}
			
			imagestring($img, 3, 0, 5, 'Gb', $black);
			
			$ox = 15; /* old x, old y */
			$oy = 595;
			
			$less_red = imagecolorallocate($img, 255, 150, 150);
			
			foreach($point as $date => $size)
			{
				//echo $date.' - '.$size.'<br>';
				
				$x = 15 + ( ($date - $bt) / ( $et - $bt ) * 890 );
				$y = 595 - ( ($size - $bs) / ( $es - $bs ) * 590 );
				
				imageline($img, $ox, $oy, $x, $y, $less_red);
				imagefilledrectangle($img, $x - 1, $y - 1, $x + 1, $y + 1, $red);
				
				$ox = $x; $oy = $y;
			}
			
			imageline($img, $x, $y, 905, 5, $less_red);
			
			imagepng($img);
			die();
			break;
		case 'clicks.png':
			header('Content-type: image/png');
			
			
			$img = imagecreatetruecolor(940, 620);
			
			imageantialias($img, true);
			
			$white = imagecolorallocate($img, 255, 255, 255);
			$black = imagecolorallocate($img, 0, 0, 0);
			
			imagefill($img, 0, 0, $white);
			
			$gray = imagecolorallocate($img, 200, 200, 200);
			
			$sz = 0;
			
			// get all the points
			
			$ld = 0; /* last day */
			$lv = 0; /* last value (clicks count) */
			$lh = 0;
			
			foreach($_SESSION['_clicks'] as $k=>$v)
			{
				$d = date('d',$k);
				if($ld != $d)
				{
					$lv = 0;
					$point[mktime(0,0,1,date('m',$k),$d,date('Y', $k))] = 0;
				}
				$h = date('h',$k);
				/*if($h - $lh > 1)
				{
					for($i = $lh+1; $i < $h; $i++) $point[mktime($i,0,0,date('m',$k-3600),$d,date('Y', $k-3600))];
				}
				*/
				$point[$k+3600] = $lv + $v;
				$ld = $d;
				$lv += $v;
				$lh = date('h', $k);
			}
			
			$bs = min($point);  // begin size
			$es = max($point);  // end size
			
			unset($_SESSION['_clicks']);
			
			$red = imagecolorallocate($img, 255, 0, 0);
			
			// graw grid and legend
			
			$num = 19;
			$xcoef = 890 / ($num+1);
			$ycoef = 590 / ($num+1);
			
			for($i = 0; $i <= $num + 1; $i++)
			{
				$x = (int)( 15 + $i * $xcoef);
				imageline( $img, $x, 5, $x, 595, $gray);
				imagestring($img, 1, $x - 10, 600, date( "d.m", $dt = $bt + $i * ($et - $bt) / ($num + 1) ), $black);
				imagestring($img, 1, $x - 10, 610, date("(D)", $dt), $black);
				
				$y = (int)( 5 + $i * $ycoef);
				imageline( $img, 15, $y, 905, $y, $gray);
				if($i != 0) imagestring($img, 1, 910, $y - 7, sprintf( '%d', ( ($num + 1 - $i) / ($num+1) ) * ($es - $bs), 1), $black);
			}
			
			imagestring($img, 3, 890, 5, 'clicks', $black);
			
			$ox = 15; /* old x, old y */
			$oy = 595;
			
			$less_red = imagecolorallocate($img, 255, 100, 100);
			
			foreach($point as $date => $size)
			{
				//echo $date.' - '.$size.'<br>';
				
				$x = 15 + ( ($date - $bt) / ( $et - $bt ) * 890 );
				$y = 595 - ( ($size - $bs) / ( $es - $bs ) * 590 );
				
				imageline($img, $ox, $oy, $x, $y, $less_red);
				imagefilledrectangle($img, $x - 1, $y - 1, $x + 1, $y + 1, $red);
				
				$ox = $x; $oy = $y;
			}
			
			imagepng($img);
			die();
			break;
		default:
			break;
	}
}

while(@ob_end_flush());
ob_implicit_flush(true);

echo '<!-- '.str_repeat('-',1024). ' -->';
echo '<h2>Статистика по кликам:<br><small><small>(статистика обновляется раз в день; когда вы заходите сюда в первый раз за день, статистика обновляется, это может занять некоторое время)</small></small></h2>';

$cache = '/tmp/stats_cache_'.date('d.m.Y');

if(!file_exists($cache))
{
	$fp = fopen('/var/log/httpd-access.log', 'r');
	
	$stats = $traff = array();
	
	$ignore = array('dolphin/', 'pma/', 'pub/', 'files/', 'core/', 'stats/', 'ajax/','work-'); // the URL's that do not give any clicks
	
	for($months = array(), $i = 1; $i <= 12; $i++) $months[$i] = date('M', mktime(0,0,0,$i,1,2008));
	$months = array_flip($months);
	
	$skip_lo = mktime(18,0,0,12,2,2008);
	$skip_hi = mktime(22,0,0,12,2,2008); /* approximate time when i stress-tested the server :) */
	
	$i = 0;
	
	echo '<span id="loading_dots">';
	
	while(!feof($fp))
	{
		$i++;
		
		if($i % 1000 == 0) echo '.&shy;';
		
		$ln = fgets($fp, 4096);
		
		list($ip, , , $dt1, $dt2, $method, $url, $httpver, $rcode, $rlength) = explode(' ', $ln);
		
		$date = (substr($dt1, 1).' '.substr($dt2, 0, -1));
		$method = substr($method, 1);
		
		if($method != 'GET' || $rcode != 200) continue;
		
		$httpver = substr($httpver, 0, -1);
		
		$day = substr($date, 0, 14);
		if(!$day) continue;
		
		$day[11] = '/';
		list($d, $m, $y, $h) = explode('/', $day);
		
		$day = mktime($h, 0, 0, $months[$m], $d, $y);
		
		if($day <= $bt || $day >= $et || $day >= $skip_lo && $day <= $skip_hi) continue;
		
		if(!isset($traff[$day])) $traff[$day] = 0;
		$traff[$day] += $rlength;
		
		foreach($ignore as $v) if(substr($url, 0, strlen($v)+1) == '/'.$v) continue(2);
		
		if(!isset($stats[$day])) $stats[$day] = 0;
		$stats[$day] += 1;
	}
	
	echo '</span><script>document.getElementById("loading_dots").style.display="none";</script>';
	
	fclose($fp);
	
	$fp = fopen($cache,'w');
	fputs($fp, serialize(array($stats,$traff)));
	fclose($fp);
}else
{
	$fp = fopen($cache, 'r');
	list($stats,$traff) = unserialize( fread($fp, filesize($cache)) );
	fclose($fp);
}

$_SESSION['_clicks'] = $stats;

$perday = 24 * array_sum($stats) / sizeof($stats);

$days = array();
foreach($stats as $k=>$v)
{
	$d = date('d',$k);
	if(!isset($days[$d])) $days[$d] = 0;
	$days[$d] += $v;
}

$pd = $perday;
$deltapd = 0;

foreach($days as $v) $deltapd += pow( $v - $perday, 2 );

$deltapd /= sizeof($days);
$deltapd = sqrt($deltapd);

extract($SQL->res('SELECT COUNT(*) `unum`, SUM(`used`) `dspace` FROM `users`'));

$dspace /= pow(2,30);

echo '<b>Средние данные за '.(date('d.m',$bt)).' &mdash; '.(date('d.m',$et)).'</b>';
echo '<table border=1 cellspacing=3>';
echo '<tr><td>Кликов в день<td>'.round($perday,1).' ± '.round($deltapd,1).'</tr>';
echo '<tr><td>Кликов в день на пользователя<td>'.round( $perday / $unum, 1 ).' ± '.round($deltapd / $unum,1).'</tr>';
echo '<tr><td>Кликов в день на Гб<td>'.round( $perday / $dspace, 1 ).' ± '.round($deltapd / $dspace,1).'</tr>';
echo '<tr><td>Максимум кликов в час<td>'.max($stats).'</tr>';
echo '<tr><td>Исходящий трафик в день<td>'.show_size('',true,array_sum($traff)).'</tr>';
echo '</table>';

echo '<br><br><b>График роста количества кликов в день (показания в 0:00 каждого дня соответствуют количеству кликов за этот день)</b><br>';

echo '<img src="/stats/clicks.png">';

echo '<h2>Статистика по файлам</h2>';

$used_total = 0;

$fsel = $SQL->qw('SELECT COUNT(*) as `files`, `uid` FROM `files` WHERE `original_id` = 0 GROUP BY `uid` ORDER BY `uid`');
$files = array();
while($res = $SQL->fetch_assoc($fsel)) $files[$res['uid']] = $res['files'];

$fsel = $SQL->qw('SELECT COUNT(*) as `files`, `uid` FROM `files` WHERE `original_id` <> 0 GROUP BY `uid` ORDER BY `uid`');
$ffiles = array();
while($res = $SQL->fetch_assoc($fsel)) $ffiles[$res['uid']] = $res['files'];

$tsel = $SQL->qw('SELECT COUNT(*) as `tags`, `uid` FROM `tags` GROUP BY `uid` ORDER BY `uid`');
$tags = array();
while($res = $SQL->fetch_assoc($tsel)) $tags[$res['uid']] = $res['tags'];

$ssel = $SQL->qw('SELECT SUM(`size`) as `wsize`, `uid` FROM `files` WHERE `date` > ? AND `original_id` = 0 GROUP BY `uid` ORDER BY `uid`', time() - 7*24*3600);
$weeksizes = array();
while($res = $SQL->fetch_assoc($ssel)) $weeksizes[$res['uid']] = $res['wsize'];

$sel = $SQL->qw('SELECT * FROM `users` ORDER BY `id`');

echo '<table border=1 cellspacing=2 cellpadding=2><tr><th>ID</th><th>FOLDER</th><th>E-MAIL</th><th>NAME</th><th>TAGS</th><th title="Own files ( + foreign files)"><u>FILES</u></th><th title="Total size (Weekly size)"><u>USED</u></th><th>QUOTA</th><th>%&nbsp;USED</th><th>REAL USAGE</th></tr>';

while($res = $SQL->fetch_assoc($sel))
{
	$use = $res['used']+filesize($USER->get_dir($res['id'],'srv'));
	$used_total += $use;
	
	echo '<tr>
		<td>'.$res['id'].'</td>
		<td><a target="_blank" href="/dolphin/?version=light&DIR='.rawurlencode($USER->get_dir($res['id'],'srv')).'">'./*basename($USER->get_dir($res['id']))*/'show'.'</td>
		<td><a href="mailto:'.htmlspecialchars($res['email']).'">'.htmlspecialchars($res['email']).'</a></td>
		<td>'.$res['name'].'</td>
		<td align=right>'.intval(@$tags[$res['id']]).'</td>
		<td align=right nowrap=nowrap>'.intval(@$files[$res['id']]).' ( + '.intval(@$ffiles[$res['id']]).')</td>
		<td>'.show_size('',false,$use).' <nobr>('.show_size('',false,(int)@$weeksizes[$res['id']]).')</nobr></td>
		<td>'.show_size('',false,$res['quota']).'</td>
		<td align=right>'.round($res['used']/$res['quota']*100,2).'</td>
		<td>'.show_size($USER->get_dir($res['id'],'srv'),true,false,true).'</td>
		</tr>';
}
echo '</table>';

extract($SQL->res('SELECT SUM(`size`) as `weekly`  FROM `files` WHERE `date` > ? AND `original_id` = 0', time() - 24*7*3600));
extract($SQL->res('SELECT SUM(`size`) as `monthly` FROM `files` WHERE `date` > ? AND `original_id` = 0', time() - 24*30*3600));

echo '<br>Суммарный объем файлов: '.show_size('',false,$used_total).' ('.show_size('',false,$weekly).' за неделю, '.show_size('',false,$monthly).' за последние 30 дней)';
extract($SQL->res('SELECT COUNT(*) as `total_files` FROM `files` WHERE `original_id` = 0'));
echo '<br>«Своих» файлов: '.$total_files;
extract($SQL->res('SELECT COUNT(*) as `total_files` FROM `files` WHERE `original_id` <> 0'));
echo '<br>«Чужих» файлов: '.$total_files;
extract($SQL->res('SELECT SUM(CHAR_LENGTH(`text`)) as `msg_size` FROM `messages`'));
echo '<br>Суммарный объем сообщений: '.show_size('',false,$msg_size);
extract($SQL->res('SELECT COUNT(*) as `total_messages` FROM `messages`'));
echo '<br>Написано сообщений: '.$total_messages;

echo '<br><br><b>График относительного роста объема файлов за '.date('d.m',$bt).' &mdash; '.date('d.m',$et).':</b><br><img src="/stats/volume.png" />';
?>