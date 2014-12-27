function CheckNetwork(){
	intel.xdk.device.updateConnection();
	return false;
}

function spif_GetURL(url){
	var GetURL = spif_config.server.protocol
	.concat('://')
	.concat(spif_config.server.url)
	.concat(':')
	.concat(spif_config.server.port)
	.concat(url);
	return(GetURL);
}

function showModal2(ModalName){
	// 在AppFramework中存在bug，如果当前正在有一个Modal在显示，
	// 要显示另外一个Modal的时候则会发生重叠的情况，必须先hide
	// 旧的Modal，再show新的Modal才能正常显示
	if(nowModal == ''){
		$.ui.showModal(ModalName,'fade');
		nowModal = ModalName;
	}
	else if(ModalName != nowModal){
		$.ui.hideModal(nowModal,'fade');
		var showNewModalCommand = 
			'$.ui.showModal(\''.concat(ModalName).concat('\',\'fade\')');
		window.setTimeout(showNewModalCommand,500);
		nowModal = ModalName;
	}
}

function hideModal2(){
	$.ui.hideModal(nowModal,'fade');
	nowModal = '';
}

function P(text){
	console.log(text);
}

function LoginFailed(text){
	var dom_errorinfo = $('#spif_login_errorinfo');
	dom_errorinfo.text(text);
	dom_errorinfo.css('color','red');
}


// 异步加载Js
function loadJs(sid,jsurl,callback){
    var nodeHead = document.getElementsByTagName('head')[0];
    var nodeScript = null;
    if(document.getElementById(sid) == null){
        nodeScript = document.createElement('script');
        nodeScript.setAttribute('type', 'text/javascript');
        nodeScript.setAttribute('src', jsurl);
        nodeScript.setAttribute('id',sid);
        if (callback != null) {
            nodeScript.onload = nodeScript.onreadystatechange = function(){
                if (nodeScript.ready) {
                    return false;
                }
                if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
                    nodeScript.ready = true;
                    callback();
                }
            };
        }
        nodeHead.appendChild(nodeScript);
    } else {
        if(callback != null){
            callback();
        }
    }
}