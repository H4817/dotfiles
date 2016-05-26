var DarkReader;
(function (DarkReader) {
    //--------------------------------
    //
    //      CONFIGURATION LOADING
    //
    //--------------------------------
    var CONFIG_URLs = {
        darkSites: {
            remote: 'https://raw.githubusercontent.com/alexanderby/darkreader/master/src/config/dark_sites.json',
            local: '../config/dark_sites.json'
        },
        sitesFixes: {
            remote: 'https://raw.githubusercontent.com/alexanderby/darkreader/master/src/config/sites_fixes.json',
            local: '../config/sites_fixes.json'
        },
        defaultFilterConfig: {
            local: '../config/default_filter_config.json'
        }
    };
    var REMOTE_TIMEOUT_MS = 10 * 1000;
    var RELOAD_INTERVAL_MS = 15 * 60 * 1000;
    DarkReader.DEBUG = chrome.runtime.id !== 'eimadpbcbfnmbkopoojfekhnkhdbieeh';
    var DEBUG_LOCAL_CONFIGS = DarkReader.DEBUG;
    /**
     * List of sites with dark theme (which should not be inverted).
     */
    DarkReader.DARK_SITES;
    /**
     * Fixes for specific sites (selectors which should not be inverted).
     */
    DarkReader.SITES_FIXES;
    //
    // ----- Load configs ------
    function loadConfigs(done) {
        if (!DEBUG_LOCAL_CONFIGS) {
            //
            // Load remote and local as fallback
            Promise.all([
                //
                // Load dark sites
                readJson({
                    url: CONFIG_URLs.darkSites.remote,
                    timeout: REMOTE_TIMEOUT_MS
                }).then(function (res) {
                    return res;
                }).catch(function (err) {
                    console.error('Dark Sites remote load error', err);
                    return readJson({
                        url: CONFIG_URLs.darkSites.local
                    });
                }).then(function (res) { return DarkReader.DARK_SITES = handleDarkSites(res); }),
                //
                // Load sites fixes
                readJson({
                    url: CONFIG_URLs.sitesFixes.remote,
                    timeout: REMOTE_TIMEOUT_MS
                }).then(function (res) {
                    return res;
                }).catch(function (err) {
                    console.error('Sites Fixes remote load error', err);
                    return readJson({
                        url: CONFIG_URLs.sitesFixes.local
                    });
                }).then(function (res) { return DarkReader.SITES_FIXES = handleSitesFixes(res); }),
                //
                // Load default filter config
                readJson({
                    url: CONFIG_URLs.defaultFilterConfig.local
                }).then(function (res) { return DarkReader.DEFAULT_FILTER_CONFIG = handleFilterConfig(res); })
            ]).then(function () { return done && done(); }, function (err) { return console.error('Fatality', err); });
        }
        else {
            // Load local configs only
            Promise.all([
                // Load dark sites
                readJson({
                    url: CONFIG_URLs.darkSites.local
                }).then(function (res) { return DarkReader.DARK_SITES = handleDarkSites(res); }),
                // Load sites fixes
                readJson({
                    url: CONFIG_URLs.sitesFixes.local
                }).then(function (res) { return DarkReader.SITES_FIXES = handleSitesFixes(res); }),
                // Load default filter config
                readJson({
                    url: CONFIG_URLs.defaultFilterConfig.local
                }).then(function (res) { return DarkReader.DEFAULT_FILTER_CONFIG = handleFilterConfig(res); })
            ]).then(function () { return done && done(); }, function (err) { return console.error('Fatality', err); });
        }
        // --------- Data handling ----------
        function onInvalidData(desc) {
            if (DarkReader.DEBUG)
                throw new Error(desc);
            console.error('Invalid data: ' + desc);
        }
        function handleDarkSites(sites) {
            // Validate sites
            if (!Array.isArray(sites)) {
                sites = [];
                onInvalidData('List is not an array.');
            }
            for (var i = sites.length - 1; i >= 0; i--) {
                if (typeof sites[i] !== 'string') {
                    sites.splice(i, 1);
                    onInvalidData('URL is not a string.');
                }
            }
            sites.sort(DarkReader.urlTemplateSorter);
            return sites;
        }
        ;
        function handleSitesFixes(fixes) {
            // Validate fixes
            if (fixes === null || typeof fixes !== 'object') {
                fixes = {
                    commonSelectors: '',
                    specials: []
                };
                onInvalidData('Fix is not an object.');
            }
            if (typeof fixes.commonSelectors !== 'string') {
                fixes.commonSelectors = '';
                onInvalidData('Missing common selectors.');
            }
            if (!Array.isArray(fixes.specials)) {
                fixes.specials = [];
                onInvalidData('Missing special selectors.');
            }
            for (var i = fixes.specials.length - 1; i >= 0; i--) {
                if (typeof fixes.specials[i].url !== 'string') {
                    fixes.specials.splice(i, 1);
                    onInvalidData('Wrong URL.');
                    continue;
                }
                if (typeof fixes.specials[i].selectors !== 'string') {
                    fixes.specials[i].selectors = fixes.commonSelectors;
                    // TODO: Optional "selectors" property.
                    onInvalidData('Missing selectors.');
                }
                if (fixes.specials[i].rules !== void 0
                    && typeof fixes.specials[i].rules !== 'string') {
                    fixes.specials[i].rules = '';
                    onInvalidData('Rule is not a string.');
                    continue;
                }
            }
            // Sort like templates?
            // Replace "{common}" with common selectors
            fixes.specials.forEach(function (s) {
                s.selectors = s.selectors.replace(/\{common\}/ig, fixes.commonSelectors);
            });
            return fixes;
        }
        ;
        function handleFilterConfig(config) {
            if (config === null || typeof config !== 'object') {
                config = DarkReader.DEFAULT_FILTER_CONFIG;
            }
            else {
                for (var prop in DarkReader.DEFAULT_FILTER_CONFIG) {
                    if (typeof config[prop] !== typeof DarkReader.DEFAULT_FILTER_CONFIG[prop]) {
                        onInvalidData("Invalid config property \"" + prop + "\"");
                        config[prop] = DarkReader.DEFAULT_FILTER_CONFIG[prop];
                    }
                }
            }
            return config;
        }
    }
    DarkReader.loadConfigs = loadConfigs;
    setInterval(loadConfigs, RELOAD_INTERVAL_MS); // Reload periodically
    /**
     * Returns fixes for a given URL.
     * If no matches found, common fixes will be returned.
     * @param url Site URL.
     */
    function getFixesFor(url) {
        var found;
        if (url) {
            // Search for match with given URL
            DarkReader.SITES_FIXES.specials.forEach(function (s) {
                if (isUrlMatched(url, s.url)) {
                    found = s;
                }
            });
            if (found) {
                console.log('URL matches ' + found.url);
            }
        }
        return (found ?
            found
            : { selectors: DarkReader.SITES_FIXES.commonSelectors });
    }
    DarkReader.getFixesFor = getFixesFor;
    //------------------
    //
    //     HELPERS
    //
    //------------------
    //
    // ---------- Data loading -----------
    /**
     * Loads and parses JSON from file to object.
     * @param params Object containing request parameters.
     */
    function readJson(params) {
        var promise = new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.overrideMimeType("application/json");
            request.open('GET', params.url + '?nocache=' + new Date().getTime(), true);
            request.onload = function () {
                if (request.status >= 200 && request.status < 300) {
                    // Remove comments
                    var resultText = request.responseText
                        .replace(/(\".*?(\\\".*?)*?\")|(\/\*(.|[\r\n])*?\*\/)|(\/\/.*?[\r\n])/gm, '$1');
                    var json = JSON.parse(resultText);
                    resolve(json);
                }
                else {
                    reject(new Error(request.status + ': ' + request.statusText));
                }
            };
            request.onerror = function (err) { return reject(err.error); };
            if (params.timeout) {
                request.timeout = params.timeout;
                request.ontimeout = function () { return reject(new Error('Config loading stopped due to timeout.')); };
            }
            request.send();
        });
        return promise;
    }
    //
    // ---------- URL template matching ----------------
    /**
     * Determines whether URL has a match in URL template list.
     * @param url Site URL.
     * @paramlist List to search into.
     */
    function isUrlInList(url, list) {
        for (var i = 0; i < list.length; i++) {
            if (isUrlMatched(url, list[i])) {
                console.log('URL ' + url + ' is in list.');
                return true;
            }
        }
        return false;
    }
    DarkReader.isUrlInList = isUrlInList;
    /**
     * Determines whether URL matches the template.
     * @param url URL.
     * @param urlTemplate URL template ("google.*", "youtube.com" etc).
     */
    function isUrlMatched(url, urlTemplate) {
        var regex = createUrlRegex(urlTemplate);
        return !!url.match(regex);
    }
    function createUrlRegex(urlTemplate) {
        urlTemplate = urlTemplate.trim();
        var exactBeginning = (urlTemplate[0] === '^');
        var exactEnding = (urlTemplate[urlTemplate.length - 1] === '$');
        urlTemplate = (urlTemplate
            .replace(/^\^/, '') // Remove ^ at start
            .replace(/\$$/, '') // Remove $ at end
            .replace(/^.*?\/{2,3}/, '') // Remove scheme
            .replace(/\?.*$/, '') // Remove query
            .replace(/\/$/, '') // Remove last slash
        );
        var slashIndex;
        var beforeSlash;
        if ((slashIndex = urlTemplate.indexOf('/')) >= 0) {
            beforeSlash = urlTemplate.substring(0, slashIndex); // google.*
            var afterSlash = urlTemplate.replace('$', '').substring(slashIndex); // /login/abc
        }
        else {
            beforeSlash = urlTemplate.replace('$', '');
        }
        //
        // SCHEME and SUBDOMAINS
        var result = (exactBeginning ?
            '^(.*?\\:\\/{2,3})?' // Scheme
            : '^(.*?\\:\\/{2,3})?([^\/]*?\\.)?' // Scheme and subdomains
        );
        //
        // HOST and PORT
        var hostParts = beforeSlash.split('.');
        result += '(';
        for (var i = 0; i < hostParts.length; i++) {
            if (hostParts[i] === '*') {
                hostParts[i] = '[^\\.\\/]+?';
            }
        }
        result += hostParts.join('\\.');
        result += ')';
        //
        // PATH and QUERY
        if (afterSlash) {
            result += '(';
            result += afterSlash.replace('/', '\\/');
            result += ')';
        }
        result += (exactEnding ?
            '(\\/?(\\?[^\/]*?)?)$' // All following queries
            : '(\\/?.*?)$' // All following paths and queries
        );
        //
        // Result
        var regex = new RegExp(result, 'i');
        return regex;
    }
    /**
     * URL template sorter.
     */
    DarkReader.urlTemplateSorter = function (a, b) {
        if (typeof a === 'string')
            a = { url: a };
        if (typeof b === 'string')
            b = { url: b };
        var slashIndexA = a.url.indexOf('/');
        var slashIndexB = b.url.indexOf('/');
        var addressA = a.url.replace('^', '').substring(0, slashIndexA);
        var addressB = b.url.replace('^', '').substring(0, slashIndexB);
        var reverseA = addressA.split('.').reverse().join('.').toLowerCase(); // com.google
        var reverseB = addressB.split('.').reverse().join('.').toLowerCase(); // *.google
        // Sort by reversed address descending
        if (reverseA > reverseB) {
            return -1;
        }
        else if (reverseA < reverseB) {
            return 1;
        }
        else {
            // Then sort by path descending
            var pathA = a.url.substring(slashIndexA);
            var pathB = b.url.substring(slashIndexB);
            return -pathA.localeCompare(pathB);
        }
    };
})(DarkReader || (DarkReader = {}));
