<?php

// Version 1.02.
// Заменяет ссылки на их HTML-эквиваленты ("подчеркивает ссылки").
// Работает с УЖЕ ПРОКВОЧЕННЫМ HTML-кодом!
function hrefActivate($text) {
	$text = preg_replace_callback(
		'{
			(?:
				# ВНИМАНИЕ: \w+ вместо (?:http|ftp) СИЛЬНО ТОРОМОЗИТ!!!
				((?:http|ftp)://)   # протокол с двумя слэшами
				| (?<!.)www\.       # или просто начинается на www
			)
			(?> [a-z0-9_-]+ (?>\.[a-z0-9_-]+)* )   # имя хоста
			(?: : \d+)?                            # порт
			(?:                                    # URI (но БЕЗ кавычек)
					&amp;                       # амперсанд
				| & (?![a-z]+;) (?!\#\d+;)    # если попался незаквоченный URI
				| [^[\]&\s\x00»«"<>]          # все остальное
			)*
			(?:                                    # последний символ должен быть...
					(?<! [[:punct:]] )          # НЕ пунктуацией
				| (?<= &amp; | [-/&+*]     )  # но допустимо окончание на -/&+*
			)
			(?= [^<>]* (?! </a) (?: < | $))        # НЕ внутри тэга
		}six',
		"hrefCallback",
		$text
	);
	return $text;
}   

// Функция обратного вызова для preg_replace_callback().
function hrefCallback($p) {
	$name = $p[0];
	// ВНИМАНИЕ!!!
	// htmlspeicalchars() НЕ ИСПОЛЬЗУЕТСЯ, т.к. функция вызывается в момент,
	// когда все спецсимволы И ТАК проквочены. Это - специфика phpBB.
	// Если нет протокола, добавляем его в начало строки.
	$href = !empty($p[1])? $name : "http://$name";
	// Пробуем преобразовать ссылку в имя страницы, а заодно и получить ее
	// "настоящий" URI (пожет потребоваться при работе с ЧПУ).
	$realUri = null;
	if (function_exists($getter='getPageTitleByUri')) $name = $getter($href, $realUri);
	$href = str_replace('"', '&amp;', $href); // на всякий случай
	if ($name === null) $name = $href;
	$html = 
		"<a href=\"$href\" " . 
		($realUri && $realUri != $href? "name=\"$realUri\" " : "") . 
		"target=\"_blank\">$name</a>";
	return $html;
}

/**
 * Shows size of $f file or folder like "1023.53 Kb". If $format=false, it returns just filesize in bytes, and fills $GLOBALS['show_size_files'] and $GLOBALS['show_size_dirs'] with values. If $size is not false, the function will just format $size value, but not count the size of directory again.
 *
 * @param string $f
 * @param bool $format
 * @return string/int
 */
function show_size($f,$format=true,$size=false,$skip_links=false)
{
	if($format || $size!==false)
	{
		if($size===false) $size=show_size($f,false,false,$skip_links);
		if(!empty($GLOBALS['TIMED_OUT'])) $p = '&gt;';
		else $p = '';
		if($size<=1024) return $p.$size.'&nbsp;байт';
		else if($size<=1048576) return $p.round($size/1024,2).'&nbsp;Кб';
		else if($size<=1073741824) return $p.round($size/1048576,2).'&nbsp;Мб';
		else if($size<=1099511627776) return $p.round($size/1073741824,2).'&nbsp;Гб';
		else if($size<=1125899906842624) return $p.round($size/1099511627776,2).'&nbsp;Тб';
		else return $p.round($size/1125899906842624,2).'&nbsp;Пб';
	}else
	{
		if($skip_links && is_link($f)) return 0;
		
		if(is_file($f))
		{
			$GLOBALS['show_size_files'] = 1;
			$GLOBALS['show_size_dirs'] = 0;
			
			return filesize($f);
		}else if(!is_dir($f))
		{
			return 0;
		}
		$size=0;

		$dh=opendir($f);
		$fs=$ds=0;
		
		while(($file=readdir($dh))!==false)
		{
			if($file=='.' || $file=='..') continue;
			// delete the next lines if you don't want any limits
			if($skip_links && is_link($f.'/'.$file)) continue;
			
			if(is_file($f.'/'.$file))
			{
				$size+=filesize($f.'/'.$file);
				$fs++;
			}else
			{
				$size+=show_size($f.'/'.$file,false,false,$skip_links);
				$ds+=$GLOBALS['show_size_dirs'];
				$fs+=$GLOBALS['show_size_files'];
			}
		}
		closedir($dh);
		
		$GLOBALS['show_size_files'] = $fs;
		$GLOBALS['show_size_dirs'] = 1+$ds;
		return $size+filesize($f); // +filesize($f) for *nix directories
	}
}

/**
 *
 * Functions, which have "mb_" in the beginning are fixed versions of standard PHP functions, that do not work correctly
 * with UTF-8 strings for some reason
 *
*/

if(!function_exists('mb_basename'))
{
	function mb_basename($path, $suffix = null)
	{
		/*$file = mb_substr($path, mb_strrpos($path, '/')+1);*/

		$file = end(explode('/', $path));
		
		if($suffix && mb_substr($file, -($l = mb_strlen($suffix))) == $suffix)
		{
			$file = mb_substr($file, 0, $l);
		}
		
		return $file;
	}
	
}

/*
 
 End of fixed functions
 
*/


function array_display($array)
{
	echo "<table border=1 cellpadding=2 cellspacing=2><tr><td colspan=2 style='text-align:center;'><b>array</b></td></tr>";
	
	foreach($array as $key=>$value)
	{
		if(!is_array($value))
		{
			echo "<tr><td width=100><i>".$key."</i></td><td>".$value."</td></tr>";
		}else
		{
			echo "<tr><td width=100><i><b style='color:red;'>".$key."</b></i></td><td>";
			array_display($value);
			echo "</td></tr>";
		}
	}

	echo "</table>";
}

/**
 
 Function that logs errors, adds CLASSNAME->METHODNAME at the beginning, and always returns FALSE
 
 It can also store $user_message in $GLOBALS['ERROR_DESCRIPTION']
 
*/

function oop_error($message, $user_message = null)
{
	$dbg = debug_backtrace();
	
	error_log($dbg[1]['class'].'->'.$dbg[1]['function'].' ('.$dbg[1]['file'].':'.$dbg[1]['line'].'): '.$message);
	
	if($user_message) $GLOBALS['ERROR_DESCRIPTION'] = $user_message;
	
	return false;
}

function timestamp()
{
	return date('d.m.Y H-i-s');
}

// Функция предназначена для вывода численных результатов с учетом
// склонения слов, например: "1 ответ", "2 ответа", "13 ответов" и т.д.
//
// $digit — целое число
// можно вместе с форматированием, например "<b>6</b>"
//
// $expr — массив, например: array("ответ", "ответа", "ответов").
// можно указывать только первые 2 элемента, например для склонения английских слов
// (в таком случае первый элемент - единственное число, второй - множественное)
//
// $expr может быть задан также в виде строки: "ответ ответа ответов", причем слова разделены
// символом "пробел"
//
// $onlyword - если true, то выводит только слово, без числа;
// необязательный параметр

function declension($digit,$expr,$onlyword=false)
{
		if(!is_array($expr)) $expr = array_filter(explode(' ', $expr));
        if(empty($expr[2])) $expr[2]=$expr[1];
        $i=preg_replace('/[^0-9]+/s','',$digit)%100; //intval не всегда корректно работает
        if($onlyword) $digit='';
        if($i>=5 && $i<=20) $res=$digit.' '.$expr[2];
        else
        {
                $i%=10;
                if($i==1) $res=$digit.' '.$expr[0];
                elseif($i>=2 && $i<=4) $res=$digit.' '.$expr[1];
                else $res=$digit.' '.$expr[2];
        }
        return trim($res);
}

function declensor($word, $enc = 'UTF-8')
{
    $ret = array_fill(0,7,$word);
    
    $cont = file_get_contents('http://export.yandex.ru/inflect.xml?name='.rawurlencode($word));
    if($cont)
    {
        $cont = explode('<inflection case="', $cont);
        array_shift($cont);
        
        foreach($cont as $v)
        {
            list($num, $name) = explode('">', $v);
            list($name,) = explode('</',$name);
            $ret[$num] = iconv('windows-1251', $enc, $name);
        }
    }
    
    return $ret;
}

function get_declension($word, $enc = 'UTF-8', $num)
{
	$res = declensor($word, $enc);
	return $res[$num];
}

function save_referer()
{
	$_SESSION['last-referer'] = $_SERVER['HTTP_REFERER'];
}

function get_referer($default = '/')
{
	if(!empty($_SESSION['last-referer']))
	{
		$url = $_SESSION['last-referer'];
		unset($_SESSION['last-referer']);
	}else
	{
		$url = $default;
	}
	
	return $url;
}

function print_tags($print = true)
{
	extract($GLOBALS['CLASSES']);
	
	ob_start();
	$sel = $SQL->qw('SELECT COUNT(*) as `cnt`, `tid` FROM `files_tags` WHERE `uid`=? GROUP BY `tid`',$USER->id);
	for($cnt = array(); $res = $SQL->fetch_assoc($sel); $cnt[$res['tid']] = $res['cnt']);
	
	$sel = $SQL->qw('SELECT * FROM `tags` WHERE `uid`=?',$USER->id);
	//$sel = $SQL->qw('SELECT * FROM `tags`');
	
	$tags = $tags_num = array();

	while($res = $SQL->fetch_assoc($sel))
	{
		$tags[] = $res;
		$tags_num[] = isset($cnt[$res['id']]) ? $cnt[$res['id']] : 0;
	}
	
	arsort($tags_num);
	
	if(sizeof($tags))
	{
		foreach($tags_num as $k=>$v)
		{
			$res = $tags[$k];
		?>
			<div>
				<div class="t_magn"><img src="/pub/i/m/tags-magnifier.png" width="17" height="12" /></div>
				<div class="t_nam" title="<?=$res['name']?>"><a href="#" onclick="var f = $('filter'); f.focus(); f.value = 'tag:<?=$res['id']?>'; Fi.reload(); return false;"><?=$res['name']?></a></div>
				<div class="t_num">(<?=sprintf("%d",$v)?>)</div>
				<div class="t_act"><a href="#" onclick="Fi.delete_tag(<?=$res['id']?>); return false;">x</a></div>
			</div>
				
		<?
		}
	}else
	{
		echo '<div align="center" style="height: auto;"><i>у вас нет тегов</i><br><br>вы можете добавить тег, нажав на кнопку &quot;+&quot; рядом с заголовком</div>';
	}
	
	$t = array();
	
	foreach($tags_num as $k=>$v)
	{
		$res = $tags[$k];
		$name = nl2br(addslashes($res['name']));
		
		if($print) $t[] = $res['id'].': \''.$name.'\'';
		else $t[$res['id']] = $res['name'];
	}
	
	if(!$print)
	{
		return array(ob_get_clean(), $t);
	}else
	{
		echo '<script> window.__tags_list = {' . implode(', ',$t).'}; </script>';
		return ob_end_flush();
	}
}

function delete_tag($tid)
{
	extract($GLOBALS['CLASSES']);
	
	$SQL->qw('DELETE FROM `tags` WHERE `uid`=? AND `id`=?', $USER->id, $tid);
	
	$ids = array();
	$sel = $SQL->qw('SELECT `fid` FROM `files_tags` WHERE `uid`=? AND `tid` = ?', $USER->id, $tid);
	while($res = $SQL->fetch_assoc($sel)) $ids[] = $res['fid'];
	
	if(sizeof($ids))
	{
		$sel = $SQL->qw('SELECT `id`,`tags` FROM `files` WHERE `id` IN(?)', $ids);
		while($res = $SQL->fetch_assoc($sel))
		{
			$SQL->qw('UPDATE `files` SET `tags` = ? WHERE `id` = ?', preg_replace('/^'.$tid.'($|,)|,'.$tid.'$/s','',str_replace(','.$tid.',',',',$res['tags'])), $res['id']);
		}
		
	}
	
	$SQL->qw('DELETE FROM `files_tags` WHERE `uid`=? AND `tid`=?', $USER->id, $_POST['id']);
}
?>