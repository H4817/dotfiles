/**
 * Application common functionality
 */

    // CHROME ONLY >>
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
    // << CHROME ONLY 

    var appDB = null;
    var appPlatform = navigator.platform.toLowerCase();
    var analyzeHistoryItemsCount = 4000;
    var displayTilesCount = 12;
    var maxDisplayTilesCount = 40;
    var maxTilesScreenBuiltTime = 60000 * 15; // 15 min
    var noTileImageFileName = "no-image.png";

    var themesSource = "http://parallaxnewtab.com/";
    var themesStatisticUrl = themesSource + "statistic/save/";
    var themeSourceInstallUrl = "https://chrome.google.com/webstore/detail/";
    var themesListApiUrl = themesSource + "api/getThemesAndTopComplexThemesSettings";
    var themesContentUrl = themesSource + "themes/";
    var themeConfigUrl = themesSource + "api/getThemeSettings?app=";
    var themeFileSystemDir = "themes";
    var themesApiCacheTime = 900000; // 15 min

    var downloadImageThemeStatus = false;
    var downloadVideoThemeStatus = false;

    var defaultThemeLiveBackgroundResolution = 1024;

    var defaultSearchFormOpacity = 0.65;
    var minSearchFormOpacity = 0.65;
    var maxSearchFormOpacity = 1;

    var defaultClockOpacity = 1;
    var minClockOpacity = 0.1;
    var maxClockOpacity = 1;

    var defaultClockBackgroundOpacity = 0.28;
    var minClockBackgroundOpacity = 0.1;
    var maxClockBackgroundOpacity = 1;

    var defaultBackgroundParallaxValue = 75;
    var minBackgroundParallaxValue = 1;
    var maxBackgroundParallaxValue = 100;

    var thumbFileSystemDir = "thumbs";
    var thumbFileMaxSize = 2097152; // 2 Mb

    var showDialTextThumb = 1;
    var showDialGalleryThumb = 2;
    var showDialScreenThumb = 3;

    var defaultDialsFormOpacity = 0.66;
    var minDialsFormOpacity = 0.15;
    var maxDialsFormOpacity = 1;

    var searchEngine = null;
    var googleSearchEngine = "https://google.com/search?q=";
    var yandexSearchEngine = "https://yandex.ru/search?text=";
    var redirectSearchEngine = "http://search.parallaxsearch.com/addon_search/?from=chrome_live_start_page&q=";
    
    var searchProviderLive = 1;
    var searchProviderYandex = 2;

    var appStoreUrlEn = "https://chrome.google.com/webstore/detail/live-start-page-living-wa/ocggccaacacpienfcgmgcihoombokbbj/reviews?hl=en-US&authuser=2";
    var appStoreUrlRu = "https://chrome.google.com/webstore/detail/live-start-page-living-wa/ocggccaacacpienfcgmgcihoombokbbj/reviews?hl=ru&authuser=2";

    var appRatingShowDelay = 172800000; // 2 days
    //var appRatingShowDelay = 20000; // 20 sec

    var openCurrentTab = 0;
    var openNewTab = 1;
    var openBackgroundTab = 2;

    var staticBackgroundType = 0;
    var liveBackgroundType = 1;
    var liveThemesType = 2;
    var flixelBackgroundType = 3;

    var flixelUrlSource = "http://flixel.com/";
    var flixeThemesApiSource = themesSource + "api/getComplexThemesSettings";
    var flixeFileSource = "https://flixels.s3.amazonaws.com/flixel/";
    var flixelDefaultPageSize = 30;
    var flixelApiMaxLoadPages = 100;

    var downloadedLiveBackgroundContent = {
        "id" : "juh8o6z8icha8uodbqcm",
        "title" : "Let's try another one...",
        "author" : "Oceanswave",
        "author_url" : flixelUrlSource + "oceanswave" + "/",
        "isFlixelContent" : true,
        "lastInstallBgVideo" : {
            "fileName" : "juh8o6z8icha8uodbqcm.hd.mp4",
            "resolution" : "1920"
        },
        "resolution" : 1920,
        "path" : "default-content/video",
        "fullHd" : 1,
        "handmade" : 0,
        "bgPoster" : getFlixelHdVideo("juh8o6z8icha8uodbqcm")
    };

    var defaultClockType = 3;
    var defaultClockItemColor = "#000000";
    var clockColorSchemeDefault = 0;
    var clockColorSchemeLight = 1;
    var clockColorSchemeDark = 2;

    var defaultClockBackgroundType = 0;
    var lightClockBackgroundType = 1;
    var darkClockBackgroundType = 2;
    var lightLongClockBackgroundType = 3;
    var darkLongClockBackgroundType = 4;

    var shareBasicUrl = "http://livestartpage.com/";

    var optionsHelpUrlEn = shareBasicUrl + "faq";
    var optionsHelpUrlRu = shareBasicUrl + "ru/faq";

    var optionsContactUrlEn = shareBasicUrl + "problem";
    var optionsContactUrlRu = shareBasicUrl + "ru/problem";

    var bookmarksShowUrl = shareBasicUrl + "images/bookmarks/";
    var restoreThemeShowUrl = shareBasicUrl + "images/restore-theme/";

    var dialsPopupScreenCoordinate = 100000;

    var locationWeatherSourceYahoo = "yahoo";
    var locationWeatherSourceYandex = "yandex";

    var locationWeatherCacheTime = 3600000; // 1 hour
    var locationWeatherRefreshTime = locationWeatherCacheTime;
    //var locationWeatherCacheTime = 20000; // 1 min
    //var locationWeatherRefreshTime = 20000; // 1 min

    var locationWeatherUnitFar = "c";
    var locationWeatherUnitCel = "f";

    var defaultWeatherOpacity = 1;
    var minWeatherOpacity = 0.1;
    var maxWeatherOpacity = 1;

    var defaultRelaxPanelOpacity = 0;
    var minRelaxPanelOpacity = 0;
    var maxRelaxPanelOpacity = 0.8;

    var defaultWeatherBackgroundOpacity = 0.4;
    var minWeatherBackgroundOpacity = 0.1;
    var maxWeatherBackgroundOpacity = 1;

    var defaultBottomPanelOpacity = 0.3;
    var minBottomPanelOpacity = 0.25;
    var maxBottomPanelOpacity = 1;

    var tileColorSchemes = setTilesColorSchemes();

    var speedDialThumbTypeText = 1;
    var speedDialThumbTypeGalleryText = 2;
    var speedDialThumbTypeAutopreviewText = 3;
    var speedDialThumbTypeGaleryAutoprevText = 4;

    var GROUP_POPULAR_ID = 10000000000000;
    var GROUP_TYPE_DEFAULT = 0;
    var GROUP_TYPE_USER = 1;
    var GROUP_TYPE_POPULAR = 2;
    var GROUP_DEFAULT_TITLE = "";
    var GROUP_POPULAR_TITLE = "";
    var GROUP_SORT_BY_ORDER = "group_selector_by_order";
    var GROUP_SORT_ADD_NEW_DIAL = "group_selector_new_dial";

    var DIALS_COLUMNS_COUNT = 4;

    var defaultUserCountry = "US";
    var COUNTRY_SEARCH_BY_DEFAULT = 0;
    var COUNTRY_SEARCH_BY_SERVICE = 1;
    var COUNTRY_SEARCH_BY_LANGUAGE = 2;

    var THEMES_SORT_NEWEST = 0;
    var THEMES_SORT_POPULAR = 1;
    var THEMES_SORT_FEATURED = 2;
    var THEMES_SORT_DOWNLOADED = 3;

    /**
     * Get toggle opacity speed
     *
     * @returns {number}
     */
    function getToggleOpacitySpeed() {
        return 800;
    }

    /**
     * Get display page speed
     *
     * @returns {number}
     */
    function getDisplayPageSpeed() {
        return 750;
    }

    /**
     * Get display dials speed
     *
     * @returns {number}
     */
    function getDisplayDialsSpeed() {
        return 150;
    }

    /**
     * Check thumb type exist
     *
     * @param thumbType String
     * @returns {boolean}
     */
    function checkThumbType(thumbType) {
        return thumbType == showDialTextThumb || thumbType == showDialGalleryThumb || thumbType == showDialScreenThumb;
    }

    /**
     * Get tile random color scheme
     *
     * @returns {*}
     */
    function getTileRandomColorScheme() {
        return tileColorSchemes[Math.floor(Math.random()*tileColorSchemes.length)];
    }

    /**
     * Get background video content type
     *
     * @returns {number}
     */
    function getBackgroundVideoContentType() {
        var contentType = parseInt(localStorage.getItem("background-video-content-type"));
        return !isNaN(contentType) && contentType == flixelBackgroundType ? flixelBackgroundType : liveBackgroundType;
    }

    /**
     * Get share url
     *
     * @returns {string}
     */
    function getShareUrl() {
        return shareBasicUrl;
    }

    /**
     * Get share ru url
     *
     * @returns {string}
     */
    function getShareRuUrl() {
        return shareBasicUrl + "ru/";
    }

    /**
     * Get feed back url
     *
     * @returns {string}
     */
    function getFeedBackUrl() {
        return shareBasicUrl + "feedback.php";
    }

    /**
     * Get redirect search url
     *
     * @param query String
     * @param engine String
     * @returns {string}
     */
    function getRedirectSearchUrl(query, engine) {
        var engineQuery = "";
        if(engine == searchProviderLive)
            engineQuery = "parallaxsearch";
        else if(engine == searchProviderYandex)
            engineQuery = "yandex";
        if(engineQuery)
            engineQuery = "&engine=" + engineQuery;
        return redirectSearchEngine + query + engineQuery;
    }

    /**
     * Get themes statistic url
     *
     * @param type Int
     * @param id String
     * @param resolution Int
     * @return {object}
     */
    function getThemeStatisticParams(type, id, resolution) {
        var params = {};
        params['type'] = type;
        params['id'] = id;
        params['resolution'] = resolution;
        return params;
    }

    /**
     * Convert flixel content to install content
     *
     * @param flixelThemeData Object
     * @returns {*}
     */
    function convertFlixelContentToInstallContent(flixelThemeData) {
        var flixelTheme = {};
            flixelTheme['id'] = flixelThemeData['hash'];
            flixelTheme['title'] = flixelThemeData['title'];
            flixelTheme['contentType'] = flixelBackgroundType;
            flixelTheme['bgFileThumb'] = flixelThemeData['thumbnail'];
            flixelTheme['bgVideoThumb'] = flixelThemeData['video_phone'];
            flixelTheme['bgVideoPath'] = {"1280" : flixelThemeData['video_tablet']};
            if(flixelThemeData['fullHd'])
                flixelTheme['bgVideoPath']["1920"] = flixelThemeData['video_hd'];

            flixelTheme['author'] = flixelThemeData['username'];
            flixelTheme['author_url'] = flixelThemeData['author_url'];
            flixelTheme['handmade'] = flixelThemeData.handmade ? true : false;
            flixelTheme['fullHd'] = flixelThemeData["fullHd"];
            
            flixelTheme['bgPoster'] = flixelThemeData['bgPoster'];
        return flixelTheme;
    }

    /**
     * Get flixel content current page
     *
     * @returns {Number}
     */
    function getFlixelContentCurrentPage() {
        var page = parseInt(localStorage.getItem("flixel-themes-current-page"));
        return !isNaN(page) && page ? page : 0;
    }

    /**
     * Get flixel content next page
     *
     * @returns {Number}
     */
    function getFlixelContentNextPage() {
        var page = getFlixelContentCurrentPage();
        return ++page;
    }

    /**
     * Check if background video is flixel content
     *
     * @returns {boolean}
     */
    function isBackgroundVideoFlixelContent() {
        return getBackgroundVideoContentType() == flixelBackgroundType;
    }

    /**
     * Get background video flixel content author
     */
    function getBackgroundVideoFlixelContentAuthor() {
        return localStorage.getItem("background-video-content-author");
    }

    /**
     * Get background video flixel content рфтвьфву
     */
    function getBackgroundVideoFlixelContentHandmade() {
        var value = parseInt(localStorage.getItem("background-video-content-hand"));
        return !isNaN(value) ? value : 0;
    }

    /**
     * Get background video flixel content author url
     *
     * @param author String
     * @return String
     */
    function getBackgroundVideoFlixelContentAuthorUrl(author) {
        var url = localStorage.getItem("background-video-content-author-url");
        var handmade = getBackgroundVideoFlixelContentHandmade();
        var result = "";
        if(handmade) {
            if(url)
                result = url;
        } else {
            if(author) {
                if(url)
                    result = url;
                else
                    result = getFlixelUserChanelUrl(author);
            }
        }
        return result;
    }

    /**
     * Get flixel chanel url
     *
     * @param page Number
     */
    function getFlixelChanelUrl(page) {
        var url = flixeThemesApiSource + "?tsort=" + getThemesSortType() + "&count=" + flixelDefaultPageSize;
        if(page && parseInt(page))
            url += "&page=" + page;
        
        return url;
    }


    /**
     * Get theme video thumb source
     *
     * @param videoId String
     * @returns {string}
     */
    function getThemeVideoThumb(videoId) {
        return themesContentUrl + videoId + "vthumb.mp4";
    }

    /**
     * Get flixel video thumb source
     *
     * @param videoId String
     * @returns {string}
     */
    function getFlixelVideoThumb(videoId) {
        return flixeFileSource + videoId + ".phone.mp4";
    }

    /**
     * Get theme video thumb source
     *
     * @param videoId String
     * @returns {string}
     */
    function getThemeFileThumb(videoId) {
        return themesContentUrl + videoId + "/" + "thumb.png?v=1";
    }

    /**
     * Get flixel video thumb source
     *
     * @param videoId String
     * @returns {string}
     */
    function getFlixelFileThumb(videoId) {
        return flixeFileSource + videoId + ".thumbnail.jpg?v=1";
    }

    /**
     * Get flixel author url
     *
     * @param author String
     * @returns {string}
     */
    function getFlixelUserChanelUrl(author) {
        return flixelUrlSource + author + "/";
    }

    /**
     * Get flixel hd video source
     *
     * @param videoId String
     * @returns {string}
     */
    function getFlixelHdVideo(videoId) {
        return flixeFileSource + getFlixelHdVideoFileName(videoId);
    }

    /**
     * Get theme hd video source
     *
     * @param videoId String
     * @returns {string}
     */
    function getThemeHdVideo(videoId) {
        return themesContentUrl + videoId + "/" + getThemeHdVideoFileName(videoId);
    }

    /**
     * Get flixel hd video source
     *
     * @param videoId String
     * @returns {string}
     */
    function getFlixelTabletVideo(videoId) {
        return flixeFileSource + getFlixelTabletVideoFileName(videoId);
    }

    /**
     * Get theme hd video source
     *
     * @param videoId String
     * @returns {string}
     */
    function getThemeTabletVideo(videoId) {
        return themesContentUrl + videoId + "/" + getThemeTabletVideoFileName(videoId);
    }

    /**
     * Get flixel hs video file name
     *
     * @param videoId String
     * @returns {string}
     */
    function getFlixelHdVideoFileName(videoId) {
        return videoId + ".hd.mp4";
    }

    /**
     * Get theme hs video file name
     *
     * @param videoId String
     * @returns {string}
     */
    function getThemeHdVideoFileName(videoId) {
        return "v1920bg.mp4";
    }

    /**
     * Get flixel tablet video file name
     *
     * @param videoId String
     * @returns {string}
     */
    function getFlixelTabletVideoFileName(videoId) {
        return videoId + ".tablet.mp4";
    }

    /**
     * Get theme tablet video file name
     *
     * @param videoId String
     * @returns {string}
     */
    function getThemeTabletVideoFileName(videoId) {
        return "v1024bg.mp4";
    }
    /**
     * Get welcome page state
     *
     * @return Bool
     */
    function getWelcomePageState() {
        var welcomeState = parseInt(localStorage.getItem("page-welcome-state"));
        return isNaN(welcomeState) ? 1 : welcomeState;
    }

    /**
     * Change welcome state
     */
    function changeWelcomePageState() {
        localStorage.setItem("page-welcome-state", 1);
    }

    /**
     * Get settings welcome page always hide state
     *
     * @return Bool
     */
    function getSettingsWelcomePageAlwaysHideState() {
        var welcomeHideState = parseInt(localStorage.getItem("settings-welcome-always-hide-state"));
        return !isNaN(welcomeHideState) &&  welcomeHideState;
    }

    /**
     * Get dials notice hide state
     *
     * @return Bool
     */
    function getDialsNoticeHideState() {
        var noticeDisplayState = parseInt(localStorage.getItem("page-dials-notice-always-hide-state"));
        return !isNaN(noticeDisplayState) &&  noticeDisplayState;
    }

    /**
     * Change dials notice hide state
     */
    function changeDialsNoticeHideState() {
        localStorage.setItem("page-dials-notice-always-hide-state", 1);
    }

    /**
     * Set settings welcome state
     *
     * @param state Int
     */
    function setSettingsWelcomePageAlwaysHideState(state) {
        localStorage.setItem("settings-welcome-always-hide-state", state ? 1 : 0);
    }

    /**
     * Get flixel total pages
     *
     * @return Int
     */
    function getFlixelTotalPagesCount() {
        var total = parseInt(localStorage.getItem("flixel-themes-total-pages"));
        return isNaN(total) ? flixelApiMaxLoadPages : total;
    }

    /**
     * Set flixel total pages
     *
     * @param count Int
     * @return Int
     */
    function setFlixelTotalPagesCount(count) {
        var total = parseInt(count) ? Math.ceil(count / flixelDefaultPageSize) : flixelApiMaxLoadPages;
        localStorage.setItem("flixel-themes-total-pages", total);
    }

    /**
     * Change settings welcome state
     */
    function changeSettingsWelcomePageState() {
        localStorage.setItem("settings-welcome-state", 1);
    }

    /**
     * Get settings welcome page state
     *
     * @return Bool
     */
    function getSettingsWelcomePageState() {
        var welcomeState = parseInt(localStorage.getItem("settings-welcome-state"));
        return !isNaN(welcomeState) &&  welcomeState;
    }

    /**
     * Set open dial type
     *
     * @param type Int
     */
    function setOpenDialType(type) {
        if(type == openCurrentTab || type == openNewTab || type == openBackgroundTab)
            localStorage.setItem("tiles-open-type", type);
    }

    /**
     * Get themes list api url
     *
     * @returns {string}
     */
    function getThemesListApiUrl() {
        return themesListApiUrl + "?tsort=" + getThemesSortType();
    }

    /**
     * Get open dial type
     *
     * @returns Int
     */
    function getOpenDialType() {
        var type = parseInt(localStorage.getItem("tiles-open-type"));
        return isNaN(type) ? openCurrentTab : type;
    }

    /**
     * Set share app status
     *
     * @param status Int
     */
    function setShareAppStatus(status) {
        localStorage.setItem("share-app-status", status ? 1 : 0);
    }

    /**
     * Get share app status
     *
     * @returns Int
     */
    function getShareAppStatus() {
        var status = parseInt(localStorage.getItem("share-app-status"));
        return isNaN(status) ? 0 : status;
    }

    /**
     * Set share ga event done
     */
    function setShareGaEventStatus() {
        localStorage.setItem("ga-share-status", 1);
    }

    /**
     * Get share ga event done
     *
     * @returns Int
     */
    function getShareGaEventStatus() {
        var status = parseInt(localStorage.getItem("ga-share-status"));
        return isNaN(status) ? 0 : status;
    }

    /**
     * Set settings value
     *
     * @param key String
     * @param val
     * @param callback Function
     */
    
    //m STAR
    /*Moved to browser choiser*/
    function setSettingsValue(key, val, callback) {
        BRW_setSettingsValue(key, val, callback);
    }

    /**
     * Get settings value
     *
     * @param key String
     * @param defaultValue
     * @param callback Function
     */
    /*Moved to browser choiser*/
    function getSettingsValue(key, defaultValue, callback) {
         BRW_getSettingsValue(key, defaultValue, callback);
    }

    /**
     * Set application rating
     *
     * @param val Number
     * @param callback Function
     */
    function setApplicationRating(val, callback) {
        val = parseInt(val);
        setSettingsValue("already-display-app-rating", val, callback);
    }

    /**
     * Get application rating
     *
     * @param callback Function
     */
    function getApplicationRating(callback) {
        getSettingsValue("already-display-app-rating", 0, callback);
    }

    /**
     * Set dials form opacity
     *
     * @param opacity
     */
    function setDialsFormOpacity(opacity) {
        if(opacity < minDialsFormOpacity)
            opacity = minDialsFormOpacity;
        else if(opacity > maxDialsFormOpacity)
            opacity = maxDialsFormOpacity;
        localStorage.setItem("dials-form-opacity", opacity);
    }

    /**
     * Get search form opacity
     */
    function getSearchFormOpacity() {
        var opacity = localStorage.getItem("search-form-opacity");
        return opacity && opacity > 0 ? opacity : defaultSearchFormOpacity;
    }

    /**
     * Get clock opacity
     */
    function getClockOpacity() {
        var opacity = localStorage.getItem("page-clock-opacity");
        return opacity && opacity > 0 ? opacity : defaultClockOpacity;
    }

    /**
     * Get clock background opacity
     */
    function getClockBackgroundOpacity() {
        var opacity = localStorage.getItem("page-clock-background-opacity");
        return opacity && opacity > 0 ? opacity : defaultClockBackgroundOpacity;
    }

    /**
     * Get weather opacity
     */
    function getWeatherOpacity() {
        var opacity = localStorage.getItem("page-weather-opacity");
        return opacity && opacity > 0 ? opacity : defaultWeatherOpacity;
    }

    /**
     * Get bottom panel
     */
    function getBottomPanelOpacity() {
        var opacity = localStorage.getItem("page-bottom-panel-opacity");
        return opacity && opacity > 0 ? opacity : defaultBottomPanelOpacity;
    }

    /**
     * Get Relax Panel Opacity
     */
    function getRelaxPanelOpacity() {
        var opacity = localStorage.getItem("page-bottom-panel-opacity");
        return opacity && opacity > 0 ? opacity : defaultRelaxPanelOpacity;
    }

    /**
     * Get weather background opacity
     */
    function getWeatherBackgroundOpacity() {
        var opacity = localStorage.getItem("page-weather-background-opacity");
        return opacity && opacity > 0 ? opacity : defaultWeatherBackgroundOpacity;
    }

    /**
     * Set application rating show start time
     *
     * @param callback Function
     */
    //m START
    function setApplicationRatingShowStartTime(callback) {
        var val = new Date().getTime() + appRatingShowDelay;
        setSettingsValue("app-rating-show-start-time", val, callback);
    }

    /**
     * Get application rating show start time
     *
     * @param callback Function
     */
    function getApplicationRatingShowStartTime(callback) {
        getSettingsValue("app-rating-show-start-time", (new Date().getTime() + appRatingShowDelay), callback);
    }

    /**
     * Get application rating modal show newtab state
     *
     * @param callback Function
     */
    function getApplicationNewtabRatingModal(callback) {
        getSettingsValue("already-display-app-rating-newtab-modal", 0, callback);
    }

    /**
     * Set application rating modal show newtab state
     *
     * @param callback Function
     */
    function setApplicationNewtabRatingModal(callback) {
        setSettingsValue("already-display-app-rating-newtab-modal", 1, callback);
    }

    /**
     * Get application search form provider type
     *
     * @param callback Function
     */
    function getSearchFormProviderType(callback) {
        BRW_getAcceptLanguages(function(languages){
            var hasRuLanguage = languages.indexOf("ru") != -1;
            var defaultSearchProvider = hasRuLanguage ? searchProviderYandex : searchProviderLive;
            getSettingsValue("search-form-provider-type", defaultSearchProvider, function(val) {
                if(!hasRuLanguage)
                    val = searchProviderLive;
                if(callback)
                    callback(val);
            });
        });
    }

    /**
     * Set application search form provider type
     *
     * @param val Int
     * @param callback Function
     */
    function setSearchFormProviderType(val, callback) {
        val = parseInt(val);
        setSettingsValue("search-form-provider-type", val, callback);
    }

    /**
     * Get application search form display state
     *
     * @param callback Function
     */
    function getDisplaySearchForm(callback) {
        getSettingsValue("search-form-display", 1, callback);
    }

    /**
     * Set application search form display state
     *
     * @param val Int
     * @param callback Function
     */
    function setDisplaySearchForm(val, callback) {
        setSettingsValue("search-form-display", val ? 1 : 0, callback);
    }

    /**
     * Set open search type
     *
     * @param type Int
     */
    function setOpenSearchType(type) {
        if(type == openCurrentTab || type == openNewTab || type == openBackgroundTab)
            localStorage.setItem("search-open-type", type);
    }

    /**
     * Get open dial type
     *
     * @returns Int
     */
    function getOpenSearchType() {
        var type = parseInt(localStorage.getItem("search-open-type"));
        return isNaN(type) ? openCurrentTab : type;
    }

    /**
     * Set show random themes
     *
     * @param status Int
     */
    function setRandomThemesDisplay(status) {
        if(!status)
            clearDisplayCurrentBackgroundFile();
        localStorage.setItem("show-random-content-state", status ? 1 : 0);
    }

    /**
     * Get show random themes
     *
     * @returns Int
     */
    function getRandomThemesDisplay() {
        var status = parseInt(localStorage.getItem("show-random-content-state"));
        return isNaN(status) ? 0 : status;
    }

    /**
     * Set themes sort type
     *
     * @param sort Int
     */
    function setThemesSortType(sort) {
        sort = parseInt(sort);
                
        localStorage.removeItem("available-themes-data-next-update");
        localStorage.removeItem("flixel-themes-data-next-update");
        
        localStorage.setItem("themes-sort-type", !isNaN(sort)/* && sort*/ ? sort /*THEMES_SORT_POPULAR*/ : THEMES_SORT_FEATURED);
    }

    /**
     * Get themes sort type
     *
     * @returns Int
     */
    function getThemesSortType() {
        var sort = parseInt(localStorage.getItem("themes-sort-type"));
        return isNaN(sort) ? THEMES_SORT_FEATURED : sort;
    }

    /**
     * Set clock color scheme
     *
     * @param colors Object
     */
    function setClockColorScheme(colors) {
        localStorage.setItem("page-clock-colors", JSON.stringify(colors));
    }

    /**
     * Get clock colors object
     *
     * @returns {Object}
     */
    function getClockColorsObject() {
        var defaultColor = defaultClockItemColor;
        return {
            "clock-time-color" : defaultColor,
            "clock-label-color" : defaultColor,
            "clock-ampm-label-color" : defaultColor,
            "clock-digit-bg-color" : defaultColor,
            "clock-circle-done-line-color" : defaultColor,
            "clock-circle-total-line-color" : defaultColor,
            "clock-border-line-color" : defaultColor
        };
    }

    /**
     * Get clock color scheme
     *
     * @param clockType Number
     * @returns Object
     */
    function getClockColorScheme(clockType) {
        var colors = localStorage.getItem("page-clock-colors");
        return colors ? JSON.parse(colors) : getClockDefaultColorScheme(clockType);
    }

    /**
     * Clear clock scheme
     */
    function clearClockColorScheme() {
        localStorage.removeItem("page-clock-colors");
        localStorage.removeItem("page-clock-color-scheme-type");
    }

    /**
     * Set clock colors scheme skip clear
     */
    function setClockColorSchemeSkipClear() {
        localStorage.setItem("page-clock-colors-skip-clear", 1);
    }

    /**
     * Get clock colors scheme skip clear
     *
     * @returns Bool
     */
    function getClockColorSchemeSkipClear() {
        var val = parseInt(localStorage.getItem("page-clock-colors-skip-clear"));
        return !isNaN(val) && val;
    }

    /**
     * Clear clock colors scheme skip clear
     */
    function clearClockColorSchemeSkipClear() {
        localStorage.removeItem("page-clock-colors-skip-clear");
    }

    /**
     * Get clock default color scheme
     *
     * @param clockType Number
     * @returns Object
     */
    function getClockDefaultColorScheme(clockType) {
        var colors = getClockColorsObject();
        var colorsDark = getClockColorsObject();
        var colorsLight = getClockColorsObject();
        switch (clockType) {
            case 0:
            {
                colors["clock-time-color"] = "#F2F2F2";
                colors["clock-ampm-label-color"] = "#F2F2F2";

                colorsDark["clock-time-color"] = "#000000";
                colorsDark["clock-ampm-label-color"] = "#000000";

                colorsLight["clock-time-color"] = "#FFFFFF";
                colorsLight["clock-ampm-label-color"] = "#FFFFFF";
                break;
            }
            case 3:
            {
                colors["clock-time-color"] = "#FFFFFF";
                colors["clock-label-color"] = "#FFFFFF";
                colors["clock-ampm-label-color"] = "#FFFFFF";
                colors["clock-border-line-color"] = "#FFC728";

                colorsDark["clock-time-color"] = "#000000";
                colorsDark["clock-label-color"] = "#000000";
                colorsDark["clock-ampm-label-color"] = "#000000";
                colorsDark["clock-border-line-color"] = "#FFFFFF";

                colorsLight["clock-time-color"] = "#FFFFFF";
                colorsLight["clock-label-color"] = "#FFFFFF";
                colorsLight["clock-ampm-label-color"] = "#FFFFFF";
                colorsLight["clock-border-line-color"] = "#000000";
                break;
            }
            case 5:
            {
                colors["clock-time-color"] = "#F2F2F2";
                colors["clock-ampm-label-color"] = "#F2F2F2";

                colorsDark["clock-time-color"] = "#000000";
                colorsDark["clock-ampm-label-color"] = "#000000";

                colorsLight["clock-time-color"] = "#FFFFFF";
                colorsLight["clock-ampm-label-color"] = "#FFFFFF";
                break;
            }
            case 6:
            {
                colors["clock-time-color"] = "#FFFFFF";
                colors["clock-label-color"] = "#B3B3B3";
                colors["clock-ampm-label-color"] = "#FFFFFF";
                colors["clock-digit-bg-color"] = "#4787ed";

                colorsDark["clock-time-color"] = "#000000";
                colorsDark["clock-label-color"] = "#FFFFFF";
                colorsDark["clock-ampm-label-color"] = "#FFFFFF";
                colorsDark["clock-digit-bg-color"] = "#FFFFFF";

                colorsLight["clock-time-color"] = "#FFFFFF";
                colorsLight["clock-label-color"] = "#000000";
                colorsLight["clock-ampm-label-color"] = "#000000";
                colorsLight["clock-digit-bg-color"] = "#000000";
                break;
            }
            case 7:
            {
                colors["clock-time-color"] = "#00DEFF";
                colors["clock-ampm-label-color"] = "#00DEFF";

                colorsDark["clock-time-color"] = "#000000";
                colorsDark["clock-ampm-label-color"] = "#000000";

                colorsLight["clock-time-color"] = "#FFFFFF";
                colorsLight["clock-ampm-label-color"] = "#FFFFFF";
                break;
            }
            case 9:
            {
                colors["clock-time-color"] = "#FFFFFF";
                colors["clock-label-color"] = "#929292";
                colors["clock-ampm-label-color"] = "#FFFFFF";
                colors["clock-circle-done-line-color"] = "#282828";
                colors["clock-circle-total-line-color"] = "#117D8B";

                colorsDark["clock-time-color"] = "#000000";
                colorsDark["clock-label-color"] = "#000000";
                colorsDark["clock-ampm-label-color"] = "#000000";
                colorsDark["clock-circle-done-line-color"] = "#FFFFFF";
                colorsDark["clock-circle-total-line-color"] = "#000000";

                colorsLight["clock-time-color"] = "#FFFFFF";
                colorsLight["clock-label-color"] = "#FFFFFF";
                colorsLight["clock-ampm-label-color"] = "#FFFFFF";
                colorsLight["clock-circle-done-line-color"] = "#000000";
                colorsLight["clock-circle-total-line-color"] = "#FFFFFF";
                break;
            }
            case 10:
            {
                colors["clock-time-color"] = "#FFFFFF";
                colors["clock-label-color"] = "#B3B3B3";
                colors["clock-ampm-label-color"] = "#FFFFFF";
                colors["clock-digit-bg-color"] = "#000000";

                colorsDark["clock-time-color"] = "#000000";
                colorsDark["clock-label-color"] = "#FFFFFF";
                colorsDark["clock-ampm-label-color"] = "#FFFFFF";
                colorsDark["clock-digit-bg-color"] = "#FFFFFF";

                colorsLight["clock-time-color"] = "#FFFFFF";
                colorsLight["clock-label-color"] = "#000000";
                colorsLight["clock-ampm-label-color"] = "#000000";
                colorsLight["clock-digit-bg-color"] = "#000000";
                break;
            }
        }

        var result = colors;
        switch (getClockColorSchemeType()) {
            case clockColorSchemeLight : {
                result = colorsLight;
                break;
            }
            case clockColorSchemeDark : {
                result = colorsDark;
                break;
            }
        }
        return result;
    }

    /**
     * Set clock color scheme type
     *
     * @param type Int
     */
    function setClockColorSchemeType(type) {
        localStorage.setItem("page-clock-color-scheme-type", parseInt(type));
    }

    /**
     * Get clock color scheme type
     *
     * @returns Int
     */
    function getClockColorSchemeType() {
        var type = parseInt(localStorage.getItem("page-clock-color-scheme-type"));
        return !isNaN(type) && type ? type : clockColorSchemeDefault;
    }

    /**
     * Set clock type
     *
     * @param type Int
     */
    function setClockType(type) {
        localStorage.setItem("page-clock-type", parseInt(type));
    }

    /**
     * Get clock type
     *
     * @returns Int
     */
    function getClockType() {
        var type = parseInt(localStorage.getItem("page-clock-type"));
        return isNaN(type) ? defaultClockType : type;
    }

    /**
     * Set clock background type
     *
     * @param type Int
     */
    function setClockBackgroundType(type) {
        localStorage.setItem("page-clock-background-type", parseInt(type));
    }

    /**
     * Get clock background type
     *
     * @returns Int
     */
    function getClockBackgroundType() {
        var type = parseInt(localStorage.getItem("page-clock-background-type"));
        return isNaN(type) ? defaultClockBackgroundType : type;
    }

    /**
     * Set search engine url
     *
     * @param isYandex bool
     */
    function setSearchEngine(isYandex) {
        if(isYandex)
            searchEngine = yandexSearchEngine;
        else
            searchEngine = googleSearchEngine;
    }

    /**
     * Get search engine url
     *
     * @param url String
     * @returns String
     */
    function getSearchEngineUrl(url) {
        return searchEngine + url;
    }

    /**
     * Get hidden capture inject script
     *
     * @returns {string}
     */
    function getHiddenCaptureInjectScript() {
        return 'window.postMessage({action:"live_start_page:replaceAlerts"}, "*")';
    }

    /**
     * Add thumb host to black list
     *
     * @param url String
     * @param sendResponse Function
     */
    function addHostToBlackList(url, sendResponse) {
        if(url) {
            var hostName = getUrlHost(url);
            if(hostName) {
                BRW_dbTransaction(function (tx) {
                    BRW_dbSelect(
                        {//Param
                            tx : tx,
                            from    :  'HOST_BLACKLIST',
                            where   : {
                                'host'   : hostName
                            }
                        },
                        function(results){//Success
                            if(!results.rows.length) {
                                BRW_dbInsert(
                                    { //Param
                                        tx : tx,
                                        table: 'HOST_BLACKLIST',
                                        'set': {
                                            id  : new Date().getTime(),
                                            host: hostName
                                        } 
                                    }
                                );
                            }//if
                            
                            if(sendResponse)
                                sendResponse({});
                        }//Success
                    );
                });
                
                /*
                getDb().transaction(function (tx) {
                    tx.executeSql('SELECT * FROM HOST_BLACKLIST WHERE host = ?', [hostName], function (tx, results) {
                        if(!results.rows.length) {
                            tx.executeSql('INSERT INTO HOST_BLACKLIST (id, host) VALUES (?,?)', [new Date().getTime(), hostName]);
                        }
                        if(sendResponse)
                            sendResponse({});
                    }, null);
                });
                */
            } else {
                if(sendResponse)
                    sendResponse({});
            }
        } else {
            if(sendResponse)
                sendResponse({});
        }
    }

    /**
     * Remove thumb host from black list
     *
     * @param url String
     * @param sendResponse Function
     */
    function removeHostFromBlackList(url, sendResponse) {
       
        if(url) {
            var hostName = getUrlHost(url);
            if(hostName) {
                BRW_dbTransaction(function (tx) {
                    BRW_dbSelect(
                        {//Param
                            tx : tx,
                            from    :  'HOST_BLACKLIST',
                            where   : {
                                'host'   : hostName
                            }
                        },
                        function(results){//Success
                            if(results.rows.length) {
                                BRW_dbDelete(
                                    {//Param
                                        tx : tx,
                                        table   :  'HOST_BLACKLIST',
                                        where   : {
                                            key : 'host', val : hostName
                                        }
                                    }       
                                );
                            }//if
                            
                            if(sendResponse)
                                sendResponse({});
                        }//Success
                    );
                });
                
                /*
                getDb().transaction(function (tx) {
                    tx.executeSql('SELECT * FROM HOST_BLACKLIST WHERE host = ?', [hostName], function (tx, results) {
                        if(results.rows.length) {
                            tx.executeSql('DELETE FROM HOST_BLACKLIST WHERE host = ?', [hostName]);
                        }
                        if(sendResponse)
                            sendResponse({});
                    }, null);
                });
                */
            } else {
                if(sendResponse)
                    sendResponse({});
            }
        } else {
            if(sendResponse)
                sendResponse({});
        }
    }

    /**
     * Create columns if not exist int table
     * @param tx Transaction
     * @param table String
     * @param columns Array
     * @param callback Function
     **/
    function createColumnsIfNotExist(tx, table, columns, callback) {
        
        tx.executeSql(
            "SELECT `sql` FROM `sqlite_master` WHERE `name` = '" + table + "' AND " +
            "`type` = 'table'", [], function(tx, results) {
                if(results.rows.length) {
                    var sql = results.rows.item(0).sql;
                    var match = sql.match(/\((.+?)\)/i);
                    var tableColumns = {};
                    if(match) {
                        var tmp = match[1].split(/\s*,\s*/);
                        for(var i = 0; i != tmp.length; i++) {
                            var t = tmp[i].split(" ")[0];
                            t = t.replace(/`|\s/g, "");
                            tableColumns[t] = t;
                        }
                    }

                    for(var i in columns) {
                        var column = columns[i];
                        if(column)
                            if(typeof(tableColumns[column]) == "undefined")
                                tx.executeSql("ALTER TABLE '" + table + "' ADD " + column);
                    }

                    if(callback)
                        callback();
                }
            }, function() {
                if(callback)
                    callback();
            });
    }

    /**
     * Get database connection
     */
    function getDb() {
        if(!appDB) {
            //m DATEBASE INIT
            /*Moved to browser choiser*/
            appDB = BRW_getDb();
        }
                
        return appDB;
    }

    /**
     * Install default groups if not exist
     */
    function installDefaultGroupsIfNotExist() {
        setDefaultGroup(setDefaultDials);
    }

    /**
     * Set default group
     *
     * @param callback Function
     */
    //m START
    /*Moved to browser choiser*/
    function setDefaultGroup(callback) {
        BRW_setDefaultGroup(callback);
    }

    /**
     * Set default dials
     *
     * @param group Object
     * @param country String
     * @param searchBy Number
     */

    //m START
    /*Moved to browser choiser*/
    function setDefaultDials(group, country, searchBy) {
         BRW_setDefaultDials(group, country, searchBy);
    }

    /**
     * Check country is actual
     *
     * @param country String
     * @returns {boolean}
     */
    function checkCountryIsActual(country) {
        var countries = ["GB", "UK", "NL", "IT", "IE", "FR", "ES", "DE", "CH", "CA", "BE", "AU", "AT", "US"];
        return countries.indexOf(country) >= 0;
    }

    /**
     * Get default dials list
     *
     * @param country String
     * @param searchBy Number
     * @returns {Array}
     */
    function getDefaultDialsList(country, searchBy) {
        var defaultDials = [];
        var defaultDialItem;
        var defaultDialsPath = "pages/newtab/img/dials/thumbs/";

        // Amazon
        defaultDialItem = {};
        switch (country) {
            case "GB" :
            case "UK" : defaultDialItem["url"] = "http://www.amazon.co.uk/?tag=couponpartnerfvd-21";
                break;
            case "DE" : defaultDialItem["url"] = "http://www.amazon.de/?tag=couponpartnerfvd07-21";
                break;
            case "FR" : defaultDialItem["url"] = "http://www.amazon.fr/?tag=couponpartnerfvd00-21";
                break;
            case "CA" : defaultDialItem["url"] = "http://www.amazon.ca/?tag=couponpartnerfvd-20";
                break;
            case "IT" : defaultDialItem["url"] = "http://www.amazon.it/?tag=couponpartnerfvd03-21";
                break;
            case "ES" : defaultDialItem["url"] = "http://www.amazon.es/?tag=couponpartnerfvd04-21";
                break;
            default   : defaultDialItem["url"] = "http://www.amazon.com/?tag=couponpartfvd-20";
        }
        defaultDialItem["title"] = "Amazon";
        defaultDialItem["image"] = extensionGetUrl(defaultDialsPath + "amazon.png");
        
        defaultDials.push(defaultDialItem);

        // Ebay
        defaultDialItem = {};
        switch (country) {
            case "GB" :
            case "UK" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/710-53481-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229508&kwid=902099&mtid=824&kw=lg";
                break;
            case "NL" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/1346-53482-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229557&kwid=902099&mtid=824&kw=lg";
                break;
            case "IT" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/724-53478-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229494&kwid=902099&mtid=824&kw=lg";
                break;
            case "IE" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/5282-53468-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229543&kwid=902099&mtid=824&kw=lg";
                break;
            case "FR" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/709-53476-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229480&kwid=902099&mtid=824&kw=lg";
                break;
            case "ES" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/1185-53479-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229501&kwid=902099&mtid=824&kw=lg";
                break;
            case "DE" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/707-53477-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229487&kwid=902099&mtid=824&kw=lg";
                break;
            case "CH" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/5222-53480-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229536&kwid=902099&mtid=824&kw=lg";
                break;
            case "CA" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/706-53473-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229529&kwid=902099&mtid=824&kw=lg";
                break;
            case "BE" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/1553-53471-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229522&kwid=902099&mtid=824&kw=lg";
                break;
            case "AU" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/705-53470-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229515&kwid=902099&mtid=824&kw=lg";
                break;
            case "AT" : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/5221-53469-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229473&kwid=902099&mtid=824&kw=lg";
                break;
            default   : defaultDialItem["url"] = "http://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=1&pub=5575149182&toolid=10001&campid=5337791832&customid=fvd&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg";
        }
        defaultDialItem["title"] = "Ebay";
        defaultDialItem["image"] = extensionGetUrl(defaultDialsPath + "ebay.png");
        defaultDials.push(defaultDialItem);

        // Aliexpress
        defaultDialItem = {};
        defaultDialItem["url"] = "http://s.click.aliexpress.com/e/MByZjauVn";
        defaultDialItem["title"] = "Aliexpress";
        defaultDialItem["image"] = extensionGetUrl(defaultDialsPath + "aliexpress.png");
        defaultDials.push(defaultDialItem);

        // Facebook
        defaultDialItem = {};
        defaultDialItem["url"] = "https://www.facebook.com/";
        defaultDialItem["title"] = "Facebook";
        defaultDialItem["image"] = extensionGetUrl(defaultDialsPath + "facebook.png");
        defaultDials.push(defaultDialItem);

        // Twitter
        defaultDialItem = {};
        defaultDialItem["url"] = "https://twitter.com/";
        defaultDialItem["title"] = "Twitter";
        defaultDialItem["image"] = extensionGetUrl(defaultDialsPath + "twitter.png");
        defaultDials.push(defaultDialItem);

        // Nimbus
        defaultDialItem = {};
        defaultDialItem["url"] = "http://nimbus.everhelper.me/";
        defaultDialItem["title"] = "Nimbus";
        defaultDialItem["image"] = extensionGetUrl(defaultDialsPath + "nimbus.png");
        defaultDials.push(defaultDialItem);

        if(searchBy == COUNTRY_SEARCH_BY_SERVICE) {//remove true
            if(country == "US") {//remove true
                // Wayfair
                defaultDialItem = {};
                defaultDialItem["url"] = "http://www.shareasale.com/r.cfm?u=935698&b=65867&m=11035&afftrack=fvdhome&urllink=www%2Ewayfair%2Ecom";
                defaultDialItem["title"] = "Wayfair";
                defaultDialItem["image"] = extensionGetUrl(defaultDialsPath + "wayfair.png");
                defaultDials.push(defaultDialItem);

                // Groupon
                defaultDialItem = {};
                defaultDialItem["url"] = "http://go.redirectingat.com/?id=68995X1538123&xs=1&xcust=21&url=http%3A%2F%2Fwww.groupon.com";
                defaultDialItem["title"] = "Groupon";
                defaultDialItem["image"] = extensionGetUrl(defaultDialsPath + "groupon.png");
                defaultDials.push(defaultDialItem);

            }
        }

        return defaultDials;
    }

    /**
     * Save to do item to db
     *
     * @param id String
     * @param title String
     * @param order Number
     */
    function saveTodoItemDb(id, title, order) {
        id = parseInt(id);
        order = parseInt(order);
        if(!isNaN(id) && !isNaN(order) && id && order) {
            BRW_dbTransaction(function (tx) {
                var response = {"id" : id, "title" : title, "done" : 0, "item_date" : getCurrentDate(), "item_order" : order};
                
                BRW_dbInsert(
                    { //Param
                        tx : tx,
                        table: 'TODO_ITEMS',
                        'set': response
                    },
                    function(){//success
                        //console.info("common.js: saveTodoItemDb -> Item successfully added");
                    },
                    function(){//error
                        console.error("common.js: saveTodoItemDb -> Can't add item");
                    }
                );
            });

            
            /*
            getDb().transaction(function (tx) {
                var response = {"id" : id, "title" : title, "done" : 0, "date" : getCurrentDate(), "order" : order};
                tx.executeSql('INSERT INTO TODO_ITEMS (id, title, done, item_date, item_order) VALUES (?,?,?,?,?)', [response.id, response.title, response.done, response.date, response.order]);
            });
            */
        }
    }

    /**
     * Remove to do item to db
     *
     * @param id String
     */
    function deleteTodoItemDb(id) {//console.info("common.js, OK: deleteTodoItemDb(id)", id);
        id = parseInt(id);
        if(!isNaN(id) && id) {
            BRW_dbTransaction(function (tx) {
                BRW_dbDelete(
                    { //Param
                        tx : tx,
                        table: 'TODO_ITEMS',
                        where   : {
                            key : 'id', val : id
                        }
                    },
                    function(){//success
                        //console.info("common.js: deleteTodoItemDb -> Item successfully deleted");
                    },
                    function(){//error
                        console.error("common.js: deleteTodoItemDb -> Can't delete item");
                    }
                );
            });
            
            
            /*
            getDb().transaction(function (tx) {
                tx.executeSql('DELETE FROM TODO_ITEMS WHERE id = ?', [id]);
            });
            */
        }
    }

    /**
     * Remove to do item title to db
     *
     * @param id String
     * @param title String
     */
    function changeTodoItemTitleDb(id, title) {
        
        id = parseInt(id);
        title = title.trim();
        if(!isNaN(id) && id && title) {
            BRW_dbTransaction(function (tx) {
                BRW_dbUpdate(
                    { //Param
                        tx : tx,
                        table: 'TODO_ITEMS',
                        'set': {
                            title: title
                        },
                        where: {
                            key : 'id', val : id
                        }
                    },
                    function(){//success
                        //console.info("common.js: changeTodoItemTitleDb -> Item successfully updated");
                    },
                    function(){//error
                        console.error("common.js: changeTodoItemTitleDb -> Can't update item");
                    }
                );
            });
            
            /*
            getDb().transaction(function (tx) {
                tx.executeSql('UPDATE TODO_ITEMS SET title = ? WHERE id = ?', [title, id]);
            });
            */
        }
    }

    /**
     * Change to do item done to db
     *
     * @param id String
     * @param done Number
     */
    function changeTodoItemDoneDb(id, done) {
        
        id = parseInt(id);
        done = done ? 1 : 0;
        if(!isNaN(id) && id) {
            BRW_dbTransaction(function (tx) {
                BRW_dbUpdate(
                    { //Param
                        tx : tx,
                        table: 'TODO_ITEMS',
                        'set': {
                            done: done
                        },
                        where: {
                            key : 'id', val : id
                        }
                    },
                    function(){//success
                        //console.info("common.js: changeTodoItemDoneDb -> Item successfully updated");
                    },
                    function(){//error
                        console.error("common.js: changeTodoItemDoneDb -> Can't update item");
                    }
                );
            });
            
            /*
            getDb().transaction(function (tx) {
                tx.executeSql('UPDATE TODO_ITEMS SET done = ? WHERE id = ?', [done, id]);
            });
            */
        }
    }

    /**
     * Change items order
     *
     * @param items Array
     */
    function changeTodoItemSortDb(items) {
        if(items.length) {
            BRW_dbTransaction(function (tx) {
                for(var i in items) {
                    var item = items[i];
                    var itemId = parseInt(item.id);
                    var itemOrder = parseInt(item.order);
                    
                    if(!isNaN(itemId) && !isNaN(itemOrder) && itemId && itemOrder){
                        changeTodoItemSortDb_OneItem(tx, itemId, itemOrder);
                    }//if
                }//for
            });
            
            /*
            getDb().transaction(function (tx) {
                for(var i in items) {
                    var item = items[i];
                    var itemId = parseInt(item.id);
                    var itemOrder = parseInt(item.order);
                    if(!isNaN(itemId) && !isNaN(itemOrder) && itemId && itemOrder)
                        tx.executeSql('UPDATE TODO_ITEMS SET item_order = ? WHERE id = ?', [itemOrder, itemId]);
                }
            });
            */
        }
    }
    
    function changeTodoItemSortDb_OneItem(tx, itemId, itemOrder) {//FIREFOX
        BRW_dbUpdate(
            { //Param
                tx : tx,
                table: 'TODO_ITEMS',
                'set': {
                    'item_order': itemOrder
                },
                where: {
                    key : 'id', val : itemId
                }
            },
            function(){//Success
                //console.info("common.js: changeTodoItemSortDb -> Order of item ("+itemOrder+") successfully updated to "+itemOrder);
            },
            function(){//Error
                console.error("common.js: changeTodoItemSortDb -> Can't update item ("+itemOrder+") order to "+itemOrder);
            }
        );
    }//changeTodoItemSortDb_OneItem
    

    /**
     * Clear to do done elements
     */
    function clearTodoDoneElementsDb() {
        BRW_dbTransaction(function (tx) {
            BRW_dbDelete(
                { //Param
                    tx : tx,
                    table: 'TODO_ITEMS',
                    where   : {
                        key : 'done', val : 1
                    }
                },
                function(){//success
                    //console.info("common.js: clearTodoDoneElementsDb -> Item successfully deleted");
                },
                function(){//error
                    console.error("common.js: clearTodoDoneElementsDb -> Can't delete item");
                }
            );
        });     
        
        /*                                
        getDb().transaction(function (tx) {
            tx.executeSql('DELETE FROM TODO_ITEMS WHERE done = 1');
        });
        */
    }

    /**
     * Get visible speed dial panel
     *
     * @returns {*}
     */
    function getVisibleSpeedDialPanel() {
        var val = parseInt(localStorage.getItem("tiles-block-visible"));
        return isNaN(val) ? false : val;
    }

    /**
     * Set visible speed dial panel
     *
     * @param val Int
     */
    function setVisibleSpeedDialPanel(val) {
        localStorage.setItem("tiles-block-visible", val ? 1 : 0);
    }

    /**
     * Set new speed dial generation thumb type
     *
     * @param val Number
     * @param callback Function
     */
    function setNewSpeedDialThumbType(val, callback) {
        stopGenerateDialThumbImage();
        setSettingsValue("tiles-new-dial-thumb-type", parseInt(val), callback);
    }

    /**
     * Set dials columns count
     *
     * @param val Number
     * @param callback Function
     */
    function setDialsColumnsCount(val, callback) {
        setSettingsValue("tiles-columns-count", parseInt(val), callback);
    }

    /**
     * Stop generate dial thumb image
     */
    function stopGenerateDialThumbImage() {
        installService = installWindow = everhelperInstall = textDialsInstall = false;
        startTiles = [];
        stopBuildTextThumbImage();
        stopPrintScreenBuild({"id" : getLastInstallWindow()});
        stopPrintScreenBuildService();
        stopPrintScreenBuildEverhelperService();
    }

    /**
     * Get new speed dial generation thumb type
     *
     * @param callback Function
     */
    function getNewSpeedDialThumbType(callback) {
        getSettingsValue("tiles-new-dial-thumb-type", speedDialThumbTypeGalleryText, callback);
    }

    /**
     * Get dials columns count
     *
     * @param callback Function
     */
    function getDialsColumnsCount(callback) {
        getSettingsValue("tiles-columns-count", DIALS_COLUMNS_COUNT, callback);
    }

    /**
     * Get display to do panel
     *
     * @returns {*}
     */
    function getDisplayTodoDialPanel() {
        var val = parseInt(localStorage.getItem("todo-block-display"));
        return isNaN(val) ? true : val;
    }

    /**
     * Set display to do panel
     *
     * @param val Int
     */
    function setDisplayTodoPanel(val) {
        localStorage.setItem("todo-block-display", val ? 1 : 0);
    }

    /**
     * Get display apps link
     *
     * @param callback Function
     * @returns {*}
     */
    function getDisplayAppsLink(callback) {
        getSettingsValue("apps-link-display", 1, callback);
    }

    /**
     * Set display apps link
     *
     * @param val Int
     * @param callback Function
     */
    function setDisplayAppsLink(val, callback) {
        setSettingsValue("apps-link-display", val ? 1 : 0, callback);
    }

    /**
     * Reset to do position and size
     */
    function resetTodoPositionSize() {
        localStorage.removeItem("todo-block-display-coordinates");
        localStorage.removeItem("todo-block-display-size");
    }

    /**
     * Set visible clock seconds
     *
     * @param val Int
     */
    function setVisibleClockSeconds(val) {
        localStorage.setItem("page-clock-seconds-visible", val ? 1 : 0);
    }

    /**
     * Get display clock seconds
     *
     * @returns {*}
     */
    function getVisibleClockSeconds() {
        var val = parseInt(localStorage.getItem("page-clock-seconds-visible"));
        return isNaN(val) ? false : val;
    }

    /**
     * Get display to do coordinates panel
     *
     * @returns {*}
     */
    function getDisplayTodoCoordinates() {
        var val = localStorage.getItem("todo-block-display-coordinates");
        return val ? JSON.parse(val) : null;
    }

    /**
     * Set display to do coordinates panel
     *
     * @param top Int
     * @param left Int
     */
    function setDisplayTodoCoordinates(top, left) {
        var coordinates = {"top" : top, "left" : left};
        localStorage.setItem("todo-block-display-coordinates", JSON.stringify(coordinates));
    }

    /**
     * Get display to do size panel
     *
     * @returns {*}
     */
    function getDisplayTodoSize() {
        var val = localStorage.getItem("todo-block-display-size");
        return val ? JSON.parse(val) : {"width" : "314px", "height" : "220px"};
    }

    /**
     * Set display to do size panel
     *
     * @param width Int
     * @param height Int
     */
    function setDisplayTodoSize(width, height) {
        var coordinates = {"width" : width, "height" : height};
        localStorage.setItem("todo-block-display-size", JSON.stringify(coordinates));
    }

    /**
     * Get clock format
     *
     * @returns {*}
     */
    function getClockFormat() {
        var val = parseInt(localStorage.getItem("page-clock-format"));
        return isNaN(val) ? getClockFormatFromCountry() : val;
    }
    
    /**
    * Get clock format from country
    **/
    function getClockFormatFromCountry(){
        if(
            localStorage.getItem("definedLocation")
            &&
            ["RU", "FR", "IT", "ES", "DE", "JA"].indexOf(String(localStorage.getItem("definedLocation")).toUpperCase()) > -1
        ) return 0; //24h
        else return 1; //12h
    }

    /**
     * Set clock format
     *
     * @param val Int
     */
    function setClockFormat(val) {
        localStorage.setItem("page-clock-format", val ? 1 : 0);
    }

    /**
     * Get clock format label
     *
     * @returns {*}
     */
    function getClockFormatLabel() {
        var val = parseInt(localStorage.getItem("page-clock-format-label"));
        return isNaN(val) ? true : val;
    }

    /**
     * Set clock format label
     *
     * @param val Int
     */
    function setClockFormatLabel(val) {
        localStorage.setItem("page-clock-format-label", val ? 1 : 0);
    }

    /**
     * Get clock visible label
     *
     * @returns {*}
     */
    function getClockVisibleLabel() {
        var val = parseInt(localStorage.getItem("page-clock-visible-label"));
        return isNaN(val) ? true : val;
    }

    /**
     * Set clock visible label
     *
     * @param val Int
     */
    function setClockVisibleLabel(val) {
        localStorage.setItem("page-clock-visible-label", val ? 1 : 0);
    }

    /**
     * Check clock type no label
     *
     * @param clockType Int
     * @returns {boolean}
     */
    function checkClockTypeNoLabel(clockType) {
        return clockType == 0 || clockType == 5 || clockType == 7;
    }

    /**
     * Get clock font bold
     *
     * @returns {*}
     */
    function getClockFontBold() {
        var val = parseInt(localStorage.getItem("page-clock-font-bold"));
        return isNaN(val) ? true : val;
    }

    /**
     * Set clock font bold
     *
     * @param val Int
     */
    function setClockFontBold(val) {
        localStorage.setItem("page-clock-font-bold", val ? 1 : 0);
    }

    /**
     * Get display speed dial panel
     *
     * @returns {*}
     */
    function getDisplaySpeedDialPanel() {
        var val = parseInt(localStorage.getItem("tiles-block-display"));
        return isNaN(val) ? true : val;
    }

    /**
     * Set display speed dial panel
     *
     * @param val Int
     */
    function setDisplaySpeedDialPanel(val) {
        localStorage.setItem("tiles-block-display", val ? 1 : 0);
    }

    /**
     * Get display popular group
     *
     * @returns {*}
     */
    function getDisplayPopularGroup() {
        var val = parseInt(localStorage.getItem("popular-group-display"));
        return isNaN(val) ? true : val;
    }

    /**
     * Set display popular group
     *
     * @param val Int
     */
    function setDisplayPopularGroup(val) {
        localStorage.setItem("popular-group-display", val ? 1 : 0);
    }

    /**
     * Get footer links block display
     *
     * @returns {*}
     */
    function getFooterLinksBlockDisplay() {
        var val = parseInt(localStorage.getItem("footer-links-block-display"));
        return isNaN(val) ? true : val;
    }

    /**
     * Set footer links block display
     *
     * @param val Int
     */
    function setFooterLinksBlockDisplay(val) {
        localStorage.setItem("footer-links-block-display", val ? 1 : 0);
    }

    /**
     * Set visible to do panel
     *
     * @param val Int
     */
    function setVisibleTodoPanel(val) {
        localStorage.setItem("todo-block-visible", val ? 1 : 0);
    }

    /**
     * Get visible to do panel
     *
     * @returns {*}
     */
    function getVisibleTodoPanel() {
        var val = parseInt(localStorage.getItem("todo-block-visible"));
        return isNaN(val) ? true : val;
    }

/**
     * Set visible to do panel
     *
     * @param val Int
     */
    function setDisplayClockPanel(val) {
        localStorage.setItem("clock-block-display", val ? 1 : 0);
    }

    /**
     * Get visible to do panel
     *
     * @returns {*}
     */
    function getDisplayClockPanel() {
        var val = parseInt(localStorage.getItem("clock-block-display"));
        return isNaN(val) ? true : val;
    }

    /**
     * Get display parallax video theme effect
     *
     * @returns {*}
     */
    function getDisplayParallaxVideoTheme() {
        var val = parseInt(localStorage.getItem("background-parallax-display"));
        return isNaN(val) ? false : val;
    }

    /**
     * Set display parallax video theme effect
     *
     * @param val Int
     */
    function setDisplayParallaxVideoTheme(val) {
        localStorage.setItem("background-parallax-display", val ? 1 : 0);
    }

    /**
     * Get display relax button
     *
     * @returns {*}
     */
    function getDisplayRelax() {
        var val = parseInt(localStorage.getItem("background-relax-display"));
        return isNaN(val) ? true : val;
    }

    /**
     * Set display relax button
     *
     * @param val Int
     */
    function setDisplayRelax(val) {
        localStorage.setItem("background-relax-display", val ? 1 : 0);
    }

    /**
     * Send google analytic install app message
     */
    //m START
    function sendGoogleAnalyticInstallApp() {
        FF_whileLoaded(function(){
            BRW_ajax(shareBasicUrl + "a/?action=install", function(){
                sendToGoogleAnalitic(function() {
                    ga('send', 'event', 'app', 'install', BROWSER || 'chrome');
                });
                
            });    
        }, function(){
            if (typeof CNT !== "undefined") return true;
            else return false;
        }, {name:"Wait for CNT"});
    }

    /**
     * Set display current background file
     */
    function setDisplayCurrentBackgroundFile() {
        return localStorage.setItem("display-current-background-file", 1);
    }

    /**
     * Get display current background file
     */
    function getDisplayCurrentBackgroundFile() {
        return localStorage.getItem("display-current-background-file");
    }

    /**
     * Clear display current background file
     */
    function clearDisplayCurrentBackgroundFile() {
        return localStorage.removeItem("display-current-background-file");
    }

    /**
     * Get settings background tab id
     *
     * @returns {*}
     */
    function getSettingsBackgroundTabId() {
        var val = parseInt(localStorage.getItem("settings-background-current-tab"));
        return isNaN(val) ? 0 : val;
    }

    /**
     * Set settings background tab id
     *
     * @param val Int
     */
    function setSettingsBackgroundTabId(val) {
        val = parseInt(val);
        localStorage.setItem("settings-background-current-tab", isNaN(val) ? 0 : val);
    }

    /**
     * Get display video theme
     *
     * @returns {*}
     */
    function getDisplayVideoTheme() {
        var val = parseInt(localStorage.getItem("background-video-display"));
        return isNaN(val) ? true : val;
    }

    /**
     * Set display video theme
     *
     * @param val Int
     */
    function setDisplayVideoTheme(val) {
        localStorage.setItem("background-video-display", val ? 1 : 0);
    }

    /**
     * Get storage background image file
     */
    function getStorageBackgroundImageFile() {
        return localStorage.getItem("background-image-file");
    }

    /**
     * Get storage background video file
     */
    function getStorageBackgroundVideoFile() {
        return localStorage.getItem("background-video-file");
    }

    /**
     * Get background video file name
     */
    function getBackgroundVideoFile() {
        return getStorageBackgroundVideoFile();
    }

    /**
     * Get last installed theme id
     */
    function getLastInstalledThemeId() {
        return localStorage.getItem("last_installed_theme");
    }

    /**
     * Get display tiles count
     *
     * @returns {number}
     */
    function getDisplayTilesCount() {
        var val = localStorage.getItem("tiles-display-count");
        var maxVal = getMaxDisplayTilesCount();
        if(val > getMaxDisplayTilesCount())
            val = maxVal;
        return val && val > 0 ? val : displayTilesCount;
    }

    /**
     * Get max display tiles count
     *
     * @returns {number}
     */
    function getMaxDisplayTilesCount() {
        return maxDisplayTilesCount;
    }

    /**
     * Set display tiles count
     *
     * @param val Int
     */
    function setDisplayTilesCount(val) {
        var maxVal = getMaxDisplayTilesCount();
        if(val > getMaxDisplayTilesCount())
            val = maxVal;
        else if(val < 1)
            val = 1;
        localStorage.setItem("tiles-display-count", val);
    }

    /**
     * Get theme config url
     *
     * @returns {string}
     */
    function getThemesConfigUrl() {
        return themeConfigUrl;
    }

    /**
     * Get theme content url
     *
     * @returns {string}
     */
    function getThemesContentUrl() {
        return themesContentUrl;
    }

    /**
     * Get themes file system directory
     *
     * @returns {string}
     */
    function getThemesFileSystemDir() {
        return themeFileSystemDir;
    }

    /**
     * Get themes file system path
     *
     * @param path String
     * @returns {string}
     */
    function getThemesFileSystemPath(path) {
        return getThemesFileSystemDir() + "/" + path;
    }

    /**
     * Get thumbs file system path
     *
     * @param path String
     * @returns {string}
     */
    function getThumbsFileSystemPath() {
        return thumbFileSystemDir;
    }

    /**
     * Get application file system
     *
     * @param callBack Function
     * @param data {*}
     */
    //m START
    /*Moved to browser choiser*/
    function getFileSystem(callBack, data) {
        BRW_getFileSystem(callBack, data);
    }

    /**
     * Save theme video file
     *
     * @param fs FileSystem
     * @param data Object
     */
    function saveFile(fs, data) {
        createDirectoryStructure(fs.root, data.path.split('/'), fs, data, saveFileComplete);
    }

    /**
     * Save file complete
     *
     * @param fs FileSystem
     * @param data Object
     */
    /*Moved to browser choiser*/
    function saveFileComplete(fs, data) {
         BRW_saveFileComplete(fs, data);
    }

    /**
     * Create directory structure
     *
     * @param rootDirEntry FileEntry
     * @param folders Array
     * @param fs FileSystem
     * @param data Object
     * @param callback Object
     */

    /*Moved to browser choiser*/
    function createDirectoryStructure(rootDirEntry, folders, fs, data, callback) {
         BRW_createDirectoryStructure(rootDirEntry, folders, fs, data, callback);
    }

    /**
     * Get analyze last history items count
     *
     * @returns {number}
     */
    function getAnalyzeHistoryLength() {
        return analyzeHistoryItemsCount;
    }

    /**
     * Gte no tile image file name
     *
     * @returns {string}
     */
    function getNoTileImageFileName() {
        return noTileImageFileName;
    }

    /**
     * Get display tiles item count
     *
     * @returns {number}
     */
    function getDisplayTilesLength() {
        return displayTilesCount;
    }

    /**
     * Get install tiles item count
     *
     * @returns {*}
     */
    function getInstallTilesCount() {
        return getDisplayTilesCount();
    }

    /**
     * Get analyze last tiles items count
     *
     * @returns {number}
     */
    function getAnalyzeLastTilesCount() {
        var val = getDisplayTilesCount();
        return val > 0 ? val + 10 : 0;
    }

    /**
     * Get tiles screen built time
     *
     * @returns {number}
     */
    function getTilesScreenBuiltTime() {
        return maxTilesScreenBuiltTime;
    }

    /**
     * Create params string for DB search IN
     *
     * @param arr
     * @returns {string}
     */
    function createParams(arr) {
        var result = "";
        for (var i in arr)
            result += (result == "" ? "" : ", ") + "?";
        return result;
    }

    /**
     * Get url host name
     *
     * @param url String
     * @returns {string}
     */
    var URLsARR = [];
    function getUrlHost(urlRaw) {
        if(urlRaw === undefined) return urlRaw;
        else{
            var url = 'http://'+getCleanRedirectTxt(String(urlRaw));
            //if(String(url).indexOf("%3A") >= -1) url = decodeURIComponent(urlRaw);
        }//else
        
        var view0=false; if(!URLsARR[url]){console.log('in', url);URLsARR[url] = true; view0=true}
        
        var url = url
        
        var result = url;
        if(result && String(result).indexOf(".") >= 0 && String(result).indexOf("://") >= 0) {
            var hostName = url ? new URL(url).hostname : "";
            result = hostName ? hostName.replace(/^www\./, "") : url;
        }
        
        if(view0){console.log('out', result);URLsARR[result] = true;}
        
        return result;
    }

    /**
     * Clear url portocol
     *
     * @param url String
     * @returns {string}
     */
    function clearUrlProtocol(url) {
        return url ? url.replace(/^https:\/\//, "").replace(/^http:\/\//, "") : url;
    }

    /**
     * Check tile format
     *
     * @param tile History Item
     * @returns {boolean}
     */
    function checkTileFormat(tile) {
        return typeof(tile.url) != "undefined" &&
               typeof(tile.title) != "undefined" &&
               !(tile.url.indexOf("chrome") == 0 || tile.url.indexOf("file:///") === 0 || tile.url.indexOf("data:") === 0)
               /*&& new RegExp("(http://|https://)").test(tile.url)*/;
    }

    /**
     * Analyze history data
     *
     * @param callback Function
     * @param analyzeLastItemsCount int
     * @param data Object|null
     */
    //m START
    /*Moved to browser choiser*/
    function analyzeHistory(callback, analyzeLastItemsCount, data){
         BRW_analyzeHistory(callback, analyzeLastItemsCount, data);
    }
    

    /**
     * Get tiles domain top links
     *
     * @param mostVisitedURLs
     * @param callback Function
     * @returns {Array}
     */
    function getTilesDomainsTopLinks(mostVisitedURLs, callback) {
        var analyzeLastItemsCount = getAnalyzeHistoryLength();

        if (mostVisitedURLs.length > getAnalyzeHistoryLength())
            mostVisitedURLs = mostVisitedURLs.slice(0, analyzeLastItemsCount);

        BRW_dbTransaction(function (tx) {
            BRW_dbSelect({ //Param
                    tx : tx,
                    from: 'HOST_BLACKLIST'
                },
                function (results) { //Success
                    var items = results.rows;
                    var itemsLength = items.length;
                    var hostBlacklist = {};
                    for (var i = 0; i < itemsLength; i++)
                        hostBlacklist[items[i].host] = items[i].host;

                    getNextTilesIteration(mostVisitedURLs, [], hostBlacklist, 0, callback);
                },
                function () { //Error
                    console.log("ERROR, BRW_dbSelect from: 'HOST_BLACKLIST'");
                }
            );
        });
        
        /*
        getDb().readTransaction(function (tx) {
            tx.executeSql('SELECT * FROM HOST_BLACKLIST', [], function (tx, results) {
                var items = results.rows;
                var itemsLength = items.length;
                var hostBlacklist = {};
                for (var i = 0; i < itemsLength; i++)
                    hostBlacklist[items[i].host] = items[i].host;

                getNextTilesIteration(mostVisitedURLs, [], hostBlacklist, 0, callback);
            });
        });
        */
    }

    /**
     * Get next tiles iteration
     *
     * @param mostVisitedURLs Array
     * @param pageHistoryTiles Array
     * @param hostBlacklist Object
     * @param i Int
     * @param callback Function
     */
    function getNextTilesIteration(mostVisitedURLs, pageHistoryTiles, hostBlacklist, i, callback) {
        if(typeof(mostVisitedURLs[i]) != "undefined") {
            var mv = mostVisitedURLs[i];
            if(checkTileFormat(mv)) {
                var itemHostName = new URL(mv.url).hostname;
                
                //alert(itemHostName);
                
                if(typeof (itemHostName) != "undefined") {
                    itemHostName = itemHostName.replace(/^www\./, "");
                    if(itemHostName && typeof (hostBlacklist[itemHostName]) == "undefined") {
                        mv.image = "";
                        if (typeof (pageHistoryTiles[itemHostName]) == "undefined") {
                            mv.totalVisitCount = mv.visitCount;
                            pageHistoryTiles[itemHostName] = mv;
                        } else {
                            if (mv.visitCount > pageHistoryTiles[itemHostName].visitCount) {
                                mv.totalVisitCount = pageHistoryTiles[itemHostName].totalVisitCount + mv.visitCount;
                                pageHistoryTiles[itemHostName] = mv;
                            } else {
                                pageHistoryTiles[itemHostName].totalVisitCount += mv.visitCount;
                            }
                        }
                        getNextTilesIteration(mostVisitedURLs, pageHistoryTiles, hostBlacklist, ++i, callback);
                    } else {
                        getNextTilesIteration(mostVisitedURLs, pageHistoryTiles, hostBlacklist, ++i, callback);
                    }
                } else {
                    getNextTilesIteration(mostVisitedURLs, pageHistoryTiles, hostBlacklist, ++i, callback);
                }
            } else {
                getNextTilesIteration(mostVisitedURLs, pageHistoryTiles, hostBlacklist, ++i, callback);
            }
        } else {
            getNextTilesEnd(pageHistoryTiles, callback);
        }
    }

    /**
     * Get next tiles iterations end
     *
     * @param pageHistoryTiles Array
     * @param callback Function
     */
    function getNextTilesEnd(pageHistoryTiles, callback) {
        var tilesDomainsTopLinks = [];
        for(var i in pageHistoryTiles)
            tilesDomainsTopLinks.push(pageHistoryTiles[i]);
        if(tilesDomainsTopLinks.length)
            tilesDomainsTopLinks.sort(compareHistoryItemByTotalViews);
        callback(tilesDomainsTopLinks);
    }

    /**
     * Compare history items by total view count
     *
     * @param a Object
     * @param b Object
     * @returns {number}
     */
    function compareHistoryItemByTotalViews(a,b) {
        return b.totalVisitCount - a.totalVisitCount;
    }

    /**
     * Refresh opened new tab pages
     *
     * @param data Object
     */
    /*Moved to browser choiser*/
    function refreshNewTabPages(data) {
         BRW_refreshNewTabPages(data);
    }

    /**
     * Get new tab pages
     *
     * @param callback Function
     * @param data Object
     */
    //m START
    /*Moved to browser choiser*/
    function getNetTabPages(callback, data) {
        BRW_getNetTabPages(callback, data);
    }

    /**
     * Get options pages
     *
     * @param callback Function
     * @param data Object
     */
    /*Moved to browser choiser*/
    function getOptionsTabPages(callback, data) {
         BRW_getOptionsTabPages(callback, data);
    }

    /**
     * Get favorite pages
     *
     * @param callback Function
     * @param data Object
     */
    /*Moved to browser choiser*/
    function getFavoriteTabPages(callback, data) {
         BRW_getFavoriteTabPages(callback, data);
    }

    /**
     * Get options pages
     *
     * @param callback Function
     * @param data Object
     */
    /*Moved to browser choiser*/
    function getSettingsTabPages(callback, data) {
         BRW_getSettingsTabPages(callback, data);
    }

    /**
     * Get options themes pages
     *
     * @param callback Function
     * @param data Object
     */
    /*Moved to breowser chioser*/
    function getOptionsThemesTabPages(callback, data) {
             BRW_getOptionsThemesTabPages(callback, data);
    }
    
    //m START
    /*Moved to breowser chioser*/
    function reloadTabPages(data) {
        BRW_reloadTabPages(data);
    }

    /**
     * Get app installed date
     *
     * @returns {*}
     */
    function getAppInstalledDate() {
        return localStorage.getItem("installed-key");
    }

    /**
     * Set app installed date
     */
    function setAppInstalledDate() {
        var value = new Date;
        localStorage.setItem("installed-key", value.getTime());
    }

    /**
     * Check current platform is Windows platform
     *
     * @returns {boolean}
     */
    function isWindowsPlatform() {
        return appPlatform.indexOf( "win" ) === 0;
    }

    /**
     * Get last install dials window id
     *
     * @returns {*}
     */
    function getLastInstallWindow() {
        var val = localStorage.getItem("loading-thumb-window");
        var valInt = parseInt(val);
        return isNaN(valInt) ? val : valInt;
    }

    /**
     * Set last install dials window id
     *
     * @param windowId Int
     */
    function setLastInstallWindow(windowId) {
        localStorage.setItem("loading-thumb-window", windowId);
    }

    /**
     * Clear last install dials window id
     */
    function clearLastInstallWindow() {
        localStorage.removeItem("loading-thumb-window");
    }

    /**
     * Get max search form opacity
     *
     * @returns {number}
     */
    function getMaxSearchFormOpacity() {
        return maxSearchFormOpacity;
    }

    /**
     * Get min search form opacity
     *
     * @returns {number}
     */
    function getMinSearchFormOpacity() {
        return minSearchFormOpacity;
    }

    /**
     * Get max clock opacity
     *
     * @returns {number}
     */
    function getMaxClockOpacity() {
        return maxClockOpacity;
    }

    /**
     * Get min clock opacity
     *
     * @returns {number}
     */
    function getMinClockOpacity() {
        return minClockOpacity;
    }

    /**
     * Get max clock background opacity
     *
     * @returns {number}
     */
    function getMaxClockBackgroundOpacity() {
        return maxClockBackgroundOpacity;
    }

    /**
     * Get min clock background opacity
     *
     * @returns {number}
     */
    function getMinClockBackgroundOpacity() {
        return minClockBackgroundOpacity;
    }

    /**
     * Get max clock opacity
     *
     * @returns {number}
     */
    function getMaxWeatherOpacity() {
        return maxWeatherOpacity;
    }

    /**
     * Get min clock opacity
     *
     * @returns {number}
     */
    function getMinWeatherOpacity() {
        return minWeatherOpacity;
    }

    /**
     * Get max bottom panel opacity
     *
     * @returns {number}
     */
    function getMaxBottomPanelOpacity() {
        return maxBottomPanelOpacity;
    }

    /**
     * Get min bottom panel opacity
     *
     * @returns {number}
     */
    function getMinBottomPanelOpacity() {
        return minBottomPanelOpacity;
    }

    /**
     * Get max relax panel opacity
     *
     * @returns {number}
     */
    function getMaxRelaxPanelOpacity() {
        return maxRelaxPanelOpacity;
    }

    /**
     * Get min relax panel opacity
     *
     * @returns {number}
     */
    function getMinRelaxPanelOpacity() {
        return minRelaxPanelOpacity;
    }

    /**
     * Get max clock background opacity
     *
     * @returns {number}
     */
    function getMaxWeatherBackgroundOpacity() {
        return maxWeatherBackgroundOpacity;
    }

    /**
     * Get min clock background opacity
     *
     * @returns {number}
     */
    function getMinWeatherBackgroundOpacity() {
        return minWeatherBackgroundOpacity;
    }

    /**
     * Get max dials form opacity
     *
     * @returns {number}
     */
    function getMaxDialsFormOpacity() {
        return maxDialsFormOpacity;
    }

    /**
     * Get min dials form opacity
     *
     * @returns {number}
     */
    function getMinDialsFormOpacity() {
        return minDialsFormOpacity;
    }

    /**
     * Set search form opacity
     *
     * @param opacity
     */
    function setSearchFormOpacity(opacity) {
        if(opacity < minSearchFormOpacity)
            opacity = minSearchFormOpacity;
        else if(opacity > maxSearchFormOpacity)
            opacity = maxSearchFormOpacity;
        localStorage.setItem("search-form-opacity", opacity);
    }

    /**
     * Set clock opacity
     *
     * @param opacity
     */
    function setClockOpacity(opacity) {
        if(opacity < minClockOpacity)
            opacity = minClockOpacity;
        else if(opacity > maxClockOpacity)
            opacity = maxClockOpacity;
        localStorage.setItem("page-clock-opacity", opacity);
    }

    /**
     * Set clock background opacity
     *
     * @param opacity
     */
    function setClockBackgroundOpacity(opacity) {
        if(opacity < minClockBackgroundOpacity)
            opacity = minClockBackgroundOpacity;
        else if(opacity > maxClockBackgroundOpacity)
            opacity = maxClockBackgroundOpacity;
        localStorage.setItem("page-clock-background-opacity", opacity);
    }

    /**
     * Get max background parallax value
     *
     * @returns {number}
     */
    function getMaxBackgroundParallaxValue() {
        return maxBackgroundParallaxValue;
    }

    /**
     * Get dials form opacity
     */
    function getDialsFormOpacity() {
        var opacity = localStorage.getItem("dials-form-opacity");
        return opacity && opacity > 0 ? opacity : defaultDialsFormOpacity;
    }

    /**
     * Get min background parallax value
     *
     * @returns {number}
     */
    function getMinBackgroundParallaxValue() {
        return minBackgroundParallaxValue;
    }

    /**
     * Set background parallax value
     *
     * @param opacity
     */
    function setBackgroundParallaxValue(opacity) {
        if(opacity < minBackgroundParallaxValue)
            opacity = minBackgroundParallaxValue;
        else if(opacity > maxBackgroundParallaxValue)
            opacity = maxBackgroundParallaxValue;
        localStorage.setItem("background-parallax-value", opacity);
    }

    /**
     * Get background parallax value
     */
    function getBackgroundParallaxValue() {
        var value = localStorage.getItem("background-parallax-value");
        return value && value > 0 ? value : defaultBackgroundParallaxValue;
    }

    /**
     * Get last install dials state
     *
     * @returns {*}
     */
    function getLastInstallState() {
        return localStorage.getItem("loading-thumb-state");
    }

    /**
     * Set last install dials state
     *
     * @param state Int
     */
    function setLastInstallState(state) {
        localStorage.setItem("loading-thumb-state", state);
    }

    /**
     * Clear last install dials state
     */
    function clearLastInstallState() {
        localStorage.removeItem("loading-thumb-state");
    }

    /**
     * Get download image status
     *
     * @returns {boolean}
     */
    function getDownloadImageThemeStatus() {
        return downloadImageThemeStatus;
    }

    /**
     * Get download video status
     *
     * @returns {boolean}
     */
    function getDownloadVideoThemeStatus() {
        return downloadVideoThemeStatus;
    }

    /**
     * Set downloading image data
     *
     * @param themeId String
     * @param fileName String
     * @param resolution Int
     */
    function setDownloadingImageData(themeId, fileName, resolution) {
        var imageData = {
            themeId : themeId,
            fileName : fileName,
            resolution : resolution
        };
        localStorage.setItem("downloading-image-data", JSON.stringify(imageData));
    }

    /**
     * Get downloading image data
     *
     * @return Object|null
     */
    function getDownloadingImageData() {
        var result = localStorage.getItem("downloading-image-data");
        return result ? JSON.parse(result) : null;
    }

    /**
     * Clear downloading image
     */
    function clearDownloadingImageData() {
        localStorage.removeItem("downloading-image-data");
    }

    /**
     * Set downloading video data
     *
     * @param themeId String
     * @param fileName String
     * @param resolution Int
     * @param contentType Int
     */
    function setDownloadingVideoData(themeId, fileName, resolution, contentType) {
        var videoData = {
            'themeId' : themeId,
            'fileName' : fileName,
            'resolution' : resolution,
            'contentType' : contentType
        };
        localStorage.setItem("downloading-video-data", JSON.stringify(videoData));
    }

    /**
     * Get downloading video data
     *
     * @return Object|null
     */
    function getDownloadingVideoData() {
        var result = localStorage.getItem("downloading-video-data");
        return result ? JSON.parse(result) : null;
    }

    /**
     * Clear downloading video
     */
    function clearDownloadingVideoData() {
        localStorage.removeItem("downloading-video-data");
    }

    /**
     * Add theme installed element
     *
     * @param theme Object
     * @param fileName String
     * @param fileResolution String
     * @param fileType String
     * @param contentType Number
     */
    function addThemeInstalledElement(theme, fileName, fileResolution, fileType, contentType) {
        
        
        fileType = fileType || "bgFilePath";
        var themes = getInstalledThemes();
        if(typeof (themes[theme.id]) == "undefined") {
            var isFlixelContent = contentType && contentType == flixelBackgroundType;
            var author = typeof (theme.author) != "undefined" && theme.author ? theme.author : "";
            var authorUrl = theme.author_url ? theme.author_url : "";
            var handmade = theme.handmade ? 1 : 0;
            
            var bgPoster = theme.bgPoster ? theme.bgPoster : "";
            var fullHd = theme.fullHd ? true : false;
            themes[theme.id] = {
                "id" : theme.id,
                "title" : theme.title,
                "bgFilePath" : {},
                "bgVideoPath" : {},
                "lastInstallBgVideo" : null,
                "isFlixelContent" : isFlixelContent,
                "author" : author,
                "author_url" : authorUrl,
                "bgPoster" : bgPoster,
                "fullHd" : fullHd,
                "handmade" : handmade
            };
        }
        if(fileType == "bgVideoPath")
            themes[theme.id]["lastInstallBgVideo"] = {
                "fileName" : fileName,
                "resolution" : fileResolution
            };

        themes[theme.id][fileType][fileResolution] = fileName;
        localStorage.setItem("installed-themes", JSON.stringify(themes));
    }

    /**
     * Get favorite themes object
     *
     * @return Object
     */
    function getFavoriteThemesObject() {
        var result = {};
        var favoriteThemesData = localStorage.getItem("favorite-themes-data");
        if(favoriteThemesData) {
            var favoriteThemesList = JSON.parse(favoriteThemesData);
            for(i in favoriteThemesList) {
                var favoriteTheme = favoriteThemesList[i];
                result[favoriteTheme.id] = favoriteTheme;
            }
        }
        return result;
    }

    /**
     * Check theme is favorite
     *
     * @param availableTheme Object
     * @param favoriteThemes Object
     * @return Boolean
     */
    function checkThemeIsFavorite(availableTheme, favoriteThemes) {
        var result = false;
        if(typeof (favoriteThemes[availableTheme['id']]) != "undefined") {
            if(typeof(favoriteThemes[availableTheme['id']]['contentType']) != "undefined")
                if(availableTheme['contentType'] == favoriteThemes[availableTheme['id']]['contentType'])
                    result = true;
                else if(availableTheme['contentType'] == liveThemesType) {
                    if(favoriteThemes[availableTheme['id']]['contentType'] == staticBackgroundType && typeof (availableTheme['bgFilePath']) != "undefined")
                        result = true;

                    if(favoriteThemes[availableTheme['id']]['contentType'] == liveBackgroundType && typeof(availableTheme['bgVideoPath']) != "undefined")
                        result = true;
                }
        }
        return result;
    }

    /**
     * Add theme elemnet to favorite
     *
     * @param contentType Int
     * @param contentId String
     * @return Boolean
     */
    function addThemeElementToFavorite(contentType, contentId) {
        var result = false;
        var item = null;
        var i;

        if(contentType == liveThemesType || contentType == liveBackgroundType || contentType == staticBackgroundType) {
            var availableThemesData = localStorage.getItem("available-themes-data");
            if(availableThemesData) {
                var availableThemes = JSON.parse(availableThemesData);
                for(i in availableThemes) {
                    var availableTheme = availableThemes[i];

                    if(contentType == liveThemesType) {
                        if(availableTheme['contentType'] == liveThemesType && typeof (availableTheme['bgVideoPath']) != "undefined" && typeof (availableTheme['bgFilePath']) != "undefined") {
                            if(availableTheme['id'] == contentId) {
                                item = availableTheme;
                                item['contentType'] = liveThemesType;
                            }
                        }
                    }

                    if(contentType == liveBackgroundType) {
                        if((availableTheme['contentType'] == liveBackgroundType || availableTheme['contentType'] == liveThemesType) && typeof (availableTheme['bgVideoPath']) != "undefined") {
                            if(availableTheme['id'] == contentId) {
                                item = availableTheme;
                                item['contentType'] = liveBackgroundType;
                            }
                        }
                    }

                    if(contentType == staticBackgroundType) {
                        if((availableTheme['contentType'] == staticBackgroundType || availableTheme['contentType'] == liveThemesType) && typeof (availableTheme['bgFilePath']) != "undefined") {
                            if(availableTheme['id'] == contentId) {
                                item = availableTheme;
                                item['contentType'] = staticBackgroundType;
                            }
                        }
                    }
                }
            }
        }

        if(contentType == flixelBackgroundType) {
            var flixelThemesData = localStorage.getItem("flixel-themes-data");
            if(flixelThemesData) {
                var flixelThemes = JSON.parse(flixelThemesData);
                flixelThemes = flixelThemes.results;

                for(i in flixelThemes) {
                    var flixelTheme = flixelThemes[i];
                    if(flixelTheme['contentType'] == flixelBackgroundType && typeof (flixelTheme['bgVideoPath']) != "undefined") {
                        if(flixelTheme['id'] == contentId) item = flixelTheme;
                    }
                }
            }
        }

        if(item) {
            var alreadyInFavorite = false;
            var favoriteThemesData = localStorage.getItem("favorite-themes-data");
            var favoriteThemes = [];
            if(favoriteThemesData) {
                favoriteThemes = JSON.parse(favoriteThemesData);
                for(i in favoriteThemes) {
                    var favoriteTheme = favoriteThemes[i];
                    if(favoriteTheme['contentType'] == item['contentType']  && favoriteTheme['id'] == item['id']) {
                        alreadyInFavorite = true;
                        break;
                    }
                }
            }
            if(!alreadyInFavorite) {
                favoriteThemes.push(item);
                favoriteThemesData = JSON.stringify(favoriteThemes);
                localStorage.setItem("favorite-themes-data", favoriteThemesData);
            }
            result = true;
        }

        return result;
    }

    /**
     * Remove theme element form favorite
     *
     * @param contentType Int
     * @param contentId String
     * @return Boolean
     */
    function removeThemeElementFromFavorite(contentType, contentId) {
        var alreadyInFavorite = false;
        var favoriteThemesData = localStorage.getItem("favorite-themes-data");
        var favoriteThemes = [];
        if(favoriteThemesData) {
            var favoriteThemes = JSON.parse(favoriteThemesData);
            for(i in favoriteThemes) {
                var favoriteTheme = favoriteThemes[i];
                if(favoriteTheme['contentType'] == contentType  && favoriteTheme['id'] == contentId) {
                    alreadyInFavorite = true;
                    favoriteThemes.splice(i, 1);
                    break;
                }
            }
        }

        if(alreadyInFavorite) {
            favoriteThemesData = JSON.stringify(favoriteThemes);
            localStorage.setItem("favorite-themes-data", favoriteThemesData);
        }
    }

    /**
     * Set hide video theme offer theme id
     *
     * @param themeId String
     */
    function setHideVideoThemeOfferThemeId(themeId) {
        localStorage.setItem("hide-video-theme-offer", themeId);
    }

    /**
     * Set hide video theme offer theme id
     *
     * @return String
     */
    function getHideVideoThemeOfferThemeId() {
        var result = localStorage.getItem("hide-video-theme-offer");
            result = result ? result : "";
        return result;
    }

    /**
     * Clear hide video theme offer theme id
     */
    function clearHideVideoThemeOfferThemeId() {
        localStorage.removeItem("hide-video-theme-offer");
    }

    /**
     * Get installed themes
     *
     * @returns {{}}
     */
    function getInstalledThemes() {
        var themes = localStorage.getItem("installed-themes");
        return themes ? JSON.parse(themes) : {};
    }

    /**
     * Get last install video url
     *
     * @param themeId String
     * @returns {string}
     */
    function getThemeLastInstallVideoFile(themeId) {
        var result = "";
        var installedThemes = getInstalledThemes();
        if(typeof (installedThemes[themeId]) != "undefined" && installedThemes[themeId]["lastInstallBgVideo"]) {
            result = installedThemes[themeId]["lastInstallBgVideo"];
            result["url"] = getVideoThemeContentUrl(themeId, installedThemes[themeId]["lastInstallBgVideo"]["resolution"]);
        }
        return result;
    }

    /**
     * Get installed file resolutions
     *
     * @param currentThemeId String
     * @returns {Number|null}
     */
    function getInstalledFileResolution(currentThemeId) {
        var installedResolution = null;
        var installedThemes = getInstalledThemes();
            if(typeof (installedThemes[currentThemeId]) != "undefined" && installedThemes[currentThemeId]) {
                if(typeof (installedThemes[currentThemeId]['lastInstallBgVideo']) != "undefined" && installedThemes[currentThemeId]['lastInstallBgVideo']) {
                    if(typeof (installedThemes[currentThemeId]['lastInstallBgVideo']['resolution']) != "undefined") {
                        installedResolution = installedThemes[currentThemeId]['lastInstallBgVideo']['resolution'];
                    }
                }
            }
        return installedResolution;
    }

    /**
     * Get length associative array
     *
     * @param data Object
     * @returns {Number}
     */
    function getArrayLength(data) {
        return Object.keys(data).length
    }

    /**
     * Get first associative array key
     *
     * @param data Object
     * @returns {string}
     */
    function getArrayFirstKey(data) {
        var result, prop;
        for(prop in data) {
            if(data.hasOwnProperty(prop)) {
                result = prop;
                break;
            }
        }
        return result;
    }

    /**
     * Get theme config url
     *
     * @param themeId
     */
    function getThemeConfigUrl(themeId) {
        return getThemesConfigUrl() + themeId;
    }

    /**
     * Get theme content url
     *
     * @param themeId String
     * @param fileName String
     * @returns {string}
     */
    function getThemeContentUrl(themeId, fileName) {
        return getThemesContentUrl() + themeId + '/' + fileName;
    }

    /**
     * Get video theme content url
     *
     * @param themeId Int
     * @param width String
     * @returns {string}
     */
    function getVideoThemeContentUrl(themeId, width) {
        return getThemeContentUrl(themeId, "/v" + width + "bg.mp4");
    }

    /**
     * Get theme content thumb image
     *
     * @param themeId String
     * @returns {string}
     */
    function getThemeContentThumbImage(themeId) {
        return getThemesContentUrl() + themeId + '/' + "thumb.png";
    }

    /**
     * Get theme content thumb video
     *
     * @param themeId String
     * @returns {string}
     */
    function getThemeContentThumbVideo(themeId) {
        return getThemesContentUrl() + themeId + '/' + "vthumb.mp4";
    }

/**
     * Open selected url
     *
     * @param type Int
     * @param url String
     */
    function openSelectedUrl(type, url) {
        if(url) {
            switch (type) {
                case openCurrentTab :
                    openUrlInCurrentTab(url);
                    break;
                case openNewTab :
                    openUrlInNewTab(url);
                    break;
                case openBackgroundTab :
                    openUrlInBackgroundTab(url);
                    break;
            }
        }
    }

    /**
     * Open url in current tab
     *
     * @param url String
     */

    /*Moved to browser choiser*/
    function openUrlInCurrentTab(url){
         BRW_openUrlInCurrentTab(url);
    }

    /**
     * Open url in new tab
     *
     * @param url String
     */
    /*Moved to browser choiser*/
    function openUrlInNewTab(url){
         BRW_openUrlInNewTab(url);
    }

    /**
     * Open url in background tab
     *
     * @param url String
     */
    /*Moved to browser choiser*/    
    function openUrlInBackgroundTab(url){
         BRW_openUrlInBackgroundTab(url);
    }

    /**
     * Move array elements
     *
     * @param current_array Array
     * @param old_index Int
     * @param new_index Int
     * @returns {Array}
     */
    function moveArrayElements(current_array, old_index, new_index) {
        while (old_index < 0) {
            old_index += current_array.length;
        }
        while (new_index < 0) {
            new_index += current_array.length;
        }
        if (new_index >= current_array.length) {
            var k = new_index - current_array.length;
            while ((k--) + 1) {
                current_array.push(undefined);
            }
        }
        current_array.splice(new_index, 0, current_array.splice(old_index, 1)[0]);
        return current_array;
    }

    /**
     * Get current date
     *
     * @returns {string}
     */
    function getCurrentDate() {
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        return year + "-" + month + "-" + day;
    }

    /**
     * Translate string
     *
     * @param key
     * @returns String
     */
    /*Moved to Browser choiser*/
    function translate(key) {
        return BRW_translate(key);
        //return chrome.i18n.getMessage(key);
    }

    /**
     * Get theme id by file path
     *
     * @param filePath
     * @returns {string}
     */
    function getThemeIdByFilePath(filePath) {
        return filePath ? filePath.substring(0, filePath.indexOf("/")) : "";
    }

    /**
     * Get clock themes resources
     *
     * @param themeNum Number
     * @param fileName String
     * @returns {*}
     */
    function getClockThemesResources(themeNum, fileName) {
        return extensionGetUrl("pages/newtab/css/clock/themes/theme-" + themeNum + "/" + fileName);
    }

    /**
     * Load js or css file
     *
     * @param filename String
     * @param filetype String
     */
    function loadjscssfile(filename, filetype) {
        var fileref;
        if (filetype == "js") { //if filename is a external JavaScript file
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
        }
        else if (filetype == "css") { //if filename is an external CSS file
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    }

    /**
     * Hex to rgb
     *
     * @param hex String
     * @returns {*}
     */
    function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Validate email format
     *
     * @param email String
     * @returns {boolean}
     */
    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    /**
     * Add url http if not exist protocol
     *
     * @param url String
     * @returns String
     */
    function addUrlHttp(url) {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }

    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };


    /******** WEATHER COMMON FUNCTIONALITY  ********/

    /**
     * Set application display weather widget
     *
     * @param val Number
     * @param callback Function
     */
    function setDisplayWeatherPanel(val, callback) {
        setSettingsValue("weather-block-display", val ? 1 : 0, callback);
    }

    /**
     * Get application display weather widget
     *
     * @param callback Function
     */
    function getDisplayWeatherPanel(callback) {
        getSettingsValue("weather-block-display", 1, callback);
    }

    /**
     * Set application bookmarks disable
     *
     * @param callback Function
     */
    function setBookmarksDisable(callback) {
        setSettingsValue("bookmarks-popup-disable", 1, callback);
    }

    /**
     * Get application bookmarks disable
     *
     * @param callback Function
     */
    function getBookmarksDisable(callback) {
        getSettingsValue("bookmarks-popup-disable", 0, callback);
    }

    /**
     * Set application relax modal disable
     */
    function setRelaxModalDisable() {
        localStorage.setItem("relax-popup-disable", 1);
    }

    /**
     * Get application relax modal disable
     *
     * @return Number
     */
    function getRelaxModalDisable() {
        return localStorage.getItem("relax-popup-disable") || 0;
    }

    /**
     * Set application weather unit
     *
     * @param val String
     * @param callback Function
     */
    function setWeatherUnit(val, callback) {
        val = val.toLowerCase();
        if(val == locationWeatherUnitCel || val == locationWeatherUnitFar) {
            setSettingsValue("weather-block-set-unit", val, function() {
                convertWeatherUnit(val);
                if(callback)
                    callback(unit);
            });
        }
    }

    /**
     * Get application weather unit
     *
     * @param callback Function
     */
    function getWeatherUnit(callback) {
        getSettingsValue("weather-block-set-unit", "", callback);
    }

    /**
     * Get application weather unit value
     *
     * @param callback Function
     */
    function getWeatherUnitVal(callback) {
        getSettingsValue("weather-block-set-unit", "", function(unit) {
            if(unit) {
                callback(unit);
            } else {
                getLastLocationWeather(function(locationWear) {
                    if (locationWear) {
                        callback(locationWear.unit);
                    } else {
                        BRW_getUILanguage(function(userLang){//firefox add callback function
                            //var userLang = chrome.i18n.getUILanguage();
                            
                            var country = userLang.toUpperCase().slice(userLang.length - 2, userLang.length);
                            callback(getTemperatureUnitByCountryName(country));
                        });
                    }
                });
            }
        });
    }

    /**
     * Convert temperature unit
     *
     * @param unit String
     */
    function convertWeatherUnit(unit) {
        getLastLocationWeather(function(locationWear) {
            if(locationWear) {
                if(unit != locationWear.unit) {
                    locationWear.weather.temp = parseInt(locationWear.weather.temp);
                    var value;
                    if(locationWear.unit == locationWeatherUnitCel)
                        value = calculateWeatherTemperatureFtoC(locationWear.weather.temp);
                    else
                        value = calculateWeatherTemperatureCtoF(locationWear.weather.temp);

                    locationWear.weather.temp = value.temp;
                    locationWear.unit = value.unit;
                    setLastLocationWeather(locationWear);
                }
            }
        });
    }

    /**
     * Calculate weather temperature from f to c
     *
     * @param val
     * @returns {{temp: number, unit: string}}
     */
    function calculateWeatherTemperatureFtoC(val) {
        return {"temp" :  Math.round(5 * (val - 32) /9), "unit" : "c"};
    }

    /**
     * Calculate weather temperature from c to f
     *
     * @param val
     * @returns {{temp: number, unit: string}}
     */
    function calculateWeatherTemperatureCtoF(val) {
        return {"temp" : Math.round(9 * val / 5 + 32) , "unit" : "f"};
    }

    /**
     * Get last client location weather
     *
     * @param callback Function
     */
    function getLastLocationWeather(callback) {
        getSettingsValue("location-weather", null, function(locationWeather) {
            locationWeather = locationWeather ? JSON.parse(locationWeather) : null;
            if(callback)
                callback(locationWeather);
        });
    }

    /**
     * Get last client location weather
     *
     * @param locationWeather Object
     * @param callback Function
     */
    function setLastLocationWeather(locationWeather, callback) {
        locationWeather = JSON.stringify(locationWeather);
        setSettingsValue("location-weather", locationWeather, callback);
    }

    /**
     * Set application display weather temperature unit
     *
     * @param val Number
     * @param callback Function
     */
    function setDisplayWeatherUnit(val, callback) {
        setSettingsValue("weather-unit-display", val ? 1 : 0, callback);
    }

    /**
     * Get application display weather temperature unit
     *
     * @param callback Function
     */
    function getDisplayWeatherUnit(callback) {
        getSettingsValue("weather-unit-display", 1, callback);
    }

    /**
     * Set application display weather background
     *
     * @param val Number
     * @param callback Function
     */
    function setDisplayWeatherBackground(val, callback) {
        setSettingsValue("weather-background-display", val ? 1 : 0, callback);
    }

    /**
     * Get application display weather background
     *
     * @param callback Function
     */
    function getDisplayWeatherBackground(callback) {
        getSettingsValue("weather-background-display", 1, callback);
    }

    /**
     * Get display weather coordinates panel
     *
     * @returns {*}
     */
    function getDisplayWeatherCoordinates() {
        var val = localStorage.getItem("weather-block-display-coordinates");
        return val ? JSON.parse(val) : null;
    }

    /**
     * Set display weather coordinates panel
     *
     * @param top Int
     * @param left Int
     */
    function setDisplayWeatherCoordinates(top, left) {
        var coordinates = {"top" : top, "left" : left};
        localStorage.setItem("weather-block-display-coordinates", JSON.stringify(coordinates));
    }

    /**
     * Reset weather coordinates to default
     */
    function resetWeatherPosition() {
        localStorage.removeItem("weather-block-display-coordinates");
    }

    /**
     * Set weather opacity
     *
     * @param opacity
     */
    function setWeatherOpacity(opacity) {
        if(opacity < minWeatherOpacity)
            opacity = minWeatherOpacity;
        else if(opacity > maxWeatherOpacity)
            opacity = maxWeatherOpacity;
        localStorage.setItem("page-weather-opacity", opacity);
    }

    /**
     * Set bottom panel opacity
     *
     * @param opacity
     */
    function setBottomPanelOpacity(opacity) {
        if(opacity < minBottomPanelOpacity)
            opacity = minBottomPanelOpacity;
        else if(opacity > maxBottomPanelOpacity)
            opacity = maxBottomPanelOpacity;
        localStorage.setItem("page-bottom-panel-opacity", opacity);
    }

    /**
     * Get geo.placefinder url
     *
     * @param search String
     * @return String
     */
    function getGeoPlaceFinedUrl(search) {
        return "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20text%3D%22"+encodeURIComponent(search)+"%22%20and%20gflags%3D%22R%22&format=json&diagnostics=true&callback=";
    }

    /**
     * Get alternative geo.placefinder url
     *
     * @param search String
     * @return String
     */
    function getAlternativePlaceFinder(search) {
        return "https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20geo.places%20WHERE%20text%3D%22"+encodeURIComponent(search)+"%22&format=json";
    }

    /**
     * Get alternative place by coordinates
     *
     * @param search String
     * @returns {string}
     */
    function getAlternativePlaceByCoordinates(search) {
        return "http://maps.googleapis.com/maps/api/geocode/json?latlng="+encodeURIComponent(search)+"&sensor=false";
    }

    /**
     * Get geo yandex url
     *
     * @param search String
     * @return String
     */
    function getGeoPlaceFinedUrlYandex(search) {
        return "https://geocode-maps.yandex.ru/1.x/?format=xml&lang=ru-RU&results=1&kind=locality&geocode=" + encodeURIComponent(search);
    }

    /**
     * Get weather.forecast url
     *
     * @param id Int
     * @param unit String
     * @return String
     */
    function getWeatherForecastUrl(id, unit) {
        return "https://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent("select * from weather.forecast where woeid=" + id + ' and u="' + unit + '"')+"&format=json&callback=";
    }

    /**
     * Get weather yandex url
     *
     * @param id Int
     * @return String
     */
    function getWeatherYandexUrl(id) {
        return "http://export.yandex.ru/weather-ng/forecasts/" + encodeURIComponent(id) + ".xml";
    }

    /**
     * Get weather images table
     *
     * @param wearCode Int
     * @returns {*}
     */
    function getWeatherImage(wearCode) {
        var icons={};
        // yahoo icons
        icons[0] ="F";icons[1] ="F";icons[2] ="F";icons[3] ="O";icons[4] ="P";icons[5] ="X";
        icons[6] ="X";icons[7] ="X";icons[8] ="X";icons[9] ="Q";icons[10]="X";icons[11]="R";
        icons[12]="R";icons[13]="U";icons[14]="U";icons[15]="U";icons[16]="W";icons[17]="X";
        icons[18]="X";icons[19]="J";icons[20]="M";icons[21]="J";icons[22]="M";icons[23]="F";
        icons[24]="F";icons[25]="G";icons[26]="Y";icons[27]="I";icons[28]="H";icons[29]="E";
        icons[30]="H";icons[31]="C";icons[32]="B";icons[33]="C";icons[34]="B";icons[35]="X";
        icons[36]="B";icons[37]="O";icons[38]="O";icons[39]="O";icons[40]="R";icons[41]="W";
        icons[42]="U";icons[43]="W";icons[44]="H";icons[45]="O";icons[46]="W";icons[47]="O"; icons[3200]=")";
        //yandex icons
        icons["bkn_-ra_d"] ="H";icons["bkn_-ra_n"] ="I";icons["bkn_-sn_d"] ="U";icons["bkn_-sn_n"] ="U";
        icons["bkn_d"] ="E";icons["bkn_n"] ="E";icons["bkn_ra_d"] ="R";icons["bkn_ra_n"] ="R";icons["bkn_sn_d"] ="W";
        icons["bkn_sn_n"] ="W";icons["bl"] ="F";icons["fg_d"] ="M";icons["ovc"] ="N";icons["ovc_-ra"] ="Q";
        icons["ovc_-sn"] ="U";icons["ovc_ra"] ="R";icons["ovc_sn"] ="W";icons["ovc_ts_ra"] ="O";icons["skc_d"] ="B";
        icons["skc_n"] ="C";icons["bkn_+ra_d"] ="R";icons["bkn_+ra_n"] ="R";icons["bkn_+sn_d"] ="X";
        icons["bkn_+sn_n"] ="X";icons["ovc_+ra"] ="R";icons["ovc_+sn"] ="W";

        return typeof (icons[wearCode]) != "undefined" ? icons[wearCode] : icons[3200];
    }

    /**
     * Set weather background opacity
     *
     * @param opacity
     */
    function setWeatherBackgroundOpacity(opacity) {
        if(opacity < minWeatherBackgroundOpacity)
            opacity = minWeatherBackgroundOpacity;
        else if(opacity > maxWeatherBackgroundOpacity)
            opacity = maxWeatherBackgroundOpacity;
        localStorage.setItem("page-weather-background-opacity", opacity);
    }

    /**
     * Search place by direct input
     *
     * @param search String
     * @param callback Function
     */
    function searchPlaceByDirectInput(search, callback) {
        getPlaceWeather(search, callback);
    }

    /**
     *
     * Search place by direct input
     *
     * @param search String
     * @param callback Function
     */
/*
    function searchPlaceByDirectInput(search, callback) {
        $.getJSON(getGeoPlaceFinedUrl(search),function(e) {
            var placeInfo = getPlaceInfo(e);
            if(placeInfo && placeInfo.latitude && placeInfo.longitude)
                getPlaceWeather(placeInfo.latitude+","+placeInfo.longitude, callback);
            else
                getPlaceWeather(search, callback);
        }).fail(function() {
            getPlaceWeather(search, callback);
        });
    }
*/

    /**
     * Search place by direct input yandex
     *
     * @param search String
     * @param callback Function
     */
    function searchPlaceByDirectInputYandex(search, callback) {
        var placeLocation, proposeCity;
        
        loadStaticXML(
            "../../vendor/weather/yandex/cities.xml", 
            function(xml){//success
                $(xml).find("city").each(function () {
                    var $el = $(this);
                    var cityName = $el.text().trim();
                    var countryCode = $el.attr('country');
                    var cityData = {id: $el.attr('id'), countrycode: countryCode, city: cityName};
                    var cityNameLower = cityName.toLowerCase();
                    var searchCityLower = search.toLowerCase();
                    if(cityNameLower == searchCityLower) {
                        placeLocation = cityData;
                        return false;
                    }
                    if(searchCityLower.length && cityNameLower.indexOf(searchCityLower) == 0)
                        proposeCity = cityData;
                });

                if(!placeLocation && proposeCity)
                    placeLocation = proposeCity;

                if(placeLocation)
                    getWeatherYandex(placeLocation.id, placeLocation, callback);
                else
                    getYandexWeatherError(search, false, callback);
            }, 
            function(){//error
                getYandexWeatherError(search, false, callback);
            }
        );
    }

    /**
     * Get client place data by client location
     *
     * @param place String
     * @param callback Function
     */
    function getPlaceWeather(place, callback) {
        if(place.indexOf(",") > 0) {
            var coordinates = place.split(",");
            if (coordinates.length == 2) {
                $.getJSON(getAlternativePlaceByCoordinates(place), function (data) {
                    $.each(data['results'], function (i, val) {
                        $.each(val['address_components'], function (i, val) {
                            if (val['types'] == "locality,political" && val['long_name']) {
                                place = val['long_name'];
                                return false;
                            }
                        });
                        $.each(val['address_components'], function (i, val) {
                            if (val['types'] == "country,political" && val['long_name']) {
                                place += " " + val['long_name'];
                                return false;
                            }
                        });
                    });
                    getAlternativePlaceWeather(place, callback);
                });
            } else
                getAlternativePlaceWeather(place, callback);
        } else
            getAlternativePlaceWeather(place, callback);
    }

    /**
     * Geo.plcefinder error handler
     *
     * @param place String
     * @param callback Function
     */
    function geoPlaceFinderError(place, callback) {
        if(place.indexOf(",") > 0) {
            var coordinates = place.split(",");
            if (coordinates.length == 2) {
                $.getJSON(getAlternativePlaceByCoordinates(place), function (data) {
                    $.each(data['results'], function (i, val) {
                        $.each(val['address_components'], function (i, val) {
                            if (val['types'] == "locality,political" && val['long_name']) {
                                place = val['long_name'];
                                return false;
                            }
                        });
                        $.each(val['address_components'], function (i, val) {
                            if (val['types'] == "country,political" && val['long_name']) {
                                place += " " + val['long_name'];
                                return false;
                            }
                        });
                    });
                    getAlternativePlaceWeather(place, callback);
                });
            } else
                getAlternativePlaceWeather(place, callback);
        } else
            getAlternativePlaceWeather(place, callback);
    }

    /**
     * Get alternative place weather
     *
     * @param place String
     * @param callback Function
     */
    function getAlternativePlaceWeather(place, callback) {
        $.getJSON(getAlternativePlaceFinder(place),function(e) {
            var placeInfo = getAlternativePlaceInfo(e, callback);
            if(placeInfo && placeInfo.woeid) {
                var placeLocation = {
                    woeid: placeInfo.woeid,
                    city: placeInfo.locality1.content,
                    country: placeInfo.country.content,
                    region: placeInfo.country.code,
                    countrycode: placeInfo.country.code
                };
                getWeather(placeInfo.woeid, placeLocation, callback);
            }
        }).fail(function() {
            getPlaceLocationDataError(callback);
        });
    }

    /**
     * Get client place data by client location yandex
     *
     * @param geo Object
     * @param callback Function
     */
    function getPlaceWeatherYandex(geo, callback) {
        var yandexPlace = geo.coords.longitude+","+geo.coords.latitude;
        var yahooPlace = geo.coords.latitude+","+geo.coords.longitude;
        var url = getGeoPlaceFinedUrlYandex(yandexPlace);
        
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function (xml) {
                var $adressLine = $(xml).find("AddressLine");
                if ($adressLine) {
                    var adressData = $adressLine.text().split(2);
                    if (adressData && typeof (adressData[0]) != "undefined" && adressData[0].trim()) {
                        var searchCity = adressData[0];
                        searchPlaceByDirectInputYandex(searchCity, callback);
                    } else {
                        getYandexWeatherError(yahooPlace, false, callback);
                    }
                } else {
                    getYandexWeatherError(yahooPlace, false, callback);
                }
            },
            error: function() {
                getYandexWeatherError(yahooPlace, false, callback);
            }
        });
    }

    /**
     * Get client place information
     *
     * @param e Object
     * @param callback Function
     */
    function getPlaceInfo(e, callback) {
        var result;
        var count = e.query.count;
        if(count > 1) {
            result = e.query.results.Result[0];
        } else if(count == 1) {
            result = e.query.results.Result;
        } else { // Location not found
            getLastLocationWeather(function(locationWeather) {
                if(locationWeather) {
                    if(callback)
                        callback(locationWeather);
                }
            });
        }
        return result;
    }

    /**
     * Get alternative client place information
     *
     * @param e Object
     * @param callback Function
     */
    function getAlternativePlaceInfo(e, callback) {
        var result;
        var count = e.query.count;
        if(count > 1) {
            for(var i in e.query.results.place) {
                if(checkAlternativePlaceIsTown(e.query.results.place[i])) {
                    result = e.query.results.place[i];
                    break;
                }
            }
        } else if(count == 1) {
            if(checkAlternativePlaceIsTown(e.query.results.place))
                result = e.query.results.place;
        }

        if(!result)
            getPlaceLocationDataError(callback);

        return result;
    }

    /**
     * Check alternative place is town data
     *
     * @param placeInfo Object
     * @returns {*|boolean}
     */
    function checkAlternativePlaceIsTown(placeInfo) {
        return placeInfo.woeid && placeInfo.country &&
               placeInfo.locality1 && placeInfo.locality1.type == "Town" &&
               placeInfo.boundingBox && placeInfo.boundingBox.southWest;
    }

    /**
     * Get place location data error
     *
     * @param callback Function
     */
    function getPlaceLocationDataError(callback) {
        getLastLocationWeather(function(locationWeather) {
            if(locationWeather) {
                if(callback)
                    callback(locationWeather);
            }
        });
    }

    /**
     * Get client place weather by place id
     *
     * @param id Int
     * @param placeLocation Object
     * @param callback Function
     */
    function getWeather(id, placeLocation, callback) {
        if(id) {
            getCountryTemperatureUnit(placeLocation.countrycode, function(unit) {
                var url = getWeatherForecastUrl(id, unit);
                $.getJSON(url,function(e) {
                    if(e && e.query && e.query.results && e.query.results.channel) {
                        var weatherChanel = e.query.results.channel;
                        placeLocation.region = weatherChanel.location.region;
                        var locationWeather = {
                            "location" : placeLocation,
                            "weather" : weatherChanel.item.condition,
                            "unit" : weatherChanel.units.temperature.toLowerCase(),
                            "nextUpdate" : new Date().getTime() + locationWeatherCacheTime,
                            "source" : locationWeatherSourceYahoo
                        };
                        setLastLocationWeather(locationWeather);
                        callback(locationWeather);
                    }
                });
            });
        }
    }

    /**
     * Get client place yandex weather by place id
     *
     * @param id Int
     * @param placeLocation Object
     * @param callback Function
     */
    function getWeatherYandex(id, placeLocation, callback) {
        if(id) {
            var countryCode = placeLocation.countrycode;
            var searchCityName = placeLocation.city;
            var alternativeSearch = searchCityName + " " + countryCode;
            getCountryTemperatureUnit(countryCode, function(unit) {
                
                var url = getWeatherYandexUrl(id);
                
                BRW_ajax(url, 
                    function(xml) {//success
                        var $forecast = $(xml).find("forecast");
                        
                        if($forecast) {
                            var $currentWeather = $forecast.find("fact");
                            var cityName = $forecast.attr("city");
                            if($currentWeather && cityName) {
                                var placeLocation = {
                                    woeid: id,
                                    city: cityName,
                                    country: $forecast.attr("country"),
                                    region: $forecast.attr("region"),
                                    countrycode: countryCode
                                };

                                var temperature = $currentWeather.find("temperature").text();
                                if(unit == "f")
                                    temperature = calculateWeatherTemperatureCtoF(temperature).temp;

                                var locationWeather = {
                                    "location" : placeLocation,
                                    "weather" : {
                                        code: $currentWeather.find("image-v3").text(),
                                        date: $currentWeather.find("uptime").text(),
                                        temp: temperature,
                                        text: $currentWeather.find("weather_type").text()
                                    },
                                    "unit" : unit,
                                    "nextUpdate" : new Date().getTime() + locationWeatherCacheTime,
                                    "source" : locationWeatherSourceYandex
                                };
                                setLastLocationWeather(locationWeather);
                                callback(locationWeather);
                            } else {
                                getYandexWeatherError(alternativeSearch/*searchCityName*/, true, callback);
                            }
                        } else {
                            getYandexWeatherError(alternativeSearch/*searchCityName*/, true, callback);
                        }
                    },
                    function() {//error
                        getYandexWeatherError(alternativeSearch/*searchCityName*/, true, callback);
                    },
                    {dataType:"xml"}
                );
                
                
                BRW_json(
                    url, 
                    function(e){
                        var weatherChanel = e.query.results.channel;
                        placeLocation.region = weatherChanel.location.region;
                        var locationWeather = {
                            "location" : placeLocation,
                            "weather" : weatherChanel.item.condition,
                            "unit" : weatherChanel.units.temperature.toLowerCase(),
                            "nextUpdate" : new Date().getTime() + locationWeatherCacheTime
                        };
                        setLastLocationWeather(locationWeather);
                        callback(locationWeather);
                    }
                );
                
                $.getJSON(url,function(e) {//firefox?
                    var weatherChanel = e.query.results.channel;
                    placeLocation.region = weatherChanel.location.region;
                    var locationWeather = {
                        "location" : placeLocation,
                        "weather" : weatherChanel.item.condition,
                        "unit" : weatherChanel.units.temperature.toLowerCase(),
                        "nextUpdate" : new Date().getTime() + locationWeatherCacheTime
                    };
                    setLastLocationWeather(locationWeather);
                    callback(locationWeather);
                });

            });
        }
    }

    /**
     * Get weather day data error
     *
     * @param val String
     * @param checkExistWeather Bool
     * @param callback Function
     */
    function getYandexWeatherError(val, checkExistWeather, callback) {
        if(checkExistWeather) {
            getLastLocationWeather(function(locationWeather) {
                if(!locationWeather)
                    searchPlaceByDirectInput(val, callback);
                else {
                    if(locationWeather.location && locationWeather.location.city && locationWeather.location.country) {
                        var compareVal = locationWeather.location.city + " " + locationWeather.location.country;
                        if(val != compareVal) {
                            searchPlaceByDirectInput(val, callback);
                        } else {
                            displayWeather(locationWeather);
                        }
                    }
                }
            });
        } else {
            searchPlaceByDirectInput(val, callback);
        }
    }

    /**
     * Get country temperature unit
     *
     * @param country String
     * @param callback Function
     */
    function getCountryTemperatureUnit(country, callback) {
        getWeatherUnit(function(unit) {
            getLastLocationWeather(function(locationWear) {
                var countryUnit = getTemperatureUnitByCountryName(country);
                var localUnit = unit ? unit : (countryUnit ? countryUnit : (locationWear ? locationWear.unit : "c"));
                callback(localUnit);
            });
        });
    }

    /**
     * Get temperature unit by country name
     *
     * @param country String
     * @returns {string}
     */
    function getTemperatureUnitByCountryName(country) {
        return country ? (["EN"/* ??? firefox */, "US", "BM", "BZ", "JM", "PW"].indexOf(country.toUpperCase()) >= 0 ? "f" : "c") : "c";
    }

    /**
     * Location weather need update
     *
     * @param callback Function
     */
    function locationWeatherCacheNeedUpdate(callback) {
        getLastLocationWeather(function(locationWeather) {
            var result = true;
            if(locationWeather) {
                var currentTime = new Date().getTime();
                var updateTime = locationWeather.nextUpdate;
                if(currentTime < updateTime)
                    result = false;
            }
            if(callback)
                callback(result);
        });
    }

    /**
     * Check url is google host
     *
     * @param url String
     * @returns {boolean}
     */
    function checkUrlHasGoogleHost(url) {
        var result = false;
        if(url) {
            var hostName = getUrlHost(url).toLowerCase();
            if(hostName) {
                result = hostName.indexOf("google.") == 0 ||
                         hostName.indexOf(".google.") > 0 ||
                         hostName.indexOf("gmail.") == 0 ||
                         hostName.indexOf(".gmail.") > 0 ||
                         hostName.indexOf("youtube.") == 0 ||
                         hostName.indexOf(".youtube.") > 0 ||
                         hostName.indexOf("android.") == 0 ||
                         hostName.indexOf(".android.") > 0 ||
                         hostName.indexOf("chrome.") == 0 ||
                         hostName.indexOf(".chrome.") > 0 ||
                         hostName.indexOf("googleusercontent.") == 0 ||
                         hostName.indexOf(".googleusercontent.") > 0
            }
        }
        return result;
    }

    /**
     * Set tiles color schemes
     */
    //m START
    function setTilesColorSchemes() {
        var arr = [];
        arr.push({"name" : "lightblue-white"   , "backgroundColor" : "rgb(23, 137, 230)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "blue-white"        , "backgroundColor" : "rgb(71, 132, 230)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "darkblue-white"    , "backgroundColor" : "rgb(58, 111, 180)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "deepblue-white"    , "backgroundColor" : "rgb(57, 68, 143)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "tinyblue-white"    , "backgroundColor" : "rgb(58, 74, 180)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "lightaqua-white"   , "backgroundColor" : "rgb(92, 177, 230)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "aqua-white"        , "backgroundColor" : "rgb(58, 180, 135)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "darkaqua-white"    , "backgroundColor" : "rgb(71, 166, 199)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "lightyellow-white" , "backgroundColor" : "rgb(240, 201, 44)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "yellow-white"      , "backgroundColor" : "rgb(245, 163, 0)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "orange-white"      , "backgroundColor" : "rgb(245, 131, 0)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "white-lightblue"   , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(45, 132, 164)"});
        arr.push({"name" : "white-blue"        , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(59, 75, 181)"});
        arr.push({"name" : "white-darkblue"    , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(32, 84, 151)"});
        arr.push({"name" : "white-tinyblue"    , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(65, 113, 164)"});
        arr.push({"name" : "white-aqua"        , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(72, 167, 199)"});
        arr.push({"name" : "white-green"       , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(85, 147, 31)"});
        arr.push({"name" : "white-lightred"    , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(179, 35, 35)"});
        arr.push({"name" : "white-red"         , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(209, 0, 0)"});
        arr.push({"name" : "white-darkred"     , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(164, 50, 65)"});
        arr.push({"name" : "white-gray"        , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(185, 113, 49)"});
        arr.push({"name" : "white-yellow"      , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(240, 201, 45)"});
        arr.push({"name" : "white-pink"        , "backgroundColor" : "rgb(255, 255, 255)"  , "color" : "rgb(104, 48, 136)"});
        arr.push({"name" : "lightgray-white"   , "backgroundColor" : "rgb(218, 126, 44)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "gray-white"        , "backgroundColor" : "rgb(187, 114, 49)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "darkgray-white"    , "backgroundColor" : "rgb(224, 107, 0)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "lime-white"        , "backgroundColor" : "rgb(115, 180, 58)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "darklime-white"    , "backgroundColor" : "rgb(85, 147, 31)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "lightgreen-white"  , "backgroundColor" : "rgb(79, 196, 118)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "darkgreen-white"   , "backgroundColor" : "rgb(58, 180, 58)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "tinygreen-white"   , "backgroundColor" : "rgb(58, 176, 180)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "ligthred-white"    , "backgroundColor" : "rgb(229, 76, 41)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "red-white"         , "backgroundColor" : "rgb(217, 26, 20)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "darkred-white"     , "backgroundColor" : "rgb(164, 51, 67)"    , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "ligthpink-white"   , "backgroundColor" : "rgb(200, 70, 201)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "pink-white"        , "backgroundColor" : "rgb(134, 58, 180)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        arr.push({"name" : "tinypink-white"    , "backgroundColor" : "rgb(104, 48, 137)"   , "color" : "rgba(255, 255, 255, 0.95)"});
        return arr;
    }

    /**************** SIDE BAR COMMON FUNCTIONALITY******************/

    /**
     * Generate uniquie id
     */
    function generateUniqueId(date) {
        return date.toString() + Math.ceil(Math.random() * 10).toString();
    }

    /**
     * Get url domain name
     *
     * @param url String
     * @returns {string}
     */
    function getUrlDomain(url) {
        var parts = url.split("/");
        return parts[0] + "//" + parts[2] + "/";
    }

    /**
     * Get clear domain
     *
     * @param domain String
     * @returns {string}
     */
    function getClearDomain(domain) {
        if (domain.indexOf("://") > -1) {
            var parts = domain.split('/');
            if(parts.length > 2)
                domain = parts[2];
        }
        return domain.replace(/^www\./, "");
    }

    /**
     * Set active group
     *
     * @param val Number
     * @param callback Function
     */
    function setActiveGroup(val, callback) {
        setSettingsValue("active-group", val, callback);
    }

    /**
     * Get active group
     *
     * @param callback Function
     */
    function getActiveGroup(callback) {
        getSettingsValue("active-group", 0, callback);
    }

    /**
     * Set sidebar status
     *
     * @param val Number
     * @param callback Function
     */
    function setSidebarStatus(val, callback) {
        setSettingsValue("sidebar-status", val, callback);
    }

    /**
     * Get sidebar status
     *
     * @param callback Function
     */
    function getSidebarStatus(callback) {
        getSettingsValue("sidebar-status", 1, callback);
    }

    /** JD
     * getCleanRedirectUrl
     *
     * @url String
     */
    function getCleanRedirectUrl(url){
        var url = getCleanRedirectTxt(url);
        return getUrlHost('http://'+url);
    }//getCleanRedirectUrl

    /** JD
     * getCleanRedirectTxt
     *
     * @url String
     */
    function getCleanRedirectTxt(url){
        var url = String(url);
        
        url = url.split('://').pop();
        url = url.split('urllink=').pop();
        url = url.split('http%3A%2F%2F').pop();
        url = url.split('https%3A%2F%2F').pop();
        
        url = url.split('s.click.').join('');
        url = url.split('rover.').join('');
        url = url.split('%2E').join('.');
        url = url.split('%2F').join('/');
        
        return url;
        //return getUrlHost('http://'+url);
    }//getCleanRedirectUrl