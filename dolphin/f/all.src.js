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
			
			+ (E.sort == field && field == 'name' && i['items_num'] > 200 ? (' <small>(<a href="#" onclick="D.cf();return false;">' + (E.fast ? 'show all folders first' : 'use faster sorting') + '</a>)</small>') : '')
			
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

window.Render = (window.R = new Render_Views['table']());var EngineClass = function(){
	var T = this;
	var _history = {'back': [], 'fwd': []};
	
	/* protected functions */
	var draw_menu_for_item_callback, _copycut, print_history, sync, show_state;
	
	T.address = false; // the address of current directory
	T.page = 1; // current page
	T.perpage = 0;
	T.sort = 'name'; // sort column
	T.order = 'asc'; // sorting order
	T.fast = true; // use fast sorting, if sort field is 'name'
	
	T.copied = false; // if something is copied (or cut)
	T.op = 'copy'; // what operation will be done - cut or copy?
	
	T.ggr = T.get_global_res = function()
	{
		return D.ggr();
	};
	
	T.ggm = (T.get_global_menu = function() // function that gets _menu
	{
		return D.ggm();
	});
	
	T.ggs = (T.get_global_status = function()
	{
		return D.ggs();
	});
	
	var _draw_timeout = false;
	
	/* cancel delayed draw of menu (e.g. information about file) */
	
	T.cd = (T.cancel_draw = function()
	{
		if(!_draw_timeout) return;
		
		clearTimeout(_draw_timeout);
		_draw_timeout = false;
	});
	
	// function changes dir to the specified location
	// if nohistory set to true, nothing will be added to history
	// function changes the name in the header, the address and even the menu
	
	var _lasterr = false;
	
	T.go2 = function(where,nohistory,page)
	{
		return D.go2(where,nohistory,page);
	};
	
	T.rf = T.request_filelist = function(dir,params,onreadyfunc)
	{
		D.qr('index.php?act=filelist', {DIR: dir, 'params': params}, onreadyfunc, true, 'requesting pages');
	};
	
	// function is the analogue of basename() function in PHP
	
	T.bsnm = (T.basename = function(path)
	{
		var p = path.split('/');
		if(!p[p.length-1]) p.pop();
		return p[p.length - 1];
	});
	
	T.round = function(digit, precision)
	{
		if(precision <= 0) return Math.round(digit);
		precision = parseInt(precision);
		
		var fp = ''+Math.round( (digit - Math.floor(digit)) * Math.pow(10, parseInt(precision)));
		
		if(fp.length < precision)
		{
			for(var i = precision - fp.length; i>0; i--) fp = '0' + fp;
		}
		
		return Math.floor(digit) + '.' + fp;
	};
	
	T.hb = T.human_bytes = function(bytes)
	{
		if(bytes < 0) return '&gt;2 Gb';
		
		if(bytes < 1024) return bytes + ' bytes';
		else if(bytes < 1024*1024) return T.round(bytes/1024,2) + ' Kb';
		else if(bytes < 1024*1024*1024) return T.round(bytes/(1024*1024), 2) + ' Mb';
		else return T.round(bytes/(1024*1024*1024), 2) + ' Gb';
	};
	
	// function gets the extension of file
	
	T.ge = (T.get_extension = function(file)
	{
		var arr=file.split('.');
		if(!arr[1]) return '';
		for(var k in arr) var ext=arr[k];
		return ext;
	});
	
	// function that returns the full path for object with number k
	
	T.path = function(k)
	{
		/* R._selected = [_items[k]]; */
		
		return _items[k]['fullpath'];
	}
	
	// function that draws menu for 1 selected item
	// it draws the menu after a timeout of 300 msec (to enable normal double-clicking)
	
	T.dmfi = (T.draw_menu_for_item = function(item)
	{
		//if(_items[item]['type']!=1&&_items[item]['type']!=0) return draw_menu_for_item_callback(item);
		
		T.cancel_draw();
			
		_draw_timeout = setTimeout(function(){draw_menu_for_item_callback(item);}, 300);
	});
	
	T.dmfis = (T.draw_menu_for_items = function()
	{	
		L.draw({0: 'operations', 1: {name: 'details', filename: 'Selected:', selnum: R.get_selected_items().length}});
		I.change_status([['Selected items',R.get_selected_items().length]]);
	});
	
	
	/* item - number of item in _items
	   info - the cached result of index.php?act=info , if present */
	draw_menu_for_item_callback = function(item, info)
	{
		//var i = _items[item];
		
		//if(i['type']==1||i['type']==0) 
		//{
			T.cancel_draw();
			
			var dr = function(info){
				//if(i['type']==0) info['size']=i['size'];
				R._selected = [{type: 1, fullpath: info['fullpath']}];
				var type = (info['dir'] ? 0 : 1);
				L.draw({0: {name: 'operations', type: type},1: info });
				
				I.change_status([['Name',info['filename']],['Type',info['type']],['Size',info['size']]]);
			}
			
			if(!info) D.qr('index.php?act=info', {  file: item }, function(d,err) { if(d) dr(d); });
			else dr(info);

		//}
		/*else if(i['type']==0)
		{
			L.draw({0: 'operations',1: {name: 'details', filename: i['name'], dir: true, size: i['size']}});
		}*///else if(i['type']==2)
		//{	
		//	L.draw({0: 'common', 1: { name: 'details', filename: i['name'], dir: false, type: i['descr'], free: i['free'], total: i['total'], fs: i['fs'] }});
		//}
	}
	
	T.di = T.delete_item = T.dis = T.delete_items = function()
	{
		var items = R.get_selected_items();
		/*for(var i=0; i<items.length; i++)
		{
			if(items[i]['type']!=0 && items[i]['type']!=1) return; // you can only delete files and folders
		}*/
		
		if(!confirm('Do you really want to delete ' + (items.length == 1 ? E.bsnm(items[0]) : 'all items ('+items.length+')') + '?')) return;
		
		var del;
		
		(del = function(result)
		{
			D.qr('index.php?act=delete', {'items':items}, function(res,err)
			{
				if(res && res.end)
				{
					if(!res.success) alert('Delete failed');
					T.F5();
				}else if(res && !res.end)
				{
					/*setTimeout(function(){*/del(res);/*}, 100);*/
				}
			},true, 'deleting ' + show_state(result) + '...');
		})();
	};
	
	/*
	sync = function(el,i,e,force)
	{
		var v = $('__vary');
		e = e||window.event;
		
		if(!v)
		{
			v = document.createElement('div');
			v.className = 'norm';
			v.style.visibility = 'hidden';
			v.style.position = 'absolute';
			v.style.whiteSpace = 'pre';
			
			document.body.appendChild(v);
		}
		
		if(e && e.keyCode == 13 // Enter
		   || force)
		{
			D.qr('index.php?act=rename', {'old': i, 'new': el.value}, function(res,err)
			{
				if(res['success'])
				{
					_items[i['id']] = res['new'];
				}else
				{
					alert('The item ' + res['f'] + ' could not be renamed.' + res['reason']);
				}
				
				el.parentNode.removeChild(el);
				R.draw(_items);
				R.cl($('it'+i['id']),{});
			});
			
			el.onblur = function(){}; // Safari blurs the element when the node is deleted and tries to rename file 2 times
			
			return;
		}
		
		v.innerHTML = el.value;
		el.style.width = (v.clientWidth - (-20) ) + 'px';
	}
	*/
	
	// function that renames the selected item (for ex. file or folder)
	
	T.ri = (T.rename_item = function()
	{
		var i = R.gsi()[0];
		//if(i['type']!=0 && i['type']!=1) return; // you can only rename files and folders
		/*var n = prompt('Enter new name: ',i['name']);
		if(!n) return;
		*/
		
		//var el = $('it'+i['id']);
		//var nm = el.firstChild.nextSibling;
		
		/*
		I.dbg('name: ' + el.nodeValue);
		
		*/
		
		//el.removeChild(nm);
		
		//var inp = document.createElement('input');
		
		/*var buf = '';
		
		for(var k in inp)
		{
			buf += k + '<br>';
		}
		
		I.dbg(buf);
		*/
		
		//var s = function(e){sync(inp,i,e);};
		
		//var p = {type: 'text', value: i['name'], className: 'norm rename_inp', onkeydown: s, onblur: function(){sync(inp,i,null,true);} };
		
		//for(var k in p) inp[k] = p[k];
		
		//el.appendChild(inp);
		
		//s();
		//inp.select();
		
		//R.un_cl();
		
		var newname = prompt('Enter new name:', T.basename(i));
		
		if(!newname) return;
		
		D.qr('index.php?act=rename', {'old': i, 'new': newname}, function(res,err)
		{
			if(res['success'])
			{
				E.F5();
			}else
			{
				alert('The item ' + res['f'] + ' could not be renamed.' + res['reason']);
			}
		});
			
	});
	
	// T function creates folder
	
	T.mkdir = function()
	{
		/* stupid IE7! It blocks prompts */
		var new_name = prompt('Enter the new directory name:','NewFolder');
		
		if(!new_name) return;
		
		D.qr('index.php?act=mkdir', {name: new_name}, function(res,err){
			if(res['success']) T.F5();
			else alert('Could not create directory.' + res['reason']/* + '. Error text: ' + err*/);
		});
	}
	
	T.mkfile = function()
	{
		/* stupid IE7! It blocks prompts */
		var new_name = prompt('Enter the new filename:','NewFile');
		
		if(!new_name) return;
		
		D.qr('index.php?act=mkfile', {name: new_name, confirm: 0}, function(res,err){
			if(res['exists'])
			{
				if(confirm('The file already exists. Overwrite it?')) D.qr('index.php?act=mkfile', {name: new_name, confirm: 1}, function(r,e)
				{
					if(!r['success']) alert('Could not create file.' + r['reason']);
					else T.F5();
				});
				
				return;
			}
			if(res['success']) T.F5();
			else alert('Could not create file.' + res['reason']/* + '. Error text: ' + err*/);
		});
	}
	
	// T function downloads the selected element
	
	T.df = T.download_file = function(i)
	{
		var undef;
		if(typeof(i) == typeof(undef)) i = R.get_selected_items()[0];
		D.qr('index.php?act=download_get_href',{file: i, type: 1},function(res,err)
		{
			if(res)
			{
				//alert(res['href']);
				window.location.href = res['href'];
			}else alert('Could not get address to download file. This error cannot happen.');
		},false,'downloading...');
	};
	
	T.cpi = (T.cpis = (T.copy_items = (T.copy_item = function(){ _copycut('copy'); })));
	
	T.cti = (T.ctis = (T.cut_items = (T.cut_item = function(){ _copycut('cut'); })));
	
	T.cancel_copy = function ()
	{
		D.qr('index.php?act=cancel_copy',{}, function(res,err)
		{
			T.copied = false;
			T.F5();
		});
	}
	
	// the function copies or cuts the file
	
	_copycut = function (what /* copy or cut? */)
	{
		D.qr('index.php?act='+what,{items: R.get_selected_items()},function(res,err)
		{
			if(!res) alert('Could not '+what+' files.');
			else
			{
				T.op = what;
				T.copied = true;
				R.un_cl(true);
			}
		});
	}
	
	// function which pastes copied or cut items
	
	show_state = function(result)
	{
		if(!result) return '(process started)';
		
		return '<small>(<b>files:</b> '+result.files+'&nbsp;&nbsp;&nbsp;<b>dirs:</b> '+result.dirs+(result.total ? '&nbsp;&nbsp;&nbsp;<b>total:</b> ' + result.total + (result.speed ? ' on ' + result.speed : '') : '')+')</small>';
	}
	
	T.pi = (T.paste_items = function ()
	{
		if(T.op == 'cut')
		{ 
			D.qr('index.php?act=paste',{}, function(res,err)
			{
				if(!res) alert(err);
				T.copied = false;
				T.F5();
			},true, T.op=='copy'?'copying...':'moving...');
		}else
		{
			var cp;

			(cp = function(result)
			{
				D.qr('index.php?act=paste',{}, function(res,err)
				{
					if(err) alert(err);
					
					if(!res)
					{
						return;
					}
					
					if(res.end)
					{
						T.copied = false;
						if(!res.success) alert( (T.op == 'copy' ? 'Copy' : 'Move') + ' failed');
						T.F5();
					}else
					{
						/*setTimeout(function(){ */cp(res);/* }, 100);*/
					}
				},true, T.op=='copy'?'copying '+ show_state(result)+'...':'moving ' + show_state(result) +'...');
			})();
		}
	});
	
	// refresh filelist
	T.F5 = (T.refresh = function(){T.go2(T.address,true,T.page,true);});
	
	var _filenum = 0;
	
	T.effi = (T.edit_file_for_item = function(k)
	{
		var filename = window.filenames[k];
		
		var wnd = I.window_open('about:blank', 'edit' + (_filenum++), 640, 480);
		
		/* window is opened just now because in JsHttpRequest handler it will be blocked!
		   
		   "smart" browsers do not block windows that were opened on user click,
		   but they do not know that I do not know URL of the file :) at that moment,
		   and need an additional asynchonous request to server
		*/
		
		D.qr('index.php?act=info', {file: filename, type: 1}, function(res,err)
		{
			var img = res['thumb'] ? true : false;
			res['thumb'] = false; /* decrease server load, we do not need to draw the thumb in info */
			
			draw_menu_for_item_callback(filename, res);
			
			if(res['size_bytes'] >= 100*1024 && !img)
			{
				T.download_file(filename);
			}else
			{
				wnd.location.href = 'index.php?act=edit&file=' + res['filename_encoded'] + (img ? '&img=true' : '');
			}
		},true,'opening...');
	});
	
	var _block_back = false; // block add button
	var _block_fwd = false; // block fwd button
	
	T.ath = (T.add_to_history = function(dir)
	{
		_history['back'].push(dir);
		_history['fwd'] = [];
		//print_history();
	});
	
	T.gb = (T.go_back = function()
	{
		if(_history['back'].length<=1) return false;
		_history['fwd'].push(_history['back'].pop());
		T.go2(_history['back'][_history['back'].length-1], true);
		//print_history();
	});
	
	T.gf = (T.go_fwd = function()
	{
		if(_history['fwd'].length==0) return false;
		var addr = _history['fwd'].pop();
		_history['back'].push(addr);
		T.go2(addr, true);
		//print_history();
	});
	
	T.cgb = (T.can_go_back = function(){ return _history['back'].length > 1; });
	T.cgf = (T.can_go_fwd = function(){ return _history['fwd'].length > 0; });
	T.cgu = (T.can_go_up = function(){ return D.cgu(); });
	
	print_history = function()
	{
		var tmp = '<table onclick="T.style.display=\'none\'"><tr><td>Back: ';
		for(k in _history['back']) if(k!='copy') tmp+='<br>' + k + ': ' + _history['back'][k];
		tmp+='</td><td>Fwd: ';
		for(k in _history['fwd']) if(k!='copy') tmp+='<br>' + k + ': ' + _history['fwd'][k];
		tmp+='</td></tr></table>';
		
		I.dbg(tmp);
	}
	
	// function uploads files selected in the left menu
	
	/*T.uf = (T.upload_files = function()
	{
		D.qr('index.php?act=upload',{ 'form': $('upload_form'), 'DIR': T.address },function(res, err)
		{
			
			setTimeout(function(){I.show_upload();T.F5();}, 100); // "fixing" the JsHttpRequest library bug
			
			if(!res) alert(err);
		
		},true,'uploading...');
		
		return true;
	});*/
	
	// the function replaces the link "show dir size" by the directory size
	
	T.sds = (T.show_dir_size = function(nolimit)
	{
		var el = $('_dirsize');
		var i, name;
		if(R.gsi().length>0)
		{
			name = R.gsi()[0];
		}else
		{
			i = -1;
			name = T.address;
		}
		
		//el.innerHTML = '<i>loading, please wait...</i>';
		
		D.qr('index.php?act=show-properties',{'items': [name] }, function(res,err)
		{
			if(res)
			{
				if(!nolimit&&!res.end) res.total += ' <a href="javascript:E.sds(true);" style="text-decoration: underline;">count further</a>';
				el.innerHTML = (res.end ? '' : '&gt;') + res.total;
				if(res.end)
				{
					if(i==-1) _menu[2]['size'] = res.total;
				}
				
				if(!res.end && nolimit)
				{
					/*setTimeout(function(){ */T.sds(true);/* }, 100);*/
				}
			}
			else el.innerHTML = 'error: '+err;
		}, true, 'counting...');
	});
	
	T.ci = T.chmod_item = T.cis = T.chmod_items = function(mod,items)
	{
		//if(!mod) mod = prompt('Enter rights for item(s): ', '777');
		var recursive = confirm('CHMOD items recursively (chmod also subdirectories and files in subdirectories)?');
		//if(!mod) return;
		
		if(!recursive)
		{
		
			D.qr('index.php?act=set_rights', {'items': items/* || R.get_selected_items()*/, 'mod': mod, 'recursive': false},function(res,err)
			{
				if(err) alert(err);
				//if(!items) T.F5();
			});
		}else
		{
			
			var cp;

			(cp = function(result)
			{
				D.qr('index.php?act=set_rights', {items: items/* || R.get_selected_items()*/, 'mod': mod, 'recursive': true},function(res,err)
				{
					if(err)
					{
						alert(err);
						return;
					}
					
					if(res.end) if(!res.success) alert( 'CHMOD failed');//if(!items) T.F5();
					else        setTimeout(function(){ cp(res); }, 100);
				}, true, 'CHMODding '+show_state(result)+'...');
			})();
		}
	};
	
	T.zis = T.zi = T.zip_items = T.zip_item = function()
	{	
		D.qr('index.php?act=zip', {items: R.gsi()}, function(res,err)
		{
			if(err) alert(err);
			T.F5();
		}, true, 'compressing');
	};
	
	T.uzi = T.unzip_item = function(mode)
	{	
		D.qr('index.php?act=unzip', {'fullpath': R.gsi()[0], 'mode': mode}, function(res,err)
		{
			if(err) alert(err);
			T.F5();
		}, true, 'extracting');
	};
	
	T.ru = T.run_update = function()
	{
		D.qr('index.php?act=update', {}, function(res,err)
		{
			if(!res)
			{
				if(confirm('Auto-update failed.\nDo you want to use advanced way to update Dolphin.php (version will be changed to light)?')) window.location='index.php?version=light&DIR=.&act=download-new';
			}else
			{
				alert('Update successful!');
				window.location.reload();
			}
		});
	};
	
	// the function which opens the terminal window
	
	T.ot = T.open_terminal = function()
	{
		I.window_open('index.php?act=terminal', 'terminal', 700, 500);
	};
	
	T.sp = T.show_properties = function()
	{
		if(!this.i) this.i = 0;
		I.window_open('index.php?act=properties', 'properties'+(this.i++), 300, 400);
	};
};

