function $(id) { return document.getElementById(id); }
var $ie = document.all && !window.opera;

var Tab = new (function()
{
	var T = this;
	
	function get_off(id)
	{
		if(id.substring(0,2) == 'tt') id = id.substring(1);
		
		switch(id)
		{
			case 't_files':
				if($('work_area').style.display != 'none')
				{
					$('filter').value = '';
					$('filter').blur();
					window.__clear_all = true;
				}
				
				$('work_area').style.display = '';
				$('mail').style.display = 'none';
				$('tags').style.display = '';
				$('info').style.display = '';
				window.location.hash = '#';
				
				Fi.load();
				return 0;
			case 't_mail':
				$('work_area').style.display = 'none';
				$('mail').style.display = '';
				$('tags').style.display = 'none';
				$('info').style.display = 'none';
				window.location.hash = '#mail';
				
				Ma.load();
				return 95;
			case 't_downloads': return 190;
			case 't_contacts':  return 285;
		}
	};
	
	T.get_off = get_off;
	
	T.mover = function(obj)
	{
		if(obj.id.substring(0,2) == 'tt') $(obj.id.substring(1)).className = 'h';
		else                              obj.className = 'h';
	};
	
	T.mout = function(obj)
	{
		if(obj.id.substring(0,2) == 'tt') $(obj.id.substring(1)).className = '';
		else                              obj.className = '';
	};
	
	T.click = function(obj)
	{
		obj.parentNode.style.backgroundPosition = '0px '+get_off(obj.id)+'px';
	}
})();

