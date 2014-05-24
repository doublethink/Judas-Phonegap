

// GPS successfully occured function
var onSuccess = function(location) {
  
  var jsonUrl = "http://judas.herokuapp.com/pestspotted";
  var position = { "latitude" : location.coords.latitude, "longitude" : location.coords.longitude, 
                  "accuracy" : location.coords.accuracy, "timestamp" : location.coords.timestamp };
  var auth = { "uid" : window.sessionStorage.userID , "accessToken" : window.sessionStorage.accessToken };
  var packet = { "position": position, "auth": auth };
  
  // MOVE THIS WHEN SERVER IS RETURNING RESPONSE
  $.mobile.loading("hide");
  $('#popupDialog').popup('close');

  $.post(jsonUrl, packet, function(data) {
    alert("post success");
  }, 'json');

};

// onError Callback receives a PositionError object
function onError(error) {
  alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  $.mobile.loading("hide");
};

function bindlogin(){
  //Facebook login button, redirects to #mainpage if connected
  $(".FB-login").bind("click", function(event, ui){
    FB.login(function(response) {
        if (response.status === 'connected') {
            window.localStorage.userID = response.authResponse.userID;
            $.mobile.changePage($("#mainpage"));
        } else {
            alert('Unable to login');
        }
    },{ scope: "email" });
  });
};

function bindloginmenu(){
  $(".FB-loginmenu").bind("click", function(event, ui){
    $.mobile.changePage($("#login"));
  }); 
};

function bindlogout(){
  //Facebook logout button, redirects to #login screen
  $(".FB-logout").bind("click", function(event, ui){
    FB.logout(function(response){
      $.mobile.changePage($("#login"));
    });
  });
};

function bindreportpage(){
  //Slider button to report page, checks person is logged into Facebook
  $(".report-button").bind("click", function(event, ui){
    $.mobile.changePage($("#mainpage"));
  });
};

function bindswipe(){
  /*
  // Swipe function for report page
  $( document ).on( "swipeleft swiperight", "#mainpage", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
          if ( e.type === "swiperight"  ) {
              $( "#report-panel" ).panel( "open" );
          }
        } else {
          if ( e.type === "swipeleft"  ) {
              $( "#report-panel" ).panel( "close" );
          }
        }
    });*/

  // Swipe function for login page
  $( document ).on( "swipeleft swiperight", "#login", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
          if ( e.type === "swiperight"  ) {
              $( "#login-panel" ).panel( "open" );
          }
        } else {
          if ( e.type === "swipeleft"  ) {
              $( "#login-panel" ).panel( "close" );
          }
        }
    });
};

function initCarousel(){
  $('.carousel-pest').slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      touchMove: true,
      slidesToScroll: 1,
      arrows: false
    });
};


function bindsendreport(){
  //Button for reporting pests
  $( "#send-report" ).bind( "click", function(event, ui) {

    //show loader
    $.mobile.loading( "show", {
      text: "Sending...",
      textVisible: true,
      theme: "a",
      html: ""
    });

    //Check user is logged into Facebook
    FB.getLoginStatus(function(response){
        if (response.status === 'connected') {
          window.sessionStorage.accessToken = response.authResponse.accessToken;

          // UID not returned in login check so make api call for email
          FB.api('/me?fields=email,id', function(response){
            window.sessionStorage.uid = response.email;
            window.sessionStorage.userID = response.id;
            if (response.id != undefined) {
              navigator.geolocation.getCurrentPosition(onSuccess, onError);
            } else {
              alert("Email not returned");
            }
          });

        } else {
            alert("Not logged in");
            $.mobile.changePage($("#login"));
            $.mobile.loading("hide");
        }
    });
    
  });
};

function initbuttons(){
    $.ajaxSetup ({
      cache: false
    });
    bindlogin();
    bindlogout();
    bindreportpage();
    bindsendreport(); 
    bindloginmenu();
    bindswipe();
    initCarousel();
};

  
// deviceready event listener, loads FB connect and checks if signed in
if (typeof CDV === 'undefined') {
        alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    }
if (typeof FB === 'undefined') {
    alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
}
     
document.addEventListener('deviceready', function() {

    $(document).on('pagecreate', function(){
      initbuttons();
      $.mobile.buttonMarkup.hoverdelay = 0;
      $.mobile.defaultPageTransition   = 'none';
    });

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
          }
        });

    } catch (e) {
        alert(e);
    }

}, false);
/*
//include in device ready once debuging is done
$(document).ready(function(){
    $('.carousel-pest').slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      touchMove: true,
      slidesToScroll: 1,
      arrows: false
    });
});*/