window.Engine = (window.E = new EngineClass());
var LeftMenuClass = function()
{
	var T = this;
	var names = {}; // the names of menus { id: name, ... }
	var hidden = {}; // the names of hidden elements { 'name': name, ... }
	
	var add_link, opac; /* protected functions */
	
	// generates left menu with the specified parameters:
	// params = { id1: 'what to draw1', id2: 'what to draw2', ... }
	// 'what to drawN' = 'common' || 'additional' || 'operations' || 'long text'
	
	T.draw = function(params)
	{
		var i=0;
		var tmp='',header='',body='',up='',visible='';
		names = {};
		
		//alert('called');
		
		for(var k in params)
		{
			i++;
			
			if(!params[k]['name']) params[k]={name: params[k]};
			
			names[i]=params[k]['name'];
			
			var p = params[k];
			
			switch(p['name'])
			{
			default:
			case 'common':
				header='Common';
				body='';
				if(E.copied)
				{
					body+=add_link("javascript:E.paste_items();",'Paste items here','paste','Paste');
					/*if(E.op=='copy') body+=add_link("javascript:E.advanced_paste();",'Paste items in several steps','paste','Paste <i>big files, experimental</i>');*/
					body+=add_link("javascript:E.cancel_copy();",'Cancel '+E.op,'cancel','Cancel '+E.op);
				}
				body+=add_link("javascript:E.mkfile();",'Create a file','mkdir','Create a file');
				body+=add_link("javascript:E.mkdir();",'Create a folder','mkdir','Create a directory');
				//body+=add_link("javascript:E.open_terminal();",'Open terminal window to execute shell commands','rename','Open terminal');
				/* TODO: make a better uploads */
				//body+=add_link("javascript:I.show_upload();",'Upload files','upload','Upload files');
				//body+='<form enctype="multipart/form-data" style="display:none; margin: 0px; padding: 0px;" id="upload_form"><div id="uploads_container"></div><div align="right" style="padding-bottom: 3px;"><a href="javascript:I._append_upload();" style="text-decoration: underline;">add more files...</a></div><button type="button" style="font-size: 10px;" onclick="E.upload_files();return false;"><b>upload'+(upload_max_filesize?' ('+upload_max_filesize+' max)':'')+'</b></button></form>';
				break;
			case 'fsearch':
				header='Filename filter';
				T._search_str_default = 'Enter part of filename...';
				if(!T._search_str) T._search_str = T._search_str_default; // the search string
				body='<input type=text name="fsearch" id="fsearch" class="fsearch_g" onkeyup="/*setTimeout is to prevent IE crash =) */if(window.search_timeout) clearTimeout(window.search_timeout); window.search_timeout = setTimeout(function(){ L._search_str=$(\'fsearch\').value;D.cp(1);}, event.keyCode == 13 ? 0 : 500);" onfocus="if(this.value==\''+T._search_str_default+'\') this.value=\'\';this.className=\'fsearch\'" onblur="this.className=\'fsearch_g\';if(this.value==\'\') this.value=\''+T._search_str_default+'\';" value="'+T._search_str+'">';
				break;
			case 'operations': // all items are taken from the main frame
				var s /* selected */ = R.gsi();
				
				
				
				header='Common operations';
				
				if(s.length == 1)
				{
					s = s[0];
					
					if(p['type'] == 1)
					{
						body = add_link("javascript:E.rename_item();",'Set another name to current file','rename','Rename file');
						body += add_link("javascript:E.cut_item();",'Move file to another place','cut','Cut file');
						
						body += add_link("javascript:E.copy_item();",'Make a copy of file','copy','Copy file');
						
						body += add_link("javascript:E.download_file();",'Download the selected file to your computer','upload','Download file');
						
						body += add_link("javascript:E.delete_item();",'Remove the file from computer','delete','Delete file');
						if(E.get_extension(s) == 'zip')
						{
							body += add_link("javascript:E.unzip_item(&quot;extract_here&quot;);",'Extract contents here','zip','Extract here');
							var lon = E.basename(s);
							lon = lon.substr(0, lon.length-4);
							var shor = lon.length>12 ? lon.substr(0,9) + '...' : lon;
							
							body += add_link("javascript:E.unzip_item(&quot;extract&quot;);",'Extract to &quot;'+lon+'/&quot;','zip','Extract to &quot;' + shor + '/&quot;');
						}else
						{
							body += add_link("javascript:E.zip_item();",'Add file to zip','zip','Add to zip');
						}
						
						//alert(p['type']);
						
						body += add_link("javascript:E.show_properties();",'Show file properties','admin','Show Properties');
					}else
					{
						body = add_link("javascript:E.rename_item();",'Set another name to current directory','rename','Rename folder');
						body += add_link("javascript:E.cut_item();",'Move directory to another place','cut','Cut folder');
						
						body += add_link("javascript:E.copy_item();",'Make a copy of directory','copy','Copy folder');
						
						body += add_link("javascript:E.delete_item();",'Remove the directory from computer','delete','Delete folder');
						body += add_link("javascript:E.zip_item();",'Add directory to zip','zip','Add to zip');
						
						body += add_link("javascript:E.show_properties();",'Show directory properties','admin','Show Properties');
					}
				}else
				{
					body += add_link("javascript:E.cut_items();",'Move items to another place','cut','Cut items');
					
					body += add_link("javascript:E.copy_items();",'Make copy of items','copy','Copy items');
					
					/*body += add_link("javascript:E.download_files();",'Download the selected items to your computer','upload','Download file');*/
					
					body += add_link("javascript:E.delete_items();",'Remove the items from computer','delete','Delete items');
					/*if(E.get_extension(s['fullpath']) == 'zip')
					{
						body += add_link("javascript:E.unzip_item(&quot;extract_here&quot;);",'Extract contents here','zip','Extract here');
						var lon = E.basename(s['fullpath']);
						var lon = lon.substr(0, lon.length-4);
						shor = lon.length>12 ? lon.substr(0,9) + '...' : lon;
						
						body += add_link("javascript:E.unzip_item(&quot;extract&quot;);",'Extract to &quot;'+lon+'/&quot;','zip','Extract to &quot;' + shor + '/&quot;');
					}else
					{
						
					}
					*/
					
					body += add_link("javascript:E.zip_items();",'Add items to zip','zip','Add to zip');
					
					body += add_link("javascript:E.show_properties();",'Show properties of items','admin','Show Properties');
				}
				break;
			case 'details': // params: { filename, dir, type, changed, size, thumb }
				header='Details';
				
				if(p['thumb']) body=p['thumb'];
				else body='';
				
				body+='<b style="'+( /*document.all && !window.opera /* stupid IE doesn't understand, what does the overflow of element without width mean */ true ? 'width: 200px;' : '')+'overflow: hidden; display: block;">'+p['filename']+'</b>';
				
				if(p['dir']) p['type'] = 'Directory';
				
				if(p['type']) body+=p['type'] + '<br><br>';
				else body += '<br>';
				
				if(p['selnum']) body+=p['selnum'] + ' items<br><br>';
				
				if(p['id3']) body+=p['id3']+ '<br><br>';
				
				if(p['fs']) body+='Filesystem: ' + p['fs'] + '<br><br>';
				if(p['free']) body+='Free disk space: ' + p['free']+ '<br><br>';
				if(p['total']) body+='Total disk space: ' + p['total']+ '<br><br>';				
				
				if(p['changed']) body+='Changed: '+p['changed']+ '<br><br>';
				if(p['owner']) body+='Owner: '+p['owner']+'<br><br>';
				if(p['group']) body+='Group: '+p['group']+'<br><br>';
				if(p['rights']) body+='Rights: '+p['rights']+'<br><br>';
				
				if(p['size']) body+='Size: <span id="_dirsize">'+p['size']+ '</span><br><br>';
				else if(p['dir']) body+='Size: <span id="_dirsize"><a href="javascript:E.show_dir_size(false);" style="text-decoration: underline;">click to show size</a></span>'+ '<br><br>';
				
				body = body.substr(0,body.length-4);
				if(body.substr(body.length,body.length-4) == '<br>') body = body.substr(0,body.length-4);;
				
				break;
			case 'long text':
				header='phylosophy';
				body='long text should be here';
				
				break;
			}
			
			var up = hidden[p['name']] ? 'l_darr' : 'l_uarr';
			var displ = up=='l_uarr' ? '' : ' style="display: none;"'
			
			tmp+='<div class="left_menu_head"><span onclick="L._hide('+i+');">'+header+'</span></div>\
			\
			<div class="left_menu_body" id="b'+i+'" border=0'+displ+'>'+body+'</td><td width=12><img src="f/i/no.png" width=12 height=1></div>';
		}
		
		
		$('left_menu').innerHTML=tmp;
	}
	
	// function is used to highlight the header in the left menu (used in draw)
	
	T._highlight = function(id,act)
	{
		var el = $('i'+id);
		var state = act=='over' ? 'h' : '';
		
		if(hidden[names[id]]) I.im(el,state,'l_darr');
		else I.im(el,state,'l_uarr');
	}
	
	// function is used to hide left menu with the specified id (used in draw_left_menu)
	
	T._hide = function(id)
	{
		var el = $('b'+id);
		var img = $('i'+id);
		var name = names[id];
		
		if(el.style.display!='none')
		{
			T.opac(el,0.3,false);
			
			setTimeout(function(){el.style.display='none';},350);
			//I.im(img,'h','l_darr');
			
			hidden[name] = name;
		}else
		{
			el.style.visibility = 'hidden';
			el.style.display='';
			
			T.opac(el,0.3,true);
			
			I.im(img,'h','l_uarr');
			
			hidden[name] = null;
		}
	}
	
	// this function adds link with icon [icon] (see menu_all.png and coords), href [href], with title [title] and name [name]
	
	var _i = 0; // the counter for add_link
	
	add_link = function(href,title,icon,name)
	{
		_i++;
		var style = "background: url('f/i/menu_all.png') -"+I.coords['m_'+icon][0]+"px -"+I.coords['m_'+icon][1]+"px";
		
		return '<div style="padding-top: 2px; padding-bottom: 2px;"><a href="'+href+'" title="'+title+'" style="text-decoration: none;"><img src="f/i/no.png" width=16 height=16 style="'+style+'" border=0>&nbsp;&nbsp;<span id=\'u'+_i+'\' style="text-decoration: underline;">'+name+'</span></a></div>';
	}
	
	//a function that is used in "add link" to underline links
	
	T._underl = function(id,underline)
	{
		var el=$('u'+id);
		
		if(underline) el.style.textDecoration='underline';
		else el.style.textDecoration='none';
	}
	
	// function for opacity
	
	T.opac = function(el,duration,direct)
	{
		if(!duration) var duration=0.3;
		if(direct==undefined) var direct = true; // true - show element, false - hide element
		var added = false; /* added style.width and style.height ? */
		
		if(el.runtimeStyle) //IE, filter works only with absolute positioned elements, or elements with specified width or height. Other elements are just _made_ to answer there conditions
		{
			if(el.style.position!='absolute' && !el.style.width && !el.style.height)
			{
				el.style.width=el.offsetWidth+'px';
				el.style.height=el.offsetHeight+'px';
				added = true;
			}
			
			el.runtimeStyle.filter='BlendTrans(Duration='+duration+')';
			
			if(direct) el.style.visibility = "hidden";
			else el.style.visibility = "visible";
			
			el.filters["BlendTrans"].Apply();
			
			if(!direct) el.style.visibility = "hidden";
			else el.style.visibility = "visible";
			
			el.filters["BlendTrans"].Play();
			
			if(added)
			{
				el.style.width='';
				el.style.height='';
			}
			return true;
		}
		
		if(el.style.opacity!=undefined) //Mozilla and opera >= 9
		{
			var bit=-1/(duration*40);
			
			if(!direct) bit = -bit;
			
			el.style.opacity=direct ? 0 : 1;
			el.style.visibility="visible";
			var op=function()
			{
				if((el.style.opacity>=1 && direct) || (el.style.opacity<=0 && !direct))
				{
					return;
				}
				el.style.opacity-=bit; //"+" works as if digit is a string
				
				setTimeout(op,25);
			}
			op();
			return true;
		}
		
		return false;
	}
}