var Fi = new (function()
{
	var T = this;
	
	var info_timeout = false;
	
	var show_info = function(id)
	{
		if(info_timeout) clearTimeout(info_timeout);
		
		setTimeout(function(){
			
			JsHttpRequest.query('/ajax/info/',
			
			{id: id},
			
			function(res,err)
			{
				var el = $('info_invis'), inf = $('info_info'), ifw = $('info_wrap'), i = $('info');
				
				el.innerHTML = '<div class="info_content">\
				'+(res.info.thumbnailable ? '<div align="center" style="width: 180px; background: url(/pub/i/loading.gif) no-repeat; background-position: center center; height: '+res.info.thumb_height+'px; margin-bottom: 5px; padding: 0px; overflow: hidden;" id="thumbnail_div">&nbsp;</div>' : '')+'\
				'+(res.shared_with.length ? '<div><span class="header">Разделено с:</span> '+res.shared_with.join(', ')+'</div>' : '')+'\
				'+(res.info.comment ? '<div><span class="header">Комментарий:</span><br>'+res.info.comment+'</div>' : '')+'\
				'+(res.info.tags.length ? '<div><span class="header">Тэги:</span> '+res.info.tags.join(', ')+'</div>' : '')+'\
				'+(res.info.img_dimensions ? '<div><span class="header">Размеры:</span> '+res.info.img_dimensions+'</div>' : '')+'\
				\
				\
				\
				'+(res.info.playable ? '<div align="center"><br><a href="#" onclick="toggle_play(\''+res.info.eurl+'\', this.firstChild); return false;"><img src="/pub/i/no.png" style="background-image: url(/pub/mix/swfplayer/player.png);" width="16" height="16" border="0" /></a></div><div align="center" style="overflow-x: hidden; width: 180px;"><b>'+res.info.hname+'</b></div>' : '')+'\
				</div>';
				
				var h = el.offsetHeight;
				
				inf.style.height = h + 'px';
				ifw.style.height = (35 + parseInt(h)) + 'px';
				i.style.height = (86 + parseInt(h)) + 'px';
				inf.innerHTML = el.innerHTML;
				el.innerHTML = '';
				
				if(res.info.thumbnailable)
				{
					$('thumbnail_div').innerHTML = '<img src="/convert/'+res.info.ename+'?thumb=true" onload="parentNode.style.background=\'\';" />';
					
					//$('thumbnail_div').style.backgroundImage = 'url(/convert/'+res.info.ename+'?thumb=true)';
				}
				
				$('tags_tags').style.height = If.tags_tagsh - h + 'px';
				$('tags_wrap').style.height = If.tags_wraph - h + 'px';
				$('tags').style.height      = If.tagsh      - h + 'px';
			},
			
			true)
			
		}, 50);
	}
	
	var _last = false;
	
	T.sel = function(obj)
	{
		if(_last && _last != obj)
		{
			_last.fselected = false;
			_last.style.backgroundColor = '';
			_last.style.border = '';
		}
		
		if(!obj.fselected)
		{
			obj.fselected = true;
			obj.style.backgroundColor = '#ffe47a';
			//obj.style.border = '#917400 1px dotted';
			
			_last = obj;
			
			show_info(obj.id.substring(4));
		}else
		{
			obj.fselected = false;
			obj.style.backgroundColor = '';
			//obj.style.border = '';
		}
		
		T.over(obj);
	}
	
	T.over = function(obj)
	{
		if(!obj.fselected) obj.style.backgroundColor = '#fff7d6';
	}
	
	T.out = function(obj)
	{
		if(!obj.fselected) obj.style.backgroundColor = 'white';
	}
	
	var sfield = 'date'; // sort field
	var sorder = 'DESC'; // sort order
	
	/* get sort [field, order]
	   
	   you must change sort order only via T.chsort() or T.load()
	*/
	
	T.gsort = function()
	{
		return [sfield, sorder];
	}
	
	T.chsort = function(obj)
	{
		var field = obj.id.substring(5); /* cut "sort_" */
		var asc = 0;
		if(obj.className != 'sort_u') asc = 1; /* else asc = 1; */
		
		var all = ['name','date','size','oid'];
		for(var k in all)
		{
			var i = 'sort_'+all[k];
			if($(i).className != 'sort__') $(i).className = 'sort__';
		}
		
		obj.className = 'sort_'+(asc?'u':'d');
		T.reload(field, asc?'ASC':'DESC');
		return false;
	}
	
	var get_sfile = function()
	{
		if(!_last) return null;
		
		var id = _last.id.substring(4);
		var t = T.files[id];
		if(!t) return null;
		
		return t;
	}
	
	T.get_sfile = get_sfile;
	
	T.rename = function()
	{
		var t = get_sfile();
		if(!t) return;
		
		var newname = prompt('Введите новое имя файла: ',t['name']);
		if(!newname || newname.charAt(0) == '.')
		{
			if(newname) alert('Имя файла не должно начинаться с точки [.]');
			return;
		}
		
		JsHttpRequest.query('/ajax/rename/',
			{
				id: t['id'],
				name: newname
			},
			function(res,err)
			{
				if(!err) T.reload(null,null, function(){ var el = $('file'+t['id']); if(el){ el.onclick(); } });
				else alert(err);
			},
		true);
	};
	
	T.remove = function()
	{
		var t = get_sfile();
		if(!t) return;
		
		if(!confirm('Действительно удалить файл?\nЕсли он разделен с другими людьми, они потеряют доступ к нему.')) return;
		
		JsHttpRequest.query('/ajax/delete/', { id: t['id'] },
			function(res,err)
			{
				if(!err) T.reload();
				else alert(err);
			},
		true);
	};
	
	T.comment = function()
	{
		var t = get_sfile();
		if(!t) return;
		
		var comment = prompt('Введите комментарий:', t['comment']);
		if(!comment) return;
		
		JsHttpRequest.query('/ajax/comment/', { id: t['id'], comment: comment },
			function(res,err)
			{
				if(!err)
				{
					var f = $('file'+id);
					f.onclick();
					f.onclick();
				}else alert(err);
			},
		true);
	};
	
	T.duplicate = function()
	{
		var t = get_sfile();
		if(!t) return;
		
		JsHttpRequest.query('/ajax/duplicate/', { id: t['id'] },
			function(res,err)
			{
				if(!err) T.reload();
				else alert(err);
			},
		true);
	};
	
	T.add_tag = function()
	{
		var name = prompt('Введите желаемое название тэга:', '');
		if(!name) return;
		
		JsHttpRequest.query('/ajax/add-tag/', { name: name },
			function(res,err)
			{
				if(!err) T.refresh_tags();
			},
		true)
	};
	
	T.delete_tag = function(id)
	{
		if(!confirm('Вы уверены, что хотите удалить этот тэг?'));
		
		JsHttpRequest.query('/ajax/delete-tag/', { id: id },
			function(res,err)
			{
				if(!err) T.refresh_tags();
			},
		true)
	};
	
	T.refresh_tags = function()
	{
		JsHttpRequest.query('/ajax/get-tags/', { name: name },
			function(res,err)
			{
				$('tags_tags').innerHTML = res.out;
				window.__tags_list = res.t;
			},
		true)
	}
	
	/*
	
	Load and display filelist
	
	Big thanks to Systemnik (http://systemnik.net.ru) for first implementation of loading-on-scroll
	
	*/
	
	T.reload = function(a,b,c)
	{
		window.__clear_all = true;
		T.load(a,b,c);
	}
	
	T.files = {};
	
	var fpositions = {}; // positions of elements ( position: id )
	
	var _last_filter = '';
	
	T.load = function(sort, order, onload_func)
	{
		if(!sort) sort = ''+sfield;
		if(!order) order = ''+sorder;
		
		var filt = $('filter');
		var filter = filt.className == 'inactive' ? '' : filt.value;
		
		var $files = $('files');
		
		var clear_all = false;
		
		if(window.__clear_all)
		{
			clear_all = true;
			window.__clear_all = null;
		}
		
		sfield = ''+sort;
		sorder = ''+order;
		_last_filter = ''+filter;
		
		var el = $('files');
		
		var height = 27; // height of one row
		
		var start = Math.max( Math.floor(el.scrollTop / height) - 20, 0);
		
		var num = Math.floor( parseInt(el.style.height) / height) + 40;
		
		JsHttpRequest.query(
			'/ajax/list/',
			
			{
			  start:  start,
			  num:    num,
			  sort:   sort,
			  order:  order,
			  filter: filter
			},
			
			function(res,err)
			{
				var tmp = [];
				
				if(!res.files || err)
				{
					$files.innerHTML = err || 'Извините, произошла ошибка на сервере';
					return;
				}
				
				var l = res.files.length, t, nm, snm, id, el, ftop, tmp, tags;
				
				T.files = {};
				
				var namewidth = parseInt($('work_area').style.width) - 250 - 30 /*scrollbar*/;
				
				$('files_scroller').style.height = (res.total * height) + 'px';
				
				for(var k in fpositions)
				{
					if(k < start*height || k > (start + num)*height || clear_all)
					{
						$files.removeChild($(fpositions[k]));
						delete fpositions[k];
					}
				}
				
				for(var i = 0; i < l; i++)
				{
					t = res.files[i];
					T.files[t['id']] = t;
					
					nm = res.users[t['oid']];
					snm = nm.split(/\s+/g);
					if(snm.length == 1) snm = snm[0];
					else snm = snm[1];
					
					id = 'file'+t['id'];
					
					ftop = ((i+start)*height);
					
					if( ! (ftop in fpositions) )
					{
						fpositions[ftop] = id;
						
						el = document.createElement('DIV');
						el.id = id;
						el.style.top = ftop+'px';
						el.className = 'file';
						el.title = 'Нажмите, чтобы выделить файл. Двойное нажатие откроет файл';
						
						el.onclick =
							  (function(el)  { return function(){ Fi.sel(el); return false; } })(el);
						el.ondblclick = t.convertable
							? (function(n)   { return function(){ window.open('/convert/'+n); return false;} })(t.ename)
							: (function(a,b) { return function(){ window.open(a+'/'+b); return false;}; })(res.udir, t.ename);
						el.onmouseover =
							  (function(el)  { return function(){ Fi.over(el); return false; } })(el);
						el.onmouseout =
							  (function(el)  { return function(){ Fi.out(el); return false; } })(el);
						
						if(t['tags'])
						{
							tmp = t['tags'].split(/\,/g);
							for(var k in tmp) tmp[k] = '<a href="#" onclick="var f = $(\'filter\'); f.focus(); f.value = \'tag:'+tmp[k]+'\'; Fi.reload(); return false;">'+window.__tags_list[tmp[k]]+'</a>';
							tags = tmp.join(', ');
						}else
						{
							tags = '';
						}
						
						el.innerHTML =
							'<table width="100%" height="'+height+'">\
								<tr>\
									<td width="40" align="center">\
										<img src="/pub/i/no.png" width="20" height="21" style="background: url(/pub/i/f/'+t['icon']+'.png);" class="ficon" />\
									</td>\
									\
									<td>\
										<div class="overf fname" style="width: '+namewidth+'px;">\
											'+t['hname']+'\
											<span>'+tags+'</span>\
										</div>\
									</td>\
									\
									<td width="70" align="right">\
										<div class="overf" style="width: 55px;">\
											'+t['hdate']+'\
										</div>\
									</td>\
									\
									<td width="70" align="right">\
										<div class="overf" style="width: 55px;">\
											'+t['hsize']+'\
										</div>\
									</td>\
									\
									<td width="70">\
										<div class="overf" style="width: 61px;" title="'+nm+'">\
											&nbsp;<u>'+snm+'</u>\
										</div>\
									</td>\
								</tr>\
							</table>';
							
						$files.appendChild(el);
					}
				}
				
				if(!filter && $('total').innerHTML != res.total_human) $('total').innerHTML = res.total_human;
				
				if(onload_func) onload_func();
				
				try{
				var t = get_sfile();
				var selected_id = t['id'];
				}catch(e){};
				
				var sel = $('file'+selected_id);
				
				if(sel && !sel.fselected) sel.onclick();
			},
			
			true
		);
	}
})();

