// deviceready event listener, loads FB connect and checks if signed in
if (typeof CDV === 'undefined') {
        alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    }
    if (typeof FB === 'undefined') {
        alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
    }
     
    document.addEventListener('deviceready', function() {
        try {
            FB.init({
                appId: "628299267250368",
                nativeInterface: CDV.FB,
                useCachedDialogs: false
            });

            FB.getLoginStatus(function(response){
                if (response.status === 'connected') {
                    $.mobile.changePage($("#mainpage"));
                    var uid = response.authResponse.userID;
                }
            });

        } catch (e) {
            alert(e);
        }
}, false);

$(document).ready(function(){

    //Add toolbar to all pages
    $("[data-role='header'").toolbar({theme:"a"});
});