window.LeftMenu = (window.L = new LeftMenuClass());var InterfaceClass = function(){
	
	var T = this;
	
	T.coords = { // 'name': {right, top, width, height}
	/** overall.88.png **/
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
			
			if(type==0)
			{
				a.style.backgroundPosition = '-0px -516px';
				h.style.backgroundPosition = '-37px -360px';
			}else if(type==2)
			{
				a.style.backgroundPosition = '-0px -538px';
				h.style.backgroundPosition = '-37px -390px';
			}else if(type==3)
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
			tmp += '<img id="btn_' + k + '" src="f/i/no.png" onmouseover="I.im(this,\'h\');" onmouseout="I.im(this,\'\');" onmousedown="I.im(this,\'d\');" onmouseup="I.im(this,\'h\'); ' + act[k] + ' " alt="' + lang[k] + '" title="' + lang[k] + '" style="background: url(\'f/i/overall.88.png\'); background-position: -' + coords[k][0] + 'px -' + coords[k][1] + 'px;' + (k.substr(k.length-9,9)=='_disabled' ? 'display: none;' : '') + '" width="' + coords[k][2] + '" height="' + coords[k][3] + '" />';
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
				if(g[0]['type']==1)
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
				}else if(g[0]['type']==0)
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

window.Interface = (window.I = new InterfaceClass());/* this file should be included last */

function $(id)
{
	return document.getElementById(id);
}

function $set(id, content)
{
	return $(id).innerHTML = content;
}

var DolphinClass = function(){
	var T = this;
	var req = false;
	
	T.abort = function(){req.abort();E.cancel_draw();I.show_loading(false);};
	
	/* something like JsHttpRequest.query() - AJAX data loader */
	/* it differs from JsHttpRequest.query() - it also shows "loading...", and does not cache anything by default */
	T.qr = function(addr, data, onreadyfunc, nocache, text)
	{
		var undef;
		
		if(typeof(nocache) == typeof(undef)) var nocache = true;
		
		I.show_loading(true, text);
		E.cancel_draw(); /* this is required for many reasons */
		
		var beg = (new Date()).getTime();
		
		var r = new JsHttpRequest();
		
		req = r;
		
		r.onerror = function(msg)
		{
			I.show_loading(false,text);
			
			if(r.aborted) return;
			
			if(msg.length > 100) msg = msg.substr(0, 100) + '...';
			
			if(r.status)
			{
				switch(r.status)
				{
				case 500:
					msg = 'Internal server error';
					break;
				case 503:
				case 502:
					msg = 'The server is temporarily busy';
					break;
				case 404:
					alert('AJAX request failed because of 404 error (Not Found). Please ensure, that Dolphin.php is installed properly.');
					return false;
				case 403:
					alert('AJAX request failed because of 403 error (Permission denied). Please ensure, that you have set correct rights to PHP files.');
					return false;
				}
			}
			
			if(confirm('AJAX subrequest failed.\nThe technical reason: ' + msg + '\n\nDo you want to send that request again?')) T.qr(addr, data, onreadyfunc, nocache);
		}
		
		r.onreadystatechange = function()
		{
			if(r.readyState==4)
			{
				var time = Math.round(((new Date()).getTime() - beg)*1000)/1000000;
				
				I.show_loading(false,text);
				
				if(r.responseText != '--error-login-required')
				{
					try{
						onreadyfunc(r.responseJS, r.aborted ? 'action aborted' : r.responseText);
					}catch(e){}
				}else
				{
					if(confirm('Session has expired, relogin required.\nDo you want to relogin now?'))
						T.qr('index.php', {login: prompt('login:'), pass: prompt('password:'), 'DIR': Engine.address}, function(res, err){
							T.qr(addr, data, onreadyfunc, nocache);
						});
				}
				
				var total = Math.round(((new Date()).getTime() - beg)*1000)/1000000;
				//I.dbg('http+php: '+time+' sec, http+php+js+html: '+total+' sec');
			}
		}
		
		r.caching = !nocache;
		
		r.open(null/*addr.substring(0,4) == 'http' ? 'GET' : 'POST'*/,addr,true);
		
		r.send(data);
	}
	
	T.init = function()
	{
		//setTimeout(function(){
		
		if($('load_screen')) document.body.removeChild($('load_screen'));
		
		//I.generate_panel();
		T.resize(true)
		
		if(window.interv)
		{
			clearInterval(window.interv);
			window.interv = null;
		}
		
		//}, 5000);
		
		//$('loading').style.visibility='hidden';
		//$('very_main').style.visibility='visible';
		
		//I.change_address();
		
		// init Drag'n'Drop Interface
		
		/*__DDI__.setPlugin('dragStateAsCursor');
	    __DDI__.setPlugin('draggedElementTip');
	    __DDI__.setPlugin('fixNoMouseSelect');
	    __DDI__.setPlugin('lockCursorAsDefault');
	    __DDI__.setPlugin('fixDragInMz');
	    __DDI__.setPlugin('resizeIT');
	    __DDI__.setPlugin('moveIT');*/
	}
	
	T.resize = function()
	{
		I.resize();
	}
	
	var _pingpong_failed = false;
	
	T.pingpong = function()
	{	
		T.qr('index.php?act=ping', 'ping', function(res,err)
		{
			/* prevent from multiple alerts */
			if(res!='pong' && !_pingpong_failed)
			{
				alert('PING-PONG request to server failed. Please check your internet connection.');
				_pingpong_failed = true;
			}else if(res=='pong')
			{
				_pingpong_failed = false;
			}
		}, true, 'server ping');
	}
	
	var _res = []; // the result of querying
	var _status = []; /* global status */
	var _menu = {}; // the global menu cache
	var _up = false;
	
	T.ggr = function(){ return _res; }
	T.ggm = function(){ return _menu; }
	T.ggs = function(){ return _status; }
	T.cgu = function(){ return _up!=false; }
	
	var _lasterr = false; /* for go2() */
	
	T.go2 = function(where,nohistory,page,savefilter)
	{
		if(!savefilter && (!nohistory || L._search_str == L._search_str_default)) L._search_str = ''; // clearing the search string
		
		//alert('D.go2('+where+', '+nohistory+', '+page+', '+savefilter+')');
		
		E.rf(where, {pagemin: page||1, pagemax: page?page+4:4, filt: L._search_str, sort: E.sort, order: E.order, perpage: E.perpage, fast: E.fast?1:0}, function(res,err)
		{
			if(res && res['res'] && !res['error'])
			{
				if(!nohistory) E.add_to_history(res['DIR']);
				
				_res = res['res']; // create a var with all the types of objects
				_up = res['up'];
				_menu = {0: 'fsearch', 1: 'common',2: res['info'] };
				
				E.address = res['DIR'];
				E.page = page ? Math.min(page,_res['pages_num']) : 1;
				
				R.df();
				
				
				L.draw(_menu);
				
				I.change_path(res['DIR'],res['dir'],res['type']);
				I.change_status(_status = [['Total items',_res['items_num']],['Generation time',res['stats']['seconds']+'sec']]);
				I.disable_buttons();
				
				
				var search_el = $('fsearch');
				if(search_el && search_el.focus) search_el.focus();
				
				//alert(res['DIR']);
				
				_lasterr = false;
				if(err) alert(err);
			}else if(!_lasterr) /* prevent from infitite asking */
			{
				_lasterr = true;
				alert('Could not change directory ' + res['reason']);
				if(err) alert(err);
				if(!res['stop']) T.go2(res['dir'],true);
			}
		});
	};
	
	T.cs = T.change_sort = function(sort)
	{
		E.sort = sort;
		E.F5();
	}
	
	T.co = T.change_order = function(order)
	{
		E.order = order;
		E.F5();
	}
	
	T.cf = T.change_fast = function()
	{
		E.fast = !E.fast;
		E.F5();
	}
	
	var _getting_list = false;
	
	T.cp = T.change_page = function(page)
	{
		var painted = false; // was filelist painted immediately (from cache)?
		
		var paint = function()
		{
			E.page = page;
			R.df();
			if(L._search_str==L._search_str_default) L.draw(_menu); // prevent search input from losing focus and entered words
			painted = true;
		}
		
		if(_res && _res['pages'] && _res['pages'][page]) paint();
		
		if(_getting_list) T.abort();
		_getting_list = true;
		
		E.rf(E.address, {pagemin: Math.max(1, page-2), pagemax: page+2, filt: L._search_str==L._search_str_default ? '' : L._search_str, sort: E.sort, order: E.order, perpage: E.perpage, fast: E.fast?1:0}, function(res,err)
		{
			_getting_list = false;
			
			if(res && _res['items_num'] != res['res']['items_num'])
			{
				_res = res['res'];
				paint();
			}else if(res && res['res'] && res['res']['pages'])
			{
				res = res['res']['pages'];
				for(var k in res) _res['pages'][k] = res[k]; // copy new pages to final cached result
				if(!painted) paint();
			}
		});
	};
	
	T.pu = T.perform_update = function()
	{
		if(!confirm('Check for newer version?')) return;
		
		D.qr('http://dolphin-php.org/'+'build-info/', {}, function(res,err)
		{
			if(!res) alert('Could not contact http://dolphin-php.org/.');
			else if(res == 88) alert('No new version available');
			else if(res < 88) alert('You have a newer version, than on a server :).');
			else if(confirm('New version ('+res+' build) is available.\nInstall it?'))
			{
				E.run_update();
			}
		}, true, 'contacting http://dolphin-php.org/');
	};
	
	T.ou = T.open_uploads = function()
	{
		I.window_open('f/swfupload/', 'uploads', 450, 350);
	}
	
	/*
	
	A function to show pages somewhere
	
		int pages    -- total number of pages
		int currpage -- current page
		current(i)   -- function to be called to add current page
		link(i,text) -- function to add link to page i. If text is not empty, display it instead of "i".
	
	returns void;
	
	*/
	
	T.show_pages = function(pages, currpage, current, link)
	{
		if(!currpage) currpage = E.page;
		
		if(pages == 0)
		{
			current(1);
		}else if(pages < 9)
		{
			for(var l = 1; l <= pages; l++)
			{
				if(l == currpage) current(l);
				else              link(l);
			}
		}else
		{
			if(E.page < 4)
			{
				for(var l = 1; l <= E.page + 2; l++)
				{
					if(l == currpage) current(l);
					else            link(l);
				}
				
				link(currpage + 4, '...');
				
				link(pages-2);
				link(pages-1);
				link(pages);
			}else if( (pages - currpage) < 4)
			{
				link(1);
				link(2);
				link(3);
				link(currpage - 4, '...');
				
				for(var l = currpage - 2; l <= pages; l++)
				{
					if(l == currpage) current(l);
					else            link(l);
				}
			}else
			{
				link(1);
				link(currpage - 4, '...');
				
				for(var l = currpage - 2; l <= currpage + 2; l++)
				{
					if(l == currpage) current(l);
					else            link(l);
				}
				
				link(currpage + 4, '...');
				link(pages);
			}
		}
	}
};

window.Dolphin = (window.D = new DolphinClass());/**
 * JsHttpRequest: JavaScript "AJAX" data loader (script-xml support only!)
 *
 * @license LGPL
 * @author Dmitry Koterov, http://en.dklab.ru/lib/JsHttpRequest/
 * @version 5.x $Id$
 */
// {{{
function JsHttpRequest() {
    // Standard properties.
    var t = this;
    t.onreadystatechange = null;
    t.readyState         = 0;
    t.responseText       = null;
    t.responseXML        = null;
    t.status             = 200;
    t.statusText         = "OK";
    // JavaScript response array/hash
    t.responseJS         = null;
    
    /* youROCK */
    t.aborted = false;
    /* / youROCK */

    // Additional properties.
    t.caching            = false;        // need to use caching?
    t.loader             = null;         // loader to use ('form', 'script', 'xml'; null - autodetect)
    t.session_name       = "PHPSESSID";  // set to  cookie or GET parameter name

    // Internals.
    t._ldObj              = null;  // used loader object
    t._reqHeaders        = [];    // collected request headers
    t._openArgs          = null;  // parameters from open()
    t._errors = {
        inv_form_el:        'Invalid FORM element detected: name=%, tag=%',
        must_be_single_el:  'If used, <form> must be a single HTML element in the list.',
        js_invalid:         'JavaScript code generated by backend is invalid!\n%',
        url_too_long:       'Cannot use so long query with GET request (URL is larger than % bytes)',
        unk_loader:         'Unknown loader: %',
        no_loaders:         'No loaders registered at all, please check JsHttpRequest.LOADERS array',
        no_loader_matched:  'Cannot find a loader which may process the request. Notices are:\n%'
    }
    
    /**
     * Aborts the request. Behaviour of this function for onreadystatechange() 
     * is identical to IE (most universal and common case). E.g., readyState -> 4
     * on abort() after send().
     */
    t.abort = function() { with (this) {
         /* youROCK */
        t.aborted = true;
        /* / youROCK */
        
        if (_ldObj && _ldObj.abort) _ldObj.abort();
        _cleanup();
        if (readyState == 0) {
            // start->abort: no change of readyState (IE behaviour)
            return;
        }
        if (readyState == 1 && !_ldObj) {
            // open->abort: no onreadystatechange call, but change readyState to 0 (IE).
            // send->abort: change state to 4 (_ldObj is not null when send() is called)
            readyState = 0;
            return;
        }
        _changeReadyState(4, true); // 4 in IE & FF on abort() call; Opera does not change to 4.
    }}
    
    /**
     * Prepares the object for data loading.
     * You may also pass URLs like "GET url" or "script.GET url".
     */
    t.open = function(method, url, asyncFlag, username, password) { with (this) {
        // Extract methor and loader from the URL (if present).
        if (url.match(/^((\w+)\.)?(GET|POST)\s+(.*)/i)) {
            this.loader = RegExp.$2? RegExp.$2 : null;
            method = RegExp.$3;
            url = RegExp.$4; 
        }
        // Append  to original URL. Use try...catch for security problems.
        try {
            if (
                document.location.search.match(new RegExp('[&?]' + session_name + '=([^&?]*)'))
                || document.cookie.match(new RegExp('(?:;|^)\\s*' + session_name + '=([^;]*)'))
            ) {
                url += (url.indexOf('?') >= 0? '&' : '?') + session_name + "=" + this.escape(RegExp.$1);
            }
        } catch (e) {}
        // Store open arguments to hash.
        _openArgs = {
            method:     (method || '').toUpperCase(),
            url:        url,
            asyncFlag:  asyncFlag,
            username:   username != null? username : '',
            password:   password != null? password : ''
        }
        _ldObj = null;
        _changeReadyState(1, true); // compatibility with XMLHttpRequest
        return true;
    }}
    
    /**
     * Sends a request to a server.
     */
    t.send = function(content) {
        if (!this.readyState) {
            // send without open or after abort: no action (IE behaviour).
            return;
        }
        this._changeReadyState(1, true); // compatibility with XMLHttpRequest
        this._ldObj = null;
        
        // Prepare to build QUERY_STRING from query hash.
        var queryText = [];
        var queryElem = [];
        if (!this._hash2query(content, null, queryText, queryElem)) return;
    
        // Solve the query hashcode & return on cache hit.
        var hash = null;
        if (this.caching && !queryElem.length) {
            hash = this._openArgs.username + ':' + this._openArgs.password + '@' + this._openArgs.url + '|' + queryText + "#" + this._openArgs.method;
            var cache = JsHttpRequest.CACHE[hash];
            if (cache) {
                this._dataReady(cache[0], cache[1]);
                return false;
            }
        }
    
        // Try all the loaders.
        var loader = (this.loader || '').toLowerCase();
        if (loader && !JsHttpRequest.LOADERS[loader]) return this._error('unk_loader', loader);
        var errors = [];
        var lds = JsHttpRequest.LOADERS;
        for (var tryLoader in lds) {
            var ldr = lds[tryLoader].loader;
            if (!ldr) continue; // exclude possibly derived prototype properties from "for .. in".
            if (loader && tryLoader != loader) continue;
            // Create sending context.
            var ldObj = new ldr(this);
            JsHttpRequest.extend(ldObj, this._openArgs);
            JsHttpRequest.extend(ldObj, {
                queryText:  queryText.join('&'),
                queryElem:  queryElem,
                id:         (new Date().getTime()) + "" + JsHttpRequest.COUNT++,
                hash:       hash,
                span:       null
            });
            var error = ldObj.load();
            if (!error) {
                // Save loading script.
                this._ldObj = ldObj;
                JsHttpRequest.PENDING[ldObj.id] = this;
                return true;
            }
            if (!loader) {
                errors[errors.length] = '- ' + tryLoader.toUpperCase() + ': ' + this._l(error);
            } else {
                return this._error(error);
            }
        }
    
        // If no loader matched, generate error message.
        return tryLoader? this._error('no_loader_matched', errors.join('\n')) : this._error('no_loaders');
    }
    
    /**
     * Returns all response headers (if supported).
     */
    t.getAllResponseHeaders = function() { with (this) {
        return _ldObj && _ldObj.getAllResponseHeaders? _ldObj.getAllResponseHeaders() : [];
    }}

    /**
     * Returns one response header (if supported).
     */
    t.getResponseHeader = function(label) { with (this) {
        return _ldObj && _ldObj.getResponseHeader? _ldObj.getResponseHeader(label) : null;
    }}

    /**
     * Adds a request header to a future query.
     */
    t.setRequestHeader = function(label, value) { with (this) {
        _reqHeaders[_reqHeaders.length] = [label, value];
    }}
    
    //
    // Internal functions.
    //
    
    /**
     * Do all the work when a data is ready.
     */
    t._dataReady = function(text, js) { with (this) {
        if (caching && _ldObj) JsHttpRequest.CACHE[_ldObj.hash] = [text, js];
        responseText = responseXML = text;
        responseJS = js;
        if (js !== null) {
            status = 200;
            statusText = "OK";
        } else {
            status = 500;
            statusText = "Internal Server Error";
        }
        _changeReadyState(2);
        _changeReadyState(3);
        _changeReadyState(4);
        _cleanup();
    }}
    
    /**
     * Analog of sprintf(), but translates the first parameter by _errors.
     */
    t._l = function(args) {
        var i = 0, p = 0, msg = this._errors[args[0]];
        // Cannot use replace() with a callback, because it is incompatible with IE5.
        while ((p = msg.indexOf('%', p)) >= 0) {
            var a = args[++i] + "";
            msg = msg.substring(0, p) + a + msg.substring(p + 1, msg.length);
            p += 1 + a.length;
        }
        return msg;
    }

    /** 
     * Called on error.
     */
    t._error = function(msg) {
        msg = this._l(typeof(msg) == 'string'? arguments : msg)
        msg = "JsHttpRequest: " + msg;
        
        /* <youROCK> */
		/* add support of very useful "onerror" property */

		if(t.onerror)
		{
			return t.onerror(msg);
		}

		/* </youROCK> */
        
        if (!window.Error) {
            // Very old browser...
            throw msg;
        } else if ((new Error(1, 'test')).description == "test") {
            // We MUST (!!!) pass 2 parameters to the Error() constructor for IE5.
            throw new Error(1, msg);
        } else {
            // Mozilla does not support two-parameter call style.
            throw new Error(msg);
        }
    }
    
    /**
     * Convert hash to QUERY_STRING.
     * If next value is scalar or hash, push it to queryText.
     * If next value is form element, push [name, element] to queryElem.
     */
    t._hash2query = function(content, prefix, queryText, queryElem) {
        if (prefix == null) prefix = "";
        if((''+typeof(content)).toLowerCase() == 'object') {
            var formAdded = false;
            if (content && content.parentNode && content.parentNode.appendChild && content.tagName && content.tagName.toUpperCase() == 'FORM') {
                content = { form: content };
            }
            for (var k in content) {
                var v = content[k];
                if (v instanceof Function) continue;
                var curPrefix = prefix? prefix + '[' + this.escape(k) + ']' : this.escape(k);
                var isFormElement = v && v.parentNode && v.parentNode.appendChild && v.tagName;
                if (isFormElement) {
                    var tn = v.tagName.toUpperCase();
                    if (tn == 'FORM') {
                        // FORM itself is passed.
                        formAdded = true;
                    } else if (tn == 'INPUT' || tn == 'TEXTAREA' || tn == 'SELECT') {
                        // This is a single form elemenent.
                    } else {
                        return this._error('inv_form_el', (v.name||''), v.tagName);
                    }
                    queryElem[queryElem.length] = { name: curPrefix, e: v };
                } else if (v instanceof Object) {
                    this._hash2query(v, curPrefix, queryText, queryElem);
                } else {
                    // We MUST skip  values, because there is no method
                    // to pass 's via GET or POST request in PHP.
                    if (v === null) continue;
                    // Convert JS boolean true and false to corresponding PHP values.
                    if (v === true) v = 1; 
                    if (v === false) v = '';
                    queryText[queryText.length] = curPrefix + "=" + this.escape('' + v);
                }
                if (formAdded && queryElem.length > 1) {
                    return this._error('must_be_single_el');
                }
            }
        } else {
            queryText[queryText.length] = content;
        }
        return true;
    }
    
    /**
     * Remove last used script element (clean memory).
     */
    t._cleanup = function() {
        var ldObj = this._ldObj;
        if (!ldObj) return;
        // Mark this loading as aborted.
        JsHttpRequest.PENDING[ldObj.id] = false;
        var span = ldObj.span;
        if (!span) return;
        // Do NOT use iframe.contentWindow.back() - it is incompatible with Opera 9!
        ldObj.span = null;
        var closure = function() {
            span.parentNode.removeChild(span);
        }
        // IE5 crashes on setTimeout(function() {...}, ...) construction! Use tmp variable.
        JsHttpRequest.setTimeout(closure, 50);
    }
    
    /**
     * Change current readyState and call trigger method.
     */
    t._changeReadyState = function(s, reset) { with (this) {
        if (reset) {
            status = statusText = responseJS = null;
            responseText = '';
        }
        readyState = s;
        if (onreadystatechange) onreadystatechange();
    }}
    
    /**
     * JS escape() does not quote '+'.
     */
    t.escape = function(s) {
        return escape(s).replace(new RegExp('\\+','g'), '%2B');
    }
}


// Global library variables.
JsHttpRequest.COUNT = 0;              // unique ID; used while loading IDs generation
JsHttpRequest.MAX_URL_LEN = 2000;     // maximum URL length
JsHttpRequest.CACHE = {};             // cached data
JsHttpRequest.PENDING = {};           // pending loadings
JsHttpRequest.LOADERS = {};           // list of supported data loaders (filled at the bottom of the file)
JsHttpRequest._dummy = function() {}; // avoid memory leaks


/**
 * These functions are dirty hacks for IE 5.0 which does not increment a
 * reference counter for an object passed via setTimeout(). So, if this 
 * object (closure function) is out of scope at the moment of timeout 
 * applying, IE 5.0 crashes. 
 */

/**
 * Timeout wrappers storage. Used to avoid zeroing of referece counts in IE 5.0.
 * Please note that you MUST write "window.setTimeout", not "setTimeout", else
 * IE 5.0 crashes again. Strange, very strange...
 */
JsHttpRequest.TIMEOUTS = { s: window.setTimeout, c: window.clearTimeout };

/**
 * Wrapper for IE5 buggy setTimeout.
 * Use this function instead of a usual setTimeout().
 */
JsHttpRequest.setTimeout = function(func, dt) {
    // Always save inside the window object before a call (for FF)!
    window.JsHttpRequest_tmp = JsHttpRequest.TIMEOUTS.s; 
    if (typeof(func) == "string") {
        id = window.JsHttpRequest_tmp(func, dt);
    } else {
        var id = null;
        var mediator = function() {
            func();
            delete JsHttpRequest.TIMEOUTS[id]; // remove circular reference
        }
        id = window.JsHttpRequest_tmp(mediator, dt);
        // Store a reference to the mediator function to the global array
        // (reference count >= 1); use timeout ID as an array key;
        JsHttpRequest.TIMEOUTS[id] = mediator;
    }
    window.JsHttpRequest_tmp = null; // no delete() in IE5 for window
    return id;
}

/**
 * Complimental wrapper for clearTimeout. 
 * Use this function instead of usual clearTimeout().
 */
JsHttpRequest.clearTimeout = function(id) {
    window.JsHttpRequest_tmp = JsHttpRequest.TIMEOUTS.c;
    delete JsHttpRequest.TIMEOUTS[id]; // remove circular reference
    var r = window.JsHttpRequest_tmp(id);
    window.JsHttpRequest_tmp = null; // no delete() in IE5 for window
    return r;
}


/**
 * Global static function.
 * Simple interface for most popular use-cases.
 * You may also pass URLs like "GET url" or "script.GET url".
 */
JsHttpRequest.query = function(url, content, onready, nocache) {
    var req = new this();
    req.caching = !nocache;
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            onready(req.responseJS, req.responseText);
        }
    }
    req.open(null, url, true);
    req.send(content);
}