var Ma = new (function()
{
	var T = this;
	
	T.load = function(msg)
	{
		if(!msg) msg = 'in';
		var $messages = $('messages');
		
		JsHttpRequest.query( '/ajax/mail/', { msg:  msg },
			function(res,err)
			{
				var tmp = [];
				
				if(!res.messages || err)
				{
					$messages.innerHTML = err || 'Извините, произошла ошибка на сервере';
					return;
				}
				
				$messages.innerHTML = '';
				
				if(res['new'] > 0)
				{
					$('tt_mail').innerHTML = 'Почта (<b>'+res['new']+'</b>)';
				}else if($('tt_mail').innerHTML != 'Почта')
				{
					$('tt_mail').innerHTML = 'Почта'
				}
				
				if(msg == 'in')
				{
					try{
					$('mail_name').innerHTML = 'Входящие';
					$('btn_outbox_text').innerHTML = 'Исходящие';
					}catch(e){};
				}else
				{
					try{
					$('mail_name').innerHTML = 'Исходящие';
					$('btn_outbox_text').innerHTML = 'Входящие';
					}catch(e){};
				}
				
				var msgwidth = parseInt($('mail').style.width) - 267 - 30 /*scrollbar*/;
				var l = res.messages.length, nm, snm, users;
				
				var field = msg == 'in' ? 'from' : 'to';
				
				for(var i = 0; i < l; i++)
				{
					t = res.messages[i];
					
					var users = t[field].split(/\,/g);
					
					for(var k in users)
					{
						nm = res.users[users[k]];
						if(!nm)
						{
							nm = 'пользователь был удален';
							snm = '<i>удалён</i>';
						}else
						{
							nm = nm['name'];
							snm = nm.split(/\s+/g);
							if(snm.length == 1) snm = snm[0];
							else snm = snm[1];
						}
						
						users[k] = '<abbr title="'+nm+'">'+snm+'</abbr>';
					}
					
					id = 'file'+t['id'];
					
					el = document.createElement('DIV');
					el.id = id;
					el.className = 'message';
					
					el.innerHTML =
						'<table width="100%">\
							<tr>\
								<td width="166" valign="top">\
									'+users.join(', ')+'\
								</td>\
								\
								<td>\
									<div style="width: '+msgwidth+'px; overflow-x: auto;">\
										'+t['text']+'\
									</div>\
								</td>\
								\
								<td width="101" align="right" valign="top">\
									<div style="width: 95px; overflow: hidden;">\
										'+t['date']+'\
									</div>\
								</td>\
							</tr>\
						</table>';
						
					$messages.appendChild(el);
				}
			},
			
			true
		);
	}
})();

