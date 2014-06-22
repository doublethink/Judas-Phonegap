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
      $( ".thanks-popup" ).popup( "open", {transition: 'fade'});
      setTimeout(function () {
        $(".thanks-popup").popup('close', {transition: 'fade'});
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

// This script contains the more technical networking related functions

function bindsendreport(){
  //Button for reporting pests
  $( ".send-report" ).bind( "click", function(event, ui) {

    //Get the current page
    var currentPage = $.mobile.activePage.attr('id');
    currentPage = currentPage.substring(0, currentPage.indexOf("page"));

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
              window.sessionStorage.userID = response.id;
              if (response.id != undefined) {
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
              } else {
                alert("Could not retreive your ID");
              }
            });

          } else {
              alert("Not logged in");
              $.mobile.changePage($("#login"));
              $.mobile.loading("hide");
          }
      });
    }
    switch (currentPage) {
      case 'main':
        $('#popup-report-main').popup('close');
        break;
      case 'rat':
        $('#popup-report-rat').popup('close');
        break;
      case 'stoat':
        $('#popup-report-stoat').popup('close');
        break;
      case 'cat':
        $('#popup-report-cat').popup('close');
        break;
      case 'possum':
        $('#popup-report-possum').popup('close');
        break;
    }
    
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
    bindrecordcurrentpest();
    bindphotopopup();
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

    initbuttons();
});