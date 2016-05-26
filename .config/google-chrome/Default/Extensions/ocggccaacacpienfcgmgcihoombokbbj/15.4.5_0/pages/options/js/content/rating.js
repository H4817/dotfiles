/**
 * Application options rating
 */

    /**
     * Add application rating click handler
     */
    function addApplicationRatingClickHandler() {
        $(document).on("click", ".options-application-rating-item", function(e) {
            e.preventDefault();
            var val = parseInt($(this).attr("data-rating"));
            if(val) {
                if(val == 2 || val == 3) {
                    showFeedBackPopup();
                    setTimeout(function() {
                        hideApplicationRatingPopup(true);
                    }, 1000);
                } else if(val == 4) {
                    $(".options-application-rating-popup-data").fadeOut("350", function() {
                        $(".options-application-rating-popup-stars").fadeIn("350", function() {
                            var $el = $(this);
                            BRW_getAcceptLanguages(function(languages){
                                var hasRuLanguage = languages.indexOf("ru") != -1;
                                var url = appStoreUrlEn;
                                if(hasRuLanguage)
                                    url = appStoreUrlRu;

                                var openUrlTimeout = setTimeout(function() {
                                    if(openUrlTimeout)
                                        clearTimeout(openUrlTimeout);
                                    openUrlInNewTab(url);
                                    hideApplicationRatingPopup();
                                }, 2500);

                                $el.on("click", function() {
                                    if(openUrlTimeout)
                                        clearTimeout(openUrlTimeout);
                                    openUrlInNewTab(url);
                                    hideApplicationRatingPopup();
                                });
                            });
                        });
                    });
                } else if(val == 1)
                    hideApplicationRatingPopup(true);
                BRW_sendMessage({command: "setApplicationRating", val: val});
            }
        });

        getApplicationRating(applicationRatingNotSetYet);
    }

    /**
     * Application rating not set yet
     *
     * @param rating Int
     */
    function applicationRatingNotSetYet(rating) {
        if(!rating)
            getApplicationRatingShowStartTime(showApplicationRating);
    }

    /**
     * Show application rating
     *
     * @param showTime Int
     */
    function showApplicationRating(showTime) {
        var currentTime = new Date().getTime();
        if(currentTime > showTime)
            $(".options-header-center-block").fadeIn();
    }

    /**
     * Hide application rating popup
     *
     * @param animation Bool
     * @param callback Function
     */
    function hideApplicationRatingPopup(animation, callback) {
        var $popup = $("#options-application-rating-popup");
        if($popup.is(":visible")) {
            if(animation) {
                $popup.fadeOut(350, function() {
                    if(callback)
                        callback();
                });
            } else {
                $popup.css({"display" : "none"});
                if(callback)
                    callback();
            }
        }
    }