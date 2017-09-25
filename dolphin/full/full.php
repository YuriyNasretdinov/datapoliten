<?
   if(!function_exists('dolphin_handler')) die('dolphin not found');
   include_once(ROOT.'/full/full_func.php');
   if(@$_GET['act']=='logout') logout();
   else if(@$_GET['act']=='edit') die(include(ROOT.'/full/edit.php'));
   else if(@$_GET['act']=='terminal') die(include(ROOT.'/full/terminal.php'));
   else if(@$_GET['act']=='properties') die(include(ROOT.'/full/properties.php'));
//   else if(@$_GET['act']=='uploads') die(include(ROOT.'/full/uploads.php'));
   else if(!empty($_REQUEST['act'])) die(include(ROOT.'/full/actions.php'));
   
   function strip_eofs($str)
   {
		return str_replace(array("\n", "\r", "\t"), '', $str);
   }
   
   ob_start('strip_eofs');
?>
<html>
<head>
	
	<title><?=NAME?> full version</title>
	
	<meta name="author" content="Yuriy Nasretdinov" />
	
	<style>
	
		body                 { overflow: hidden; }
		div, span            { padding: 0px; margin: 0px; }
		#menu_actions button { height: 20px; }
		
		/* menu */
		.column { font-family: sanf-serif; font-size: 15px;}
		th.sort { background: #9bddff; border: 1px double #acacac; background: url('f/i/sort_bg.png'); }
		th.sort a { color: black; text-decoration: none; }
		th.active { background: #9bdd00; background: url('f/i/sort_bg_active.png'); }
		
		/* left menu */
		.left_menu_head { color: #526072; font-weight: bold; padding-left: 10px; padding-top: 5px; padding-bottom: 5px; cursor: default; }
		.left_menu_body { padding-left: 20px; padding-bottom: 5px; font-size: 13px; font-family: sans-serif; }
		.left_menu_body a { color: black; text-decoration: underline; }
	
	</style>
	
</head>
	
<body
 onload="        if(D) D.init();"
 oncontextmenu=" if(R && !R.is_inp(event)) return I.draw_menu(event);"
 onselectstart=" if(R && !R.is_inp(event)) return false; /* onselectstart is IE-specific */"
 onresize="      if(D) D.resize();"
 onkeydown="     if(I) return I.handle_keydown(event);"
 onmousedown="   if(I&&!I.in_menu)I.hide_cm();"
>

<a href="index.php?version=light&DIR=." id="safelink">
	<b>switch to light version...</b>
</a>

<noscript>

<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
 <tr>
  <td align="center" valign="middle">
  	<big>
  	 JavaScript MUST be enabled in order to use full version.<br><br>
     <a href="index.php?version=light&DIR=.&<?=SID?>">click here to use light version</a>
  	</big>
  </td>
</tr>
</table>

</noscript>
	
<script>/* loading */

/* at least DOM browsers are supported */

if(!document.getElementById || !document.getElementById('safelink') || !document.body || !document.createElement || !document.body.appendChild)
{
	alert('Your browser will not run this version. Click OK to go to light version...');
	window.location.href = 'index.php?version=light&DIR=.&<?=SID?>';
}else
{
	var l=document.getElementById('safelink');
	var d=document.body.appendChild(document.createElement('DIV'));
	var s=d.style;
	
	document.body.style.padding="0px";
	document.body.style.margin="0px";
	
	d.id         = "load_screen";
	
	s.position   = "absolute";
	s.width      = "100%";
	s.height     = "100%";
	
	d.innerHTML='<table width="100%" height="100%"><tr><td valign="middle" align="center"><img src="f/i/loading.gif"><br><h3>Loading, please wait...</h3><h4>if you experience problems with full version,<br><a href="index.php?version=light&DIR=.">use light version</a></td></tr></table>';
	
	l.style.display='none';
	
	/*
	d.id="loading";
	
	window.interv=setInterval(function()
	{
		var d=document.getElementById('dots');
		if(!this.cnt) this.cnt=2;
		if(cnt==1) d.innerHTML='...';
		if(cnt==2) d.innerHTML='&nbsp;..';
		if(cnt==3) d.innerHTML='.&nbsp;.';
		if(cnt==4) d.innerHTML='..&nbsp;';
		
		cnt++;
		
		if(cnt>4) cnt=1;
	},600);
	*/
}

window.upload_max_filesize = '<?=ini_get('upload_max_filesize')?>';
</script>

<script language="javascript" src="f/<?=(IS_DEVELOPER ?  'compress.php?act=js' : 'all.'.BUILD.'.js')?>"></script>

<script>
/* prevent from session expire */
setInterval(D.pingpong, <?=round(max(intval(ini_get('session.gc_maxlifetime'))*1000/2, 1000*60))?>);
</script>

<div id="very_main" style="width: 100%; height: 100%; padding: 0px; margin: 0px; overflow: hidden; visibility: hidden;">

<div id="upper" style="height: 30px; background: #222222;">
	
	<div id="dir_div" style="position: absolute; top: 3; left: 5;">
		<img src="f/i/dir.png" width="33" height="25" alt="[DIR]">
	</div>
	
	<div id="address_div" style="position: absolute; top: 5; left: 45;">
		<input type="input" name="address" value="." id="address" onkeydown="if(event.keyCode == 13 /* ENter */) $('go').onclick();"> <input type="button" value="go" id="go" onclick="I.change_address();">
	</div>
	
	<div id="logout_div" style="float: right;">
		<a href="?version=light&DIR=."><img src="f/i/light.png" width="25" height="30" alt="light" title="switch to light version" border="0"></a>&nbsp;&nbsp;
		<a href="?act=logout" onclick="return confirm('Really log out?');"><img src="f/i/logout.png" width="25" height="30" alt="log out" title="log out" border="0"></a>
	</div>
</div>

<div id="menu" style="height: 40px; overflow: hidden; width: 100%;">

	<div style="float: left; font-size: 20px; padding: 10px;" id="menu_nav">
             
		<a href="#" onclick="E.go_back(); return false;" id="btn_back">Back</a>
		<span style="display:none;" id="btn_back_disabled">Back</span>
		, 

		<a href="#" onclick="E.go_fwd(); return false;" id="btn_fwd">Forward</a>
		<span style="display:none;" id="btn_fwd_disabled">Forward</span>
		, 
                
		<a href="#" onclick="I.change_address('..'); return false;" id="btn_up">Up</a>
		<span style="display:none;" id="btn_up_disabled">Up</span>
		, 
                
		<a href="#" onclick="E.refresh(); return false;">Refresh</a>
		, 
		
		<a href="#" onclick="D.abort(); return false;" style="display:none;" id="btn_stop">Stop</a>
		<span id="btn_stop_disabled">Stop</span>
	</div>

	<div style="float: right; padding: 10px;" id="menu_actions">
		<button onclick="D.perform_update();">Dolphin update</button> 
		<button onclick="E.open_terminal();">Open Terminal</button> 
		<button onclick="D.open_uploads();" style="font-weight: bold;">Upload Files</button>
	</div>
</div>

<div id="left_menu" style="width: 249px; height: 100px; overflow: auto; background: #d6dde5; border-right: 1px #8b8b8b solid;">
<!-- Left Menu -->
</div>

<div id="content" style="width: 50px; height: 100px; overflow: hidden;">
	
	<table width="100%" height="100%" cellpadding="0" cellspacing="0">
		<tr>
			<td id="filelist"> <!-- the file list --> </td>
		</tr>
	
		<tr height="23" style="background: #9bddff;">
			<td>
				
				&nbsp;&nbsp;
				<span id="select_links"><!-- <b>Select:</b> all 50, all 100, none --></span>
				&nbsp;&nbsp;&nbsp;
				<span id="pages_links"><!-- <b>Pages:</b> 1 2 3 ... --></span>
				
			</td>
		</tr>
	</table>

</div>

<div id="footer" style="background: #e6edfa; height: 30px; overflow: hidden; width: 100%;">

	<div id="footer_descr" style="padding: 5px; position: absolute; overflow: hidden;">
	
		<!-- description -->
	
	</div>
	
	<img src="f/i/no.png" width="50" height="30" alt="dolph" align="center" id="footer_dolphin" style="position: absolute; background: url('f/i/logo-frames.png'); background-position: 0px 0px;">
	
	<div id="footer_state" style="padding: 5px; position: absolute; overflow: hidden;">
	
		<!-- AJAX state -->
	
	</div>

</div>

</div>

</body>
</html>
