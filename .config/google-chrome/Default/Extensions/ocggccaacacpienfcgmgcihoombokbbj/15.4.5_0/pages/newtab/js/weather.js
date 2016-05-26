var weatherShowTimer;
var defaultWeatherStyle = {"right" : 25 + "px", "left" : "auto", "top" : 10 + "px", "bottom" : "auto"};

/**
 * Get client current location
 */
function getCurrentLocation() { 
    navigator.geolocation.getCurrentPosition(function(geo) {
        getLocationWeather(geo, true);
        endEditClientPlace($("#weather-city"));
    }, getLocationError);
}

/**
 * Get location weather by client coordinates
 *
 * @param geo Object
 * @param skipCache Bool
 */
function getLocationWeather(geo, skipCache) { 
    locationWeatherCacheNeedUpdate(function(update) {
        getLastLocationWeather(function(locationWeather) {
            if(skipCache)
                update = true;
            if(update) {
                BRW_getAcceptLanguages(function(languages) {
                    var hasRuLanguage = languages.indexOf("ru") != -1;
                    if(geo) {
                        if(hasRuLanguage)
                            getPlaceWeatherYandex(geo, displayWeather);
                        else
                            getPlaceWeather(geo.coords.latitude+","+geo.coords.longitude, displayWeather);
                    } else {
                        if(typeof (locationWeather['source']) != "undefined") {
                            if(locationWeather.source == locationWeatherSourceYandex)
                                getWeatherYandex(locationWeather.location.woeid, locationWeather.location, displayWeather);
                            else
                                getWeather(locationWeather.location.woeid, locationWeather.location, displayWeather);
                        } else {
                            getWeather(locationWeather.location.woeid, locationWeather.location, displayWeather);
                        }
                    }
                });
            } else
                displayWeather(locationWeather);
        });

    });
}

/**
 * Get client current location error
 *
 * @param e Error
 */
function getLocationError(e) { 
    var $block = $("#header-weather");
        $block.css(defaultWeatherStyle);
    var $intro = $("#weather-intro");
    var $active = $("#weather-active");
    var $error = $("#weather-error");
    if($active.is(":visible"))
        $active.css({"display" : "none"});
    if($intro.is(":visible"))
        $intro.css({"display" : "none"});
    if(!$error.is(":visible"))
        $error.css({"display" : "inline-block"});
    $("#weather-input-city-field").focus();
}

/**
 * Display client weather
 *
 * @param locationWeather Object
 */
function displayWeather(locationWeather) { 
    var $weatherUnits = $("#weather-units");
    var $weatherBackground = $("#header-weather");

    $("#weather-icon").attr("title", locationWeather.weather.text ? locationWeather.weather.text.capitalizeFirstLetter() : "")
        .attr("data-icon", getWeatherImage(locationWeather.weather.code));
    $("#weather-temperature").html(locationWeather.weather.temp + "&deg;");
    $("#weather-city").html(locationWeather.location.city);
    $weatherUnits.html(locationWeather.unit.toUpperCase());

    getDisplayWeatherUnit(function(display) {
        if(display)
            $weatherUnits.css({"display" : "inline"});
    });

    getDisplayWeatherBackground(function(display) {
        var opacity = 0;
        if(display)
            opacity = getWeatherBackgroundOpacity();
        $weatherBackground.css({"background-color": "rgba(0, 0, 0, " + opacity + ")"});
    });

    $weatherBackground.css({"opacity" : getWeatherOpacity()});

    var $intro = $("#weather-intro");
    var $active = $("#weather-active");
    var $error = $("#weather-error");

    $("#weather-input-city-field").val("");

    if($intro.is(":visible"))
        $intro.css({"display" : "none"});
    if($error.is(":visible"))
        $error.css({"display" : "none"});
    if(!$active.is(":visible")) {
        addWeatherListDraggableProperty();
        displayWeatherContainer();
        $active.fadeIn();
    }
}

/**
 * Display weather container
 */
