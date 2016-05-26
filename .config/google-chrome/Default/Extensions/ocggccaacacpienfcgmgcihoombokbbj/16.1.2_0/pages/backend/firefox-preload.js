$(function(){
    var appDB = new Dexie('speeddial');
    appDB.delete();
    localStorage.clear();
    
    window.location.href="../options/options.html";
});

function FF_countryFromBrowser(browser_locate){/*alert(browser_locate);*/}