/**
 * Global static function.
 * Called by server backend script on data load.
 */
JsHttpRequest.dataReady = function(d) {
    var th = this.PENDING[d.id];
    delete this.PENDING[d.id];
    if (th) {
        th._dataReady(d.text, d.js);
    } else if (th !== false) {
        throw "dataReady(): unknown pending id: " + d.id;
    }
}


// Adds all the properties of src to dest.
JsHttpRequest.extend = function(dest, src) {
    for (var k in src) dest[k] = src[k];
}

// {{{ xml
// Loader: XMLHttpRequest or ActiveX.
// [+] GET and POST methods are supported.
// [+] Most native and memory-cheap method.
// [+] Backend data can be browser-cached.
// [-] Cannot work in IE without ActiveX. 
// [-] No support for loading from different domains.
// [-] No uploading support.
//
JsHttpRequest.LOADERS.xml = { loader: function(req) {
    JsHttpRequest.extend(req._errors, {
        xml_no:          'Cannot use XMLHttpRequest or ActiveX loader: not supported',
        xml_no_diffdom:  'Cannot use XMLHttpRequest to load data from different domain %',
        xml_no_headers:  'Cannot use XMLHttpRequest loader or ActiveX loader, POST method: headers setting is not supported, needed to work with encodings correctly',
        xml_no_form_upl: 'Cannot use XMLHttpRequest loader: direct form elements using and uploading are not implemented'
    });
    
    this.load = function() {
        if (this.queryElem.length) return ['xml_no_form_upl'];
        
        // XMLHttpRequest (and MS ActiveX'es) cannot work with different domains.
        if (this.url.match(new RegExp('^([a-z]+://[^\\/]+)(.*)', 'i'))) {
        	// We MUST also check if protocols matched: cannot send from HTTP 
        	// to HTTPS and vice versa.
            if (RegExp.$1.toLowerCase() != document.location.protocol + '//' + document.location.hostname.toLowerCase()) {
                return ['xml_no_diffdom', RegExp.$1];
            }
        }
        
        // Try to obtain a loader.
        var xr = null;
        if (window.XMLHttpRequest) {
            try { xr = new XMLHttpRequest() } catch(e) {}
        } else if (window.ActiveXObject) {
            try { xr = new ActiveXObject("Microsoft.XMLHTTP") } catch(e) {}
            if (!xr) try { xr = new ActiveXObject("Msxml2.XMLHTTP") } catch (e) {}
        }
        if (!xr) return ['xml_no'];
        
        // Loading method detection. We cannot POST if we cannot set "octet-stream" 
        // header, because we need to process the encoded data in the backend manually.
        var canSetHeaders = window.ActiveXObject || xr.setRequestHeader;
        if (!this.method) this.method = canSetHeaders && this.queryText.length? 'POST' : 'GET';
        
        // Build & validate the full URL.
        if (this.method == 'GET') {
            if (this.queryText) this.url += (this.url.indexOf('?') >= 0? '&' : '?') + this.queryText;
            this.queryText = '';
            if (this.url.length > JsHttpRequest.MAX_URL_LEN) return ['url_too_long', JsHttpRequest.MAX_URL_LEN];
        } else if (this.method == 'POST' && !canSetHeaders) {
            return ['xml_no_headers'];
        }
        
        // Add ID to the url if we need to disable the cache.
        this.url += (this.url.indexOf('?') >= 0? '&' : '?') + 'JsHttpRequest=' + (req.caching? '0' : this.id) + '-xml';        
        
        // Assign the result handler.
        var id = this.id;
        xr.onreadystatechange = function() { 
            if (xr.readyState != 4) return;
            // Avoid memory leak by removing the closure.
            xr.onreadystatechange = JsHttpRequest._dummy;
            req.status = null;
            try { 
                // In case of abort() call, xr.status is unavailable and generates exception.
                // But xr.readyState equals to 4 in this case. Stupid behaviour. :-(
                req.status = xr.status;
                req.responseText = xr.responseText;
            } catch (e) {}
            if (!req.status) return;
            try {
                // Prepare generator function & catch syntax errors on this stage.
                eval('JsHttpRequest._tmp = function(id) { var d = ' + req.responseText + '; d.id = id; JsHttpRequest.dataReady(d); }');
            } catch (e) {
                // Note that FF 2.0 does not throw any error from onreadystatechange handler.
                return req._error('js_invalid', req.responseText)
            }
            // Call associated dataReady() outside the try-catch block 
            // to pass exceptions in onreadystatechange in usual manner.
            JsHttpRequest._tmp(id);
            JsHttpRequest._tmp = null;
        };

        // Open & send the request.
        xr.open(this.method, this.url, true, this.username, this.password);
        if (canSetHeaders) {
            // Pass pending headers.
            for (var i = 0; i < req._reqHeaders.length; i++) {
                xr.setRequestHeader(req._reqHeaders[i][0], req._reqHeaders[i][1]);
            }
            // Set non-default Content-type. We cannot use 
            // "application/x-www-form-urlencoded" here, because 
            // in PHP variable HTTP_RAW_POST_DATA is accessible only when 
            // enctype is not default (e.g., "application/octet-stream" 
            // is a good start). We parse POST data manually in backend 
            // library code. Note that Safari sets by default "x-www-form-urlencoded"
            // header, but FF sets "text/xml" by default.
            xr.setRequestHeader('Content-Type', 'application/octet-stream');
        }
        xr.send(this.queryText);
        
        // No SPAN is used for this loader.
        this.span = null;
        this.xr = xr; // save for later usage on abort()
        
        // Success.
        return null;
    }
    
    // Override req.getAllResponseHeaders method.
    this.getAllResponseHeaders = function() {
        return this.xr.getAllResponseHeaders();
    }
    
    // Override req.getResponseHeader method.
    this.getResponseHeader = function(label) {
        return this.xr.getResponseHeader(label);
    }

    this.abort = function() {
        this.xr.abort();
        this.xr = null;
    }
}}
// }}}

