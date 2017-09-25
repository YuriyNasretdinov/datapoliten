var InterfaceClass = function(){
	
	var T = this;
	
	T.coords = { // 'name': {right, top, width, height}
	/** overall.FVER.png **/
	back: [0, 0, 61, 30],
	back_disabled: [0, 582, 61, 30],
	fwd: [0, 90, 34, 30],
	fwd_disabled: [0, 612, 34, 30],
	up: [48, 90, 29, 30],
	up_disabled: [71, 612, 29, 30],
	search: [0, 180, 66, 30],
	dirs: [0, 270, 65, 30],
	view: [0, 360, 37, 30],
	
	close: [72, 360, 28, 30],
	go: [0, 450, 58, 22],
	
	// left menu
	
	l_uarr: [77, 90, 23, 23],
	l_darr: [77, 136, 23, 23],
	
	// table view
	
	tv_sep: [64, 360, 8, 20],
	tv_lsep: [94, 450, 6, 20],
	tv_uarr: [68, 439, 9, 5],
	tv_darr: [63, 445, 9, 5],
	
	/** menu_all.png **/
	m_open: [0,0,16,16],
	m_mkdir: [0,16,16,16],
	m_upload: [0,32,16,16],
	m_rename: [0,48,16,16],
	m_cut: [0,64,16,16],
	m_copy: [0,80,16,16],
	m_delete: [0,96,16,16],
	m_control_panel: [0,112,16,16],
	m_admin: [0,128,16,16],
	m_paste: [0,160,16,16],
	m_cancel: [0,176,16,16],
	m_zip: [0, 192, 16, 16]
	};
	
	T.dbg = function(message)
	{
		var el = $('debug');
		if(!el)
		{
			el = document.createElement('div');
			el.id = 'debug';
			document.body.appendChild(el);
		}
		el.innerHTML = message;
	}
	
	T.gw = T.get_width = function()
	{
		if(document.body.offsetWidth) return document.body.offsetWidth;
	  	else if(window.innerWidth) return window.innerWidth;
	  	else return false;
	}
	
	T.gh = T.get_height = function()
	{
		if(document.body.offsetHeight) return document.body.offsetHeight;
	  	else if(window.innerHeight) return window.innerHeight;
	  	else return false;
	}
	
	// the function (taken from xpoint.ru), which determines the coordinates of an object
	
	T.gb = T.get_bounds = function(element)
	{
		var left = element.offsetLeft;
		var top = element.offsetTop;
		for (var parent = element.offsetParent; parent; parent = parent.offsetParent)
		{
			left += parent.offsetLeft;
			top += parent.offsetTop;
		}
		return {left: left, top: top, width: element.offsetWidth, height: element.offsetHeight};
	}
	
	T.mh = T.menu_hover = function()
	{
	}
	
	T.mo = T.menu_out = function()
	{
	}
	
	// the function changes the current path (changes title, adress and icon)
	
	T.cp = T.change_path = function(address,dir,type)
	{
		if(0)
		{
			var a = $('address_img');
			var h = $('header_icon');
			
			if(type==tDIR)
			{
				a.style.backgroundPosition = '-0px -516px';
				h.style.backgroundPosition = '-37px -360px';
			}else if(type==tDRIVE)
			{
				a.style.backgroundPosition = '-0px -538px';
				h.style.backgroundPosition = '-37px -390px';
			}else if(type==tMYCOMP)
			{
				a.style.backgroundPosition = '-0px -560px';
				h.style.backgroundPosition = '-37px -420px';
			}
			
			$('name_of_folder').innerHTML = dir;
			
		}
		$('address').value = address;
	}
	
	// the function changes the current path (calls go2)
	// if path is specified, it must be relative
	
	T.ca = T.change_address = function(path)
	{
		var p = $('address').value;
		
		if(path) p = E.address+'/'+path;
		
		if(p==E.address) E.refresh();
		else E.go2(p);
	}
	
	// function changes the status string, params = [ ..., [ name, value ], ... ]
	
	T.cs = T.change_status = function(pr)
	{
		var el = $('footer_descr');
		var tmp = [];
		var j = 0;
		
		for(var k in pr)
		{
			var p = pr[k];
			if(!p[1]) continue;
			
			tmp[j++] = '<b>'+p[0]+'</b>: '+p[1];
		}
		
		el.innerHTML = '<nobr>'+tmp.join('&nbsp;&nbsp;&nbsp;')+'</nobr>';
	}
	
	// function that sets another image (name - the name of image, state - '', 'h' or 'd')
	// iname - the real image name, if not specified, by default takes name from id ( btn_NAME )
	
	T.im = function(obj,state,iname)
	{
		if(!iname) var iname = obj.id.substr(4);
		var c = T.coords[iname];
		var offset = 0;
		
		if(state=='h') offset = -c[3];
		if(state=='d') offset = -c[3]*2;
		
		obj.style.backgroundPosition = '-' + c[0] + 'px -' + (c[1] - (obj.id.substr(obj.id.length-9,9)=='_disabled' ? 0 : offset)) + 'px';
	}
	
	// this function returns the centered message (as in Windows)
	
	var _msg = function(msg,nowidth)
	{
		return '<table'+(nowidth ? '' : ' width="100%"')+' height="100%"><tr><td style="vertical-align: middle; text-align: center;">'+msg+'</td></tr></table>';
	}
	
	// function that generates panel images, and generates upper panel
	
	T.gp = T.generate_panel = function()
	{
		var el = $('panel');
		var tmp = '';
		var coords = T.coords;
		
		var act = {
			back: "E.go_back();",
			back_disabled: "return false;", // the disabled elements have style="display: none"
			fwd: "E.go_fwd();",
			fwd_disabled: "return false;",
			up: "I.change_address('..');",
			up_disabled: "return false;"/*,
			search: "I.dbg('search');",
			dirs: "I.dbg('dirs');",
			view: "I.dbg('view');"*/
		};
		
		var lang = {
			back: 'Back',
			back_disabled: 'Back',
			fwd: 'Forward',
			fwd_disabled: 'Forward',
			up: 'Up',
			up_disabled: 'Up',
			search: 'Search',
			dirs: 'Folders',
			view: 'View'
		};
		
		for(var k in act)
		{
			tmp += '<img id="btn_' + k + '" src="f/i/no.png" onmouseover="I.im(this,\'h\');" onmouseout="I.im(this,\'\');" onmousedown="I.im(this,\'d\');" onmouseup="I.im(this,\'h\'); ' + act[k] + ' " alt="' + lang[k] + '" title="' + lang[k] + '" style="background: url(\'f/i/overall.FVER.png\'); background-position: -' + coords[k][0] + 'px -' + coords[k][1] + 'px;' + (k.substr(k.length-9,9)=='_disabled' ? 'display: none;' : '') + '" width="' + coords[k][2] + '" height="' + coords[k][3] + '" />';
		}
		
		el.innerHTML = tmp;
		
		var el = $('upperpanel');
		
		var upper_panel = {
			Update: 'Update&nbsp;to&nbsp;latest&nbsp;development&nbsp;version'/*,
			File: 'File',
			Edit: 'Edit',
			View: 'View',
			Tools: 'Tools',
			Help: 'Help'*/
		};
		
		tmp = '<table width="100%" cellspacing=0 cellpadding=0 border=0><tr height=2><td colspan=6></td></tr><tr height=18 class="menu">';
		
		for(var k in upper_panel)
		{
			//tmp += '<div class="menuelm" onmousedown="I.upperpanel(\'' + k + '\',event,this);" onmouseover="this.className=\'menuelm_hover\';" onmouseout="this.className=\'menuelm\';">' + _msg(upper_panel[k],true) + '</div>';
			tmp += '<td height=18 valign=middle onmouseover="this.className=\'menuelm_hover\'" onmouseout="this.className=\'\';" onmousedown="I.upperpanel(\'' + k + '\',event,this);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+upper_panel[k]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
		}
		
		el.innerHTML = tmp + '<td width="100%">&nbsp;</td></tr><tr height=4><td colspan=6></td></tr></table>';
	}
	
	// function used to show the Upper Panel Menu
	
	T.upp = T.upperpanel = function(name,e,obj)
	{
		var x=10,y=10;
		
		/*if(obj.x)
		{
			x=obj.x;
			y=obj.y;
		}else if(e.offsetX)
		{
			x = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - event.offsetX;
			y = event.clientY + document.documentElement.scrollTop + document.body.scrollTop - event.offsetY;
		}
		
		y += obj.clientHeight - 3;*/
		
		if(name!='Update')
		{
			var bounds = T.get_bounds(obj);
			
			var el = $('debug');
			if(!el) return;
			
			el.style.position = 'absolute';
			el.style.top = (parseInt(bounds['top']) + parseInt(bounds['height'])) + 'px';
			el.style.left = bounds['left'] + 'px';
			el.innerHTML = 'menu';
		}else
		{
			D.perform_update();
		}
	}
	
	/*
	
	set styles for elements els:
	
	els    should be a string with ids of elements separated by ","
	styles should be a hash, containing key-value pairs for style
	
	EXAMPLE:
	
	// set width to 19px and height to 28px for elements with id element1, element2 and element3
	
	T.ss( 'element1,element2,element3' , 
	{
		width:  '19px',
		height: '28px'
	});
	
	*/
	
	T.ss = T.set_style = function(els, styles)
	{
		var el;
		
		els = els.split(',');
		
		for(var key in els)
		{
			el = $(els[key]);
			if(!el) return false;
			
			//alert('Set style');
			
			for(var k in styles)
			{
				if(typeof(el.style[k]) == typeof(undef)) continue; //alert('Fuck '+k);
				el.style[k] = styles[k];
			}
		}
		
		return true;
	};
	
	var w_width, w_height;
	
	var refresh_timeout = false;
	
	T.resize = function(norefresh)
	{
		/* T.dbg(T.get_height()); */
		var el;
		
		/* heights */
		var fh = 30, hh = 30, mh = 40;

		/* widths */		
		var dw = 50, lw = 250;
		
		w_width  = T.gw();
		w_height = T.gh();
		
		//alert('Hello fuck you');
		
		T.ss('address_div',
		{
			width: (w_width - 100) + 'px'
		});
		
		T.ss('content',
		{
			width: (w_width - lw) + 'px'
		});
		
		T.ss('address',
		{
			width: (w_width - 180) + 'px'	
		});
		
		T.ss('main_area',
		{
			height: (w_height - fh - hh - mh) + 'px'
		});
		
		T.ss('footer_descr', 
		{
			//position: 'absolute',
			//top: (w_height - fh) + '',
			left: '0',
			width: Math.floor( (w_width - dw) / 2) + 'px'
		});
		
		T.ss('footer_dolphin', 
		{
			//position: 'absolute',
			//top: (w_height - fh) + '',
			left: Math.floor( (w_width - dw) / 2) + '',
			width: dw + 'px'
		});
		
		T.ss('footer_state', 
		{
			//position: 'absolute',
			//top: (w_height - fh) + '',
			left: Math.floor( (w_width + dw) / 2) + '',
			width: Math.floor( (w_width - dw) / 2) + 'px'
		});
		
		T.ss('left_menu,content',
		{
			position: 'absolute',
			top: (hh - (-mh)),
			height: (w_height - fh - mh - hh) + 'px'
			//border: '1px blue dashed'
		});
		
		T.ss('content',
		{
			left: lw
		});
		
		
		T.ss('footer', 
		{
			position: 'absolute',
			top: (w_height - fh),
			left: 0
		});
		
		T.ss('very_main',
		{
			visibility: ''
		});
		
		if(!norefresh)
		{
			var perform_refresh = function(){ refresh_timeout = false; E.F5(); };
			
			var firstrun = true;
			if(E.perpage) firstrun = false;
			
			E.perpage = Math.floor( (w_height - fh - hh - mh - 46 /* hey, do not ask me about 46, okay ;)? */) / 24 /* height of 1 row */);
			
			if(firstrun)
			{
				//perform_refresh();
				refresh_timeout = false;
				D.go2('.');
			}else
			{
				if(refresh_timeout) clearTimeout(refresh_timeout);
				refresh_timeout = setTimeout(perform_refresh, 500);
			}
		}
	}
	
	T.db = T.disable_buttons = function()
	{
		for(var k in {fwd:'',back:'',up:''})
		{
			if(!E['can_go_'+k]())
			{
				$('btn_'+k).style.display='none';
				$('btn_'+k+'_disabled').style.display='';
			}else
			{
				$('btn_'+k).style.display='';
				$('btn_'+k+'_disabled').style.display='none';
			}
			
		}
	}
	
	// all functions with "upload" work with the upload form in the left menu
	
	/*T.su = T.show_upload = function()
	{
		var el = $('upload_form');
		
		if(el.style.display == 'none')
		{
			el.style.display = '';
			T._append_upload();
		}
		else
		{
			T._clear_uploads();
			el.style.display = 'none';
		}
	}
	
	var _created = []; // array of all appended and created elements to the form
	
	T._append_upload = function()
	{
		if(!T.i) T.i=0;
		
		var el = $('uploads_container');
		
		var obj = document.createElement('input');
		obj.type = 'file';
		obj.className = 'upl';
		obj.name = 'files['+(T.i++)+']';
		
		el.appendChild(obj);
		_created.push(obj);
		obj = document.createElement('br');
		el.appendChild(obj);
		_created.push(obj);
	}
	
	T._clear_uploads = function()
	{
		var el = $('uploads_container');
		
		for(var i = 0; i<_created.length; i++)
		{
			//try{
			el.removeChild(_created[i]);
			//}catch(e){}
			//alert(_created[i]);
		}
		_created = [];
	}
	*/
	
	// function that shows that something is loading (if state is true - loading started, false - loading finished)
	
	var dolphin_position = 0;
	var frames = 11;
	
	var dolphin_interval = null;
	
	T.sl = T.show_loading = function(state, text)
	{
		var d = $('footer_state');
		var s = text||'loading...';
		var dolphin = $('footer_dolphin');
		
		if(d)
		{
			if(state)
			{
				s = s.replace('...','');
				
				if(!dolphin_interval)
				{
					dolphin_interval = setInterval(function(){ dolphin_position += 30; dolphin_position %= frames*30; dolphin.style.backgroundPosition = '0px -'+dolphin_position+'px'; }, 250);
				}
				
			}else if(!state && dolphin_interval)
			{
				clearInterval(dolphin_interval);
				dolphin_interval = null;
			}
			
			$('btn_stop_disabled').style.display = state ? 'none' : '';
			$('btn_stop').style.display = state ? '' : 'none';
		}else
		{
			d = $('loading');
			if(!d) return;
		}
		
		if(state==true)
		{
			d.innerHTML = s;
			d.style.visibility = 'visible';
		}else
		{
			d.style.visibility = 'hidden';
			d.innerHTML = s;
		}
	}
	
	T.wo = T.window_open = function(src, name, width, height)
	{	
		return window.open(src, name, 'width=' + width + ',height= ' + height + ',resizeable=0,menubar=0,location=0,scrollbars=1,toolbar=0,status=0,top='+(screen.height/2-height/2)+',left='+(screen.width/2-width/2));
	}
	
	T.hk = T.handle_keydown = function(e)
	{
		// T.dbg('handled');
		return true;
		var sel = R.get_selected_items();
		var filt = E.get_filtered_items();
		var items = E.get_filtered_items();
		var t = e.srcElement || e.target;
		
		if(R.is_smpl_view() || filt.length == 0) return true;
		
		if(R.is_inp(e))
		{
			if(e.keyCode!=38 && e.keyCode!=40) return true;
			else t.blur(e);
		}
		
		
		//T.dbg(e.keyCode + ' ' + e.charCode + ' ' + Math.random());
		
		switch(e.keyCode || e.charCode)
		{
		case 46 /*delete*/:
			if(sel.length>=1)
			{
				E['delete_item'+(sel.length>1?'s':'')]();
				return false;
			}else
			{
				return true;
			}
			break;
		case 113 /*F2*/:
			if(sel.length==1)
			{
				E.rename_item();
				return false;
			}else
			{
				return true;
			}
			break;
		case 38 /* KEYUP */:
		case 40 /* KEYDOWN */:
			if(filt.length!=E.get_global_items().length) return false; /* implementation of arrows is buggy when filter is active */
		
			var id = sel[sel.length-1] ? sel[sel.length-1].id : (filt[0]&&filt[0].k?filt[0].k:0);
			var mstep = e.keyCode ==38 ? 1 : -1;
			var el = $('it'+id);
			var old_id = +id;
			
			if(mstep == 1)
			{
				if(id>0 && !$('it'+(id-1)))
				{
					var prev = id;
					for(var k in filt)
					{
						if(filt[k]['k'] == id) break;
						prev = filt[k]['k'];
					}
					
					id = prev;
				}else if(id>0)
				{
					id-=mstep;
				}
			}else
			{
				if(id<items.length-1 && !$('it'+(id-(-1))))
				{
					var brknext = false, t = null;
					
					for(var k in filt)
					{
						if(brknext)
						{
							id = filt[k]['k'];
							break;
						}
						if(filt[k]['k'] == id) brknext = true;
					}
				}else if(id<E.get_global_items().length-1)
				{
					id-=mstep;
				}
			}
			
			if(id==old_id) return;
			if(R.is_selected(items[id]) || sel.length==2 && sel[0]==items[id])
			{
				id = old_id;
			}
			
			/*I.dbg(id);*/
			$('it'+id).onmousedown(e);
			
			return false;
			break;
		case 13 /* enter */:
			var el;
			if(sel.length==1 && (el=$('it'+sel[0]['id'])))
			{
				el.ondblclick(e);
			}
			return false;
			break;
		case 8 /* backspace */:
			T.change_address('..');
			return false;
			break;
		case 67 /* C (and Ctrl) */:
		case 99 /* charCode */:
			if(!e.ctrlKey || sel.length==0) break;
			E.copy_item();
			break;
		case 88 /* X (and Ctrl) */:
		case 120 /* charCode */:
			if(!e.ctrlKey || sel.length==0) break;
			E.cut_item();
			break;
		case 86 /* V (and Ctrl) */:
		case 118 /* charCode */:
			if(!e.ctrlKey) break;
			E.paste_items();
			break;
		case 65: /* A (and Ctrl) */
		case 97: /* charCode */
		case 2: /* B (for Safari) */
		case 66: /* B (for others) */
			if(!e.ctrlKey) break;
			var l = filt.length;
			for(var k=0; k<l; k++)
			{
				R.cl($('it'+(filt[k]['k']||k)),e,true);
			}
			
			E.draw_menu_for_items();
			
			return false;
			break;
		}
		
		return true;
	}
	
	T.in_menu = false;
	T.LINK_OVER = false;
	
	T.cm = T.context_menu = function(params,event)
	{
		var sub_params={};
		var el = $("cm");
		if(!el)
		{
			el=document.createElement('div');
			el.id='cm';
			el.className='cm';
			el.onmouseover=function(){T.in_menu=true;};
			el.onmouseout=function(){T.in_menu=false;};
			document.body.appendChild(el);
		}
		
		if(el.style.display && el.style.display!='none') return false;
		
		var x = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		var y = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
		
		var spacer='<img src="f/i/no.png" width=1 height=1 style="visibility: hidden;">';
		var tmp='<table cellspacing=0 cellpadding=0 border=0 id="__cmtable"><tr height="2"><td colspan=7>'+spacer+'</td></tr>';
		
		var offsety=0,stl='';
		
		for(var k in params)
		{
			if(params[k]=='space') tmp+='<tr height="10"><td width="2">'+spacer+'</td><td valign="middle" style="vertical-align: middle;" colspan="4"><img src="f/i/hr.png" width="100%" height="1" border=0></td><td width="2">'+spacer+'</td></tr>';
			else
			{
				if(params[k]['nested'] || params[k]['disabled']) params[k]['onclick']='return false;';
				if(params[k]['disabled']) stl='gray';
				else stl='black';
				
				if(params[k]['nested']) sub_params[k]=params[k]['nested'];
				
				val='<td width="16" style="vertical-align: middle; align: center; text-align: center;">'+(params[k]['icon'] ? '<img src="f/i/'+params[k]['icon']+'.png" width=13 height=13>' : spacer)+'</td><td><nobr>'+params[k]["value"]+'</nobr></td>'+('<td nowrap="nowrap">&nbsp;&nbsp;&nbsp;'+(params[k]['hotkey']||'')+'</td>')+'<td align="center" style="align: center; text-align: center;" width="18">'+(params[k]['nested'] ? '<img src="f/i/arrow.png" width=18 height=16>' : spacer)+'</td>';
				tmp+='<tr height="16" onclick="'+params[k]["onclick"]+';I.hide_cm();" onmouseover="this.className=\'cm_'+stl+' cm_'+stl+'_hover\';window.status=this.title;I.LINK_OVER=true;return true;" onmouseout="this.className=\'cm_'+stl+'\';window.status=\'\';I.LINK_OVER=false;return true;" title="'+params[k]["title"]+'"  class="cm_'+stl+'"><td width="2">'+spacer+'</td>'+val+'<td width="2">'+spacer+'</td></tr>';
			}
			offsety+=16;
			if(params[k]=='space') offsety-=6;
		}
		
		tmp+='<tr height="2"><td colspan=7>'+spacer+'</td></tr></table>';
		
		el.innerHTML=tmp;
		
		el.style.visibility = "hidden";
		el.style.display="block";
		
		var height = el.scrollHeight+30;
		//if(window.opera) height+= 50; //stupid opera...
		
		var width = el.scrollWidth+30;
		//if(window.opera) width+= 30; //stupid opera...
		
		if (event.clientY + height > document.body.clientHeight) { y-=height-24 } else { y+=2 }
		if (event.clientX + width > document.body.clientWidth) { x-=width-24 } else { x+=2 }
		
		el.style.left = x + "px";
		el.style.top  = y + "px";
		
		el.style.visibility = "hidden";
		el.style.display="block";
		
		L.opac(el);
		
		event.returnValue=false;
		return false;
	}
	
	T.hc = T.hide_cm = function()
	{
		var el = $("cm");
		if(!el) return;
		el.style.visibility="hidden";
		el.style.display="none";
		I.in_menu = false;
		I.LINK_OVER = false;
	}
	
	T.dm = T.draw_menu = function(e)
	{
		var ecp = { clientX: e.clientX, clientY: e.clientY, returnValue: false };
		
		/* the problem is that the file has to be selected already when the context menu is going to be drawn :)
		   that's why I use setTimeout to be sure that a file is selected
		*/
		
		setTimeout(function(){
			
			var g = R.gsi();
			var params = {};
			if(!g.length)
			{
				params = {
					0: {
						title: 'Refresh filelist',
						onclick: 'E.F5();',
						value: '<b>Refresh</b>',
						hotkey: 'F5'
					},
					1: 'space',
					2: {
						title: 'Paste items here',
						onclick: 'E.pi();',
						value: 'Paste',
						disabled: !E.copied,
						hotkey: 'Ctrl+V'
					},
					3: {
						title: 'Cancel operation',
						onclick: 'E.cc();',
						value: 'Cancel '+E.op,
						disabled: !E.copied
					},
					4: 'space',
					5: {
						title: 'Create a file',
						onclick: 'E.mkfile();',
						value: 'Create a file'
					},
					6: {
						title: 'Create a folder',
						onclick: 'E.mkdir();',
						value: 'Create a directory'
					},
					7: {
						title: 'Open the shell emulator',
						onclick: 'E.ot();',
						value: 'Open terminal'
					},
					'7.5': 'space',
					8: {
						title: 'Properties of current directory',
						onclick: 'E.sp();',
						value: 'Properties',
						disabled: false
					}
				};
			}else if(g.length>1)
			{
				params = {
					0: {
						title: 'Cut items',
						onclick: 'E.cut_items();',
						value: 'Cut',
						hotkey: 'Ctrl+X'
					},
					1: {
						title: 'Copy items',
						onclick: 'E.copy_items();',
						value: 'Copy',
						hotkey: 'Ctrl+V'
					},
					2: {
						title: 'Delete items without possibility to recover them',
						onclick: 'E.delete_items();',
						value: 'Delete',
						hotkey: 'Delete'
					},
					3: {
						title: 'Add items to .zip archive',
						onclick: 'E.zip_items();',
						value: 'Add to zip'
					},
					4: {
						title: 'Change rights of items',
						onclick: 'E.chmod_items();',
						value: 'CHMOD'
					},
					'4.5': 'space',
					5: {
						title: 'Properties',
						onclick: 'E.sp();',
						value: 'Properties',
						disabled: false
					}
				};
			}else /* if g.length == 1 */
			{
				if(g[0]['type']==tFILE)
				{
					params = {
						'-2': {
							title: 'Edit file or download it',
							onclick: '$(\'it'+g[0]['id']+'\').ondblclick(event);',
							value: '<b>Open</b>',
							hotkey: 'Enter'
						},
						'-1': 'space',
						'-0.5': {
							title: 'Rename file',
							onclick: 'E.rename_item();',
							value: 'Rename',
							hotkey: 'F2'
						},
						0: {
							title: 'Cut file',
							onclick: 'E.cut_item();',
							value: 'Cut',
							hotkey: 'Ctrl+X'
						},
						1: {
							title: 'Copy file',
							onclick: 'E.copy_item();',
							value: 'Copy',
							hotkey: 'Ctrl+V'
						},
						2: {
							title: 'Delete file without possibility to recover them',
							onclick: 'E.delete_item();',
							value: 'Delete',
							hotkey: 'Delete'
						},
						3: {
							title: 'Add file to .zip archive',
							onclick: 'E.zip_item();',
							value: 'Add to zip'
						},
						4: {
							title: 'Change rights of file',
							onclick: 'E.chmod_item();',
							value: 'CHMOD'
						},
						5: {
							title: 'Download file',
							onclick: 'E.download_file();',
							value: 'Download'
						},
						'5.5': 'space',
						6: {
							title: 'Properties',
							onclick: 'E.sp();',
							value: 'Properties',
							disabled: false
						}
					};
				}else if(g[0]['type']==tDIR)
				{
					params = {
						'-2': {
							title: 'Open directory',
							onclick: '$(\'it'+g[0]['id']+'\').ondblclick(event);',
							value: '<b>Open</b>',
							hotkey: 'Enter'
						},
						'-1': 'space',
						'-0.5': {
							title: 'Rename dir',
							onclick: 'E.rename_item();',
							value: 'Rename',
							hotkey: 'F2'
						},
						0: {
							title: 'Cut dir',
							onclick: 'E.cut_item();',
							value: 'Cut',
							hotkey: 'Ctrl+X'
						},
						1: {
							title: 'Copy dir',
							onclick: 'E.copy_item();',
							value: 'Copy',
							hotkey: 'Ctrl+V'
						},
						2: {
							title: 'Delete dir without possibility to recover them',
							onclick: 'E.delete_item();',
							value: 'Delete',
							hotkey: 'Delete'
						},
						3: {
							title: 'Add dir to .zip archive',
							onclick: 'E.zip_item();',
							value: 'Add to zip'
						},
						4: {
							title: 'Change rights of dir',
							onclick: 'E.chmod_item();',
							value: 'CHMOD'
						},
						'4.5': 'space',
						5: {
							title: 'Properties',
							onclick: 'E.sp();',
							value: 'Properties',
							disabled: false
						}
					};
				}
			}
			
			I.context_menu(params,ecp);
			
		},30);
		
		return false;
	}
};

window.Interface = (window.I = new InterfaceClass());