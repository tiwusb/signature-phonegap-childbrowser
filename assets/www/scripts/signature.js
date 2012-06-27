function onDeviceReadyChildBrowser() {

    // var testValue = 0;
    // no need for Android ;

    /*XXX attention ; for IOS and Winphone ; it could be necessary to do things like that :
     cb = ChildBrowser.install();
     if(cb != null) {
     cb.onLocationChange = function(loc) {
     root.locChanged(loc);
     };
     cb.onClose = function() {
     root.onCloseBrowser();
     };
     cb.onOpenExternal = function() {
     root.onOpenExternal();
     };

     }
     cb is returned as window.plugin.childBrowser

     */
    path = String(getInternalAddress("signature.html"));
    console.log("-------->" + path);

    window.plugins.childBrowser.showWebPage(path, {
        showLocationBar : false
    });

    window.plugins.childBrowser.onLocationChange = function(loc) {
        // A hack for the childbrowser , because we simply want the cb to do
        // the signature functionality , so it could be more user friendly not let the user feels they're using a webview
        // logic  :
        /*
         * button finishSignature
         * -->
         * change url  in child browser
         * -->
         * catch the change in parent browser
         * -->
         * close child browser
         */
        // jump into cb 
        if(loc == "file:///android_asset/www/signature.html") {
            // address we want 
            console.log("we now in the child browser with url  -- >" + loc);

        } else {
            
            // cb changed URL , it means web logic is done , we close cb
            window.plugins.childBrowser.close();

        }

    };

    window.plugins.childBrowser.onClose = function() {
        /*
        * a hook for do some stuff with onClose , but be aware of the non-blocking operations
        * about javascript and Jquery
        *
        *
        *
        *
        *
        *
        *
        */
        //do something
        //console.log("testValue " + testValue);
    };

    //console.log("testValue " + testValue);
}


/**
 * get internal file path directing to the signature page
 *
 * @param URL  the URL to load
 * @return path the absolute path for internal URL
 */
function getInternalAddress(URL) {
    var strPath = window.location.href;
    var path = strPath.substr(0, strPath.lastIndexOf('/')) + "/" + URL;
    return path;

}