/* this file should be included last */

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
					alert('AJAX request failed because of 404 error (Not Found). Please ensure, that SNAME is installed properly.');
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
		
		D.qr('MASTER_SITE'+'build-info/', {}, function(res,err)
		{
			if(!res) alert('Could not contact MASTER_SITE.');
			else if(res == FVER) alert('No new version available');
			else if(res < FVER) alert('You have a newer version, than on a server :).');
			else if(confirm('New version ('+res+' build) is available.\nInstall it?'))
			{
				E.run_update();
			}
		}, true, 'contacting MASTER_SITE');
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

window.Dolphin = (window.D = new DolphinClass());