function displayWeatherContainer() { 
    var $weatherContainer = $("#header-weather");
    var windowHeight = parseInt($(window).height());
    var windowWidth = parseInt($(window).width());

    var containerHeight = parseInt($weatherContainer.height());
    var containerWidth = parseInt($weatherContainer.width());
    var displayWeatherCoordinates = getDisplayWeatherCoordinates();
    if (typeof (displayWeatherCoordinates) != "undefined") {
        var displayTop, displayLeft;

        if (displayWeatherCoordinates) {
            displayTop = parseInt(displayWeatherCoordinates.top);
            displayLeft = parseInt(displayWeatherCoordinates.left);
        }

        if (((displayLeft + containerWidth) > windowWidth) || (displayLeft < 0) || ((displayTop + containerHeight) > windowHeight) || (displayTop < 0))
            $weatherContainer.css(defaultWeatherStyle);
        else {
            if (displayWeatherCoordinates)
                $weatherContainer.css({"left": displayLeft + "px", "right" : "auto", "top": displayTop + "px", "bottom" : "auto"});
            else
                $weatherContainer.css(defaultWeatherStyle);
        }


        $(window).resize(function () {
            var $weatherContainer = $("#header-weather");
            if ($weatherContainer.is(":visible")) {
                if (weatherShowTimer)
                    clearTimeout(weatherShowTimer);
                weatherShowTimer = setTimeout(function () {
                    calculateNewWeatherPosition();
                }, 20);
            }
        });
    }
}

/**
 * Add weather list draggable
 */
function addWeatherListDraggableProperty() { 
    $("#header-weather").draggable({ handle: "#weather-active", containment: "#background-borders", scroll: false,
        stop: function(event, ui) {
            updateWeatherCoordinates($(this));
        }
    });
}

/**
 * Update weather list coordinates
 *
 * @param $el jQuery element
 */
function updateWeatherCoordinates($el) { 
    var Stoppos = $el.position();
    var left = parseInt(Stoppos.left);
    var top = parseInt(Stoppos.top);
    BRW_sendMessage({command: "changeWeatherItemCoordinates", "left": left,  "top": top});
}

/**
 * Calculate new weather position
 */
function calculateNewWeatherPosition() { 
    var $weatherContainer = $("#header-weather");

    var coordinates = getDisplayWeatherCoordinates();
    var windowHeight = parseInt($(window).height());
    var windowWidth = parseInt($(window).width());

    var Stoppos = $weatherContainer.position();
    var displayLeft = parseInt(Stoppos.left);
    var displayTop = parseInt(Stoppos.top);

    var containerWidth = $weatherContainer.width();
    var containerHeight = $weatherContainer.height();

    var displayLeftStyle = false;
    var displayTopStyle = false;

    if(displayLeft + containerWidth >= windowWidth) {
        $weatherContainer.css(defaultWeatherStyle);
    } else {
        if(coordinates) {
            if(coordinates.left + containerWidth >= windowWidth)
                $weatherContainer.css(defaultWeatherStyle);
            else
                displayLeftStyle = true;
        }
        else
            $weatherContainer.css(defaultWeatherStyle);
    }

    if(windowHeight - containerHeight >= 0) {
        if(displayTop + containerHeight >= windowHeight) {
            $weatherContainer.css(defaultWeatherStyle);
        } else {
            if(coordinates) {
                if(coordinates.top + containerHeight >= windowHeight)
                    $weatherContainer.css(defaultWeatherStyle);
                else
                    displayTopStyle = true;
            } else
                $weatherContainer.css(defaultWeatherStyle);
        }
    } else
        $weatherContainer.css(defaultWeatherStyle);

    if(displayLeftStyle && displayTopStyle)
        $weatherContainer.css({"right" : "auto", "left" : coordinates.left, "top" : coordinates.top, "bottom" : "auto"});
    else
        $weatherContainer.css(defaultWeatherStyle);

    if(displayLeft < 0)
        $weatherContainer.css(defaultWeatherStyle);
    else if(displayTop < 0)
        $weatherContainer.css(defaultWeatherStyle);
}

/**
 * Set client default location weather
 */
function setDefaultLocationWeather() { 
    getLastLocationWeather(function(locationWeather) {
        if(locationWeather)
            displayWeather(locationWeather);
    });
}

