    /**
     * Application new tab page tiles
     */

    var pageTiles;
    var displayPopupTimeOut;
    var lastRestoredDialId;
    var lastRestoredDialUrl;
    var lastRestoredDialTimer;
    var needLoadTextTilesList;
    var needLoadTilesList;
    var tilesInMove = false;//firefox


    /**
     * Build most viewed URLs
     *
     * @param mostVisitedURLs Array
     */
    function buildTilesList(mostVisitedURLs) { 
        if(mostVisitedURLs.length)
            getTilesDomainsTopLinks(mostVisitedURLs, analyzeTilesList);
        else
            analyzeTilesList([]);
    }

    /**
     * Analyze tiles list content
     * get db content
     *
     * @param tiles Array
     */
    function analyzeTilesList(tiles) { 
        var tilesURLs = [], i;
        var displayTilesCount = getDisplayTilesCount();
        pageTiles = [];
        for(i = 0; i < displayTilesCount; i++) {
            if(typeof (tiles[i]) != "undefined") {
                pageTiles.push(tiles[i]);
                tilesURLs.push(tiles[i].url);
            }
        }
        getTilesFromDB(pageTiles, tilesURLs);
    }

    /**
     * Get tiles from DB
     *
     * @param tiles Array
     * @param URLs Array
     */
    function getTilesFromDB(tiles, URLs) { 
        var searchUrlList = [];
        var tilesLength = tiles.length;
        for (var j in URLs) {
            searchUrlList.push(getUrlHost(URLs[j]));
            searchUrlList.push(URLs[j]);
        }
                                          
        BRW_dbTransaction(function (tx) {                                  
            BRW_dbSelect(
                {//Param
                    tx : tx,
                    from    :  'IMAGES',
                    whereIn   : {
                        'key' : 'url',
                        'arr' : searchUrlList
                    }
                },
                function(results){//Success
                    var imagesResults = results.rows;
                    var imagesResultsLength = imagesResults.length;
                    var i, j;
                    for (j = 0; j < tilesLength; j++) {
                        tiles[j]['hostUrl'] = getUrlHost(tiles[j].url);
                        tiles[j].thumbType = null;
                        for (i = 0; i < imagesResultsLength; i++) {
                            if (tiles[j].url == imagesResults[i].url || tiles[j]['hostUrl'] == imagesResults[i].url) {
                                if(imagesResults[i].image)
                                    tiles[j].image = imagesResults[i].image;
                                if(imagesResults[i].bg_color && imagesResults[i].text_color)
                                    tiles[j].colorScheme = {"backgroundColor" : imagesResults[i].bg_color , "color" : imagesResults[i].text_color};
                                tiles[j].hostData = tiles[j]['hostUrl'].split(".");
                                tiles[j].thumbType = imagesResults[i].thumb_type;
                            }
                        }
                    }

                    BRW_sendMessage({command: "getDialsColumnsCount"}, function(data) {
                        if(data && data.maxColumns) {
                            setTimeout(function() {
                                var $container = $("#mv-tiles");
                                if(!$container.hasClass("page-dials-container-max-cols" + data.maxColumns))
                                    $container.addClass("page-dials-container-max-cols" + data.maxColumns);
                            }, 50);

                            var callback = (tiles.length && !$(".mv-tile, .mv-new-dial").length) || !tiles.length ? getBackgroundImage : null;
                            getBackgroundParams(callback, {"dials" : tiles});
                        }
                    });
                },        
                function(error){//Error

                }        
            );
        });
                                          
        /*                                  
        getDb().readTransaction(function (tx) {
            tx.executeSql('SELECT * FROM IMAGES WHERE url IN(' + createParams(searchUrlList) + ')', searchUrlList, function (tx, results) {
                
                var imagesResults = results.rows;
                var imagesResultsLength = imagesResults.length;
                var i, j;
                for (j = 0; j < tilesLength; j++) {
                    tiles[j]['hostUrl'] = getUrlHost(tiles[j].url);
                    tiles[j].thumbType = null;
                    for (i = 0; i < imagesResultsLength; i++) {
                        if (tiles[j].url == imagesResults[i].url || tiles[j]['hostUrl'] == imagesResults[i].url) {
                            if(imagesResults[i].image)
                                tiles[j].image = imagesResults[i].image;
                            if(imagesResults[i].bg_color && imagesResults[i].text_color)
                                tiles[j].colorScheme = {"backgroundColor" : imagesResults[i].bg_color , "color" : imagesResults[i].text_color};
                            tiles[j].hostData = tiles[j]['hostUrl'].split(".");
                            tiles[j].thumbType = imagesResults[i].thumb_type;
                        }
                    }
                }

                BRW_sendMessage({command: "getDialsColumnsCount"}, function(data) {
                    if(data && data.maxColumns) {
                        setTimeout(function() {
                            var $container = $("#mv-tiles");
                            if(!$container.hasClass("page-dials-container-max-cols" + data.maxColumns))
                                $container.addClass("page-dials-container-max-cols" + data.maxColumns);
                        }, 50);

                        var callback = (tiles.length && !$(".mv-tile, .mv-new-dial").length) || !tiles.length ? getBackgroundImage : null;
                        getBackgroundParams(callback, {"dials" : tiles});
                    }
                });
            }, null);
        });
        */                                  
    }

    /**
     * Start prepare group tiles
     */
    function startPrepareCurrentGroupTiles() { 
        BRW_sendMessage({command: "getDialsColumnsCount"}, function(data) {
            
            if(data && data.maxColumns) {
                setTimeout(function() {
                    var $container = $("#mv-tiles");
                    if(!$container.hasClass("page-dials-container-max-cols" + data.maxColumns))
                        $container.addClass("page-dials-container-max-cols" + data.maxColumns);
                    prepareCurrentGroupTiles();
                }, 50);
            }
        });
    }

    /**
     * Prepare current group page dials
     */
    function prepareCurrentGroupTiles() { 
        if(getDisplaySpeedDialPanel()) {
            BRW_sendMessage({command: "getActiveGroup", withDials: true}, function(data) {
                if(data && data.group) {
                    data.group = prepareCurrentGroupTilesEnd(data.group);
                    getBackgroundParams(getBackgroundImage, {"dials" : data.group.dials, "group" : data.group});
                }
            });
        } else {
            getBackgroundParams(getBackgroundImage, {"dials" : [], "group" : {}});
        }
    }

    /**
     * Prepare current group tiles end
     *
     * @param group Object
     * @returns {object}
     */
    function prepareCurrentGroupTilesEnd(group) { 
        var dials = [];
        for(var i in group.dials) {
            if(group.dials.hasOwnProperty(i)) {
                var dial = group.dials[i];
                if(checkTileFormat(dial)) {
                    dial.thumbType = dial.thumb_type;
                    if(dial.bg_color && dial.text_color)
                        dial.colorScheme = {"backgroundColor" : dial.bg_color, "color" : dial.text_color};
                    dial.hostUrl = getUrlHost(dial.url);
                    dial.hostData = dial.hostUrl.split(".");
                    dials.push(dial);
                }
            }
        }
        group.dials = dials;
        return group;
    }

    /**
     * Display history items
     *
     * @param data Object
     */
    function displayHistoryItems(data) { 
        var group = data.group;
        var tiles = data.dials;
        var $tilesContainer = $("#mv-tiles");
        var showContainerAnimation = !$tilesContainer.css("opacity");

            needLoadTilesList = [];
            needLoadTextTilesList = [];

        $tilesContainer.fadeOut(150, function () {
            var $el = $(this).html('');
            if (data.displaySpeedDialPanel) {
                for (var i = 0; i < tiles.length; i++) {
                    var mv = tiles[i];
                        mv.title = mv.title ? mv.title : mv.url;
                        mv.dialId = group ? mv.id  : null;
                    var $tile = mv.url ? displayTileItem(mv, i) : addEmptyTileItem();
                    $el.append($tile);
                }
                initTilesContextMenu(group);

                if(group) {
                    var $addNewDial = displayAddNewDial();
                    $el.append($addNewDial);
                    $addNewDial.animate({
                        "opacity" : ($addNewDial.is(":hover") ? getMaxDialsFormOpacity() : getDialsFormOpacity())
                    }, {"duration" : getDisplayDialsSpeed(), "queue" : true});

                    $tilesContainer.sortable({
                        placeholder: "mv-placeholder",
                        forcePlaceholderSize: true,
                        delay: 100,
                        tolerance: "pointer",
                        cursor: "move",
                        appendTo: "body",
                        items: "> .mv-tile",
                        "disabled" : false,
                        start: function (ev, ui) {
                            tilesInMove = true;
                            $(ui.item).addClass("mv-dial-sortable");
                        },
                        stop: function (ev, ui) {
                            $(ui.item).removeClass("mv-dial-sortable");
                            setTimeout(function () {
                                tilesInMove = false;
                                
                                BRW_sendMessage({
                                    command: "moveDialsOrder",
                                    collectDials: collectCurrentDirectoryDials()
                                });
                            }, 250);
                        }
                    });
                } else {
                    $tilesContainer.sortable({
                        "disabled" : true
                    });
                }

                setLoadTilesThumbsList(needLoadTilesList);
                setLoadTilesTextThumbsList(needLoadTextTilesList);

                setTimeout(function () {
                    setTilesHoverBlockFadeEffects($el);
                    displayTiles(showContainerAnimation);
                }, 1);
            }

            setTimeout(function () {
                displaySearch();
                displayClock();
            }, 1);
        });
    }

    /**
     * Display add new dial block
     */
    function displayAddNewDial() { 
        var $dial = $("<a></a>");
        $dial.addClass("mv-new-dial");
        $dial.tooltip({
            "placement": "bottom",
            "delay": {show: 600},
            "trigger": "hover",
            "title": translate("page_new_dial_tooltip")
        });
        $dial.on("click", showAddNewDialPopup);
        var $newDialImg = $("<img>");
        $newDialImg.attr("src", extensionGetUrl("pages/newtab/img/dials/new_dial_plus.png"));
        $newDialImg.addClass("mv-new-dial-img");
        $dial.append($newDialImg);

        displayTileWithOpacityEffect($dial);
        addHoverFadeEffectToElements($dial);

        return $dial;
    }

    /**
     * Show add new dial popup
     *
     * @param e Event
     */
    function showAddNewDialPopup(e) {
        e.preventDefault();
        var $modal = $('#add-new-dial-dialog');
        var $modalTitle = $modal.find("#add-new-dial-dialog-title");
        var $form = $modal.find("#add-new-dial-form");
        if($form) {
            $modalTitle.text(translate("add_new_dial_dialog_title"));
            if($form.hasClass("edit-dial-dialog"))
                $form.removeClass("edit-dial-dialog");
            $form.attr("data-edit-dial-groupId", 0);
            $form.attr("data-edit-dial-dialId", 0);
            //getNewDialGroups();
        }

        $modal.modal();
    }

    /**
     * Add empty tile item if no url
     *
     * @returns {*|jQuery|HTMLElement}
     */
    function addEmptyTileItem() { 
        var $tile = $("<div></div>");
        $tile.addClass("mv-tile");
        $tile.addClass("mv-no-select");

        addTileFooterShadow($tile);

        return $tile;
    }

    /**
     * Display tile item
     *
     * @param mv Object
     * @returns {*|jQuery|HTMLElement}
     */
    function displayTileItem(mv, i) {
        mv.cleanURL = String(getCleanRedirectUrl(mv.url));
        
        var $tile = $("<a></a>");
            $tile.attr("href", 'http://'+mv.cleanURL);
            $tile.attr("fullHref", mv.url);
            $tile.attr("title", mv.title);
            $tile.attr("data-tileid", i);
            $tile.attr("data-dialId", mv.dialId);
            $tile.attr("data-groupId", mv.groupId);
            $tile.addClass("mv-tile");
            $tile.addClass("mv-tile-instance");
            $tile.addClass("mv-no-select");
        
            $tile.on("click", function(e) {
                e.preventDefault();
                sendToGoogleAnalitic(function() {
                    ga('send', 'event', 'dial', 'click');
                });
                
                if(!tilesInMove){
                    BRW_sendMessage({
                        command: "openSelectedDialUrl", url: $(this).attr("fullHref"),
                        newtab: (window.event||e).ctrlKey || e.which == 2
                    });
                }//if
            });
        
        var $tileContainer = $("<div></div>").addClass("mv-tile-container");

        var $favicon = $("<div></div>").addClass("mv-favicon");
        var $faviconImg = $("<img>").attr("src", BRW_favicon(mv.url));
            $favicon.append($faviconImg);

        var $title = $("<div></div>").text(mv.title).addClass("mv-title");
        var $thumb = $("<div></div>").addClass("mv-thumb");

        var $mvRightButtons = $("<div></div>").addClass("mv-right-buttons");
        var $mvRightButtonsContainer = $("<div></div>").addClass("mv-right-buttons-container");

        var $settings = $("<div></div>").addClass("mv-settings");
            $settings.attr("title", translate("page_speed_dials_settings_title"));
        var $close = $("<div></div>").addClass("mv-close");
            $close.attr("title", translate("page_speed_dials_close_title"));
            $close.attr("data-url", mv.url);
            $close.attr("data-dialId", mv.dialId);
            $close.on("click", deleteHistoryItem);
        
        
        if  (
                mv.cleanURL.indexOf('booking.com') > -1 ||
                mv.cleanURL.indexOf('amazon.com') > -1 ||
                mv.cleanURL.indexOf('ebay.com') > -1
            ){
                var $search = $("<div></div>").addClass("mv-search");
                    $search.attr("title" , translate("page_speed_dials_search_title")+" "+mv.cleanURL);
                    $search.attr("search", mv.cleanURL);
                    
                var srch = new DialsSearch();
                    srch.init($search, mv.cleanURL, Date.now());
                    
                    /*
                    $search.on("click", function(e){
                        e.preventDefault(); e.stopPropagation();
                        alert("search by "+mv.cleanURL);
                    });
                    */
            }//if
        else var $search = false;

        var $focusTileMask = $("<div></div>");
            $focusTileMask.addClass("mv-mask");

            $tile.on("focusin", function() {
                $(this).find(".mv-mask").addClass("mv-mask-bg");
                $("#search-suggestion").hide();
            });
            $tile.on("focusout", function() {
                $(this).find(".mv-mask").removeClass("mv-mask-bg");
            });

        $tileContainer.append($focusTileMask);

        var $dotBg = $("<div></div>").addClass("mv-dot-bg");
        var $dotImage = $("<div></div>").addClass("mv-dot");

        var loadingImg = extensionGetUrl("pages/newtab/css/img/buttons/tiles/loading.gif");
        var $thumbImg = $("<div></div>");

        if((mv.image && mv.image == getNoTileImageFileName()) || mv.thumbType == showDialTextThumb) {
            if(typeof (mv.colorScheme) == "undefined") {
                $thumb.append($dotBg.append($dotImage));
                needLoadTextTilesList.push(mv);
            } else {
                prepareTextDial($thumb, mv);
            }
        } else if(mv.image && mv.image != 'undefined') {
            if(checkUrlHasGoogleHost(mv.url)  && (!mv.thumbType || mv.thumbType == showDialGalleryThumb) && mv.image.indexOf("data:image") < 0) {
                if(typeof (mv.colorScheme) == "undefined") {
                    $thumb.append($dotBg.append($dotImage));
                    needLoadTextTilesList.push(mv);
                } else
                    prepareTextDial($thumb, mv);
            } else {
                if(mv.image.indexOf("data:image") < 0/* && mv.image.indexOf("blob:resource") < 0*/) {
                    $thumbImg = $("<div></div>");
                    $thumbImg.addClass("thumbnail");
                    $thumb.append($thumbImg);
                    $thumb.addClass("mv-thumb-image");
                    $thumbImg.css({"background" : "url('" + mv.image + "') 50% 50% / contain no-repeat"});
                } else {
                    if (mv.thumbType == showDialGalleryThumb) {
                        if(typeof (mv.colorScheme) == "undefined") {
                            $thumb.append($dotBg.append($dotImage));
                            needLoadTextTilesList.push(mv);
                        } else
                            prepareTextDial($thumb, mv);
                    } else {
                        $thumbImg = $("<div></div>");
                        $thumbImg.addClass("thumbnail");
                        $thumb.append($thumbImg);
                        $thumb.addClass("mv-thumb-live");
                        $thumbImg.css({"background" : "url('" + mv.image + "') 50% 50% / contain no-repeat"});
                    }
                }
            }
        } else {
            $thumb.addClass("mv-thumb-loading");
            $thumbImg.css({"background" : "url('" + loadingImg + "') 50% 50% no-repeat"});
            $thumbImg.addClass("thumbnail").addClass("thumbnail-loading");
            $thumb.append($thumbImg);
            needLoadTilesList.push(mv);
        }
        
        if($thumbImg) displayTileItemReDraw($thumbImg, mv);//firefox

        $mvRightButtonsContainer.append($settings).append($close);
        $mvRightButtons.append($mvRightButtonsContainer);
        $tileContainer.append($mvRightButtons).append($favicon).append($title).append($thumb);
        $tile.append($tileContainer);
        if($search) $tileContainer.append($search);

        displayTileWithOpacityEffect($tile);
        addTileFooterShadow($tile);

        return $tile;
    }
    
    /**
     * Re generate lost blob image for thumbnail
     *
     * @param $thumbImg jQuery element
     * @param mv Object
     */
    function displayTileItemReDraw($thumbImg, mv){//firefox
        if(BROWSER && BROWSER == 'firefox' && mv.image && mv.image.indexOf("blob:resource") >= 0){
            BRW_getFileSystem(function(){//Wait for load filesystem
                fileStorage.getAttachment('thumbs', mv.hostUrl+'.jpg').then(function(blob){
                    if(blob){
                        var blobURL = URL.createObjectURL(blob);
                        $thumbImg.css("background", "url('" + blobURL + "') 50% 50% / contain no-repeat");
                    }//if
                });
            });
        }//if
    }

    /**
     * Display tiel with opacity effect
     *
     * @param $tile jQuery element
     */
    function displayTileWithOpacityEffect($tile) { 
        $tile.animate({
            "opacity" : ($tile.is(":hover") ? getMaxDialsFormOpacity() : getDialsFormOpacity())
        }, {"duration" : 0, "queue" : true});
    }

    /**
     * Try load tile thumbs that has no images
     *
     * @param needLoadTilesList array
     */
    function setLoadTilesThumbsList(needLoadTilesList) { 
        if(needLoadTilesList.length) {
            setTimeout(function() {
                BRW_sendMessage({
                    "command": "thumbLoad",
                    "tiles" : needLoadTilesList
                });
            }, 1500);
        }
    }

    /**
     * Try load tile thumbs that has no images
     *
     * @param needLoadTextTilesList array
     */
    function setLoadTilesTextThumbsList(needLoadTextTilesList) { 
        if(needLoadTextTilesList.length) {
            setTimeout(function() {
                BRW_sendMessage({
                    "command": "textThumbLoad",
                    "tiles" : needLoadTextTilesList
                });
            }, 1500);
        }
    }

    /**
     * Set tiles block fade effect
     *
     * @param $tilesContainer jQuery element
     */
    function setTilesHoverBlockFadeEffects($tilesContainer) { 
        var $dials = $tilesContainer.find(".mv-tile, .mv-new-dial");
        addHoverFadeEffectToElements($dials);
    }

    /**
     * Add hover fade effect to elements
     *
     * @param $dials Array|Object
     */
    function addHoverFadeEffectToElements($dials) { 
        var minDialsOpacity = getDialsFormOpacity();
        var maxDialsOpacity = getMaxDialsFormOpacity();
        var dialsOpcatitySpeed = getDisplayDialsSpeed();

        $dials.off('hover').hover(function() {
            $(this).animate({"opacity" : maxDialsOpacity}, {"duration" : dialsOpcatitySpeed, "queue" : false});
        }, function() {
            $(this).animate({"opacity" : minDialsOpacity}, {"duration" : dialsOpcatitySpeed, "queue" : false});
        });
        $dials.off("focusin").on("focusin", function(){
            $(this).animate({"opacity" : maxDialsOpacity}, {"duration" : dialsOpcatitySpeed, "queue" : false});
        });
        $dials.off("focusout").on("focusout", function(){
            $(this).animate({"opacity" : minDialsOpacity}, {"duration" : dialsOpcatitySpeed, "queue" : false});
        });
    }

    /**
     * Add restore dial block
     *
     * @param $container jQuery element
     */
    function setRestoreTileBlock($container) { 
        var $restoreContainerWrap = $("<div></div>").addClass("mv-restore-container-wrap");
        $restoreContainerWrap.attr("id", "mv-restore-container-wrap");
        var $restoreContainer = $("<div></div>").addClass("mv-restore-container");
        $restoreContainer.attr("id", "mv-restore-container");
        var $restoreText = $("<span></span>").addClass("mv-restored-dial-text").text(translate("page_tiles_remove_text"));
        var $restoreLink = $("<a></a>").addClass("mv-restore-dial").text(translate("page_tiles_restore_text"));
        $restoreLink.attr("id", "mv-restore-dial");
        $restoreLink.on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(lastRestoredDialId) {
                BRW_sendMessage({"command": "restoreRemovedDialById", "val" : lastRestoredDialId}, function(data) {
                    if(lastRestoredDialTimer)
                        clearTimeout(lastRestoredDialTimer);
                    $(".mv-tile[data-dialId=" + lastRestoredDialId + "]").each(function() {
                        var $el = $(this);
                        if(!$el.is(":visible")) {
                            var $restoreContainer = $("#mv-restore-container-wrap");
                            if($restoreContainer.is(":visible"))
                                $restoreContainer.hide(0);
                            $el.show(0, function() {
                                setTimeout(function () {
                                    BRW_sendMessage({
                                        command: "moveDialsOrder",
                                        "collectDials": collectCurrentDirectoryDials()
                                    });
                                }, 250);
                            });
                        }
                    });
                    lastRestoredDialUrl = null;
                    lastRestoredDialId = null;
                });
            } else if(lastRestoredDialUrl) {
                BRW_sendMessage({"command": "restoreRemovedDialByUrl", "val" : lastRestoredDialUrl}, function(data) {
                    if(lastRestoredDialTimer)
                        clearTimeout(lastRestoredDialTimer);
                    lastRestoredDialUrl = null;
                    lastRestoredDialId = null;
                    analyzeHistory(buildTilesList);
                });
            }
        });

        var $restoreCloseBtn = $("<div></div>").addClass("mv-restore-close");
        $restoreCloseBtn.on("click", function() {
            if(lastRestoredDialId)
                $(".mv-tile[data-dialId=" + lastRestoredDialId + "]").each(function() {
                    $(this).remove();
                });

            if(lastRestoredDialTimer)
                clearTimeout(lastRestoredDialTimer);
            lastRestoredDialUrl = null;
            lastRestoredDialId = null;

            if($restoreContainerWrap.is(":visible"))
                $restoreContainerWrap.fadeOut(350);
        });

        $restoreContainer.append($restoreText);
        $restoreContainer.append($restoreLink);
        $restoreContainer.append($restoreCloseBtn);
        $restoreContainerWrap.append($restoreContainer);
        $container.append($restoreContainerWrap);

        var lastRestoredDialHost = getUrlHost(lastRestoredDialUrl);
        if((lastRestoredDialId || lastRestoredDialUrl) && lastRestoredDialHost)
            $restoreContainerWrap.show(0);
    }

    /**
     * Display tiles
     *
     * @param showContainerAnimation Bool
     */
    function displayTiles(showContainerAnimation) { 
        var minDialsOpacity = getDialsFormOpacity();
        var displayPageSpeed = getDisplayPageSpeed();

        BRW_sendMessage({"command": "getVisibleSpeedDialPanel"}, function(data) {
            var $tilesContainer = $("#mv-tiles");
            var $dials = $tilesContainer.find(".mv-tile, .mv-new-dial");
            var tilesBlockVisibleState = data.visible;
            if(tilesBlockVisibleState) {
                if(showContainerAnimation)
                    $dials.css({"opacity" : 0});
                $tilesContainer.css({"display" : "block"}).animate({"opacity" : 1}, {"duration" : displayPageSpeed, "queue" : true});
            } else {
                $tilesContainer.css({"display" : "none", "opacity" : 1});
                $dials.css({"opacity" : minDialsOpacity});
                if(getDisplaySpeedDialPanel()) {
                    if(!getDialsNoticeHideState()) {
                        var $popup = $("#dials-notifications");
                        $popup.fadeIn(displayPageSpeed);
                        displayPopupTimeOut = setTimeout(function(){
                            var $popup = $("#dials-notifications");
                            if($popup.is(":visible"))
                                $popup.fadeOut(250);
                            clearTimeout(displayPopupTimeOut);
                        }, 2500);
                    }
                }
            }
            setRestoreTileBlock($tilesContainer);
        });
    }

    /**
     * Display search
     */
    function displaySearch() { 
        var minSearchOpacity = getSearchFormOpacity();
        var maxSearchOpacity = getMaxSearchFormOpacity();
        var toggleOpacitySpeed = getToggleOpacitySpeed();
        var displayPageSpeed = getDisplayPageSpeed();

        getDisplaySearchForm(function(display) {
            var $searchForm = $("#search-input-box");
            if(display && !$searchForm.is(":visible")) {
                setTimeout(function() {
                    var $formContainer = $("#search-input-box");
                    var $searchInput = $("#search-input");
                    var $speechInput = $("#search-speed-container");

                    $formContainer.on("focusin", function(){
                        $(this).animate({"opacity" : maxSearchOpacity}, {"duration" : toggleOpacitySpeed, "queue" : false});
                    });
                    $formContainer.on("focusout", function(){
                        if(!$("#search-input").is(":hover"))
                            $(this).animate({"opacity" : minSearchOpacity}, {"duration" : toggleOpacitySpeed, "queue" : false});
                    });
                    $formContainer.hover(function(){
                        $(this).animate({"opacity" : maxSearchOpacity}, {"duration" : toggleOpacitySpeed, "queue" : false});
                    }, function() {
                        if(!$("#search-input").is(":focus"))
                            $(this).animate({"opacity" : minSearchOpacity}, {"duration" : toggleOpacitySpeed, "queue" : false});
                    });
                    
                    //if(!$searchInput.is(":hover") && !$searchInput.is(":focus") && !$speechInput.is(":hover") && !$speechInput.is(":focus"))
                    //Reutrn: "Syntax error, unrecognized expression: unsupported pseudo: hover"
                    
                    if(!$("#search-input:hover, #search-input:focus, #search-speed-container:hover, #search-speed-container:focus").length)//Firefox
                        $searchForm.animate({"opacity" : minSearchOpacity}, 2000);

                }, 3000);

                $searchForm.css({"opacity" : 0, "display" : "inline-block"}).animate({"opacity" : maxSearchOpacity}, displayPageSpeed);
            }
        });
    }

    /**
     * Prepare text dial
     *
     * @param $thumb jQuery element
     * @param mv Object
     */
    function prepareTextDial($thumb, mv) { 
        if(typeof(mv.colorScheme) != "undefined") {
            var $textBg = $("<div></div>").addClass("mv-text-bg");
            $textBg.css({"background-color" : mv.colorScheme.backgroundColor});
            $thumb.append($textBg);
            var $overlayImage = $("<img>").addClass("mv-text-bg-overlay");
            $overlayImage.attr("src", extensionGetUrl("pages/newtab/css/img/buttons/tiles/overlay.png"));
            $thumb.append($overlayImage);

            if(typeof (mv.hostData) != "undefined") {
                if(typeof (mv.hostData[0])) {
                    mv.hostData[0] = clearUrlProtocol(mv.hostData[0]);
                    var itemHost = mv.hostData[0];
                    var $hostName = $("<div></div>").addClass("mv-host-name");
                    var containerHeight = 114;
                    var domainFontSize = 13;
                    var domainFirstFontSize = 16;
                    var hostMaxFontSize = 48;
                    var hostMinFontSize = 18;
                    var minDomainTopOffset = 0;
                    var maxDomainTopOffset = 5;
                    var itemsTopDiffOffset = 5;

                    var hostDiffFontSize = hostMaxFontSize - hostMinFontSize;
                    var hostFontSizePercents = Math.round(itemHost.length / 4);
                    var hostFontSize = hostMaxFontSize;
                    if(hostFontSizePercents > 1) {
                        hostFontSize = hostMinFontSize + Math.round(hostDiffFontSize / hostFontSizePercents);
                        hostFontSize = hostFontSize < hostMinFontSize ? hostMinFontSize : hostFontSize;
                        hostFontSize = hostFontSize > hostMaxFontSize ? hostMaxFontSize : hostFontSize;
                    }
                    var hostNameTopOffset = containerHeight / 2 - hostFontSize / 2 - itemsTopDiffOffset;
                    if(typeof (mv.hostData[1]))
                        hostNameTopOffset = containerHeight / 2 - (hostFontSize + domainFontSize) / 2 - itemsTopDiffOffset;

                    $hostName.css({
                        "font-size" : hostFontSize + "px",
                        "top" : hostNameTopOffset + "px",
                        "text-transform" : itemHost.length < 7 ? "capitalize" : "none",
                        "color" : mv.colorScheme.color
                    });
                    var $hostNameText = $("<span></span>");
                    $hostNameText.text(itemHost);
                    $thumb.append($hostName.append($hostNameText));

                    if(typeof (mv.hostData[1])) {
                        var $hostDomain = $("<div></div>").addClass("mv-host-domain");
                        var domainPartLength = mv.hostData.length;
                        if(mv.hostData.length > 2) {
                            var $domainNameEl = $("<span></span>").addClass("mv-host-domain-first");
                            $domainNameEl.css({
                                "font-size" : domainFirstFontSize + "px"
                            });
                            $domainNameEl.append(mv.hostData[1]);
                            $hostDomain.append($domainNameEl);
                        } else
                            $hostDomain.append(mv.hostData[1]);

                        for(var t = 2; t < domainPartLength; t++)
                            $hostDomain.append("." + mv.hostData[t]);

                        var diffDomainTopOffset = maxDomainTopOffset - minDomainTopOffset;
                        var additionalDomainTopOffset = (hostMinFontSize - hostFontSize) / hostDiffFontSize * diffDomainTopOffset;
                        var domainTopOffset = containerHeight / 2 + hostFontSize / 2 + additionalDomainTopOffset - itemsTopDiffOffset;

                        $hostDomain.css({
                            "font-size" : domainFontSize + "px",
                            "top" : domainTopOffset + "px",
                            "color" : mv.colorScheme.color
                        });
                        $thumb.append($hostDomain);
                    }
                }
            }
        }
    }

    /**
     * Error load gallery thumb
     *
     * @param data Objetc
     */
    function errorLoadGalleryThumb(data) { 
        if(data.mv) {
            var mv = data.mv;
            if(mv.url) {
                var hostName = getUrlHost(mv.url);
                if(hostName) {
                    $.jGrowl(translate("page_dial_thumb_load_gallery_problem") + "<br>" + hostName, { "life" : 3000 });
                }
            }
        }
    }

    /**
     * Add tile footer shadow
     *
     * @param $tile jQuery element
     */
    function addTileFooterShadow($tile) { 
        var $footer = $("<div></div>").addClass("mv-footer");
        var $footerShadow = $("<img>").addClass("tile-footer-shadow");
        $footerShadow.attr("src", extensionGetUrl("pages/newtab/css/img/buttons/tiles/bottom_shadow.png"));
        $footer.append($footerShadow);
        $tile.append($footer);
    }

    /**
     * Delete history item handler
     *
     * @param e Event
     */
    function deleteHistoryItem(e) { 
        e.preventDefault();
        e.stopPropagation();
        deleteHistoryItemHandler($(this));
    }

    /**
     * Delete history item handler
     *
     * @param $el jQuery element
     */
    function deleteHistoryItemHandler($el) { 
        if($el) {
            var removeUrl = $el.attr('data-url');
            var dialId = $el.attr('data-dialId');
            if(dialId) {
                var $link = $el.closest(".mv-tile");
                if($link) {
                    $link.fadeOut(350, function() {
                        BRW_sendMessage({
                            "command": "deleteDialById",
                            "dialId": dialId,
                            "collectDials": collectCurrentDirectoryDials()
                        }, function () {
                            if (lastRestoredDialTimer)
                                clearTimeout(lastRestoredDialTimer);
                            lastRestoredDialTimer = setTimeout(function () {
                                if(lastRestoredDialId)
                                    $(".mv-tile[data-dialId=" + lastRestoredDialId + "]").each(function() {
                                        $(this).remove();
                                    });
                                lastRestoredDialUrl = null;
                                lastRestoredDialId = null;
                                var $restoreContainer = $("#mv-restore-container-wrap");
                                if ($restoreContainer.is(":visible"))
                                    $restoreContainer.fadeOut(350);
                            }, 15000);
                            lastRestoredDialId = dialId;

                            var $restoreContainerWrap = $("#mv-restore-container-wrap");
                            $restoreContainerWrap.show(0);
                        });
                    });
                }
            } else if(removeUrl) {
                $el.off("click", deleteHistoryItem).on(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                BRW_sendMessage({"command": "addHostToBlackList", "val" : removeUrl}, function() {
                    if(lastRestoredDialTimer)
                        clearTimeout(lastRestoredDialTimer);
                    lastRestoredDialTimer = setTimeout(function() {
                        if(lastRestoredDialId)
                            $(".mv-tile[data-dialId=" + lastRestoredDialId + "]").each(function() {
                                $(this).remove();
                            });
                        lastRestoredDialUrl = null;
                        lastRestoredDialId = null;
                        var $restoreContainer = $("#mv-restore-container-wrap");
                        if($restoreContainer.is(":visible"))
                            $restoreContainer.fadeOut(350);
                    }, 15000);
                    lastRestoredDialUrl = removeUrl;
                    analyzeHistory(buildTilesList);
                });
            }
        }
    }

    /**
     * Display async loaded tile thumb image
     *
     * @param message Object
     */
    function displayLoadedTileThumbImage(message) { 
        var mv = message.mv;
        if(typeof (mv) != "undefined" && mv && mv.url) {
            $("#mv-tiles").find(".mv-tile").each(function() {
                var $el = $(this);
                if(mv.dialId) {
                    if($el.attr('data-dialId') == mv.dialId)
                        endDisplayLoadedTileThumbImage($el, mv);
                } else {
                    if ($el.attr('href') == mv.url) {
                        getActiveGroup(function (val) {
                            if (val == GROUP_POPULAR_ID) {
                                endDisplayLoadedTileThumbImage($el, mv);
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * End display loaded tile thumb image
     *
     * @param $el jQuery element
     * @param mv Object
     */
    function endDisplayLoadedTileThumbImage($el, mv) { 
        var $mvThumb = $el.find(".mv-thumb");
        var $thumbnail = $el.find(".thumbnail");
        $mvThumb.fadeOut(350, function () {
            $mvThumb.removeClass("mv-thumb-loading").removeClass("mv-thumb-image").removeClass("mv-thumb-live");
            $thumbnail.removeClass("thumbnail-loading");

            var $dotBg = $("<div></div>");
            var $dotImage = $("<div></div>");

            if(!mv.thumbType)
                mv.thumbType = null;

            if ((mv.image && mv.image == getNoTileImageFileName()) || mv.thumbType == showDialTextThumb) { // display no tile image
                $mvThumb.html('');
                if (typeof (mv.colorScheme) == "undefined")
                    $mvThumb.append($dotBg.addClass("mv-dot-bg").append($dotImage.addClass("mv-dot")));
                else
                    prepareTextDial($mvThumb, mv);
            } else if(mv.image) { // display tile image
                if (checkUrlHasGoogleHost(mv.url) && (!mv.thumbType || mv.thumbType == showDialGalleryThumb) && mv.image.indexOf("data:image") < 0) {
                    $mvThumb.html('');
                    if (typeof (mv.colorScheme) == "undefined")
                        $mvThumb.append($dotBg.addClass("mv-dot-bg").append($dotImage.addClass("mv-dot")));
                    else
                        prepareTextDial($mvThumb, mv);
                } else {
                    if(mv.image.indexOf("data:image") < 0) {
                        $mvThumb.addClass("mv-thumb-image");
                        $thumbnail.css({"background": "url('" + mv.image + "') 50% 50% / contain no-repeat"});
                    } else {
                        if (mv.thumbType == showDialGalleryThumb) {
                            $mvThumb.html('');
                            if (typeof (mv.colorScheme) == "undefined")
                                $mvThumb.append($dotBg.addClass("mv-dot-bg").append($dotImage.addClass("mv-dot")));
                            else
                                prepareTextDial($mvThumb, mv);
                        } else {
                            $thumbnail.css({"background": "url('" + mv.image + "') 50% 50% / contain no-repeat"});
                            $mvThumb.addClass("mv-thumb-live");
                        }
                    }
                }
            } else {
                $mvThumb.html('');
                if (typeof (mv.colorScheme) == "undefined")
                    $mvThumb.append($dotBg.addClass("mv-dot-bg").append($dotImage.addClass("mv-dot")));
                else
                    prepareTextDial($mvThumb, mv);
            }
            $mvThumb.fadeIn(500);
        });
    }

    /**
     * Display async not loaded tiles thumb images
     */
    function displayNotLoadedTilesThumbImages() { 
        $(".mv-thumb-loading").each(function() {
            var $mvThumb = $(this);
            var $thumbnail = $mvThumb.find(".thumbnail-loading");
            setTimeout(function() {
            if($mvThumb.hasClass("mv-thumb-loading") && $thumbnail.hasClass("thumbnail-loading") /*&& !$mvThumb.hasClass("manual-preview")*/) {
                    $mvThumb.fadeOut(350, function() {
                        $mvThumb.removeClass("mv-thumb-loading");
                        $thumbnail.removeClass("thumbnail-loading");
                        $thumbnail.hide();

                        var $dotBg = $("<div></div>");
                        $dotBg.addClass("mv-dot-bg");
                        var $dotImage = $("<div></div>");
                        $dotImage.addClass("mv-dot");
                        $dotBg.append($dotImage);
                        $mvThumb.append($dotBg);
                        $mvThumb.fadeIn(500);
                    });
                }
            }, 1500);
        });
    }

    /**
     * Add dials panel visible dbl click handler
     */
    function addDialsPanelVisibleDblClickHandler() { 
        if(getDisplaySpeedDialPanel()) {
            setTimeout(function() {
                $(document).on("dblclick", dialsPanelVisibleChange);
            }, 1600);
        }
    }

    /**
     * Dials panel visible change
     *
     * @param e Event
     */
    function dialsPanelVisibleChange(e) { 
        e.preventDefault();
        var $targetEl = $(e.target);
        
        var relaxIsVisible = $("#relax-start-btn").is(":visible");
        
        var needReturn = false;
        
        if( $targetEl.context.nodeName.toLowerCase() != "html" &&
            $targetEl.attr("id") != "search-container" &&
            $targetEl.attr("id") != "footer-visible-dials" &&
            $targetEl.attr("id") != "dials-notification" &&
            $targetEl.attr("id") != "dials-notification-message" &&
            $targetEl.attr("id") != "mv-container" && 
            $targetEl.attr("id") != "mv-tiles" && //firefox
            $targetEl.attr("id") != "relax"
          )
            needReturn = true;
        else if($targetEl.hasClass("search-input") ||
                $targetEl.hasClass("search-placeholder") ||
                $targetEl.hasClass("search-suggestion-img") ||
                $targetEl.hasClass("search-suggestion-text") ||
                $targetEl.hasClass("search-suggestion-item"))
            needReturn = true;
        else if($targetEl.hasClass("relax-start-btn") ||
                $targetEl.hasClass("relax-done-btn")) {
            needReturn = true;
        }
        
        if(!needReturn) {
            var $tilesContainer = $(".mv-tiles");
            var $popup = $("#dials-notifications");
            var $clock = $("#clock-container");
            if($tilesContainer.is(":visible")) {
                if(!$popup.is(":visible")) {
                    BRW_sendMessage({"command": "setVisibleSpeedDialPanel", "val" : false});
                    
                    $("#footer-visible-dials").text(translate("page_footer_visible_dials_link_on"));
                    if(!getDialsNoticeHideState()) {
                        if(displayPopupTimeOut) clearTimeout(displayPopupTimeOut);
                        displayPopupTimeOut = setTimeout(function(){
                            var $popup = $("#dials-notifications");
                            if($popup.is(":visible"))
                                $popup.fadeOut(250);
                            clearTimeout(displayPopupTimeOut);
                        }, 3000);
                    }
                    $tilesContainer.fadeOut(250, function() {
                        if(!getDialsNoticeHideState())
                            $popup.fadeIn(250);
                        showClock(250);
                    });
                }
            } else {
                BRW_sendMessage({"command": "setVisibleSpeedDialPanel", "val" : true});
                
                $("#footer-visible-dials").text(translate("page_footer_visible_dials_link_off"));
                if(displayPopupTimeOut) clearTimeout(displayPopupTimeOut);
                if($popup.is(":visible")) {
                    hideClock(150);
                    $popup.fadeOut(250, function() {
                        $tilesContainer.fadeIn(250);
                    });
                } else {
                    if($clock.is(":visible")) {
                        $clock.fadeOut(150, function() {
                            $tilesContainer.fadeIn(250);
                        });
                    } else {
                        $tilesContainer.fadeIn(250);
                    }
                }
            }
        }
        e.stopPropagation();
    }

    $(function() {
        addDialsPanelVisibleDblClickHandler();
        
        $('#tileSearchModal').modal('hide');
    });

    /**
     * Dials search 
     */



function DialsSearch(data){
    var myself = this;
    myself.searchModal = $('#tileSearchModal');
    myself.form =  myself.searchModal.find('#tile-search-form');
    myself.input = myself.searchModal.find('#tileSearchText');
    myself.button= myself.searchModal.find('#buttonSubmit');
    myself.list  = myself.searchModal.find('#tileSearchList');
    myself.img   = myself.searchModal.find('#tileSearchImg');
    
    myself.last  = '';
    myself.xhr   = null;
    
    myself.actions = {
        "booking": {
            search : "http://fvdmedia.com/addon_search/booking.php",
            hintUrl: "http://www.booking.com/autocomplete_2?lang={lang}&aid=0&term={query}",
            image  : "./css/img/search/booking.png",
            parser : function (r) {
                return JSON.parse(r);
            },
            getArray: function (obj) {
                var arr = [];
                if (obj && obj.city/* && obj.city.lenght*/) {
                        //console.log(obj.city);

                    for (var k in obj.city){
                        //console.log(obj.city[k].label);
                        arr.push(obj.city[k].label);
                    }
                } //if
                return arr;
            }
        },
        "amazon": {
            search : "http://fvdmedia.com/addon_search/amazon.php",
            hintUrl: "http://completion.amazon.com/search/complete?method=completion&mkt=1&client=amazon-search-ui&x=String&search-alias=aps&q={query}&qs=&cf=1&fb=1&sc=1",
            image  : "./css/img/search/amazon.png",
            parser : function (r) {
                var m = r.match(/^completion\s*=\s*(.+)/i);
                var text = m[1];
                text = text.replace(/String\(\);$/, "");
                text = text.replace(/;+$/, "");
                return JSON.parse(text);
            },
            getArray: function (obj) {
                var arr = [];
                if (obj && obj[1]) arr = obj[1];
                return arr;
            }
        },
        "ebay": {
            search : "http://fvdmedia.com/addon_search/ebay_new.php",
            hintUrl: "http://autosug.ebay.com/autosug?kwd={query}&version=1279292363&_jgr=1&sId=0&_ch=0&callback=GH_ac_callback",
            image  : "./css/img/search/ebay.png",
            parser: function (r) {
                var m = r.match(/AutoFill\._do\((.+?)\)$/i);
                return JSON.parse(m[1]);
            },
            getArray: function (obj) {
                var arr = [];
                if (obj && obj.res && obj.res.sug) arr = obj.res.sug;
                return arr;
            }
        }
    }
    
    // Init actions
    this.init = function(obj, system, id){
        myself.id  = id;  // unique searcher ID
        myself.obj = obj; // dial object
        myself.system = String(system); //search system
        
        
        myself.form.on("submit", function(e){
            e.preventDefault();
            //myself.handleSubmit();
        });
        
        myself.button.on("click", function(e){
            myself.handleSubmit();
        });
        
        for(let key in myself.actions){
            if(myself.system.indexOf(key) > -1){
                myself.current = myself.actions[key]; //current search system actions
                break;
            }//if
        }//for
        
        myself.obj.on("click", function(e){
            e.preventDefault(); e.stopPropagation();
            myself.modalShow();
        });
        
        myself.input.on("keyup", function(e){
            e.preventDefault(); e.stopPropagation();
            //console.log(e.keyCode);
            
            switch(e.keyCode){
                case 13://enter
                    myself.handleSubmit(true, myself.input.val());
                break;
                case 37: case 38://up
                    myself.dropDownNav('up')
                break;
                case 39: case 40://down
                    myself.dropDownNav('down');
                break;
                default: 
                    myself.modalHint();
            }//switch
        });
    }//init
    
    this.modalShow = function(){
        myself.img.attr("src", myself.current.image);
        myself.input.attr({
            "search-id"  : myself.id,
            "placeholder": translate("page_speed_dials_search_title")+" "+myself.system
        }).val('').focus();
        myself.list.css("display","none").find("li").remove();
        myself.form.attr("action", myself.current.search);
        
        setTimeout(function(){
            myself.input.focus();
        }, 700);
        
        myself.searchModal.modal('show');
    }
    
    this.handleSubmit = function(dropdown, text){
        if(myself.id != myself.input.attr("search-id")) return false;
        
        var drop  =  myself.list.find("li.active");
        if(drop && drop.text()) myself.input.val(drop.text());
        
        var query = myself.input.val() || text;
        
        if(query.length){
            window.location = myself.current.search+'?q='+encodeURIComponent(String(query).trim());
        }//if
    },
    
    this.dropDownNav = function(dir){
        if(myself.id != myself.input.attr("search-id")) return false;
        
        var list  =  myself.list.find("li");
        var count =  list.length;
        
        if(count){
            var n=0, cur = -1;
            
            list.each(function(){
                if($(this).hasClass('active')) cur = n;
                n++;
            });
            
            if(dir == 'down'){
                if(cur < count-1){
                    list.removeClass('active');
                    $(list[++cur]).addClass('active');
                }
            }else if(dir == 'up'){
                list.removeClass('active');
                
                if(cur > 0){
                    $(list[--cur]).addClass('active');
                }
            }//else if
            
            
        }//if
    },
    
    this.modalHint = function(){
        if(myself.id != myself.input.attr("search-id")) return false;
        
        var query = myself.input.val().trim();
        
        if(!query.length){//reset datalist
            myself.list.css("display","none").find("li").remove();
        }else if(query != myself.last){
            myself.last = query;
            
            if(myself.xhr) 
                myself.xhr.abort();
            
            var url = myself.current.hintUrl
                        .replace('{query}', encodeURIComponent(query))
                        .replace('{lang}' , encodeURIComponent(navigator.language))
                      ;
            //console.log(url);
                
            myself.xhr = BRW_ajax(
                url,
                function(response){//successFunction
                    //if(myself.xhr){
                        var searchResponse = myself.xhr.responseText;

                        searchResponse = myself.current.parser(searchResponse);
                        response = myself.current.getArray(searchResponse);

                        //console.log(searchResponse); console.log(response);
                        //var response = ['Paris','Prague','Portugal'];

                        var elements = [];
                        for(let key in response){
                            elements.push(
                                $("<li>").text(response[key])
                                //$("<option>").attr("value", response[key])
                            );

                            if(key == 5) break; //dropdown limit
                        }//for

                        if(elements.length){
                            myself.list.css("display","block").html(elements);
                            
                            myself.list.find('li').on('click', function(){
                                myself.list.find('.active').removeClass('active');
                                $(this).addClass('active');
                                myself.handleSubmit(true);
                            });
                        }
                        else myself.list.css("display","none").find("li").remove();

                        //myself.xhr = null;
                    //}//if
                },//successFunction
                false, {'text':true}
            );
            
        }//if
    }
    
    return this;
}//function setDials()

































