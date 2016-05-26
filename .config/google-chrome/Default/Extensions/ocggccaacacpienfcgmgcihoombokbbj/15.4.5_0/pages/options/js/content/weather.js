/**
 * Application options weather setting
 */

    /**
     * Display current weather location
     */
    function displayWeatherLocation() {
        var $weatherLocationDescription = $("#options-settings-weather-location-description");
        var $weatherLocationText = $("#options-settings-weather-location-text");
        var $weatherLocationInput = $("#options-settings-weather-location-input");
        var $weatherLocationInputField = $("#weather-location");
        getLastLocationWeather(function(locationWeather) {
            var $locationText = "";
            if (locationWeather) {
                $locationText += locationWeather.location.city;
                if(locationWeather.location.country)
                    $locationText += ", " + locationWeather.location.country;
            } else {
                $locationText = translate("options_settings_weather_location_unknown");
            }
            $weatherLocationDescription.text($locationText);
        });
        $(document).on("click", "#options-settings-weather-location-change", function(e) {
            e.preventDefault();
            $weatherLocationText.fadeOut("fast", function() {
                $weatherLocationInput.fadeIn("fast");
            });
        });
        $(document).on("click", "#options-settings-weather-location-cancel", function(e) {
            e.preventDefault();
            endEditWeatherLocation();
        });

        $("#weather-location-current-img").on("click", onClientPlaceCurrentClick);

        $("#options-settings-weather-location-form").on("submit", function(e) {
            e.preventDefault();
            var val = $weatherLocationInputField.val().trim();
            if(val) {
                BRW_getAcceptLanguages(function(languages) {
                    var hasRuLanguage = languages.indexOf("ru") != -1;
                    if (hasRuLanguage)
                        searchPlaceByDirectInputYandex(val, updateWeatherLocation);
                    else
                        searchPlaceByDirectInput(val, updateWeatherLocation);
                });
            } else
                endEditWeatherLocation();
        });
    }

    /**
     * Client place current click
     *
     * @param e Event
     */
    function onClientPlaceCurrentClick(e) {
        e.preventDefault();
        getCurrentLocation();
    }

    /**
     * Get client current location
     */
    function getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(function(e) {getLocationWeather(e)}, function(e) {getLocationError(e)});
    }

    /**
     * Get client current location error
     *
     * @param e Error
     */
    function getLocationError(e) {
        var $locationBtn = $("#weather-location-current-img");
        var $locationBlock = $("#weather-location-current-block-text");
        if($locationBtn.hasClass("btn-info")) {
            $locationBtn.addClass("btn-warning");
            $locationBtn.removeClass("btn-info");
            var $locationIcon = $locationBtn.find("span");
            $locationIcon.removeClass("glyphicon-map-marker").addClass("glyphicon-ban-circle");
            $locationBtn.off("click", onClientPlaceCurrentClick).on("click", function(e) {
                e.preventDefault();
                if(!$locationBlock.is(":visible"))
                    $locationBlock.fadeIn();
            });
            $locationBtn.attr("title", translate("options_settings_weather_location_block"));
            $locationBlock.fadeIn();
        }
    }

    /**
     * Get location weather by client coordinates
     *
     * @param geo Object
     */
    function getLocationWeather(geo) {
        BRW_getAcceptLanguages(function(languages) {
            var hasRuLanguage = languages.indexOf("ru") != -1;
            if(geo) {
                if(hasRuLanguage)
                    getPlaceWeatherYandex(geo, updateWeatherLocation);
                else
                    getPlaceWeather(geo.coords.latitude+","+geo.coords.longitude, updateWeatherLocation);
            } else {
                getLastLocationWeather(function(locationWeather) {
                    if(typeof (locationWeather['source']) != "undefined") {
                        if(locationWeather.source == locationWeatherSourceYandex)
                            getWeatherYandex(locationWeather.location.woeid, locationWeather.location, updateWeatherLocation);
                        else
                            getWeather(locationWeather.location.woeid, locationWeather.location, updateWeatherLocation);
                    } else {
                        getWeather(locationWeather.location.woeid, locationWeather.location, updateWeatherLocation);
                    }
                });
            }
        });
    }

    /**
     * Display client weather location
     *
     * @param locationWeather Object
     */
    function updateWeatherLocation(locationWeather) {
        if(locationWeather) {
            var locationText = "";
            locationText += locationWeather.location.city;
            if(locationWeather.location.country)
                locationText += ", " + locationWeather.location.country;
            $(".weather-unit-item").removeAttr("checked");
            if(locationWeather.unit)
                $(".weather-unit-item[data-weather-unit=" + locationWeather.unit + "]").prop('checked', true);
            $("#options-settings-weather-location-description").text(locationText);
            endEditWeatherLocation();
            getNetTabPages(reloadTabPages);
            BRW_TabsGetCurrentID(function(tab) {
                getSettingsTabPages(reloadTabPages, {skipTab: tab.id});
            });
        } else {
            endEditWeatherLocation();
        }
    }

    /**
     * Cancel edit weather location
     */
    function endEditWeatherLocation() {
        var $weatherLocationText = $("#options-settings-weather-location-text");
        var $weatherLocationInput = $("#options-settings-weather-location-input");
        var $weatherLocationInputField = $("#weather-location");
        var $locationBlock = $("#weather-location-current-block-text");
        if($locationBlock.is(":visible"))
            $locationBlock.fadeOut("fast");
        $weatherLocationInput.fadeOut("fast", function() {
            $weatherLocationText.fadeIn("fast", function() {
                $weatherLocationInputField.val("");
            });
        });
    }