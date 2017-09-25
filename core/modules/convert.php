<?php
error_reporting(E_ALL);
ini_set('display_errors','on');

$udir     = $USER->srv_directory;
$f        = mb_basename(rawurldecode($parts[2]));
$parts[2] = rawurlencode($f);

if(!file_exists($udir.'/'.$f))
{
	error_log('Convertion failed, file does not exist: '.$udir.'/'.$f);
	die('Извините, запрошенного Вами файла не существует');
}

session_write_close();

$ext = strtolower(end(explode('.',$f)));

$doc = array('doc','rtf','odt','xls','ppt','ods','odp','docx','xlsx');
$img = $IMG_LIST;

if(in_array($ext, $doc) || in_array($ext, $img) || $ext == 'pdf')
{
	if(!file_exists($cdir = $udir.'/.convert')) mkdir($cdir);
	
	if(in_array($ext, $doc))      $oext = '.html'; /* output extension */
	else if(in_array($ext, $img))
	{
		if(isset($_GET['thumb'])) $oext = '.t.jpg';
		else                      $oext = '.png';
	}else if($ext == 'pdf')       $oext = empty($_GET['thumb']) ? '.html' : '.t.jpg';
	
	$newnam = md5($f).'/-';
	if(!file_exists($cdir.'/'.md5($f))) mkdir($cdir.'/'.md5($f));
	
	if(!file_exists($cdir.'/'.$newnam.$oext))
	{
		if(!isset($_GET['thumb']))
		{
			while(@ob_end_flush());
			
			echo '<!-- ',str_repeat('-', 1024), ' -->';
			
			echo '<html><head><title>Идет конвертация, пожалуйста подождите</title><body><table width="100%" height="100%"><tr><td valign="middle" align="center"><img src="/pub/i/loading.gif"><br><br><b>Обработка...</b><br><br>Ваш файл обрабатывается для просмотра в браузере, пожалуйста подождите...</td></tr></table></body></html>';
			
			flush();
		}
		
		exec('ln '.escapeshellarg($udir.'/'.$f).' '.escapeshellarg($cdir.'/'.$newnam.'.'.$ext));
		
		chdir($cdir);
		
		if($oext == '.html')
		{
			//exec('abiword -t '.escapeshellarg($f.$oext).' '.escapeshellarg($f), $out, $code);
			if($ext == 'pdf')
			{
				exec('/usr/local/bin/pdf2swf -s insertstop '.escapeshellarg($cdir.'/'.$newnam.'.'.$ext).' -o '.escapeshellarg($cdir.'/'.$newnam.'.swf'), $out, $code);
				if(!$code) exec('ln -s '.escapeshellarg(ROOT.'/templates/indirect/pdf.html').' '.escapeshellarg($cdir.'/'.$newnam.'.html'));
			}elseif($ext != 'ppt' && $ext != 'odp')
			{
				$oname = $cdir.'/'.$newnam.$oext;
				$odir = dirname($oname);
				
				exec('/usr/local/bin/docconvert '.escapeshellarg($cdir.'/'.$newnam.'.'.$ext).' '.escapeshellarg($oname), $out, $code);
				
				if(!$code)
				{
					$fc = file_get_contents($oname);
					
					if(($ext == 'xls' || $ext == 'xlsx' || $ext == 'ods'))
					{
						$fc = str_replace('</HEAD>','<style><!--
						td { border-right: 1px #cdcdcd solid; border-bottom: 1px #cdcdcd solid; }
						table { border-top: 1px #cdcdcd solid; border-left: 1px #cdcdcd solid; ; }
						--></style>
						
						</HEAD>',$fc);
					}
					
					/* fix stupid OOO behavouir when it does not guess the width and height of his generated images */
					
					function fix_wh($dat)
					{
						global $odir;
						if(!$inf = getimagesize($odir.'/'.$dat[1])) return $dat[0];
						
						$w = $dat[3];
						$h = $dat[5];
						
						if(abs( ($inf[0] - $w) / $w) < 0.1) $w = $inf[0];
						if(abs( ($inf[1] - $h) / $h) < 0.1) $h = $inf[1];
						
						return '<IMG SRC="'.$dat[1].'"'.$dat[2].'WIDTH='.$w.$dat[4].'HEIGHT='.$h.$dat[6].'>';
					}
					
					$fc = preg_replace_callback('/\<IMG SRC\="([^"]*)"([^\>]+)WIDTH\=([0-9]+)([^\>]+)HEIGHT\=([0-9]+)([^\>]*)\>/s', 'fix_wh', $fc);
					
					file_put_contents($oname, $fc);
				}
			}else
			{
				exec('/usr/local/bin/docconvert '.escapeshellarg($cdir.'/'.$newnam.'.'.$ext).' '.escapeshellarg($cdir.'/'.$newnam.'.swf'), $out, $code);
				if(!$code) exec('ln -s '.escapeshellarg(ROOT.'/templates/indirect/presentation.html').' '.escapeshellarg($cdir.'/'.$newnam.'.html'));
			}
		}else if(in_array($ext, $img) || $ext == 'pdf')
		{
			$pg = ($ext == 'pdf'||$ext=='psd' ? '[0]' /* only (first page)/(whole image) needed */ : '');
			exec('/usr/local/bin/convert '.escapeshellarg($newnam.'.'.$ext.$pg).' '.(isset($_GET['thumb']) ? ' -background gray95 -transparent-color gray95 -flatten -thumbnail 180x180 -quality 70 ' : '').escapeshellarg($newnam.$oext), $out, $code);
		}
		
		if($code)
		{
			error_log('File convertion failed: '.$udir.'/'.$f);
			echo '<script>document.location="'.addslashes($USER->pub_directory.'/'.$parts[2]).'"; setTimeout(function(){window.close();}, 3000);</script>';
			unlink($cdir.'/'.$newnam.'.'.$ext);
			die();
		}
		
		$pdir = $USER->pub_directory;
		
		$on = ROOT; /* old name */
		$nn = ROOT.'/converted'; /* new name */
		
		/* $pdir looks like "/files/...", so the first element will always be empty
		   
		   the next foreach should create the directory "converted/files/..." for the corresponding user
		*/
		if(!file_exists(ROOT.'/converted'.$USER->pub_directory))
		{
			foreach(explode('/',dirname($pdir)) as $v)
			{
				$on .= $v; $nn .= $v;
				
				if(!file_exists($nn)) mkdir($nn);
				
				$on .= '/'; $nn .= '/';
			}
			
			exec('ln -s '.escapeshellarg($cdir).' '.escapeshellarg(ROOT.'/converted'.$USER->pub_directory));
		}
		
		/*
		if($oext == '.html')
		{
			$dh = opendir('.');
			
			while(false!==($fn = readdir($dh)))
			{
				if(substr($fn,0,strlen($f) + strlen('_html')) != $f.'_html') continue;
				exec('ln -s '.escapeshellarg($cdir.'/'.$fn).' '.escapeshellarg(ROOT.'/converted'.$USER->pub_directory.'/'.$fn));
			}
			
			closedir($dh);
		}
		*/
		
		unlink($cdir.'/'.$newnam.'.'.$ext);
		
		if(!isset($_GET['thumb'])) die('<script>document.location="/converted'.$USER->pub_directory.'/'.$newnam.$oext.'";</script>');
		else header('location: /converted'.$USER->pub_directory.'/'.$newnam.$oext);
	}
	
	header('location: /converted'.$USER->pub_directory.'/'.$newnam.$oext);
}else /* other formats are not currently supported */
{
	header('location: '.$USER->pub_directory.'/'.$parts[2]);
	die();
}
?>