// deviceready event listener, loads FB connect and checks if signed in
if (typeof CDV === 'undefined') {
        alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    }
    if (typeof FB === 'undefined') {
        alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
    }
     
    document.addEventListener('deviceready', function() {
        try {
            // Initialise FB SDK with app id
            FB.init({
                appId: "628299267250368",
                nativeInterface: CDV.FB,
                useCachedDialogs: false
            });

            // check if user is already signed in, if so forward to report screen
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

// Center #center-button div in main page
$(document).delegate("#mainpage", "pageshow", function(e,data){    
    $('#center-report').css('margin-top',($(window).height() - $('[data-role=header]').height() - $('[data-role=footer]').height() - $('#index-content').outerHeight())/2);
});

// Center #center-button div in login page 
$(document).delegate("#login", "pageshow", function(e,data){    
    $('#center-button').css('margin-top',($(window).height() - $('[data-role=header]').height() - $('[data-role=footer]').height() - $('#index-content').outerHeight())/2);
});


