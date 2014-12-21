var onDeviceReady = function () {
    intel.xdk.device.setRotateOrientation("portrait");
    intel.xdk.device.setAutoRotate(false);
    webRoot = intel.xdk.webRoot + "";
    $.ui.blockPageScroll();
};

document.addEventListener('intel.xdk.device.ready', onDeviceReady, false);
