/**
 * Application settings page
 */
    var settingsTabId;

    $(function() {
        BRW_langLoaded(function(){
            displayActiveOptionsTab(1);

            getSettingsCurentTab(function() {
                displaySearchOpenType();
                displaySearchFormBlock();
                displaySearchFormProviderType();
                displaySearchFormOpacitySlider();

                displaySpeedDialBlock();
                displaySpeedDialThumbBlock();
                displayPopularGroupBlock();
                displayCurrentDialsCount();
                displayDialsColumnsCount();
                displayDialsFormOpacitySlider();
                displayDialsOpenType();

                displayWeatherBlock();
                displayWeatherLocation();
                displayWeatherUnitFormat();
                displayWeatherTemperatureUnit();
                displayWeatherBackground();
                displayWeatherOpacitySlider();
                displayWeatherBackgroundOpacitySlider();

                displayClockType();
                displayClockSeconds();
                displayClockColorPickers();
                displayClockFormat();
                displayClockFormatLabel();
                displayClockDate();
                displayClockVisibleLabel();
                displayClockFontBold();
                displayClockBackgroundType();
                displayClockBlock();
                displayClockOpacitySlider();
                displayClockBackgroundOpacitySlider();
                addClockColorSchemeTypeButtonHandler();

                displayParallaxVideoThemeStatus();
                displayRelaxStatus();
                displayBackgroundParallaxValueSlider();

                displayTodoBlock();

                displayAppsLink();

                displayBottomPanelOpacitySlider();
            });
        });
    });

    /**
     * Get settings current tab
     */
    /*Moved to browser choiser*/
    function getSettingsCurentTab(callback) {
         PGS_getSettingsCurentTab(callback);
    }

    /**
     * Display weather block
     */
    function displayWeatherBlock() {
        var $el = $("#weather-display");
        getDisplayWeatherPanel(function(display) {
            if(display) {
                $el.attr("checked", "checked");
                $("#weather-settings").css({"display" : "block"});
            }
        });

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            var $weatherSettingsEl = $("#weather-settings");
            if(val) {
                $weatherSettingsEl.slideDown();
            }
            else {
                $weatherSettingsEl.slideUp();
                BRW_sendMessage({command: "resetWeatherPosition"});
            }

            BRW_sendMessage({command: "setDisplayWeatherPanel", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display weather temperature unit
     */
    function displayWeatherTemperatureUnit() {
        var $el = $("#weather-unit-display");
        getDisplayWeatherUnit(function(display) {
            if(display)
                $el.attr("checked", "checked");
        });

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            BRW_sendMessage({command: "setDisplayWeatherUnit", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display weather background
     */
    function displayWeatherBackground() {
        var $el = $("#weather-background-display");
        getDisplayWeatherBackground(function(display) {
            if(display) {
                $el.attr("checked", "checked");
                $("#weather-background-opacity").css({"display" : "block"});
            }
        });

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            var $weatherSettingsEl = $("#weather-background-opacity");
            if(val) {
                $weatherSettingsEl.slideDown();
            }
            else {
                $weatherSettingsEl.slideUp();
            }
            BRW_sendMessage({command: "setDisplayWeatherBackground", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display storage weather opacity slider
     */
    function displayWeatherOpacitySlider() {
        var opacityProp = getWeatherOpacity();
        var minOpacityProp = getMinWeatherOpacity();
        var maxOpacityProp = getMaxWeatherOpacity();
        var diffOpacityProp = maxOpacityProp - minOpacityProp;
        var minOpacityVal = 1;
        var maxOpacityVal = 100;
        var currentOpacity = (opacityProp - minOpacityProp) / (maxOpacityProp - minOpacityProp) * 100;
        var sliderId = "#weather-opacity-slider";
        var sliderLabelId = "#weather-opacity-value";
        $(sliderId).slider({
            range: "min",
            value: currentOpacity,
            min: minOpacityVal,
            max: maxOpacityVal,
            slide: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                var valuePercents = ((value - minOpacityProp) / diffOpacityProp * 100).toFixed(0);
                if(valuePercents < minOpacityVal) valuePercents = minOpacityVal;
                $(sliderLabelId).text(valuePercents  + "%");
            },
            stop: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                BRW_sendMessage({command: "setWeatherOpacity", val: value, tab: settingsTabId});
            }
        });
        $(sliderLabelId).text($(sliderId).slider("value")+"%");
    }

    /**
     * Display bottom panel opacity slider
     */
    function displayBottomPanelOpacitySlider() {
        var opacityProp = getBottomPanelOpacity();
        var minOpacityProp = getMinBottomPanelOpacity();
        var maxOpacityProp = getMaxBottomPanelOpacity();
        var diffOpacityProp = maxOpacityProp - minOpacityProp;
        var minOpacityVal = 1;
        var maxOpacityVal = 100;
        var currentOpacity = (opacityProp - minOpacityProp) / (maxOpacityProp - minOpacityProp) * 100;
        var sliderId = "#page-bottom-panel-opacity-slider";
        var sliderLabelId = "#page-bottom-panel-opacity-value";
        $(sliderId).slider({
            range: "min",
            value: currentOpacity,
            min: minOpacityVal,
            max: maxOpacityVal,
            slide: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                var valuePercents = ((value - minOpacityProp) / diffOpacityProp * 100).toFixed(0);
                if(valuePercents < minOpacityVal) valuePercents = minOpacityVal;
                $(sliderLabelId).text(valuePercents  + "%");
            },
            stop: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                BRW_sendMessage({command: "setBottomPanelOpacity", val: value, tab: settingsTabId});
            }
        });
        $(sliderLabelId).text($(sliderId).slider("value")+"%");
    }

    /**
     * Display storage weather background opacity slider
     */
    function displayWeatherBackgroundOpacitySlider() {
        var opacityProp = getWeatherBackgroundOpacity();
        var minOpacityProp = getMinWeatherBackgroundOpacity();
        var maxOpacityProp = getMaxWeatherBackgroundOpacity();
        var diffOpacityProp = maxOpacityProp - minOpacityProp;
        var minOpacityVal = 1;
        var maxOpacityVal = 100;
        var currentOpacity = (opacityProp - minOpacityProp) / (maxOpacityProp - minOpacityProp) * 100;
        var sliderId = "#weather-background-opacity-slider";
        var sliderLabelId = "#weather-background-opacity-value";
        $(sliderId).slider({
            range: "min",
            value: currentOpacity,
            min: minOpacityVal,
            max: maxOpacityVal,
            slide: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                var valuePercents = ((value - minOpacityProp) / diffOpacityProp * 100).toFixed(0);
                if(valuePercents < minOpacityVal) valuePercents = minOpacityVal;
                $(sliderLabelId).text(valuePercents  + "%");
            },
            stop: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                BRW_sendMessage({command: "setWeatherBackgroundOpacity", val: value, tab: settingsTabId});
            }
        });
        $(sliderLabelId).text($(sliderId).slider("value")+"%");
    }

    /**
     * Display to do block
     */
    function displayTodoBlock() {
        var $el = $("#todo-display");
        if(getDisplayTodoDialPanel()) {
            $el.attr("checked", "checked");
        }

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            if(!val) {
                BRW_sendMessage({command: "resetTodoPositionSize"});
            }
            BRW_sendMessage({command: "setDisplayTodoPanel", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display apps link
     */
    function displayAppsLink() {
        var $el = $("#apps-link-display");
        getDisplayAppsLink(function(display) {
            if(display)
                $el.attr("checked", "checked");
        });

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            BRW_sendMessage({command: "setDisplayAppsLink", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display clock block
     */
    function displayClockBlock() {
        var $el = $("#clock-display");
        if(getDisplayClockPanel()) {
            $el.attr("checked", "checked");
            $("#clock-settings").show();
        }

        $el.on("change", function(e) {
            var val = $el.is(':checked');

            var $clockSettingsEl = $("#clock-settings");
            if(val) {
                $clockSettingsEl.slideDown();
            }
            else {
                $clockSettingsEl.slideUp();
            }

            BRW_sendMessage({command: "setDisplayClockPanel", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display clock seconds
     */
    function displayClockSeconds() {
        var $el = $("#clock-seconds");
        if(getVisibleClockSeconds())
            $el.attr("checked", "checked");

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            setVisibleSpeedDialPanel(false);
            BRW_sendMessage({command: "setClockSecondsVisible", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display speed dial block
     */
    function displaySpeedDialBlock() {
        var $el = $("#dials-display");
        if(getDisplaySpeedDialPanel()) {
            $el.attr("checked", "checked");
            $("#dials-settings").show();
        }

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            var $dialsCountEl = $("#dials-settings");
            if(val) {
                $dialsCountEl.slideDown();
            }
            else {
                sendToGoogleAnalitic(function() {
                    ga('send', 'event', 'dials', 'turnoff');
                });
                $dialsCountEl.slideUp();
            }

            BRW_sendMessage({command: "setDisplaySpeedDialPanel", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display popular group block
     */
    function displayPopularGroupBlock() {
        var $el = $("#popular-group-display");
        if(getDisplayPopularGroup()) {
            $el.attr("checked", "checked");
            $("#popular-dials-settings").show(0);
        }

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            var $popularGroupEl = $("#popular-dials-settings");
            if(val) {
                $popularGroupEl.slideDown();
            } else {
                $popularGroupEl.slideUp();
            }

            BRW_sendMessage({command: "setDisplayPopularGroup", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display speed dial thumb block
     */
    function displaySpeedDialThumbBlock() {
        var $el = $(".speed-dial-generate-type-item");
        getNewSpeedDialThumbType(function(type) {
            var $currentEl = $(".speed-dial-generate-type-item[data-new-dial-thumb-generate-type=" + type + "]");
            if($currentEl.length) {
                $currentEl.each(function() {
                    var $item = $(this);
                    $item.attr("checked", "checked");
                });
            }
        });

        $el.on("click", function(e) {
            setVisibleSpeedDialPanel(true);
            var val = parseInt($(this).attr("data-new-dial-thumb-generate-type"));
            BRW_sendMessage({command: "setNewSpeedDialThumbType", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display speed dial columns count block
     */
    function displayDialsColumnsCount() {
        var $el = $(".dials-columns-count-item");
        getDialsColumnsCount(function(count) {
            var $currentEl = $(".dials-columns-count-item[data-dials-columns-count=" + count + "]");
            if($currentEl.length) {
                $currentEl.each(function() {
                    var $item = $(this);
                    $item.attr("checked", "checked");
                });
            }
        });

        $el.on("click", function(e) {
            setVisibleSpeedDialPanel(true);
            var val = parseInt($(this).attr("data-dials-columns-count"));
            BRW_sendMessage({command: "setDialsColumnsCount", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display clock format
     */
    function displayClockFormat() {
        var $el = $(".clock-format-item");
        var $currentEl = $(".clock-format-item[data-clock-format=" + getClockFormat() + "]");
        if($currentEl.length) {
            $currentEl.each(function() {
                var $item = $(this);
                    $item.attr("checked", "checked");
                var itemVal = parseInt($item.attr("data-clock-format"));
                if(itemVal)
                    $("#clock-format-label-block").show();
            });
        }

        $el.on("click", function(e) {
            setVisibleSpeedDialPanel(false);
            var val = parseInt($(this).attr("data-clock-format"));
            var $clockFormatLabel = $("#clock-format-label-block");
            var $clockFormatLabelColor = $("#clock-ampm-label-color-block");
            var clockFormatLabel = getClockFormatLabel();
            if(val) {
                $clockFormatLabel.slideDown();
                if(clockFormatLabel && !$clockFormatLabelColor.is(":visible"))
                    $clockFormatLabelColor.slideDown();
            }
            else {
                $clockFormatLabel.slideUp();
                if($clockFormatLabelColor.is(":visible"))
                    $clockFormatLabelColor.slideUp();
            }
            BRW_sendMessage({command: "setClockFormat", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display weather unit
     */
    function displayWeatherUnitFormat() {
        var $el = $(".weather-unit-item");
        getWeatherUnitVal(function(unit) {
            getLastLocationWeather(function(locationWear) {
                var localUnit = unit ? unit : (locationWear ? locationWear.unit : "");
                if(localUnit) {
                    var $currentEl = $(".weather-unit-item[data-weather-unit=" + localUnit + "]");
                    if($currentEl.length) {
                        $currentEl.each(function() {
                            var $item = $(this);
                            $item.attr("checked", "checked");
                        });
                    }
                }
            });
        });

        $el.on("click", function(e) {
            var val = $(this).attr("data-weather-unit");
            BRW_sendMessage({command: "setWeatherUnit", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display clock format label
     */
    function displayClockFormatLabel() {
        var $el = $("#clock-format-label");
        if(getClockFormatLabel())
            $el.attr("checked", "checked");

        $el.on("change", function(e) {
            setVisibleSpeedDialPanel(false);
            var val = $el.is(':checked');
            var $clockFormatLabelColor = $("#clock-ampm-label-color-block");

            if(val) {
                if(!$clockFormatLabelColor.is(":visible"))
                    $clockFormatLabelColor.slideDown();
            } else {
                if($clockFormatLabelColor.is(":visible"))
                    $clockFormatLabelColor.slideUp();
            }

            BRW_sendMessage({command: "setClockFormatLabel", val: val, tab: settingsTabId});
        });
    }
    /**
     * Display clock date
     */
    function displayClockDate() {
        var $el = $("#clock-date");
        
        if(getClockDate())
            $el.attr("checked", "checked");

        $el.on("change", function(e) {
            //setVisibleSpeedDialPanel(false);
            var val = $el.is(':checked');

            BRW_sendMessage({command: "setClockDate", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display clock visible label
     */
    function displayClockVisibleLabel() {
        var $el = $("#clock-visible-label");
        if(getClockVisibleLabel())
            $el.attr("checked", "checked");

        $el.on("change", function(e) {
            setVisibleSpeedDialPanel(false);
            var val = $el.is(':checked');
            var $clockVisibleLabelColor = $("#clock-label-color-block");

            if(val) {
                if(!$clockVisibleLabelColor.is(":visible"))
                    $clockVisibleLabelColor.slideDown();
            } else {
                if($clockVisibleLabelColor.is(":visible"))
                    $clockVisibleLabelColor.slideUp();
            }

            BRW_sendMessage({command: "setClockVisibleLabel", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display clock font bold
     */
    function displayClockFontBold() {
        var $el = $("#clock-font-bold");
        if(getClockFontBold())
            $el.attr("checked", "checked");

        $el.on("change", function(e) {
            setVisibleSpeedDialPanel(false);
            var val = $el.is(':checked');
            BRW_sendMessage({command: "setClockFontBold", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display current dials count
     */
    function displayCurrentDialsCount() {
        var $el = $("#dials-count");
        $el.val(getDisplayTilesCount());

        $el.on("keyup", function(e) {
            var $el = $(this);
            var val = $el.val();
            var maxVal = getMaxDisplayTilesCount();
            if(val.length) {
                if(val > maxVal) {
                    $el.val(maxVal);
                    BRW_sendMessage({command: "setDisplayTilesCount", val: maxVal, tab: settingsTabId});
                }
                else if(val < 1) {
                    $el.val(1);
                    BRW_sendMessage({command: "setDisplayTilesCount", val: 1, tab: settingsTabId});
                }
            }
        });

        $el.on("change", function(e) {
            var $el = $(this);
            var val = $el.val();
            var maxVal = getMaxDisplayTilesCount();
            if(val > maxVal)
                val = maxVal;
            else if(val < 1)
                val = 1;
            BRW_sendMessage({command: "setDisplayTilesCount", val: val, tab: settingsTabId});
        });
    }

    /**
     * Display parallax video theme status
     */
    function displayParallaxVideoThemeStatus() {
        var $el = $("#parallax-display");
        if(getDisplayParallaxVideoTheme()) {
            $el.attr("checked", "checked");
            $("#background-parallax-value").show();
        }
        if(getDisplayVideoTheme())
            $("#background-parallax-display").show();
        $el.on("change", function(e) {
            var val = $el.is(':checked');
            BRW_sendMessage({command: "setDisplayParallaxVideoTheme", val: val, tab: settingsTabId});
            var $parallaxEl = $("#background-parallax-value");
            if(val)
                $parallaxEl.slideDown();
            else
                $parallaxEl.slideUp();
        });
    }


    /**
     * Display relax status
     */
    function displayRelaxStatus() {
        var $el = $("#relax-display");
        if(getDisplayRelax())
            $el.attr("checked", "checked");

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            BRW_sendMessage({command: "setDisplayRelax", val: val, tab: settingsTabId});
            if(!val) {
                sendToGoogleAnalitic(function() {
                    ga('send', 'event', 'relax', 'off');
                });
            }
        });
    }

    /**
     * Display search form block
     */
    function displaySearchFormBlock() {
        var $el = $("#search-form-display");
        getDisplaySearchForm(function(display) {
            if(display) {
                $el.attr("checked", "checked");
                $("#search-form-settings").css({"display" : "block"});
            }
        });

        $el.on("change", function(e) {
            var val = $el.is(':checked');
            if(!val) {
                sendToGoogleAnalitic(function() {
                    ga('send', 'event', 'searchbar', 'turnoff');
                });
            }
            BRW_sendMessage({command: "setDisplaySearchForm", val: val, tab: settingsTabId});
            var $settings = $("#search-form-settings");
            if(val)
                $settings.slideDown();
            else
                $settings.slideUp();
        });
    }

    /**
     * Display search form provider type
     */
    function displaySearchFormProviderType() {
        BRW_getAcceptLanguages(function(languages) {
            var hasRuLanguage = languages.indexOf("ru") != -1;
            if(hasRuLanguage) {
                $("#search-form-provider").css({"display" : "block"});
                var $el = $(".search-form-provider-item");
                getSearchFormProviderType(function(searchPorviderType) {
                    var $currentEl = $(".search-form-provider-item[data-search-provider=" + searchPorviderType + "]");
                    if($currentEl.length) {
                        $currentEl.each(function() {
                            var $item = $(this);
                            $item.attr("checked", "checked");
                        });
                    }
                });

                $el.on("click", function(e) {
                    var val = parseInt($(this).attr("data-search-provider"));
                    BRW_sendMessage({command: "setSearchFormProviderType", val: val, tab: settingsTabId});
                });
            }
        });
    }

    /**
     * Display storage parallax distance slider
     */
    function displaySearchFormOpacitySlider() {
        var opacityProp = getSearchFormOpacity();
        var minOpacityProp = getMinSearchFormOpacity();
        var maxOpacityProp = getMaxSearchFormOpacity();
        var diffOpacityProp = maxOpacityProp - minOpacityProp;
        var minOpacityVal = 1;
        var maxOpacityVal = 100;
        var currentOpacity = (opacityProp - minOpacityProp) / (maxOpacityProp - minOpacityProp) * 100;
        var sliderId = "#search-form-min-opacity-slider";
        var sliderLabelId = "#search-form-min-opacity";
        $(sliderId).slider({
            range: "min",
            value: currentOpacity,
            min: minOpacityVal,
            max: maxOpacityVal,
            slide: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                var valuePercents = ((value - minOpacityProp) / diffOpacityProp * 100).toFixed(0);
                if(valuePercents < minOpacityVal) valuePercents = minOpacityVal;
                $(sliderLabelId).text(valuePercents  + "%");
            },
            stop: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                BRW_sendMessage({command: "setSearchFormOpacity", val: value, tab: settingsTabId});
            }
        });
        $(sliderLabelId).text($(sliderId).slider("value")+"%");
    }

    /**
     * Display storage clock opacity slider
     */
    function displayClockOpacitySlider() {
        var opacityProp = getClockOpacity();
        var minOpacityProp = getMinClockOpacity();
        var maxOpacityProp = getMaxClockOpacity();
        var diffOpacityProp = maxOpacityProp - minOpacityProp;
        var minOpacityVal = 1;
        var maxOpacityVal = 100;
        var currentOpacity = (opacityProp - minOpacityProp) / (maxOpacityProp - minOpacityProp) * 100;
        var sliderId = "#clock-opacity-slider";
        var sliderLabelId = "#clock-opacity-value";
        $(sliderId).slider({
            range: "min",
            value: currentOpacity,
            min: minOpacityVal,
            max: maxOpacityVal,
            slide: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                var valuePercents = ((value - minOpacityProp) / diffOpacityProp * 100).toFixed(0);
                if(valuePercents < minOpacityVal) valuePercents = minOpacityVal;
                $(sliderLabelId).text(valuePercents  + "%");
            },
            stop: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                BRW_sendMessage({command: "setClockOpacity", val: value, tab: settingsTabId});
            }
        });
        $(sliderLabelId).text($(sliderId).slider("value")+"%");
    }

    /**
     * Display storage clock background opacity slider
     */
    function displayClockBackgroundOpacitySlider() {
        var opacityProp = getClockBackgroundOpacity();
        var minOpacityProp = getMinClockBackgroundOpacity();
        var maxOpacityProp = getMaxClockBackgroundOpacity();
        var diffOpacityProp = maxOpacityProp - minOpacityProp;
        var minOpacityVal = 1;
        var maxOpacityVal = 100;
        var currentOpacity = (opacityProp - minOpacityProp) / (maxOpacityProp - minOpacityProp) * 100;
        var sliderId = "#clock-background-opacity-slider";
        var sliderLabelId = "#clock-background-opacity-value";
        $(sliderId).slider({
            range: "min",
            value: currentOpacity,
            min: minOpacityVal,
            max: maxOpacityVal,
            slide: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                var valuePercents = ((value - minOpacityProp) / diffOpacityProp * 100).toFixed(0);
                if(valuePercents < minOpacityVal) valuePercents = minOpacityVal;
                $(sliderLabelId).text(valuePercents  + "%");
            },
            stop: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                BRW_sendMessage({command: "setClockBackgroundOpacity", val: value, tab: settingsTabId});
                setClockBackgroundOpacity(value);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
            }
        });
        $(sliderLabelId).text($(sliderId).slider("value")+"%");
    }

    /**
     * Display background parallax value slider
     */
    function displayBackgroundParallaxValueSlider() {
        var multiplier = getBackgroundParallaxValue();
        var minParallaxMultiplier = getMinBackgroundParallaxValue();
        var maxParallaxMultiplier = getMaxBackgroundParallaxValue();
        var sliderId = "#parallax-value-slider";
        var sliderLabelId = "#parallax-value";
        $(sliderId).slider({
            range: "min",
            value: multiplier,
            min: minParallaxMultiplier,
            max: maxParallaxMultiplier,
            slide: function( event, ui ) {
                $(sliderLabelId).text(ui.value  + "%");
            },
            stop: function( event, ui ) {
                BRW_sendMessage({command: "setBackgroundParallaxValue", val: ui.value, tab: settingsTabId});
            }
        });
        $(sliderLabelId).text($(sliderId).slider("value")+"%");
    }

    /**
     * Display storage parallax distance slider
     */
    function displayDialsFormOpacitySlider() {
        var opacityProp = getDialsFormOpacity();
        var minOpacityProp = getMinDialsFormOpacity();
        var maxOpacityProp = getMaxDialsFormOpacity();
        var diffOpacityProp = maxOpacityProp - minOpacityProp;
        var minOpacityVal = 1;
        var maxOpacityVal = 100;
        var currentOpacity = (opacityProp - minOpacityProp) / (maxOpacityProp - minOpacityProp) * 100;
        var sliderId = "#dials-form-min-opacity-slider";
        var sliderLabelId = "#dials-form-min-opacity";
        $(sliderId).slider({
            range: "min",
            value: currentOpacity,
            min: minOpacityVal,
            max: maxOpacityVal,
            slide: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                var valuePercents = ((value - minOpacityProp) / diffOpacityProp * 100).toFixed(0);
                $(sliderLabelId).text(valuePercents  + "%");
            },
            stop: function( event, ui ) {
                var value = (minOpacityProp + ui.value * diffOpacityProp / 100).toFixed(2);
                BRW_sendMessage({command: "setDialsFormOpacity", val: value, tab: settingsTabId});
            }
        });
        $(sliderLabelId).text($(sliderId).slider("value")+"%");
    }

    /**
     * Display dials open type
     */
    function displayDialsOpenType() {
        var $container = $("#dials-open-type");
        var $el = $container.find("#dials-open");
        $el.val(getOpenDialType());
        $el.on("change", function() {
            BRW_sendMessage({command: "setOpenDialType", val: $(this).val(), tab: settingsTabId});
        });
    }

    /**
     * Display search open type
     */
    function displaySearchOpenType() {
        var $container = $("#search-open-type");
        var $el = $container.find("#search-open");
        $el.val(getOpenSearchType());
        $el.on("change", function() {
            BRW_sendMessage({command: "setOpenSearchType", val: $(this).val(), tab: settingsTabId});
        });
    }

    /**
     * Display search open type
     */
    function displayClockType() {
        var $container = $("#clock-type-block");
        var $el = $container.find("#clock-type");
        var clockType = getClockType();
        $el.val(clockType);
        if(checkClockTypeNoLabel(clockType))
            $("#clock-visible-label-block").css({"display" : "none"});

        $el.on("change", function() {
            var val = parseInt($(this).val());
            BRW_sendMessage({command: "setClockType", val: val, tab: settingsTabId});

            clearClockSchemeContent();
            displayClockColorBlocks(val);

            var $clockVisibleLabel = $("#clock-visible-label-block");
            if(checkClockTypeNoLabel(val)) {
                if($clockVisibleLabel.is(":visible"))
                    $clockVisibleLabel.slideUp();
            } else {
                if(!$clockVisibleLabel.is(":visible"))
                    $clockVisibleLabel.slideDown();
            }
        });
        displayClockColorBlocks(clockType);
    }

    /**
     * Display clock background type
     */
    function displayClockBackgroundType() {
        var $container = $("#clock-background-block");
        var $el = $container.find("#clock-background");
        var clockBackgroundType = getClockBackgroundType();
        var $clockBackgroundOpacity = $("#clock-background-opacity");
        $el.val(clockBackgroundType);

        if(clockBackgroundType)
            $clockBackgroundOpacity.show();

        $el.on("change", function() {
            var val = parseInt($(this).val());
            BRW_sendMessage({command: "setClockBackgroundType", val: val, tab: settingsTabId});

            var $clockBackgroundOpacity = $("#clock-background-opacity");
            if(val)
                $clockBackgroundOpacity.slideDown();
            else
                $clockBackgroundOpacity.slideUp();
        });
    }

    /**
     * Clear clock scheme content
     */
    function clearClockSchemeContent() {
        $(".clock-color-scheme-btn").removeClass("clock-color-scheme-active");
        clearClockColorScheme();
    }

    /**
     * Display clock color blocks
     *
     * @param clockType Number
     */
    function displayClockColorBlocks(clockType) {
        var $container = $("#clock-colors-block-items");
        if($container.is(":visible")) {
            $container.slideUp(500, function() {
                displayClockColorBlocksItem(clockType, true);
            });
        } else {
            displayClockColorBlocksItem(clockType, false);
        }
    }

    /**
     * Display clock color block items
     *
     * @param clockType Number
     * @param animate Bool
     */
    function displayClockColorBlocksItem(clockType, animate) {
        var $colorItems = $(".clock-color-block");
        $colorItems.hide();
        var $colorTime = $("#clock-time-color-block");
        var $colorLabel = $("#clock-label-color-block");
        var $colorAmPmLabel = $("#clock-ampm-label-color-block");
        var $colorDigitBg = $("#clock-digit-bg-color-block");
        var $colorDoneLine = $("#clock-circle-done-line-color-block");
        var $colorTotalLine = $("#clock-circle-total-line-color-block");
        var $colorBorderLine = $("#clock-border-line-color-block");
        $colorTime.show();
        if(getClockFormat() && getClockFormatLabel())
            $colorAmPmLabel.show();
        var lableIsVisible = getClockVisibleLabel();
        switch (clockType) {
            case 3:
            {
                if(lableIsVisible) $colorLabel.show();
                $colorBorderLine.show();
                break;
            }
            case 6:
            {
                if(lableIsVisible) $colorLabel.show();
                $colorDigitBg.show();
                break;
            }
            case 9:
            {
                if(lableIsVisible) $colorLabel.show();
                $colorDoneLine.show();
                $colorTotalLine.show();
                break;
            }
            case 10:
            {
                if(lableIsVisible) $colorLabel.show();
                $colorDigitBg.show();
                break;
            }
        }
        updateClockColorPickers();
        setTimeout(function () {
            var $container = $("#clock-colors-block-items");
            if(animate) {
                if(!$(".clock-color-scheme-active").length)
                    $("#clock-color-scheme-default").addClass("clock-color-scheme-active");
                $container.slideDown();
            } else
                $container.show();
        }, 250);
    }

    /**
     * Add clock color scheme type button handler
     */
    function addClockColorSchemeTypeButtonHandler() {
        var $colorLightBtn = $("#clock-color-scheme-light");
        var $colorDarkBtn = $("#clock-color-scheme-dark");
        var $colorDefaultBtn = $("#clock-color-scheme-default");
            $colorLightBtn.attr("data-settings-color-scheme-type", clockColorSchemeLight);
            $colorDarkBtn.attr("data-settings-color-scheme-type", clockColorSchemeDark);
            $colorDefaultBtn.attr("data-settings-color-scheme-type", clockColorSchemeDefault);
        var colorSchemeType = getClockColorSchemeType();
        if(colorSchemeType == clockColorSchemeLight)
            $colorLightBtn.addClass("clock-color-scheme-active");
        else if(colorSchemeType == clockColorSchemeDark)
            $colorDarkBtn.addClass("clock-color-scheme-active");
        else
            $colorDefaultBtn.addClass("clock-color-scheme-active");


        $(document).on("click", ".clock-color-scheme-btn", function(e) {
            clearClockSchemeContent();
            var $el = $(this).addClass("clock-color-scheme-active");
            BRW_sendMessage({command: "setClockColorSchemeType", val: $el.attr("data-settings-color-scheme-type"), tab: settingsTabId});
            setTimeout(function() {
                updateClockColorPickers(true);
            }, 50);
        });
    }

    /**
     * Display color pickers
     */
    function displayClockColorPickers() {
        var clockColors = getClockColorScheme(getClockType());
        $("#clock-colors-block").find(".mini-colors").each(function () {
            var color = clockColors[$(this).attr("id")];
            if(!color && $(this).attr("id") == "clock-ampm-label-color") // if am/pm color not defined set as text color
                color = clockColors['clock-time-color'];
            $(this).
                val(color).
                css('border-color', color).
                colpick({
                    layout:'hex',
                    submit:0,
                    colorScheme:'dark',
                    color: color.substr(1),
                    onChange:function(hsb,hex,rgb,el,bySetColor) {
                        hex = hex.toUpperCase();
                        $(el).css('border-color','#'+hex);
                        if(!bySetColor) $(el).val('#' + hex);
                        if(getClockColorSchemeSkipClear()) {
                            clearClockColorSchemeSkipClear();
                        } else {
                            clearClockSchemeContent();
                        }
                        setTimeout(function() {
                            saveClockColorScheme();
                        }, 50);
                    }
                }).keyup(function(){
                    $(this).colpickSetColor(this.value);
                });
        });
    }

    /**
     * Update clock color pickers
     */
    function updateClockColorPickers(skipClear) {
        var clockColors = getClockColorScheme(getClockType());
        $("#clock-colors-block").find(".mini-colors").each(function () {
            var $el = $(this);
            var color = clockColors[$(this).attr("id")];
            if(!color && $(this).attr("id") == "clock-ampm-label-color") // if am/pm color not defined set as text color
                color = clockColors['clock-time-color'];
            if(skipClear)
                setClockColorSchemeSkipClear();
            $el.colpickSetColor(color).val(color);
        });
    }

    /**
     * Save clock color scheme
     */
    function saveClockColorScheme() {
        var colors = getClockColorsObject();
        $("#clock-colors-block-items").find(".mini-colors").each(function() {
            var $el = $(this);
            var val = $el.val();
            if(typeof (colors[$el.attr("id")]) != "undefined")
                colors[$el.attr("id")] = val ? val : defaultClockItemColor;
        });
        setClockColorScheme(colors);
    }