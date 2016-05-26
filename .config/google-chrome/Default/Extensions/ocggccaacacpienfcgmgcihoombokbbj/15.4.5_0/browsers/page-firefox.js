/*From /pages/options/js/common.js*/
function PGS_addOptionsListener(){
    //console.log("PGS_addOptionsListener() - ok");
    
    window.addEventListener("addon-message", function(event) {//"addon message" or other name ???
        //console.log("******   PGS_addOptionsListener   ******");
        
        var message = event.detail;
        
        if(typeof (message) != "undefined") {
            if(message.command == "themeSendBackgroundVideoToPage") // download video theme complete
                displayLoadedBackgroundVideoTheme(message);
            else if(message.command == "changeStaticBackgroundToOptionsPage") // change static content
                changeStaticBackgroundToOptionsPage(message);
            else if(message.command == "changeLiveBackgroundToOptionsPage") // change video content resolution
                changeLiveBackgroundToOptionsPage(message);
            else if(message.command == "changeFlixerBackgroundToOptionsPage") // change flixer video content
                changeFlixerBackgroundToOptionsPage(message);
            else if(message.command == "changeBackgroundImageFileProgressToPage") // change video content progress
                changeBackgroundImageFileProgress(message);
            else if(message.command == "changeBackgroundFlixerVideoFileProgressToPage") // change flixer video content progress
                changeBackgroundFlixerVideoFileProgressToPage(message);
            else if(message.command == "videoThemeSendDownloadProgressToPage" || message.command == "changeBackgroundVideoFileProgressToPage") // change video theme progress
                changeBackgroundVideoFileProgress(message);
            else if(message.command == "changeBackgroundImageFileErrorToPage") // change video content error
                changeBackgroundImageFileError(message);
            else if(message.command == "changeBackgroundFlixerVideoFileErrorToPage") // change flixer video content error
                changeBackgroundFlixerVideoFileErrorToPage(message);
            else if(message.command == "videoThemeSendDownloadErrorToPage" || message.command == "changeBackgroundVideoFileErrorToPage") // download video theme error
                changeBackgroundVideoFileError(message);
            else if(message.command == "availableContentDownloadError")
                getAvailableContentError(message);
            else if(message.command == "loadMoreLixerContentEnd")
                displayLoadedFlixerContent(message);
            else if(message.command == "removeOptionsContentFavoriteMark")
                removeContentFavoriteMark(message);
            else{
                //console.log("******   PGS_addOptionsListener (unknown)  >>> ");
                //console.log(message);
            }
        }
    }); 
}//PGS_addOptionsListener

/*From /pages/newtab/js/page.js*/
function PGS_addNewtabListener(){
//console.log("PGS_addNewtabListener() - ok");
    
    window.addEventListener("addon-message", function(event) {//"addon message" or other name ???
        //console.log("******   PGS_addNewtabListener   ******");
        
        var message = event.detail;    
    
        if(typeof (message) != "undefined") {
            if(message.command == "tileThumbLoadComplete") // speed dial each tile load complete
                displayLoadedTileThumbImage(message);
            else if(message.command == "tilesThumbsLoadEnd") // speed dial all tiles load end
                displayNotLoadedTilesThumbImages();
            else if(message.command == "themeSendBackgroundToPage") // download image theme complete
                displayLoadedBackgroundImageTheme(message);
            else if(message.command == "sendVideoThemeOfferToPage") { // download video theme offer
                checkPageDisplayVideoThemeOffer(message);
            } else if(message.command == "themeSendBackgroundVideoToPage") // download video theme complete
                displayLoadedBackgroundVideoTheme(message);
            else if(message.command == "videoThemeSendDownloadProgressToPage") // download video theme progress
                displayLoadingVideoThemeProgress(message);
            else if(message.command == "videoThemeSendDownloadErrorToPage") // download video theme error
                displayLoadingVideoThemeError(message);
            else if(message.command == "imageThemeSendDownloadProgressToPage") // download image theme progress
                displayLoadingImageThemeProgress(message);
            else if(message.command == "imageThemeSendDownloadErrorToPage") // download image theme error
                displayLoadingImageThemeError(message);
            else if(message.command == "hideThemeVideoDownloadOffer") // hide download video theme offer when theme change
                hideThemeVideoDownloadOffer(message);
            else if(message.command == "errorLoadGalleryThumb" || message.command == "errorLoadLiveThumb") // error show on load gallery or auto preview thumb problem
                errorLoadGalleryThumb(message);
        }
    });
}//PGS_addNewtabListener

/*From /pages/newtab/js/page.js*/
function PGS_getNewTabCurentTab(callback) {
    //console.log("***: - PGS_getNewTabCurentTab, just callback");
    callback();
}//PGS_getNewTabCurentTab

/*From /pages/options/js/settings.js*/
function PGS_getSettingsCurentTab(callback) {
    //console.log("***: - PGS_getSettingsCurentTab, just callback");
    callback();
}//PGS_getSettingsCurentTab