/**
 * Each loader has the following properties which must be initialized:
 * - method
 * - url
 * - asyncFlag (ignored)
 * - username
 * - password
 * - queryText (string)
 * - queryElem (array)
 * - id
 * - hash
 * - span
 */ 
 
// }}}

// {{{ script
// Loader: SCRIPT tag.
// [+] Most cross-browser. 
// [+] Supports loading from different domains.
// [-] Only GET method is supported.
// [-] No uploading support.
// [-] Backend data cannot be browser-cached.
//
JsHttpRequest.LOADERS.script = { loader: function(req) {
    JsHttpRequest.extend(req._errors, {
        script_only_get:   'Cannot use SCRIPT loader: it supports only GET method',
        script_no_form:    'Cannot use SCRIPT loader: direct form elements using and uploading are not implemented'
    })
    
    this.load = function() {
        // Move GET parameters to the URL itself.
        if (this.queryText) this.url += (this.url.indexOf('?') >= 0? '&' : '?') + this.queryText;
        this.url += (this.url.indexOf('?') >= 0? '&' : '?') + 'JsHttpRequest=' + this.id + '-' + 'script';        
        this.queryText = '';
        
        if (!this.method) this.method = 'GET';
        if (this.method !== 'GET') return ['script_only_get'];
        if (this.queryElem.length) return ['script_no_form'];
        if (this.url.length > JsHttpRequest.MAX_URL_LEN) return ['url_too_long', JsHttpRequest.MAX_URL_LEN];

        var th = this, d = document, s = null, b = d.body;
        if (!window.opera) {
            // Safari, IE, FF, Opera 7.20.
            this.span = s = d.createElement('SCRIPT');
            var closure = function() {
                s.language = 'JavaScript';
                if (s.setAttribute) s.setAttribute('src', th.url); else s.src = th.url;
                b.insertBefore(s, b.lastChild);
            }
        } else {
            // Oh shit! Damned stupid Opera 7.23 does not allow to create SCRIPT 
            // element over createElement (in HEAD or BODY section or in nested SPAN - 
            // no matter): it is created deadly, and does not response the href assignment.
            // So - always create SPAN.
            this.span = s = d.createElement('SPAN');
            s.style.display = 'none';
            b.insertBefore(s, b.lastChild);
            s.innerHTML = 'Workaround for IE.<s'+'cript></' + 'script>';
            var closure = function() {
                s = s.getElementsByTagName('SCRIPT')[0]; // get with timeout!
                s.language = 'JavaScript';
                if (s.setAttribute) s.setAttribute('src', th.url); else s.src = th.url;
            }
        }
        JsHttpRequest.setTimeout(closure, 10);
        
        // Success.
        return null;
    }
}}
// }}}