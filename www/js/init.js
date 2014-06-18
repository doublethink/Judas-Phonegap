

// GPS successfully occured function
var onSuccess = function(location) {
  
  var jsonUrl = "http://judas.herokuapp.com/pestspotted";
  var date = new Date();
  var currtime = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.toLocaleTimeString();

  // Post packet to sever
  $.ajax({
    type: "POST",
    url: jsonUrl,
    data: {"packet":{
      "position": {
        "longitude": location.coords.longitude, "latitude": location.coords.latitude, "accuracy": location.coords.accuracy,
        "datestamp": currtime}, "pest": window.sessionStorage.currentPest,
      "auth":
      {"uid": window.sessionStorage.userID, "accessToken": window.sessionStorage.accessToken}
      }},
    success: function(data, textStatus, jqHXR){
      $.mobile.loading("hide");
      $( "#thanks-popup" ).popup( "open" );
      setTimeout(function () {
        $("#thanks-popup").popup('close');
       }, 2000);  
    },
    error: function(jqXHR, textStatus, errorThrown){
      $.mobile.loading("hide");
      alert(JSON.stringify(jqXHR) + "error: " + errorThrown + "status: "+ textStatus);
    }
  });
};

// onError Callback receives a PositionError object
function onError(error) {
  $.mobile.loading("hide");
  alert("GPS error\nPlease ensure that you have your location enabled under settings.");
};

function bindlogin(){
  //Facebook login button, redirects to #mainpage if connected
  $(".FB-login").on("click", function(){
    FB.login(function(response) {
        if (response.status === 'connected') {
            window.localStorage.userID = response.authResponse.userID;
            $.mobile.changePage($("#mainpage"));
        } else {
            alert('Unable to login. Is your device connected?');
        }
    },{ scope: "email" });
  });
};

function bindloginmenu(){
  $(".FB-loginmenu").on("click", function(){
    $.mobile.changePage($("#login"));
  });
};

function bindlogout(){
  //Facebook logout button, redirects to #login screen
  $(".FB-logout").on("click", function(){
    FB.logout(function(response){
      $.mobile.changePage($("#login"));
    });
  });
};

function bindmenupest(){
  $(".menu-pest-button").on("click", function(){
    $.mobile.changePage($("#pestpage"));
  });
};

function bindreportpage(){
  //Slider button to report page, checks person is logged into Facebook
  $(".report-button").on("click", function(){
    $.mobile.changePage($("#mainpage"));
  });
};

function bindswipe(){
  
  // Swipe function for report page
  $( document ).on( "swipeleft swiperight", "#mainpage", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
          if ( e.type === "swiperight" ) {
              $( "#report-panel" ).panel( "open" );
          }
        } else {
          if ( e.type === "swipeleft" ) {
              $( "#report-panel" ).panel( "close" );
          }
        }
    });

  // Swipe function for login page
  $( document ).on( "swipeleft swiperight", "#login", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
          if ( e.type === "swiperight" ) {
              $( "#login-panel" ).panel( "open" );
          }
        } else {
          if ( e.type === "swipeleft" ) {
              $( "#login-panel" ).panel( "close" );
          }
        }
    });

  // Swipe function for pest page
  $( document ).on( "swipeleft swiperight", "#pestpage", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
          if ( e.type === "swiperight" ) {
              $( "#pest-panel" ).panel( "open" );
          }
        } else {
          if ( e.type === "swipeleft" ) {
              $( "#pest-panel" ).panel( "close" );
          }
        }
    });
};

function bindsendreport(){
  //Button for reporting pests
  $( "#send-report" ).bind( "click", function(event, ui) {

    if (window.sessionStorage.currentPest === undefined){
      alert("Please select a pest before reporting");
    } else {
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
    }
    $('#popupDialog').popup('close');
  });
};

function bindexpandpestdiv(){
  //hide all pest info initially

    $( '#possum' ).on('click',function() {
      window.sessionStorage.currentPest = "possum";
    });

    $( '#rabbit' ).on('click',function() {
      window.sessionStorage.currentPest = "rabbit";
    });
    $( '#stoat' ).on('click',function() {
      window.sessionStorage.currentPest = "stoat";
    });
	$( '#other' ).on('click',function() {
      window.sessionStorage.currentPest = "cat";
    });
};

function initbuttons(){
    $.ajaxSetup ({
      cache: false
    });
    bindlogin();
    bindlogout();
    bindreportpage();
    bindloginmenu();
    bindswipe();
    bindmenupest();
	  bindsendreport();
    bindexpandpestdiv();
};

  
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
          }
        });

    } catch (e) {
        alert(e);
    }

}, false);

//include in device ready once debuging is done
$(document).ready(function(){

    $.mobile.buttonMarkup.hoverdelay = 200;
    $.mobile.defaultPageTransition = 'none';
    $( ".photopopup" ).on({
        popupbeforeposition: function() {
            var maxHeight = $( window ).height() - 60 + "px";
            $( ".photopopup img" ).css( "max-height", maxHeight );
        }
    });

    initbuttons();
});