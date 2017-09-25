var Render_Views={table:function(){
var T=this;
var _2=[];
var _3=false;
var _4="";
var _5=false;
T.gsi=(T.get_selected_items=function(){
return _2;
});
T._tv_h=function(_6,ev){
switch(ev){
case "over":
I.im(_6.firstChild,"h","tv_lsep");
_6.className="h";
break;
case "out":
I.im(_6.firstChild,"","tv_lsep");
_6.className="";
break;
case "down":
I.im(_6.firstChild,"d","tv_lsep");
_6.className="d";
break;
}
};
T.it=(T.is_tag=function(e,_9){
if(!e||(e.target||e.srcElement).nodeName.toLowerCase()!=_9.toLowerCase()){
return false;
}
return true;
});
T.ii=(T.is_inp=function(e){
return T.is_tag(e,"input");
});
var _b=false;
T.isv=(T.is_smpl_view=function(){
return _b;
});
var _c=function(k){
return (k%2==1?"#f6f6f6":"white");
};
var _e={_default:0,ace:1,app:2,avi:3,bat:4,bmp:5,chm:6,com:7,css:8,divx:9,dll:10,doc:11,exe:12,fon:13,gif:14,gz:15,hlp:16,htaccess:17,htm:18,html:19,htpasswd:20,inc:21,ini:22,jpe:23,jpeg:24,jpg:25,js:26,lnk:27,log:28,mdb:29,mid:30,midi:31,mov:32,mp3:33,mpeg:34,mpg:35,pdf:36,php:37,php3:38,phtml:39,pl:40,png:41,psd:42,ptt:43,rar:44,rtf:45,shtm:46,shtml:47,sys:48,tar:49,ttf:50,txt:51,wav:52,wbmp:53,wma:54,zip:55};
T.file_icon=T.fi=function(_f){
var e=E.ge(_f).toLowerCase();
return "<img src=\"f/i/no.png\" width=16 height=16 border=0 style=\"background: url('f/iconz/16-f.png'); background-position: 0px "+(_e[e]?-_e[e]*16:0)+"px\">";
};
T.df=T.draw_files=function(){
var i=E.ggr();
var n=[];
var j=0,k=0;
var _15=E.perpage;
var swd=100;
var wd=I.gw()-250-swd;
var _18=i["pages_num"];
var tmp=[];
var _1a=function(l){
tmp.push("<span style=\"background: white;\">"+l+"</span>");
};
var _1c=function(l,_1e){
tmp.push("<a href=\"#\" onclick=\"D.cp("+l+"); return false;\">"+(_1e||l)+"</a>");
};
D.show_pages(_18,E.page,_1a,_1c);
var f=i["pages"][E.page];
E.perpage=_15;
window.filenames=[];
_2=[];
var _20=function(){
if(f&&f["dirs"]&&f["dirs"]["name"]){
for(j=0;f["dirs"]["name"][j]&&k<_15;j++,k++){
n[k]="<tr height=\"24\" style=\"cursor: default; background: "+_c(k)+";\" id=\"tr_"+k+"\" onmouseover=\"R.hove(event);\" onmouseout=\"R.hout(event);\">\t\t\t\t\t\t\t\t\t\t<td ondblclick=\"D.go2(window.filenames["+k+"]); return false;\" onclick=\"R.check(this,event);\" id=\""+k+"\" onmousedown=\"return false;\" class=\"column\"><div style=\"overflow: hidden; width: "+wd+"px; padding-left: 5px;\"><nobr><img src=\"f/iconz/16-folder.png\" width=16 height=16 border=0> "+f["dirs"]["name"][j]+"</nobr></div></td>\t\t\t\t\t\t\t\t\t\t<td width=\""+swd+"\"><div id=\"size_"+k+"\" style=\"padding-left: 5px; width: "+swd+"px; overflow: hidden;\"><nobr>"+E.hb(f["dirs"]["size"][j])+"</nobr></div></td>\t\t\t\t\t\t\t\t\t\t</tr>";
window.filenames[k]=E.address+"/"+f["dirs"]["name"][j];
}
}
};
var _21=function(){
var _22=null;
if(f&&f["files"]&&f["files"]["name"]){
for(j=0;(_22=f["files"]["name"][j])&&k<_15;j++,k++){
n[k]="<tr height=\"24\" style=\"cursor: default; background: "+_c(k)+";\" id=\"tr_"+k+"\" onmouseover=\"R.hove(event);\" onmouseout=\"R.hout(event);\">\t\t\t\t\t\t\t\t\t\t<td ondblclick=\"E.edit_file_for_item("+k+"); return false;\" onclick=\"R.check(this,event);\" id=\""+k+"\" onmousedown=\"return false;\" class=\"column\"><div style=\"overflow: hidden; width: "+wd+"px; padding-left: 5px;\"><nobr>"+T.fi(_22)+" "+_22+"</nobr></div></td>\t\t\t\t\t\t\t\t\t\t<td width=\""+swd+"\"><div id=\"size_"+k+"\" style=\"padding-left: 5px; width: "+swd+"px; overflow: hidden;\"><nobr>"+E.hb(f["files"]["size"][j])+"</nobr></div></td>\t\t\t\t\t\t\t\t\t\t</tr>";
window.filenames[k]=E.address+"/"+f["files"]["name"][j];
}
}
};
if(E.order=="asc"){
_20();
_21();
}else{
_21();
_20();
}
var _23="<table width=\"100%\" height=\"100%\" cellspacing=0 cellpadding=0><tr height=\"23\">";
var els={name:["Name",0],size:["Size",swd]};
for(var _25 in els){
var _26=els[_25][1]?" width=\""+els[_25][1]+"\"":"";
_23+="<th id=\""+_25+"_th\""+_26+" class=\"sort"+(E.sort==_25?" active":"")+" column\"><a href=\"#\" onclick=\"if(E.sort != '"+_25+"') D.cs('"+_25+"'); else D.co(E.order=='asc'?'desc':'asc'); return false;\">"+els[_25][0]+(E.sort==_25?" "+(E.order=="asc"?"&uarr;":"&darr;"):"")+"</a>"+(E.sort==_25&&_25=="name"&&i["items_num"]>200?(" <small>(<a href=\"#\" onclick=\"D.cf();return false;\">"+(E.fast?"show all folders first":"use faster sorting")+"</a>)</small>"):"")+"</th>";
}
var fl=$("filelist");
fl.innerHTML=_23+n.join("")+"<tr><td></td></tr></table>";
fl.onmousedown=T.handle_down;
$("pages_links").innerHTML=_18>1?"<b>Pages:</b> "+tmp.join(" "):"";
$("select_links").innerHTML=_18>0?"<b>Select:</b> "+(true?"<a href=\"#\" onclick=\"R.check_all(); R.redraw_menu(); return false;\">"+(_18<1?"all":"this page")+"</a>, ":"")+"<a href=\"#\" onclick=\"R.uncheck_all(); R.redraw_menu(); return false;\">none</a>":"";
_5=false;
};
var _28=function(k){
I.ss("tr_"+k,{background:_c(k)});
};
var _2a=function(k){
return (k%2==1?"#fff07c":"#fdf5b5");
};
var _2c=function(k){
I.ss("tr_"+k,{background:_2a(k)});
};
T.uncheck_all=function(){
var els=_2.length;
for(var i=0;i<els;i++){
for(var l=0;l<window.filenames.length;l++){
if(_2[i]==window.filenames[l]){
_28(l);
break;
}
}
}
_2=[];
};
T.check_all=function(){
_2=[];
for(var l=0;l<window.filenames.length;l++){
_2c(l);
_2.push(window.filenames[l]);
}
};
T.redraw_menu=function(){
var els=_2.length;
if(els==0){
L.draw(D.ggm());
I.cs(D.ggs());
this.last=false;
}else{
if(els==1){
if(_5==_2[0]){
return;
}
E.dmfi(_2[0]);
_5=_2[0];
}else{
E.dmfis();
this.last=false;
}
}
};
T.check=function(el,_34){
var k=el.id;
var _36=window.filenames[k];
var num=T.is(_36);
var els=_2.length;
if(_34.ctrlKey||_34.metaKey){
if(num!==false){
if(els>1){
_2.splice(num,1);
}else{
_2=[];
}
_28(k);
els--;
}else{
_2.push(_36);
_2c(k);
els++;
}
_5=false;
}else{
T.uncheck_all();
_2=[_36];
els=1;
_2c(k);
}
T.redraw_menu();
};
T.is=T.is_selected=function(el){
for(var i=0;i<_2.length;i++){
if(_2[i]==el){
return i;
}
}
return false;
};
T.cl=function(el,e,_3d){
if(_b){
return false;
}
if(!e.ctrlKey&&!T.is_rbutton(e)){
T.un_cl();
}
var id=el.id.substr(2);
var i=E.ggi()[id];
i["id"]=id;
if(true){
var num=el.className=="item16_h";
if((_3d||T.ir(e))&&num!==false){
return;
}
}
if(!_3d&&e.ctrlKey&&num!==false){
T._selected.splice(num,1);
el.className="item16";
}else{
T._selected.push(i);
el.className="item16_h";
}
if(T._selected.length==0){
T.un_cl(true);
}else{
if(T._selected.length==1){
if(!_3d){
E.dmfi(id);
}
}else{
if(!_3d){
E.dmfis();
}
}
}
};
T.uc=T.un_cl=function(_41){
var el=false;
if(_b){
return false;
}
if(_41){
L.draw(E.get_global_menu());
I.change_status(E.get_global_status());
}
for(var k=0;k<T._selected.length;k++){
el=$("it"+T._selected[k]["id"]);
if(el){
el.className="item16";
}
}
T._selected=[];
};
T.hove=(T.handle_over=function(e,obj){
if(_b){
return false;
}
_3=true;
});
T.hout=(T.handle_out=function(e,obj){
if(_b){
return false;
}
_3=false;
});
T.hd=(T.handle_down=function(e){
if(_b){
return false;
}
if(T.is_inp(e)||T.is_tag(e,"a")){
return true;
}
if(!_3){
T.uncheck_all();
T.redraw_menu();
}
return true;
});
T.ir=(T.is_rbutton=function(e){
return e.button==3||e.button==2;
});
}};
window.Render=(window.R=new Render_Views["table"]());
var EngineClass=function(){
var T=this;
var _4b={"back":[],"fwd":[]};
var _4c,_4d,_4e,_4f,_50;
T.address=false;
T.page=1;
T.perpage=0;
T.sort="name";
T.order="asc";
T.fast=true;
T.copied=false;
T.op="copy";
T.ggr=T.get_global_res=function(){
return D.ggr();
};
T.ggm=(T.get_global_menu=function(){
return D.ggm();
});
T.ggs=(T.get_global_status=function(){
return D.ggs();
});
var _51=false;
T.cd=(T.cancel_draw=function(){
if(!_51){
return;
}
clearTimeout(_51);
_51=false;
});
var _52=false;
T.go2=function(_53,_54,_55){
return D.go2(_53,_54,_55);
};
T.rf=T.request_filelist=function(dir,_57,_58){
D.qr("index.php?act=filelist",{DIR:dir,"params":_57},_58,true,"requesting pages");
};
T.bsnm=(T.basename=function(_59){
var p=_59.split("/");
if(!p[p.length-1]){
p.pop();
}
return p[p.length-1];
});
T.round=function(_5b,_5c){
if(_5c<=0){
return Math.round(_5b);
}
_5c=parseInt(_5c);
var fp=""+Math.round((_5b-Math.floor(_5b))*Math.pow(10,parseInt(_5c)));
if(fp.length<_5c){
for(var i=_5c-fp.length;i>0;i--){
fp="0"+fp;
}
}
return Math.floor(_5b)+"."+fp;
};
T.hb=T.human_bytes=function(_5f){
if(_5f<0){
return "&gt;2 Gb";
}
if(_5f<1024){
return _5f+" bytes";
}else{
if(_5f<1024*1024){
return T.round(_5f/1024,2)+" Kb";
}else{
if(_5f<1024*1024*1024){
return T.round(_5f/(1024*1024),2)+" Mb";
}else{
return T.round(_5f/(1024*1024*1024),2)+" Gb";
}
}
}
};
T.ge=(T.get_extension=function(_60){
var arr=_60.split(".");
if(!arr[1]){
return "";
}
for(var k in arr){
var ext=arr[k];
}
return ext;
});
T.path=function(k){
return _items[k]["fullpath"];
};
T.dmfi=(T.draw_menu_for_item=function(_65){
T.cancel_draw();
_51=setTimeout(function(){
_4c(_65);
},300);
});
T.dmfis=(T.draw_menu_for_items=function(){
L.draw({0:"operations",1:{name:"details",filename:"Selected:",selnum:R.get_selected_items().length}});
I.change_status([["Selected items",R.get_selected_items().length]]);
});
_4c=function(_66,_67){
T.cancel_draw();
var dr=function(_69){
R._selected=[{type:1,fullpath:_69["fullpath"]}];
var _6a=(_69["dir"]?0:1);
L.draw({0:{name:"operations",type:_6a},1:_69});
I.change_status([["Name",_69["filename"]],["Type",_69["type"]],["Size",_69["size"]]]);
};
if(!_67){
D.qr("index.php?act=info",{file:_66},function(d,err){
if(d){
dr(d);
}
});
}else{
dr(_67);
}
};
T.di=T.delete_item=T.dis=T.delete_items=function(){
var _6d=R.get_selected_items();
if(!confirm("Do you really want to delete "+(_6d.length==1?E.bsnm(_6d[0]):"all items ("+_6d.length+")")+"?")){
return;
}
var del;
(del=function(_6f){
D.qr("index.php?act=delete",{"items":_6d},function(res,err){
if(res&&res.end){
if(!res.success){
alert("Delete failed");
}
T.F5();
}else{
if(res&&!res.end){
del(res);
}
}
},true,"deleting "+_50(_6f)+"...");
})();
};
T.ri=(T.rename_item=function(){
var i=R.gsi()[0];
var _73=prompt("Enter new name:",T.basename(i));
if(!_73){
return;
}
D.qr("index.php?act=rename",{"old":i,"new":_73},function(res,err){
if(res["success"]){
E.F5();
}else{
alert("The item "+res["f"]+" could not be renamed."+res["reason"]);
}
});
});
T.mkdir=function(){
var _76=prompt("Enter the new directory name:","NewFolder");
if(!_76){
return;
}
D.qr("index.php?act=mkdir",{name:_76},function(res,err){
if(res["success"]){
T.F5();
}else{
alert("Could not create directory."+res["reason"]);
}
});
};
T.mkfile=function(){
var _79=prompt("Enter the new filename:","NewFile");
if(!_79){
return;
}
D.qr("index.php?act=mkfile",{name:_79,confirm:0},function(res,err){
if(res["exists"]){
if(confirm("The file already exists. Overwrite it?")){
D.qr("index.php?act=mkfile",{name:_79,confirm:1},function(r,e){
if(!r["success"]){
alert("Could not create file."+r["reason"]);
}else{
T.F5();
}
});
}
return;
}
if(res["success"]){
T.F5();
}else{
alert("Could not create file."+res["reason"]);
}
});
};
T.df=T.download_file=function(i){
var _7f;
if(typeof (i)==typeof (_7f)){
i=R.get_selected_items()[0];
}
D.qr("index.php?act=download_get_href",{file:i,type:1},function(res,err){
if(res){
window.location.href=res["href"];
}else{
alert("Could not get address to download file. This error cannot happen.");
}
},false,"downloading...");
};
T.cpi=(T.cpis=(T.copy_items=(T.copy_item=function(){
_4d("copy");
})));
T.cti=(T.ctis=(T.cut_items=(T.cut_item=function(){
_4d("cut");
})));
T.cancel_copy=function(){
D.qr("index.php?act=cancel_copy",{},function(res,err){
T.copied=false;
T.F5();
});
};
_4d=function(_84){
D.qr("index.php?act="+_84,{items:R.get_selected_items()},function(res,err){
if(!res){
alert("Could not "+_84+" files.");
}else{
T.op=_84;
T.copied=true;
R.un_cl(true);
}
});
};
_50=function(_87){
if(!_87){
return "(process started)";
}
return "<small>(<b>files:</b> "+_87.files+"&nbsp;&nbsp;&nbsp;<b>dirs:</b> "+_87.dirs+(_87.total?"&nbsp;&nbsp;&nbsp;<b>total:</b> "+_87.total+(_87.speed?" on "+_87.speed:""):"")+")</small>";
};
T.pi=(T.paste_items=function(){
if(T.op=="cut"){
D.qr("index.php?act=paste",{},function(res,err){
if(!res){
alert(err);
}
T.copied=false;
T.F5();
},true,T.op=="copy"?"copying...":"moving...");
}else{
var cp;
(cp=function(_8b){
D.qr("index.php?act=paste",{},function(res,err){
if(err){
alert(err);
}
if(!res){
return;
}
if(res.end){
T.copied=false;
if(!res.success){
alert((T.op=="copy"?"Copy":"Move")+" failed");
}
T.F5();
}else{
cp(res);
}
},true,T.op=="copy"?"copying "+_50(_8b)+"...":"moving "+_50(_8b)+"...");
})();
}
});
T.F5=(T.refresh=function(){
T.go2(T.address,true,T.page,true);
});
var _8e=0;
T.effi=(T.edit_file_for_item=function(k){
var _90=window.filenames[k];
var wnd=I.window_open("about:blank","edit"+(_8e++),640,480);
D.qr("index.php?act=info",{file:_90,type:1},function(res,err){
var img=res["thumb"]?true:false;
res["thumb"]=false;
_4c(_90,res);
if(res["size_bytes"]>=100*1024&&!img){
T.download_file(_90);
}else{
wnd.location.href="index.php?act=edit&file="+res["filename_encoded"]+(img?"&img=true":"");
}
},true,"opening...");
});
var _95=false;
var _96=false;
T.ath=(T.add_to_history=function(dir){
_4b["back"].push(dir);
_4b["fwd"]=[];
});
T.gb=(T.go_back=function(){
if(_4b["back"].length<=1){
return false;
}
_4b["fwd"].push(_4b["back"].pop());
T.go2(_4b["back"][_4b["back"].length-1],true);
});
T.gf=(T.go_fwd=function(){
if(_4b["fwd"].length==0){
return false;
}
var _98=_4b["fwd"].pop();
_4b["back"].push(_98);
T.go2(_98,true);
});
T.cgb=(T.can_go_back=function(){
return _4b["back"].length>1;
});
T.cgf=(T.can_go_fwd=function(){
return _4b["fwd"].length>0;
});
T.cgu=(T.can_go_up=function(){
return D.cgu();
});
_4e=function(){
var tmp="<table onclick=\"T.style.display='none'\"><tr><td>Back: ";
for(k in _4b["back"]){
if(k!="copy"){
tmp+="<br>"+k+": "+_4b["back"][k];
}
}
tmp+="</td><td>Fwd: ";
for(k in _4b["fwd"]){
if(k!="copy"){
tmp+="<br>"+k+": "+_4b["fwd"][k];
}
}
tmp+="</td></tr></table>";
I.dbg(tmp);
};
T.sds=(T.show_dir_size=function(_9a){
var el=$("_dirsize");
var i,_9d;
if(R.gsi().length>0){
_9d=R.gsi()[0];
}else{
i=-1;
_9d=T.address;
}
D.qr("index.php?act=show-properties",{"items":[_9d]},function(res,err){
if(res){
if(!_9a&&!res.end){
res.total+=" <a href=\"javascript:E.sds(true);\" style=\"text-decoration: underline;\">count further</a>";
}
el.innerHTML=(res.end?"":"&gt;")+res.total;
if(res.end){
if(i==-1){
_menu[2]["size"]=res.total;
}
}
if(!res.end&&_9a){
T.sds(true);
}
}else{
el.innerHTML="error: "+err;
}
},true,"counting...");
});
T.ci=T.chmod_item=T.cis=T.chmod_items=function(mod,_a1){
var _a2=confirm("CHMOD items recursively (chmod also subdirectories and files in subdirectories)?");
if(!_a2){
D.qr("index.php?act=set_rights",{"items":_a1,"mod":mod,"recursive":false},function(res,err){
if(err){
alert(err);
}
});
}else{
var cp;
(cp=function(_a6){
D.qr("index.php?act=set_rights",{items:_a1,"mod":mod,"recursive":true},function(res,err){
if(err){
alert(err);
return;
}
if(res.end){
if(!res.success){
alert("CHMOD failed");
}else{
setTimeout(function(){
cp(res);
},100);
}
}
},true,"CHMODding "+_50(_a6)+"...");
})();
}
};
T.zis=T.zi=T.zip_items=T.zip_item=function(){
D.qr("index.php?act=zip",{items:R.gsi()},function(res,err){
if(err){
alert(err);
}
T.F5();
},true,"compressing");
};
T.uzi=T.unzip_item=function(_ab){
D.qr("index.php?act=unzip",{"fullpath":R.gsi()[0],"mode":_ab},function(res,err){
if(err){
alert(err);
}
T.F5();
},true,"extracting");
};
T.ru=T.run_update=function(){
D.qr("index.php?act=update",{},function(res,err){
if(!res){
if(confirm("Auto-update failed.\nDo you want to use advanced way to update Dolphin.php (version will be changed to light)?")){
window.location="index.php?version=light&DIR=.&act=download-new";
}
}else{
alert("Update successful!");
window.location.reload();
}
});
};
T.ot=T.open_terminal=function(){
I.window_open("index.php?act=terminal","terminal",700,500);
};
T.sp=T.show_properties=function(){
if(!this.i){
this.i=0;
}
I.window_open("index.php?act=properties","properties"+(this.i++),300,400);
};
};
window.Engine=(window.E=new EngineClass());
var LeftMenuClass=function(){
var T=this;
var _b1={};
var _b2={};
var _b3,_b4;
T.draw=function(_b5){
var i=0;
var tmp="",_b8="",_b9="",up="",_bb="";
_b1={};
for(var k in _b5){
i++;
if(!_b5[k]["name"]){
_b5[k]={name:_b5[k]};
}
_b1[i]=_b5[k]["name"];
var p=_b5[k];
switch(p["name"]){
default:
case "common":
_b8="Common";
_b9="";
if(E.copied){
_b9+=_b3("javascript:E.paste_items();","Paste items here","paste","Paste");
_b9+=_b3("javascript:E.cancel_copy();","Cancel "+E.op,"cancel","Cancel "+E.op);
}
_b9+=_b3("javascript:E.mkfile();","Create a file","mkdir","Create a file");
_b9+=_b3("javascript:E.mkdir();","Create a folder","mkdir","Create a directory");
break;
case "fsearch":
_b8="Filename filter";
T._search_str_default="Enter part of filename...";
if(!T._search_str){
T._search_str=T._search_str_default;
}
_b9="<input type=text name=\"fsearch\" id=\"fsearch\" class=\"fsearch_g\" onkeyup=\"/*setTimeout is to prevent IE crash =) */if(window.search_timeout) clearTimeout(window.search_timeout); window.search_timeout = setTimeout(function(){ L._search_str=$('fsearch').value;D.cp(1);}, event.keyCode == 13 ? 0 : 500);\" onfocus=\"if(this.value=='"+T._search_str_default+"') this.value='';this.className='fsearch'\" onblur=\"this.className='fsearch_g';if(this.value=='') this.value='"+T._search_str_default+"';\" value=\""+T._search_str+"\">";
break;
case "operations":
var s=R.gsi();
_b8="Common operations";
if(s.length==1){
s=s[0];
if(p["type"]==1){
_b9=_b3("javascript:E.rename_item();","Set another name to current file","rename","Rename file");
_b9+=_b3("javascript:E.cut_item();","Move file to another place","cut","Cut file");
_b9+=_b3("javascript:E.copy_item();","Make a copy of file","copy","Copy file");
_b9+=_b3("javascript:E.download_file();","Download the selected file to your computer","upload","Download file");
_b9+=_b3("javascript:E.delete_item();","Remove the file from computer","delete","Delete file");
if(E.get_extension(s)=="zip"){
_b9+=_b3("javascript:E.unzip_item(&quot;extract_here&quot;);","Extract contents here","zip","Extract here");
var lon=E.basename(s);
lon=lon.substr(0,lon.length-4);
var _c0=lon.length>12?lon.substr(0,9)+"...":lon;
_b9+=_b3("javascript:E.unzip_item(&quot;extract&quot;);","Extract to &quot;"+lon+"/&quot;","zip","Extract to &quot;"+_c0+"/&quot;");
}else{
_b9+=_b3("javascript:E.zip_item();","Add file to zip","zip","Add to zip");
}
_b9+=_b3("javascript:E.show_properties();","Show file properties","admin","Show Properties");
}else{
_b9=_b3("javascript:E.rename_item();","Set another name to current directory","rename","Rename folder");
_b9+=_b3("javascript:E.cut_item();","Move directory to another place","cut","Cut folder");
_b9+=_b3("javascript:E.copy_item();","Make a copy of directory","copy","Copy folder");
_b9+=_b3("javascript:E.delete_item();","Remove the directory from computer","delete","Delete folder");
_b9+=_b3("javascript:E.zip_item();","Add directory to zip","zip","Add to zip");
_b9+=_b3("javascript:E.show_properties();","Show directory properties","admin","Show Properties");
}
}else{
_b9+=_b3("javascript:E.cut_items();","Move items to another place","cut","Cut items");
_b9+=_b3("javascript:E.copy_items();","Make copy of items","copy","Copy items");
_b9+=_b3("javascript:E.delete_items();","Remove the items from computer","delete","Delete items");
_b9+=_b3("javascript:E.zip_items();","Add items to zip","zip","Add to zip");
_b9+=_b3("javascript:E.show_properties();","Show properties of items","admin","Show Properties");
}
break;
case "details":
_b8="Details";
if(p["thumb"]){
_b9=p["thumb"];
}else{
_b9="";
}
_b9+="<b style=\""+(true?"width: 200px;":"")+"overflow: hidden; display: block;\">"+p["filename"]+"</b>";
if(p["dir"]){
p["type"]="Directory";
}
if(p["type"]){
_b9+=p["type"]+"<br><br>";
}else{
_b9+="<br>";
}
if(p["selnum"]){
_b9+=p["selnum"]+" items<br><br>";
}
if(p["id3"]){
_b9+=p["id3"]+"<br><br>";
}
if(p["fs"]){
_b9+="Filesystem: "+p["fs"]+"<br><br>";
}
if(p["free"]){
_b9+="Free disk space: "+p["free"]+"<br><br>";
}
if(p["total"]){
_b9+="Total disk space: "+p["total"]+"<br><br>";
}
if(p["changed"]){
_b9+="Changed: "+p["changed"]+"<br><br>";
}
if(p["owner"]){
_b9+="Owner: "+p["owner"]+"<br><br>";
}
if(p["group"]){
_b9+="Group: "+p["group"]+"<br><br>";
}
if(p["rights"]){
_b9+="Rights: "+p["rights"]+"<br><br>";
}
if(p["size"]){
_b9+="Size: <span id=\"_dirsize\">"+p["size"]+"</span><br><br>";
}else{
if(p["dir"]){
_b9+="Size: <span id=\"_dirsize\"><a href=\"javascript:E.show_dir_size(false);\" style=\"text-decoration: underline;\">click to show size</a></span>"+"<br><br>";
}
}
_b9=_b9.substr(0,_b9.length-4);
if(_b9.substr(_b9.length,_b9.length-4)=="<br>"){
_b9=_b9.substr(0,_b9.length-4);
}
break;
case "long text":
_b8="phylosophy";
_b9="long text should be here";
break;
}
var up=_b2[p["name"]]?"l_darr":"l_uarr";
var _c1=up=="l_uarr"?"":" style=\"display: none;\"";
tmp+="<div class=\"left_menu_head\"><span onclick=\"L._hide("+i+");\">"+_b8+"</span></div>\t\t\t\t\t\t<div class=\"left_menu_body\" id=\"b"+i+"\" border=0"+_c1+">"+_b9+"</td><td width=12><img src=\"f/i/no.png\" width=12 height=1></div>";
}
$("left_menu").innerHTML=tmp;
};
T._highlight=function(id,act){
var el=$("i"+id);
var _c5=act=="over"?"h":"";
if(_b2[_b1[id]]){
I.im(el,_c5,"l_darr");
}else{
I.im(el,_c5,"l_uarr");
}
};
T._hide=function(id){
var el=$("b"+id);
var img=$("i"+id);
var _c9=_b1[id];
if(el.style.display!="none"){
T.opac(el,0.3,false);
setTimeout(function(){
el.style.display="none";
},350);
_b2[_c9]=_c9;
}else{
el.style.visibility="hidden";
el.style.display="";
T.opac(el,0.3,true);
I.im(img,"h","l_uarr");
_b2[_c9]=null;
}
};
var _i=0;
_b3=function(_cb,_cc,_cd,_ce){
_i++;
var _cf="background: url('f/i/menu_all.png') -"+I.coords["m_"+_cd][0]+"px -"+I.coords["m_"+_cd][1]+"px";
return "<div style=\"padding-top: 2px; padding-bottom: 2px;\"><a href=\""+_cb+"\" title=\""+_cc+"\" style=\"text-decoration: none;\"><img src=\"f/i/no.png\" width=16 height=16 style=\""+_cf+"\" border=0>&nbsp;&nbsp;<span id='u"+_i+"' style=\"text-decoration: underline;\">"+_ce+"</span></a></div>";
};
T._underl=function(id,_d1){
var el=$("u"+id);
if(_d1){
el.style.textDecoration="underline";
}else{
el.style.textDecoration="none";
}
};
T.opac=function(el,_d4,_d5){
if(!_d4){
var _d4=0.3;
}
if(_d5==undefined){
var _d5=true;
}
var _d6=false;
if(el.runtimeStyle){
if(el.style.position!="absolute"&&!el.style.width&&!el.style.height){
el.style.width=el.offsetWidth+"px";
el.style.height=el.offsetHeight+"px";
_d6=true;
}
el.runtimeStyle.filter="BlendTrans(Duration="+_d4+")";
if(_d5){
el.style.visibility="hidden";
}else{
el.style.visibility="visible";
}
el.filters["BlendTrans"].Apply();
if(!_d5){
el.style.visibility="hidden";
}else{
el.style.visibility="visible";
}
el.filters["BlendTrans"].Play();
if(_d6){
el.style.width="";
el.style.height="";
}
return true;
}
if(el.style.opacity!=undefined){
var bit=-1/(_d4*40);
if(!_d5){
bit=-bit;
}
el.style.opacity=_d5?0:1;
el.style.visibility="visible";
var op=function(){
if((el.style.opacity>=1&&_d5)||(el.style.opacity<=0&&!_d5)){
return;
}
el.style.opacity-=bit;
setTimeout(op,25);
};
op();
return true;
}
return false;
};
};
window.LeftMenu=(window.L=new LeftMenuClass());
var InterfaceClass=function(){
var T=this;
T.coords={back:[0,0,61,30],back_disabled:[0,582,61,30],fwd:[0,90,34,30],fwd_disabled:[0,612,34,30],up:[48,90,29,30],up_disabled:[71,612,29,30],search:[0,180,66,30],dirs:[0,270,65,30],view:[0,360,37,30],close:[72,360,28,30],go:[0,450,58,22],l_uarr:[77,90,23,23],l_darr:[77,136,23,23],tv_sep:[64,360,8,20],tv_lsep:[94,450,6,20],tv_uarr:[68,439,9,5],tv_darr:[63,445,9,5],m_open:[0,0,16,16],m_mkdir:[0,16,16,16],m_upload:[0,32,16,16],m_rename:[0,48,16,16],m_cut:[0,64,16,16],m_copy:[0,80,16,16],m_delete:[0,96,16,16],m_control_panel:[0,112,16,16],m_admin:[0,128,16,16],m_paste:[0,160,16,16],m_cancel:[0,176,16,16],m_zip:[0,192,16,16]};
T.dbg=function(_da){
var el=$("debug");
if(!el){
el=document.createElement("div");
el.id="debug";
document.body.appendChild(el);
}
el.innerHTML=_da;
};
T.gw=T.get_width=function(){
if(document.body.offsetWidth){
return document.body.offsetWidth;
}else{
if(window.innerWidth){
return window.innerWidth;
}else{
return false;
}
}
};
T.gh=T.get_height=function(){
if(document.body.offsetHeight){
return document.body.offsetHeight;
}else{
if(window.innerHeight){
return window.innerHeight;
}else{
return false;
}
}
};
T.gb=T.get_bounds=function(_dc){
var _dd=_dc.offsetLeft;
var top=_dc.offsetTop;
for(var _df=_dc.offsetParent;_df;_df=_df.offsetParent){
_dd+=_df.offsetLeft;
top+=_df.offsetTop;
}
return {left:_dd,top:top,width:_dc.offsetWidth,height:_dc.offsetHeight};
};
T.mh=T.menu_hover=function(){
};
T.mo=T.menu_out=function(){
};
T.cp=T.change_path=function(_e0,dir,_e2){
if(0){
var a=$("address_img");
var h=$("header_icon");
if(_e2==0){
a.style.backgroundPosition="-0px -516px";
h.style.backgroundPosition="-37px -360px";
}else{
if(_e2==2){
a.style.backgroundPosition="-0px -538px";
h.style.backgroundPosition="-37px -390px";
}else{
if(_e2==3){
a.style.backgroundPosition="-0px -560px";
h.style.backgroundPosition="-37px -420px";
}
}
}
$("name_of_folder").innerHTML=dir;
}
$("address").value=_e0;
};
T.ca=T.change_address=function(_e5){
var p=$("address").value;
if(_e5){
p=E.address+"/"+_e5;
}
if(p==E.address){
E.refresh();
}else{
E.go2(p);
}
};
T.cs=T.change_status=function(pr){
var el=$("footer_descr");
var tmp=[];
var j=0;
for(var k in pr){
var p=pr[k];
if(!p[1]){
continue;
}
tmp[j++]="<b>"+p[0]+"</b>: "+p[1];
}
el.innerHTML="<nobr>"+tmp.join("&nbsp;&nbsp;&nbsp;")+"</nobr>";
};
T.im=function(obj,_ee,_ef){
if(!_ef){
var _ef=obj.id.substr(4);
}
var c=T.coords[_ef];
var _f1=0;
if(_ee=="h"){
_f1=-c[3];
}
if(_ee=="d"){
_f1=-c[3]*2;
}
obj.style.backgroundPosition="-"+c[0]+"px -"+(c[1]-(obj.id.substr(obj.id.length-9,9)=="_disabled"?0:_f1))+"px";
};
var _f2=function(msg,_f4){
return "<table"+(_f4?"":" width=\"100%\"")+" height=\"100%\"><tr><td style=\"vertical-align: middle; text-align: center;\">"+msg+"</td></tr></table>";
};
T.gp=T.generate_panel=function(){
var el=$("panel");
var tmp="";
var _f7=T.coords;
var act={back:"E.go_back();",back_disabled:"return false;",fwd:"E.go_fwd();",fwd_disabled:"return false;",up:"I.change_address('..');",up_disabled:"return false;"};
var _f9={back:"Back",back_disabled:"Back",fwd:"Forward",fwd_disabled:"Forward",up:"Up",up_disabled:"Up",search:"Search",dirs:"Folders",view:"View"};
for(var k in act){
tmp+="<img id=\"btn_"+k+"\" src=\"f/i/no.png\" onmouseover=\"I.im(this,'h');\" onmouseout=\"I.im(this,'');\" onmousedown=\"I.im(this,'d');\" onmouseup=\"I.im(this,'h'); "+act[k]+" \" alt=\""+_f9[k]+"\" title=\""+_f9[k]+"\" style=\"background: url('f/i/overall.88.png'); background-position: -"+_f7[k][0]+"px -"+_f7[k][1]+"px;"+(k.substr(k.length-9,9)=="_disabled"?"display: none;":"")+"\" width=\""+_f7[k][2]+"\" height=\""+_f7[k][3]+"\" />";
}
el.innerHTML=tmp;
var el=$("upperpanel");
var _fb={Update:"Update&nbsp;to&nbsp;latest&nbsp;development&nbsp;version"};
tmp="<table width=\"100%\" cellspacing=0 cellpadding=0 border=0><tr height=2><td colspan=6></td></tr><tr height=18 class=\"menu\">";
for(var k in _fb){
tmp+="<td height=18 valign=middle onmouseover=\"this.className='menuelm_hover'\" onmouseout=\"this.className='';\" onmousedown=\"I.upperpanel('"+k+"',event,this);\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+_fb[k]+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";
}
el.innerHTML=tmp+"<td width=\"100%\">&nbsp;</td></tr><tr height=4><td colspan=6></td></tr></table>";
};
T.upp=T.upperpanel=function(_fc,e,obj){
var x=10,y=10;
if(_fc!="Update"){
var _101=T.get_bounds(obj);
var el=$("debug");
if(!el){
return;
}
el.style.position="absolute";
el.style.top=(parseInt(_101["top"])+parseInt(_101["height"]))+"px";
el.style.left=_101["left"]+"px";
el.innerHTML="menu";
}else{
D.perform_update();
}
};
T.ss=T.set_style=function(els,_104){
var el;
els=els.split(",");
for(var key in els){
el=$(els[key]);
if(!el){
return false;
}
for(var k in _104){
if(typeof (el.style[k])==typeof (undef)){
continue;
}
el.style[k]=_104[k];
}
}
return true;
};
var _108,_109;
var _10a=false;
T.resize=function(_10b){
var el;
var fh=30,hh=30,mh=40;
var dw=50,lw=250;
_108=T.gw();
_109=T.gh();
T.ss("address_div",{width:(_108-100)+"px"});
T.ss("content",{width:(_108-lw)+"px"});
T.ss("address",{width:(_108-180)+"px"});
T.ss("main_area",{height:(_109-fh-hh-mh)+"px"});
T.ss("footer_descr",{left:"0",width:Math.floor((_108-dw)/2)+"px"});
T.ss("footer_dolphin",{left:Math.floor((_108-dw)/2)+"",width:dw+"px"});
T.ss("footer_state",{left:Math.floor((_108+dw)/2)+"",width:Math.floor((_108-dw)/2)+"px"});
T.ss("left_menu,content",{position:"absolute",top:(hh-(-mh)),height:(_109-fh-mh-hh)+"px"});
T.ss("content",{left:lw});
T.ss("footer",{position:"absolute",top:(_109-fh),left:0});
T.ss("very_main",{visibility:""});
if(!_10b){
var _112=function(){
_10a=false;
E.F5();
};
var _113=true;
if(E.perpage){
_113=false;
}
E.perpage=Math.floor((_109-fh-hh-mh-46)/24);
if(_113){
_10a=false;
D.go2(".");
}else{
if(_10a){
clearTimeout(_10a);
}
_10a=setTimeout(_112,500);
}
}
};
T.db=T.disable_buttons=function(){
for(var k in {fwd:"",back:"",up:""}){
if(!E["can_go_"+k]()){
$("btn_"+k).style.display="none";
$("btn_"+k+"_disabled").style.display="";
}else{
$("btn_"+k).style.display="";
$("btn_"+k+"_disabled").style.display="none";
}
}
};
var _115=0;
var _116=11;
var _117=null;
T.sl=T.show_loading=function(_118,text){
var d=$("footer_state");
var s=text||"loading...";
var _11c=$("footer_dolphin");
if(d){
if(_118){
s=s.replace("...","");
if(!_117){
_117=setInterval(function(){
_115+=30;
_115%=_116*30;
_11c.style.backgroundPosition="0px -"+_115+"px";
},250);
}
}else{
if(!_118&&_117){
clearInterval(_117);
_117=null;
}
}
$("btn_stop_disabled").style.display=_118?"none":"";
$("btn_stop").style.display=_118?"":"none";
}else{
d=$("loading");
if(!d){
return;
}
}
if(_118==true){
d.innerHTML=s;
d.style.visibility="visible";
}else{
d.style.visibility="hidden";
d.innerHTML=s;
}
};
T.wo=T.window_open=function(src,name,_11f,_120){
return window.open(src,name,"width="+_11f+",height= "+_120+",resizeable=0,menubar=0,location=0,scrollbars=1,toolbar=0,status=0,top="+(screen.height/2-_120/2)+",left="+(screen.width/2-_11f/2));
};
T.hk=T.handle_keydown=function(e){
return true;
var sel=R.get_selected_items();
var filt=E.get_filtered_items();
var _124=E.get_filtered_items();
var t=e.srcElement||e.target;
if(R.is_smpl_view()||filt.length==0){
return true;
}
if(R.is_inp(e)){
if(e.keyCode!=38&&e.keyCode!=40){
return true;
}else{
t.blur(e);
}
}
switch(e.keyCode||e.charCode){
case 46:
if(sel.length>=1){
E["delete_item"+(sel.length>1?"s":"")]();
return false;
}else{
return true;
}
break;
case 113:
if(sel.length==1){
E.rename_item();
return false;
}else{
return true;
}
break;
case 38:
case 40:
if(filt.length!=E.get_global_items().length){
return false;
}
var id=sel[sel.length-1]?sel[sel.length-1].id:(filt[0]&&filt[0].k?filt[0].k:0);
var _127=e.keyCode==38?1:-1;
var el=$("it"+id);
var _129=+id;
if(_127==1){
if(id>0&&!$("it"+(id-1))){
var prev=id;
for(var k in filt){
if(filt[k]["k"]==id){
break;
}
prev=filt[k]["k"];
}
id=prev;
}else{
if(id>0){
id-=_127;
}
}
}else{
if(id<_124.length-1&&!$("it"+(id-(-1)))){
var _12c=false,t=null;
for(var k in filt){
if(_12c){
id=filt[k]["k"];
break;
}
if(filt[k]["k"]==id){
_12c=true;
}
}
}else{
if(id<E.get_global_items().length-1){
id-=_127;
}
}
}
if(id==_129){
return;
}
if(R.is_selected(_124[id])||sel.length==2&&sel[0]==_124[id]){
id=_129;
}
$("it"+id).onmousedown(e);
return false;
break;
case 13:
var el;
if(sel.length==1&&(el=$("it"+sel[0]["id"]))){
el.ondblclick(e);
}
return false;
break;
case 8:
T.change_address("..");
return false;
break;
case 67:
case 99:
if(!e.ctrlKey||sel.length==0){
break;
}
E.copy_item();
break;
case 88:
case 120:
if(!e.ctrlKey||sel.length==0){
break;
}
E.cut_item();
break;
case 86:
case 118:
if(!e.ctrlKey){
break;
}
E.paste_items();
break;
case 65:
case 97:
case 2:
case 66:
if(!e.ctrlKey){
break;
}
var l=filt.length;
for(var k=0;k<l;k++){
R.cl($("it"+(filt[k]["k"]||k)),e,true);
}
E.draw_menu_for_items();
return false;
break;
}
return true;
};
T.in_menu=false;
T.LINK_OVER=false;
T.cm=T.context_menu=function(_12e,_12f){
var _130={};
var el=$("cm");
if(!el){
el=document.createElement("div");
el.id="cm";
el.className="cm";
el.onmouseover=function(){
T.in_menu=true;
};
el.onmouseout=function(){
T.in_menu=false;
};
document.body.appendChild(el);
}
if(el.style.display&&el.style.display!="none"){
return false;
}
var x=_12f.clientX+document.documentElement.scrollLeft+document.body.scrollLeft;
var y=_12f.clientY+document.documentElement.scrollTop+document.body.scrollTop;
var _134="<img src=\"f/i/no.png\" width=1 height=1 style=\"visibility: hidden;\">";
var tmp="<table cellspacing=0 cellpadding=0 border=0 id=\"__cmtable\"><tr height=\"2\"><td colspan=7>"+_134+"</td></tr>";
var _136=0,stl="";
for(var k in _12e){
if(_12e[k]=="space"){
tmp+="<tr height=\"10\"><td width=\"2\">"+_134+"</td><td valign=\"middle\" style=\"vertical-align: middle;\" colspan=\"4\"><img src=\"f/i/hr.png\" width=\"100%\" height=\"1\" border=0></td><td width=\"2\">"+_134+"</td></tr>";
}else{
if(_12e[k]["nested"]||_12e[k]["disabled"]){
_12e[k]["onclick"]="return false;";
}
if(_12e[k]["disabled"]){
stl="gray";
}else{
stl="black";
}
if(_12e[k]["nested"]){
_130[k]=_12e[k]["nested"];
}
val="<td width=\"16\" style=\"vertical-align: middle; align: center; text-align: center;\">"+(_12e[k]["icon"]?"<img src=\"f/i/"+_12e[k]["icon"]+".png\" width=13 height=13>":_134)+"</td><td><nobr>"+_12e[k]["value"]+"</nobr></td>"+("<td nowrap=\"nowrap\">&nbsp;&nbsp;&nbsp;"+(_12e[k]["hotkey"]||"")+"</td>")+"<td align=\"center\" style=\"align: center; text-align: center;\" width=\"18\">"+(_12e[k]["nested"]?"<img src=\"f/i/arrow.png\" width=18 height=16>":_134)+"</td>";
tmp+="<tr height=\"16\" onclick=\""+_12e[k]["onclick"]+";I.hide_cm();\" onmouseover=\"this.className='cm_"+stl+" cm_"+stl+"_hover';window.status=this.title;I.LINK_OVER=true;return true;\" onmouseout=\"this.className='cm_"+stl+"';window.status='';I.LINK_OVER=false;return true;\" title=\""+_12e[k]["title"]+"\"  class=\"cm_"+stl+"\"><td width=\"2\">"+_134+"</td>"+val+"<td width=\"2\">"+_134+"</td></tr>";
}
_136+=16;
if(_12e[k]=="space"){
_136-=6;
}
}
tmp+="<tr height=\"2\"><td colspan=7>"+_134+"</td></tr></table>";
el.innerHTML=tmp;
el.style.visibility="hidden";
el.style.display="block";
var _139=el.scrollHeight+30;
var _13a=el.scrollWidth+30;
if(_12f.clientY+_139>document.body.clientHeight){
y-=_139-24;
}else{
y+=2;
}
if(_12f.clientX+_13a>document.body.clientWidth){
x-=_13a-24;
}else{
x+=2;
}
el.style.left=x+"px";
el.style.top=y+"px";
el.style.visibility="hidden";
el.style.display="block";
L.opac(el);
_12f.returnValue=false;
return false;
};
T.hc=T.hide_cm=function(){
var el=$("cm");
if(!el){
return;
}
el.style.visibility="hidden";
el.style.display="none";
I.in_menu=false;
I.LINK_OVER=false;
};
T.dm=T.draw_menu=function(e){
var ecp={clientX:e.clientX,clientY:e.clientY,returnValue:false};
setTimeout(function(){
var g=R.gsi();
var _13f={};
if(!g.length){
_13f={0:{title:"Refresh filelist",onclick:"E.F5();",value:"<b>Refresh</b>",hotkey:"F5"},1:"space",2:{title:"Paste items here",onclick:"E.pi();",value:"Paste",disabled:!E.copied,hotkey:"Ctrl+V"},3:{title:"Cancel operation",onclick:"E.cc();",value:"Cancel "+E.op,disabled:!E.copied},4:"space",5:{title:"Create a file",onclick:"E.mkfile();",value:"Create a file"},6:{title:"Create a folder",onclick:"E.mkdir();",value:"Create a directory"},7:{title:"Open the shell emulator",onclick:"E.ot();",value:"Open terminal"},"7.5":"space",8:{title:"Properties of current directory",onclick:"E.sp();",value:"Properties",disabled:false}};
}else{
if(g.length>1){
_13f={0:{title:"Cut items",onclick:"E.cut_items();",value:"Cut",hotkey:"Ctrl+X"},1:{title:"Copy items",onclick:"E.copy_items();",value:"Copy",hotkey:"Ctrl+V"},2:{title:"Delete items without possibility to recover them",onclick:"E.delete_items();",value:"Delete",hotkey:"Delete"},3:{title:"Add items to .zip archive",onclick:"E.zip_items();",value:"Add to zip"},4:{title:"Change rights of items",onclick:"E.chmod_items();",value:"CHMOD"},"4.5":"space",5:{title:"Properties",onclick:"E.sp();",value:"Properties",disabled:false}};
}else{
if(g[0]["type"]==1){
_13f={"-2":{title:"Edit file or download it",onclick:"$('it"+g[0]["id"]+"').ondblclick(event);",value:"<b>Open</b>",hotkey:"Enter"},"-1":"space","-0.5":{title:"Rename file",onclick:"E.rename_item();",value:"Rename",hotkey:"F2"},0:{title:"Cut file",onclick:"E.cut_item();",value:"Cut",hotkey:"Ctrl+X"},1:{title:"Copy file",onclick:"E.copy_item();",value:"Copy",hotkey:"Ctrl+V"},2:{title:"Delete file without possibility to recover them",onclick:"E.delete_item();",value:"Delete",hotkey:"Delete"},3:{title:"Add file to .zip archive",onclick:"E.zip_item();",value:"Add to zip"},4:{title:"Change rights of file",onclick:"E.chmod_item();",value:"CHMOD"},5:{title:"Download file",onclick:"E.download_file();",value:"Download"},"5.5":"space",6:{title:"Properties",onclick:"E.sp();",value:"Properties",disabled:false}};
}else{
if(g[0]["type"]==0){
_13f={"-2":{title:"Open directory",onclick:"$('it"+g[0]["id"]+"').ondblclick(event);",value:"<b>Open</b>",hotkey:"Enter"},"-1":"space","-0.5":{title:"Rename dir",onclick:"E.rename_item();",value:"Rename",hotkey:"F2"},0:{title:"Cut dir",onclick:"E.cut_item();",value:"Cut",hotkey:"Ctrl+X"},1:{title:"Copy dir",onclick:"E.copy_item();",value:"Copy",hotkey:"Ctrl+V"},2:{title:"Delete dir without possibility to recover them",onclick:"E.delete_item();",value:"Delete",hotkey:"Delete"},3:{title:"Add dir to .zip archive",onclick:"E.zip_item();",value:"Add to zip"},4:{title:"Change rights of dir",onclick:"E.chmod_item();",value:"CHMOD"},"4.5":"space",5:{title:"Properties",onclick:"E.sp();",value:"Properties",disabled:false}};
}
}
}
}
I.context_menu(_13f,ecp);
},30);
return false;
};
};
window.Interface=(window.I=new InterfaceClass());
function $(id){
return document.getElementById(id);
}
function $set(id,_142){
return $(id).innerHTML=_142;
}
var DolphinClass=function(){
var T=this;
var req=false;
T.abort=function(){
req.abort();
E.cancel_draw();
I.show_loading(false);
};
T.qr=function(addr,data,_147,_148,text){
var _14a;
if(typeof (_148)==typeof (_14a)){
var _148=true;
}
I.show_loading(true,text);
E.cancel_draw();
var beg=(new Date()).getTime();
var r=new JsHttpRequest();
req=r;
r.onerror=function(msg){
I.show_loading(false,text);
if(r.aborted){
return;
}
if(msg.length>100){
msg=msg.substr(0,100)+"...";
}
if(r.status){
switch(r.status){
case 500:
msg="Internal server error";
break;
case 503:
case 502:
msg="The server is temporarily busy";
break;
case 404:
alert("AJAX request failed because of 404 error (Not Found). Please ensure, that Dolphin.php is installed properly.");
return false;
case 403:
alert("AJAX request failed because of 403 error (Permission denied). Please ensure, that you have set correct rights to PHP files.");
return false;
}
}
if(confirm("AJAX subrequest failed.\nThe technical reason: "+msg+"\n\nDo you want to send that request again?")){
T.qr(addr,data,_147,_148);
}
};
r.onreadystatechange=function(){
if(r.readyState==4){
var time=Math.round(((new Date()).getTime()-beg)*1000)/1000000;
I.show_loading(false,text);
if(r.responseText!="--error-login-required"){
try{
_147(r.responseJS,r.aborted?"action aborted":r.responseText);
}
catch(e){
}
}else{
if(confirm("Session has expired, relogin required.\nDo you want to relogin now?")){
T.qr("index.php",{login:prompt("login:"),pass:prompt("password:"),"DIR":Engine.address},function(res,err){
T.qr(addr,data,_147,_148);
});
}
}
var _151=Math.round(((new Date()).getTime()-beg)*1000)/1000000;
}
};
r.caching=!_148;
r.open(null,addr,true);
r.send(data);
};
T.init=function(){
if($("load_screen")){
document.body.removeChild($("load_screen"));
}
T.resize(true);
if(window.interv){
clearInterval(window.interv);
window.interv=null;
}
};
T.resize=function(){
I.resize();
};
var _152=false;
T.pingpong=function(){
T.qr("index.php?act=ping","ping",function(res,err){
if(res!="pong"&&!_152){
alert("PING-PONG request to server failed. Please check your internet connection.");
_152=true;
}else{
if(res=="pong"){
_152=false;
}
}
},true,"server ping");
};
var _res=[];
var _156=[];
var _157={};
var _up=false;
T.ggr=function(){
return _res;
};
T.ggm=function(){
return _157;
};
T.ggs=function(){
return _156;
};
T.cgu=function(){
return _up!=false;
};
var _159=false;
T.go2=function(_15a,_15b,page,_15d){
if(!_15d&&(!_15b||L._search_str==L._search_str_default)){
L._search_str="";
}
E.rf(_15a,{pagemin:page||1,pagemax:page?page+4:4,filt:L._search_str,sort:E.sort,order:E.order,perpage:E.perpage,fast:E.fast?1:0},function(res,err){
if(res&&res["res"]&&!res["error"]){
if(!_15b){
E.add_to_history(res["DIR"]);
}
_res=res["res"];
_up=res["up"];
_157={0:"fsearch",1:"common",2:res["info"]};
E.address=res["DIR"];
E.page=page?Math.min(page,_res["pages_num"]):1;
R.df();
L.draw(_157);
I.change_path(res["DIR"],res["dir"],res["type"]);
I.change_status(_156=[["Total items",_res["items_num"]],["Generation time",res["stats"]["seconds"]+"sec"]]);
I.disable_buttons();
var _160=$("fsearch");
if(_160&&_160.focus){
_160.focus();
}
_159=false;
if(err){
alert(err);
}
}else{
if(!_159){
_159=true;
alert("Could not change directory "+res["reason"]);
if(err){
alert(err);
}
if(!res["stop"]){
T.go2(res["dir"],true);
}
}
}
});
};
T.cs=T.change_sort=function(sort){
E.sort=sort;
E.F5();
};
T.co=T.change_order=function(_162){
E.order=_162;
E.F5();
};
T.cf=T.change_fast=function(){
E.fast=!E.fast;
E.F5();
};
var _163=false;
T.cp=T.change_page=function(page){
var _165=false;
var _166=function(){
E.page=page;
R.df();
if(L._search_str==L._search_str_default){
L.draw(_157);
}
_165=true;
};
if(_res&&_res["pages"]&&_res["pages"][page]){
_166();
}
if(_163){
T.abort();
}
_163=true;
E.rf(E.address,{pagemin:Math.max(1,page-2),pagemax:page+2,filt:L._search_str==L._search_str_default?"":L._search_str,sort:E.sort,order:E.order,perpage:E.perpage,fast:E.fast?1:0},function(res,err){
_163=false;
if(res&&_res["items_num"]!=res["res"]["items_num"]){
_res=res["res"];
_166();
}else{
if(res&&res["res"]&&res["res"]["pages"]){
res=res["res"]["pages"];
for(var k in res){
_res["pages"][k]=res[k];
}
if(!_165){
_166();
}
}
}
});
};
T.pu=T.perform_update=function(){
if(!confirm("Check for newer version?")){
return;
}
D.qr("http://dolphin-php.org/"+"build-info/",{},function(res,err){
if(!res){
alert("Could not contact http://dolphin-php.org/.");
}else{
if(res==88){
alert("No new version available");
}else{
if(res<88){
alert("You have a newer version, than on a server :).");
}else{
if(confirm("New version ("+res+" build) is available.\nInstall it?")){
E.run_update();
}
}
}
}
},true,"contacting http://dolphin-php.org/");
};
T.ou=T.open_uploads=function(){
I.window_open("f/swfupload/","uploads",450,350);
};
T.show_pages=function(_16c,_16d,_16e,link){
if(!_16d){
_16d=E.page;
}
if(_16c==0){
_16e(1);
}else{
if(_16c<9){
for(var l=1;l<=_16c;l++){
if(l==_16d){
_16e(l);
}else{
link(l);
}
}
}else{
if(E.page<4){
for(var l=1;l<=E.page+2;l++){
if(l==_16d){
_16e(l);
}else{
link(l);
}
}
link(_16d+4,"...");
link(_16c-2);
link(_16c-1);
link(_16c);
}else{
if((_16c-_16d)<4){
link(1);
link(2);
link(3);
link(_16d-4,"...");
for(var l=_16d-2;l<=_16c;l++){
if(l==_16d){
_16e(l);
}else{
link(l);
}
}
}else{
link(1);
link(_16d-4,"...");
for(var l=_16d-2;l<=_16d+2;l++){
if(l==_16d){
_16e(l);
}else{
link(l);
}
}
link(_16d+4,"...");
link(_16c);
}
}
}
}
};
};
window.Dolphin=(window.D=new DolphinClass());
function JsHttpRequest(){
var t=this;
t.onreadystatechange=null;
t.readyState=0;
t.responseText=null;
t.responseXML=null;
t.status=200;
t.statusText="OK";
t.responseJS=null;
t.aborted=false;
t.caching=false;
t.loader=null;
t.session_name="PHPSESSID";
t._ldObj=null;
t._reqHeaders=[];
t._openArgs=null;
t._errors={inv_form_el:"Invalid FORM element detected: name=%, tag=%",must_be_single_el:"If used, <form> must be a single HTML element in the list.",js_invalid:"JavaScript code generated by backend is invalid!\n%",url_too_long:"Cannot use so long query with GET request (URL is larger than % bytes)",unk_loader:"Unknown loader: %",no_loaders:"No loaders registered at all, please check JsHttpRequest.LOADERS array",no_loader_matched:"Cannot find a loader which may process the request. Notices are:\n%"};
t.abort=function(){
with(this){
t.aborted=true;
if(_ldObj&&_ldObj.abort){
_ldObj.abort();
}
_cleanup();
if(readyState==0){
return;
}
if(readyState==1&&!_ldObj){
readyState=0;
return;
}
_changeReadyState(4,true);
}
};
t.open=function(_172,url,_174,_175,_176){
with(this){
if(url.match(/^((\w+)\.)?(GET|POST)\s+(.*)/i)){
this.loader=RegExp.$2?RegExp.$2:null;
_172=RegExp.$3;
url=RegExp.$4;
}
try{
if(document.location.search.match(new RegExp("[&?]"+session_name+"=([^&?]*)"))||document.cookie.match(new RegExp("(?:;|^)\\s*"+session_name+"=([^;]*)"))){
url+=(url.indexOf("?")>=0?"&":"?")+session_name+"="+this.escape(RegExp.$1);
}
}
catch(e){
}
_openArgs={method:(_172||"").toUpperCase(),url:url,asyncFlag:_174,username:_175!=null?_175:"",password:_176!=null?_176:""};
_ldObj=null;
_changeReadyState(1,true);
return true;
}
};
t.send=function(_177){
if(!this.readyState){
return;
}
this._changeReadyState(1,true);
this._ldObj=null;
var _178=[];
var _179=[];
if(!this._hash2query(_177,null,_178,_179)){
return;
}
var hash=null;
if(this.caching&&!_179.length){
hash=this._openArgs.username+":"+this._openArgs.password+"@"+this._openArgs.url+"|"+_178+"#"+this._openArgs.method;
var _17b=JsHttpRequest.CACHE[hash];
if(_17b){
this._dataReady(_17b[0],_17b[1]);
return false;
}
}
var _17c=(this.loader||"").toLowerCase();
if(_17c&&!JsHttpRequest.LOADERS[_17c]){
return this._error("unk_loader",_17c);
}
var _17d=[];
var lds=JsHttpRequest.LOADERS;
for(var _17f in lds){
var ldr=lds[_17f].loader;
if(!ldr){
continue;
}
if(_17c&&_17f!=_17c){
continue;
}
var _181=new ldr(this);
JsHttpRequest.extend(_181,this._openArgs);
JsHttpRequest.extend(_181,{queryText:_178.join("&"),queryElem:_179,id:(new Date().getTime())+""+JsHttpRequest.COUNT++,hash:hash,span:null});
var _182=_181.load();
if(!_182){
this._ldObj=_181;
JsHttpRequest.PENDING[_181.id]=this;
return true;
}
if(!_17c){
_17d[_17d.length]="- "+_17f.toUpperCase()+": "+this._l(_182);
}else{
return this._error(_182);
}
}
return _17f?this._error("no_loader_matched",_17d.join("\n")):this._error("no_loaders");
};
t.getAllResponseHeaders=function(){
with(this){
return _ldObj&&_ldObj.getAllResponseHeaders?_ldObj.getAllResponseHeaders():[];
}
};
t.getResponseHeader=function(_183){
with(this){
return _ldObj&&_ldObj.getResponseHeader?_ldObj.getResponseHeader(_183):null;
}
};
t.setRequestHeader=function(_184,_185){
with(this){
_reqHeaders[_reqHeaders.length]=[_184,_185];
}
};
t._dataReady=function(text,js){
with(this){
if(caching&&_ldObj){
JsHttpRequest.CACHE[_ldObj.hash]=[text,js];
}
responseText=responseXML=text;
responseJS=js;
if(js!==null){
status=200;
statusText="OK";
}else{
status=500;
statusText="Internal Server Error";
}
_changeReadyState(2);
_changeReadyState(3);
_changeReadyState(4);
_cleanup();
}
};
t._l=function(args){
var i=0,p=0,msg=this._errors[args[0]];
while((p=msg.indexOf("%",p))>=0){
var a=args[++i]+"";
msg=msg.substring(0,p)+a+msg.substring(p+1,msg.length);
p+=1+a.length;
}
return msg;
};
t._error=function(msg){
msg=this._l(typeof (msg)=="string"?arguments:msg);
msg="JsHttpRequest: "+msg;
if(t.onerror){
return t.onerror(msg);
}
if(!window.Error){
throw msg;
}else{
if((new Error(1,"test")).description=="test"){
throw new Error(1,msg);
}else{
throw new Error(msg);
}
}
};
t._hash2query=function(_18e,_18f,_190,_191){
if(_18f==null){
_18f="";
}
if((""+typeof (_18e)).toLowerCase()=="object"){
var _192=false;
if(_18e&&_18e.parentNode&&_18e.parentNode.appendChild&&_18e.tagName&&_18e.tagName.toUpperCase()=="FORM"){
_18e={form:_18e};
}
for(var k in _18e){
var v=_18e[k];
if(v instanceof Function){
continue;
}
var _195=_18f?_18f+"["+this.escape(k)+"]":this.escape(k);
var _196=v&&v.parentNode&&v.parentNode.appendChild&&v.tagName;
if(_196){
var tn=v.tagName.toUpperCase();
if(tn=="FORM"){
_192=true;
}else{
if(tn=="INPUT"||tn=="TEXTAREA"||tn=="SELECT"){
}else{
return this._error("inv_form_el",(v.name||""),v.tagName);
}
}
_191[_191.length]={name:_195,e:v};
}else{
if(v instanceof Object){
this._hash2query(v,_195,_190,_191);
}else{
if(v===null){
continue;
}
if(v===true){
v=1;
}
if(v===false){
v="";
}
_190[_190.length]=_195+"="+this.escape(""+v);
}
}
if(_192&&_191.length>1){
return this._error("must_be_single_el");
}
}
}else{
_190[_190.length]=_18e;
}
return true;
};
t._cleanup=function(){
var _198=this._ldObj;
if(!_198){
return;
}
JsHttpRequest.PENDING[_198.id]=false;
var span=_198.span;
if(!span){
return;
}
_198.span=null;
var _19a=function(){
span.parentNode.removeChild(span);
};
JsHttpRequest.setTimeout(_19a,50);
};
t._changeReadyState=function(s,_19c){
with(this){
if(_19c){
status=statusText=responseJS=null;
responseText="";
}
readyState=s;
if(onreadystatechange){
onreadystatechange();
}
}
};
t.escape=function(s){
return escape(s).replace(new RegExp("\\+","g"),"%2B");
};
}
JsHttpRequest.COUNT=0;
JsHttpRequest.MAX_URL_LEN=2000;
JsHttpRequest.CACHE={};
JsHttpRequest.PENDING={};
JsHttpRequest.LOADERS={};
JsHttpRequest._dummy=function(){
};
JsHttpRequest.TIMEOUTS={s:window.setTimeout,c:window.clearTimeout};
JsHttpRequest.setTimeout=function(func,dt){
window.JsHttpRequest_tmp=JsHttpRequest.TIMEOUTS.s;
if(typeof (func)=="string"){
id=window.JsHttpRequest_tmp(func,dt);
}else{
var id=null;
var _1a1=function(){
func();
delete JsHttpRequest.TIMEOUTS[id];
};
id=window.JsHttpRequest_tmp(_1a1,dt);
JsHttpRequest.TIMEOUTS[id]=_1a1;
}
window.JsHttpRequest_tmp=null;
return id;
};
JsHttpRequest.clearTimeout=function(id){
window.JsHttpRequest_tmp=JsHttpRequest.TIMEOUTS.c;
delete JsHttpRequest.TIMEOUTS[id];
var r=window.JsHttpRequest_tmp(id);
window.JsHttpRequest_tmp=null;
return r;
};
JsHttpRequest.query=function(url,_1a5,_1a6,_1a7){
var req=new this();
req.caching=!_1a7;
req.onreadystatechange=function(){
if(req.readyState==4){
_1a6(req.responseJS,req.responseText);
}
};
req.open(null,url,true);
req.send(_1a5);
};
JsHttpRequest.dataReady=function(d){
var th=this.PENDING[d.id];
delete this.PENDING[d.id];
if(th){
th._dataReady(d.text,d.js);
}else{
if(th!==false){
throw "dataReady(): unknown pending id: "+d.id;
}
}
};
JsHttpRequest.extend=function(dest,src){
for(var k in src){
dest[k]=src[k];
}
};
JsHttpRequest.LOADERS.xml={loader:function(req){
JsHttpRequest.extend(req._errors,{xml_no:"Cannot use XMLHttpRequest or ActiveX loader: not supported",xml_no_diffdom:"Cannot use XMLHttpRequest to load data from different domain %",xml_no_headers:"Cannot use XMLHttpRequest loader or ActiveX loader, POST method: headers setting is not supported, needed to work with encodings correctly",xml_no_form_upl:"Cannot use XMLHttpRequest loader: direct form elements using and uploading are not implemented"});
this.load=function(){
if(this.queryElem.length){
return ["xml_no_form_upl"];
}
if(this.url.match(new RegExp("^([a-z]+://[^\\/]+)(.*)","i"))){
if(RegExp.$1.toLowerCase()!=document.location.protocol+"//"+document.location.hostname.toLowerCase()){
return ["xml_no_diffdom",RegExp.$1];
}
}
var xr=null;
if(window.XMLHttpRequest){
try{
xr=new XMLHttpRequest();
}
catch(e){
}
}else{
if(window.ActiveXObject){
try{
xr=new ActiveXObject("Microsoft.XMLHTTP");
}
catch(e){
}
if(!xr){
try{
xr=new ActiveXObject("Msxml2.XMLHTTP");
}
catch(e){
}
}
}
}
if(!xr){
return ["xml_no"];
}
var _1b0=window.ActiveXObject||xr.setRequestHeader;
if(!this.method){
this.method=_1b0&&this.queryText.length?"POST":"GET";
}
if(this.method=="GET"){
if(this.queryText){
this.url+=(this.url.indexOf("?")>=0?"&":"?")+this.queryText;
}
this.queryText="";
if(this.url.length>JsHttpRequest.MAX_URL_LEN){
return ["url_too_long",JsHttpRequest.MAX_URL_LEN];
}
}else{
if(this.method=="POST"&&!_1b0){
return ["xml_no_headers"];
}
}
this.url+=(this.url.indexOf("?")>=0?"&":"?")+"JsHttpRequest="+(req.caching?"0":this.id)+"-xml";
var id=this.id;
xr.onreadystatechange=function(){
if(xr.readyState!=4){
return;
}
xr.onreadystatechange=JsHttpRequest._dummy;
req.status=null;
try{
req.status=xr.status;
req.responseText=xr.responseText;
}
catch(e){
}
if(!req.status){
return;
}
try{
eval("JsHttpRequest._tmp = function(id) { var d = "+req.responseText+"; d.id = id; JsHttpRequest.dataReady(d); }");
}
catch(e){
return req._error("js_invalid",req.responseText);
}
JsHttpRequest._tmp(id);
JsHttpRequest._tmp=null;
};
xr.open(this.method,this.url,true,this.username,this.password);
if(_1b0){
for(var i=0;i<req._reqHeaders.length;i++){
xr.setRequestHeader(req._reqHeaders[i][0],req._reqHeaders[i][1]);
}
xr.setRequestHeader("Content-Type","application/octet-stream");
}
xr.send(this.queryText);
this.span=null;
this.xr=xr;
return null;
};
this.getAllResponseHeaders=function(){
return this.xr.getAllResponseHeaders();
};
this.getResponseHeader=function(_1b3){
return this.xr.getResponseHeader(_1b3);
};
this.abort=function(){
this.xr.abort();
this.xr=null;
};
}};
JsHttpRequest.LOADERS.script={loader:function(req){
JsHttpRequest.extend(req._errors,{script_only_get:"Cannot use SCRIPT loader: it supports only GET method",script_no_form:"Cannot use SCRIPT loader: direct form elements using and uploading are not implemented"});
this.load=function(){
if(this.queryText){
this.url+=(this.url.indexOf("?")>=0?"&":"?")+this.queryText;
}
this.url+=(this.url.indexOf("?")>=0?"&":"?")+"JsHttpRequest="+this.id+"-"+"script";
this.queryText="";
if(!this.method){
this.method="GET";
}
if(this.method!=="GET"){
return ["script_only_get"];
}
if(this.queryElem.length){
return ["script_no_form"];
}
if(this.url.length>JsHttpRequest.MAX_URL_LEN){
return ["url_too_long",JsHttpRequest.MAX_URL_LEN];
}
var th=this,d=document,s=null,b=d.body;
if(!window.opera){
this.span=s=d.createElement("SCRIPT");
var _1b9=function(){
s.language="JavaScript";
if(s.setAttribute){
s.setAttribute("src",th.url);
}else{
s.src=th.url;
}
b.insertBefore(s,b.lastChild);
};
}else{
this.span=s=d.createElement("SPAN");
s.style.display="none";
b.insertBefore(s,b.lastChild);
s.innerHTML="Workaround for IE.<s"+"cript></"+"script>";
var _1b9=function(){
s=s.getElementsByTagName("SCRIPT")[0];
s.language="JavaScript";
if(s.setAttribute){
s.setAttribute("src",th.url);
}else{
s.src=th.url;
}
};
}
JsHttpRequest.setTimeout(_1b9,10);
return null;
};
}};

