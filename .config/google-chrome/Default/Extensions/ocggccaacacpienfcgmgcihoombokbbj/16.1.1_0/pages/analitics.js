(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.defer="defer";a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

/**
 * Send data to google analitic
 * set ga client id
 *
 * @param callback Function
 */
function sendToGoogleAnalitic(callback) {
    var GA_LOCAL_STORAGE_KEY = 'ga:clientId';

    var gaSettings = {'storage': 'none'};

    var clientId = localStorage.getItem(GA_LOCAL_STORAGE_KEY);
    if(clientId)
        gaSettings['clientId'] = clientId;

    ga('create', 'UA-67774717-12', gaSettings);

    ga('set', 'checkProtocolTask', function(){});
    ga(function (tracker) {
        var clientId = localStorage.getItem(GA_LOCAL_STORAGE_KEY);
        if(!clientId)
            localStorage.setItem(GA_LOCAL_STORAGE_KEY, tracker.get('clientId'));

        callback();
    });
}