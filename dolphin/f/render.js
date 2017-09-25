var Render_Views = 
{
table: function(){
	var T = this;
	var _selected = [];
	var FILE_OVER = false;
	var _filter = '';
	
	var _last_selected = false; // last selected element (should be flushed after changing directory)
	
	T.gsi = (T.get_selected_items = function()
	{
		return _selected;
	});
	
	// function, that is used in Table View to highlight the view
	
	T._tv_h = function(obj,ev)
	{
		
		switch(ev)
		{
		case 'over':
			I.im(obj.firstChild,'h','tv_lsep');
			obj.className = 'h';
			break;
		case 'out':
			I.im(obj.firstChild,'','tv_lsep');
			obj.className = '';
			break;
		case 'down':
			I.im(obj.firstChild,'d','tv_lsep');
			obj.className = 'd';
			break;
		}
	}
	
	T.it = (T.is_tag = function(e,tagname)
	{
		if(!e || (e.target || e.srcElement).nodeName.toLowerCase()!=tagname.toLowerCase()) return false;
		return true;
	});
	
	T.ii = (T.is_inp = function(e)
	{
		return T.is_tag(e,'input');
	});
	
	
	var _simple_view = false;
	
	T.isv = (T.is_smpl_view = function() { return _simple_view; });
	
	var zebra = function(k) { return (k%2 == 1 ? '#f6f6f6' : 'white'); };
	
	
	// offsets for different extensions in f/iconz/16-f.png
	var _ext = {_default: 0, ace: 1, app: 2, avi: 3, bat: 4, bmp: 5, chm: 6, com: 7, css: 8, divx: 9, dll: 10, doc: 11, exe: 12, fon: 13, gif: 14, gz: 15, hlp: 16, htaccess: 17, htm: 18, html: 19, htpasswd: 20, inc: 21, ini: 22, jpe: 23, jpeg: 24, jpg: 25, js: 26, lnk: 27, log: 28, mdb: 29, mid: 30, midi: 31, mov: 32, mp3: 33, mpeg: 34, mpg: 35, pdf: 36, php: 37, php3: 38, phtml: 39, pl: 40, png: 41, psd: 42, ptt: 43, rar: 44, rtf: 45, shtm: 46, shtml: 47, sys: 48, tar: 49, ttf: 50, txt: 51, wav: 52, wbmp: 53, wma: 54, zip: 55};
	
	T.file_icon = T.fi = function(path)
	{
		var e = E.ge(path).toLowerCase();
		
		return '<img src="f/i/no.png" width=16 height=16 border=0 style="background: url(\'f/iconz/16-f.png\'); background-position: 0px '+(_ext[e] ? -_ext[e]*16 : 0)+'px">';
	};
	
	T.df = T.draw_files = function()
	{
		var i = E.ggr();
		var n = []; // new items
		//var l = s.length;
		var j = 0, k = 0;
		//_filter = (s = s.toLowerCase());
		
		var row_files = E.perpage;
		var swd = 100;
		var wd = I.gw() - 250 - swd;
		
		var pages = i['pages_num'];
		
		var tmp = [];
		
		var current = function(l){ tmp.push('<span style="background: white;">' + l + '</span>'); };
		var link    = function(l,text){ tmp.push('<a href="#" onclick="D.cp('+l+'); return false;">' + (text || l) + '</a>'); };
		
		D.show_pages(pages, E.page, current, link);
		
		var f = i['pages'][E.page];
		E.perpage = row_files;
		
		window.filenames = [];
		_selected = [];
		
		//var sz = [];
		
		var show_dirs = function()
		{
			if(f && f['dirs'] && f['dirs']['name'])
			{
				for(j = 0; f['dirs']['name'][j] && k < row_files; j++, k++)
				{
					n[k] = '<tr height="24" style="cursor: default; background: ' + zebra(k) + ';" id="tr_'+k+'" onmouseover="R.hove(event);" onmouseout="R.hout(event);">\
					\
					<td ondblclick="D.go2(window.filenames['+k+']); return false;" onclick="R.check(this,event);" id="' + k + '" onmousedown="return false;" class="column"><div style="overflow: hidden; width: '+wd+'px; padding-left: 5px;"><nobr><img src="f/iconz/16-folder.png" width=16 height=16 border=0> ' + f['dirs']['name'][j] + '</nobr></div></td>\
					\
					<td width="'+swd+'"><div id="size_' + k + '" style="padding-left: 5px; width: '+swd+'px; overflow: hidden;"><nobr>' + E.hb(f['dirs']['size'][j]) + '</nobr></div></td>\
					\
					</tr>';
					window.filenames[k] = E.address + '/' + f['dirs']['name'][j];
				}
			}
		}
		
		var show_files = function()
		{
			var path = null;
			
			if(f && f['files'] && f['files']['name'])
			{
				for(j = 0; (path=f['files']['name'][j]) && k < row_files; j++, k++)
				{
					n[k] = '<tr height="24" style="cursor: default; background: ' + zebra(k) + ';" id="tr_' + k + '" onmouseover="R.hove(event);" onmouseout="R.hout(event);">\
					\
					<td ondblclick="E.edit_file_for_item(' + k + '); return false;" onclick="R.check(this,event);" id="' + k + '" onmousedown="return false;" class="column"><div style="overflow: hidden; width: '+wd+'px; padding-left: 5px;"><nobr>' + T.fi(path) + ' ' + path + '</nobr></div></td>\
					\
					<td width="'+swd+'"><div id="size_' + k + '" style="padding-left: 5px; width: '+swd+'px; overflow: hidden;"><nobr>' + E.hb(f['files']['size'][j]) + '</nobr></div></td>\
					\
					</tr>';
					
					window.filenames[k] = E.address + '/' + f['files']['name'][j];
				}
			}
		}
		
		if(E.order == 'asc')
		{
			show_dirs();
			show_files();
		}else
		{
			show_files();
			show_dirs();
		}
		
		var filelist = '<table width="100%" height="100%" cellspacing=0 cellpadding=0><tr height="23">';
		
		var els = {name: ['Name', 0], size: ['Size', swd]};
		
		for(var field in els)
		{
			var width = els[field][1] ? ' width="'+els[field][1]+'"' : '';
			
			filelist +=
			
			'<th id="' + field + '_th"' + width + ' class="sort'+(E.sort==field ? ' active' : '')+' column"><a href="#" onclick="if(E.sort != \'' + field + '\') D.cs(\'' + field + '\'); else D.co(E.order==\'asc\'?\'desc\':\'asc\'); return false;">'
			
			+ els[field][0] + (E.sort == field ? ' '+(E.order == 'asc' ? '&uarr;' : '&darr;') : '') + '</a>'
			
			+ (E.sort == field && field == 'name' && i['items_num'] > JS_MAX_ITEMS ? (' <small>(<a href="#" onclick="D.cf();return false;">' + (E.fast ? 'show all folders first' : 'use faster sorting') + '</a>)</small>') : '')
			
			+ '</th>';
		}
		
		var fl = $('filelist');
		
		fl.innerHTML = filelist + n.join('') + '<tr><td></td></tr></table>';
		fl.onmousedown = T.handle_down;
		
		$('pages_links').innerHTML = pages>1 ? '<b>Pages:</b> '+tmp.join(' ') : '';
		$('select_links').innerHTML = pages>0 ? '<b>Select:</b> '+(/*pages>1*/true ? '<a href="#" onclick="R.check_all(); R.redraw_menu(); return false;">'+(pages<1 ? 'all' : 'this page')+'</a>, ' : '') + /* '<a href="#" onclick="' + (pages > 1 ? 'alert(\'Not implemented\');' : 'R.check_all();') + ' R.redraw_menu(); return false;">all ('+i['items_num']+')</a>, ' +  */ '<a href="#" onclick="R.uncheck_all(); R.redraw_menu(); return false;">none</a>' : '';
		
		//$('files_td').innerHTML = n.join('');
		//$('sizes_td').innerHTML = sz.join('');
		
		_last_selected = false;
	};
	
	var deselect = function(k)
	{
		I.ss('tr_'+k, {background: zebra(k) });
	};
	
	var yellow_zebra = function(k) { return (k%2 == 1 ? '#fff07c' : '#fdf5b5'); };
	
	var select = function(k)
	{
		I.ss('tr_'+k, {background: yellow_zebra(k) });
	};
	
	T.uncheck_all = function()
	{
		var els = _selected.length;
		for(var i = 0; i < els; i++)
		{
			for(var l = 0; l < window.filenames.length; l++)
			{
				if(_selected[i] == window.filenames[l])
				{
					deselect(l);
					break;
				}
			}
		}
		
		_selected = [];
	}
	
	T.check_all = function()
	{
		_selected = [];
		
		for(var l = 0; l < window.filenames.length; l++)
		{
			select(l);
			_selected.push(window.filenames[l])
		}
	}
	
	T.redraw_menu = function()
	{
		var els = _selected.length;
		
		if(els == 0)
		{
			L.draw(D.ggm()); /* draw the default folder menu */
			I.cs(D.ggs());
			this.last = false;
		}else if(els == 1)
		{
			if(_last_selected == _selected[0]) return;
			E.dmfi(_selected[0]); /* draw menu for (1) item */
			_last_selected = _selected[0];
		}else
		{
			E.dmfis(); /* draw menu for items */
			this.last = false;
		}
	}
	
	T.check = function(el,event)
	{
		var k = el.id;
		var file = window.filenames[k];
		var num = T.is(file);
		var els = _selected.length;
		
		//alert(file);
		
		if(event.ctrlKey || event.metaKey)
		{
			if(num !== false)
			{
				//alert('ECTb');
				if(els > 1)
				{
					_selected.splice(num,1);
				}else
				{
					_selected = [];
				}
				deselect(k);
				els--;
			}else
			{
				//alert('NETU');
				_selected.push(file);
				select(k);
				els++;
			}
			
			_last_selected = false;
		}else
		{
			T.uncheck_all();
			_selected = [file];
			els = 1;
			select(k);
		}
		
		//alert(els);
		T.redraw_menu();
	}
	
	/* returns index of element in _selected or boolean false otherwise
	   NOTE: check for true as !==false (not ==true) */
	
	T.is = T.is_selected = function(el)
	{
		for(var i=0; i<_selected.length; i++)
		{
			//alert('selected = ' + _selected[i] + ', el = ' + el);
			if(_selected[i] == el) return i;
		}
		
		return false;
	};
	
	// this function selects the file or folder - the element el
	
	T.cl = function(el,e,fast)
	{
		if(_simple_view) return false;
		
		if(!e.ctrlKey && !T.is_rbutton(e)) T.un_cl();
		
		var id = el.id.substr(2);
		
		var i = E.ggi()[id];
		
		i['id'] = id;
		
		if(true/*!fast*/)
		{
			var num = /*T.is_selected(i)*/el.className=='item16_h';
			if((fast||T.ir(e)) && num!==false) return;
		}
		
		if(!fast && e.ctrlKey && num!==false)
		{
			T._selected.splice(num,1);
			el.className = 'item16';
		}else
		{
			T._selected.push(i);
			el.className = 'item16_h';
		}
		
		if(T._selected.length == 0) T.un_cl(true);
		else if(T._selected.length == 1)
		{
			if(!fast) E.dmfi(id);
		}else
		{
			if(!fast) E.dmfis();
		}
	}
	
	// this function cancels selection. If force = true, it will also draw the menu
	
	T.uc = T.un_cl = function(force)
	{
		var el = false;
		
		if(_simple_view) return false;
		
		if(force)
		{
			L.draw(E.get_global_menu());
			I.change_status(E.get_global_status());
		}
		
		for(var k=0; k < T._selected.length; k++)
		{
			el = $('it' + T._selected[k]['id']);
			if(el) el.className = 'item16';
		}
		
		T._selected = [];
		
		//last_items_global = {};
	};
	
	// this function handles the onmouseover event for table view. It would use the common for all interface
	
	T.hove = (T.handle_over = function(e, obj)
	{
		if(_simple_view) return false;
		FILE_OVER = true;
	});
	
	// this function handles the onmouseout event for table view. It would use the common for all interface
	
	T.hout = (T.handle_out = function(e, obj)
	{
		if(_simple_view) return false;
		FILE_OVER = false;
	});
	
	// 
	
	T.hd = (T.handle_down = function(e)
	{
		if(_simple_view) return false;
		if(T.is_inp(e) || T.is_tag(e,'a')) return true;
		
		if(!FILE_OVER)
		{
			T.uncheck_all();//T.un_cl(true);
			T.redraw_menu();
		}
		
		return true/*false*/ /* for input.onblur() worked correctly. Need to make changes in event system to handle this case better. */;
	});
	
	T.ir = (T.is_rbutton = function(e)
	{
		return e.button==3 || e.button==2;
	});
}
};

window.Render = (window.R = new Render_Views['table']());