/**
 * Edit client place
 *
 * @param e Event
 */
function editClientPlace(e) { 
    var $el = $(this);
    if(!$el.hasClass("editing"))
        $el.addClass("editing");
    if(!$el.hasClass("pulse"))
        $el.addClass("pulse");
    $el.attr("contenteditable",true);
    $("#weather-location-current").fadeIn();
    $("#weather-city").attr("title", "");

    $el.focus();
}

/**
 * Client place input key press event handler
 *
 * @param e Event
 */
function onClientPlaceKeypress(e) { 
    var $el = $(this);
    if(e.keyCode == 13) {
        confirmClientPlace($el);
    }
}

/**
 * Client place input key down event handler
 *
 * @param e Event
 */
function onClientPlaceKeydown(e) { 
    var $el = $(this);
    if(e.keyCode == 27) { // cancel input client place
        setDefaultLocationWeather();
        endEditClientPlace($el);
    }
}

/**
 * Client place input focus out event handler
 *
 * @param e Event
 */
function onClientPlaceFocusOut(e) { 
    var $el = $(this);
    setDefaultLocationWeather();
    endEditClientPlace($el);
}

/**
 * Confirm client place
 *
 * @param $el jQuery element
 */
function confirmClientPlace($el) { 
    var val = $el.text().trim();
    if(val) {
        BRW_getAcceptLanguages(function(languages) {
            var hasRuLanguage = languages.indexOf("ru") != -1;
            if (hasRuLanguage)
                searchPlaceByDirectInputYandex(val, displayWeather);
            else
                searchPlaceByDirectInput(val, displayWeather);
        });
    } else
        setDefaultLocationWeather();

    endEditClientPlace($el);
}

/**
 * End edit client place
 *
 * @param $el jQuery element
 */
function endEditClientPlace($el) { 
    $el.attr("contenteditable",false).removeClass("editing").removeClass("pulse").addClass("pulse");
    $("#weather-location-current").fadeOut();
    $("#weather-city").attr("title", translate("options_application_weather_city"));
}

/**
 * Set intro click button
 */
function setIntroClickHandler() { 
    $("#weather-intro").on("click", function(e) {
        e.preventDefault();
        getCurrentLocation();
    });
}

/**
 * Client form place submit
 *
 * @param e Event
 */
function onClientPlaceFormSubmit(e) { 
    e.preventDefault();
    var val = $("#weather-input-city-field").val().trim();
    if(val) {
        BRW_getAcceptLanguages(function(languages) {
            var hasRuLanguage = languages.indexOf("ru") != -1;
            if (hasRuLanguage)
                searchPlaceByDirectInputYandex(val, displayWeather);
            else
                searchPlaceByDirectInput(val, displayWeather);
        });
    } else
        setDefaultLocationWeather();
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
 * Set location weather click handler
 */
function setLocationWeatherCLickHandler() { 
    $("#weather-city")
        .on("dblclick", editClientPlace)
        .on("keydown", onClientPlaceKeydown)
        .on("keypress", onClientPlaceKeypress)
        .on("focusout", onClientPlaceFocusOut);
    $("#weather-input-city-form").on("submit", onClientPlaceFormSubmit);
    $("#weather-location-current").on("click", onClientPlaceCurrentClick);
}

/**
 * Init location weather
 */
function initLocationWeather() { 
    var $intro = $("#weather-intro");
    var $active = $("#weather-active");
    getLastLocationWeather(function(locationWeather) {
        if(locationWeather) {
            $intro.css({"display" : "none"});
            getLocationWeather();
            setInterval(function() {
                getLocationWeather();
            }, locationWeatherRefreshTime);
        } else {
            $active.css({"display" : "none"});
            $intro.css({"display" : "inline-block"});
        }
    });
    setIntroClickHandler();
    setLocationWeatherCLickHandler();
}

$(function() {
    
    getDisplayWeatherPanel(function(display) {
        if(display) {
            initLocationWeather();
            setTimeout(function() {
                $("#header-weather").fadeIn();
            }, 500);
        }
    });
});