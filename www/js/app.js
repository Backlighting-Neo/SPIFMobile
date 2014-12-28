document.addEventListener("intel.xdk.device.ready",function(){
    intel.xdk.device.setRotateOrientation("portrait");
    intel.xdk.device.setAutoRotate(false);
    intel.xdk.device.hideSplashScreen();   
},false);   

$.ui.ready(function(){
	//$.ui.toggleNavMenu();
	
	$('#spif_scanqrcode').click(function(){
		intel.xdk.device.scanBarcode();
	})

	$('#spif_button_wheretofindqrcode').click(function(){
		$.ui.popup( {
		   title:"二维码",
		   message:"<img src='image/Wheretofindmyqrcode.png' alt='' width='100%'><div class='content align-center'>请先在您的电脑上登陆SPIF后<br>在右下方点击“手机登陆”按钮</div>",
		   cancelText:"知道了",
		   cancelOnly:true
		 });
	})

	document.addEventListener('intel.xdk.device.barcode.scan',function(evt){
		if(evt.success){
            var QrCodeInfo = evt.codedata;

            if(/(Backlighting)(=)(\d+)/.test(QrCodeInfo)) {
            	//$.ui.showMask('正在获取密钥');
            	QrCodeInfo = QrCodeInfo.replace('Backlighting=','');
            	$.ajax({
				    type:"GET",
				    url:spif_GetURL(spif_config.qrcodeinfo.url),
				    data:{ItemID:QrCodeInfo},
				    success:function(data){
				    	// 拉取到密钥
				    	spif_config.MobileAccessToekn = data;
    	            	$.ajax({
    					    type:"GET",
    					    url:spif_GetURL(spif_config.interface.url),
    					    data:{c_cmd:'ValidateToken',UserToken:spif_config.MobileAccessToekn},
    					    success:function(data){
    					    	//TODO:验证ValidateToken
    					    	//$.ui.hideMask();
    					    	if(data=='OK') {
    					    		hideModal2();
    					    		$.ui.toggleNavMenu();
    					    		$.ui.loadContent('spif_panel_home',false,false,'fade');
    					    		spif_Logined();  //登陆后调用
    					    	}
    					    	else {
    					    		spif_config.MobileAccessToekn = '';
    					    		LoginFailed('您的密钥已过期，请重新扫描');
    					    	}
    					    }
    					})
				    }
				})
            }
            else {
            	LoginFailed('您扫描的二维码不正确，请重新扫描');
            }
	    }
	    else{
	    	LoginFailed('没有扫描到您的二维码，请重新扫描');
	    }
	},false);//BarCode Scan

	document.addEventListener("intel.xdk.device.connection.update",function(){
		if(intel.xdk.device.connection=='wifi'||intel.xdk.device.connection=='cell'){
			if(!islogin){    //Have a Network Connection
				showModal2('spif_panel_login');
				islogin = false;	//Toggle IsLogin
			}
		}
		else{    //No Network Connection
			showModal2('spif_panel_noconnection');	//Show NoConnection UI
		}
	},false);//Network Check

	$('#spif_button_tryagain').click(CheckNetwork);

	CheckNetwork();//Check the network

});

function spif_Logined(){
	//TODO:登陆成功之后要干的事情,UI已处理完成，只需要初始化调用等

	//拉取用户数据
	loadJs('setUserInfo',spif_GetURL(spif_config.setUserInfo.url),function(){
		//TODO:填充用户数据
		$('spif_username').text(SessionUsername);
		$('spif_expdate').text('有效期 '+SessionValidateDate);
		$('spif_point').text('点券 '+SessionPoint);
		
	})
}