var If = new (function()
{
	var T = this;
	
	T.resize = function(first_time)
	{
		var ww = T.get_width();
		var wh = T.get_height();
		
		var ih = 0; /* info height */
		
		if(!$('info_info')) return
		
		if($('info_info').style.height) ih = parseInt($('info_info').style.height);
		
		T.tagsh = (wh-140-40 );
		T.ss('tags',
		{
			height: (T.tagsh-ih)+'px'
		});
		
		T.tags_wraph = ( wh - 305 );
		T.ss('tags_wrap',
		{
			height: (T.tags_wraph-ih)+'px'
		});
		
		T.tags_tagsh = ( wh - 338 );
		T.ss('tags_tags',
		{
			height: (T.tags_tagsh-ih)+'px'
		});
		
		
		if($ie) /* remind IE that tags_btm has style bottom: 0px :) */
		T.ss('tags_btm',
		{
			bottom: '0px'
		});
		
		T.ss('head_info',
		{
			width: ( ww - 139 )+'px'
		});
		
		T.ss('head_stripe',
		{
			width: ( ww - 125 )+'px'
		});
		
		T.ss('vstripe',
		{
			height: wh + 'px'
		});
		
		T.ss('work_area',
		{
			width: ( (ww-1024) + 692)+'px',
			height: ( (wh-600) + 422)+'px'
		});
		
		T.ss('work_work',
		{
			width: ( (ww-1024) + 692)+'px',
			height: ( (wh-600) + 422 - 41)+'px'
		});
		
		T.ss('files',
		{
			width: ( (ww-1024) + 692)+'px',
			height: ( (wh-600) + 422 - 41 -46 - 25) + 'px'
		});
		
		T.ss('mail',
		{
			width: ( (ww-1024) + 864)+'px',
			height: ( (wh-600) + 422)+'px'
		});
		
		T.ss('mail_work',
		{
			width: ( (ww-1024) + 864)+'px',
			height: ( (wh-600) + 422 - 41)+'px'
		});
		
		T.ss('messages',
		{
			width: ( (ww-1024) + 864)+'px',
			height: ( (wh-600) + 422 - 41 -46 - 25) + 'px'
		});
		
		if(!first_time)
		{
			window.__clear_all = true;
			$('files').onscroll();
		}
	}
	
	/* func to call on load */
	T.load = function()
	{
		T.resize(true);
		
		function finalize_load()
		{
			document.body.style.backgroundImage = 'url(/pub/i/m/case-blue.png)';
			$('initial_loading').style.display = 'none';
			$('very_main').style.visibility = ''; 
		}
		
		if(window.location.hash == '#mail')
		{
			$('t_mail').onclick();
			finalize_load();
		}else
		{
			Fi.load('date', 'DESC', finalize_load);
		}
		if($('mp3_player_div')) $('mp3_player_div').style.display = 'block';
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
		var el, undef;
		
		els = els.split(',');
		
		
		for(var key in els)
		{
			el = $(els[key]);
			if(!el) return false;
			
			for(var k in styles)
			{
				//if(typeof(el.style[k]) == typeof(undef)) continue;
				el.style[k] = styles[k];
			}
		}
		
		return true;
	};
	
	T.gw = T.get_width = function()
	{
		if(document.body.offsetWidth) return document.body.offsetWidth;
	  	else if(window.innerWidth) return window.innerWidth;
	  	else return false;
	};
	
	T.gh = T.get_height = function()
	{
		if(document.body.offsetHeight) return document.body.offsetHeight;
	  	else if(window.innerHeight) return window.innerHeight;
	  	else return false;
	};
	
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
	};
	
	T.wo = T.window_open = function(src, name, width, height)
	{	
	   return window.open(src, name, 'width=' + width + ',height= ' + height + ',resizeable=0,menubar=0,location=0,scrollbars=1,toolbar=0,status=0,top='+(screen.height/2-height/2)+',left='+(screen.width/2-width/2));
	};
	
	T.it = (T.is_tag = function(e,tagname)
	{
		if(!e || (e.target || e.srcElement).nodeName.toLowerCase()!=tagname.toLowerCase()) return false;
		return true;
	});
	
	T.ii = (T.is_inp = function(e)
	{
		return T.is_tag(e,'input');
	});
})();