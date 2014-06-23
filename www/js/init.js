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
    success: ajaxSuccess,
    error: function(jqXHR, textStatus, errorThrown){
      $.mobile.loading("hide");
      alert(JSON.stringify(jqXHR) + "error: " + errorThrown + "status: "+ textStatus);
    }
  });
};

function ajaxSuccess(data, textStatus, jqHXR){
      $.mobile.loading("hide");
      var timeoutVal = 2000;
      switch (window.sessionStorage.currentPage) {
        case 'main':
          $( "#thanks-popup-main" ).popup( "open", {transition: 'fade'});
          setTimeout(function () {
            $("#thanks-popup-main").popup('close', {transition: 'fade'});
           }, timeoutVal);
          break;
        case 'cat':
          $( "#thanks-popup-cat" ).popup( "open", {transition: 'fade'});
          setTimeout(function () {
          $("#thanks-popup-cat").popup('close', {transition: 'fade'});
          }, timeoutVal);
          break;
        case 'possum':
          $( "#thanks-popup-possum" ).popup( "open", {transition: 'fade'});
          setTimeout(function () {
            $("#thanks-popup-possum").popup('close', {transition: 'fade'});
           }, timeoutVal);
          break;
        case 'stoat':
          $( "#thanks-popup-stoat" ).popup( "open", {transition: 'fade'});
          setTimeout(function () {
            $("#thanks-popup-stoat").popup('close', {transition: 'fade'});
           }, timeoutVal);
          break;
        case 'rat':
          $( "#thanks-popup-rat" ).popup( "open", {transition: 'fade'});
          setTimeout(function () {
            $("#thanks-popup-rat").popup('close', {transition: 'fade'});
           }, timeoutVal);
          break;
      }
};

// onError Callback receives a PositionError object
function onError(error) {
  $.mobile.loading("hide");
  alert("GPS error\nPlease ensure that you have your location enabled under settings.");
};

function reportLoginFailure(){
  alert("Report Failed\nYou are not logged in");
  $.mobile.changePage($("#login"));
  $.mobile.loading("hide");
};

// This script contains the more technical networking related functions

function bindsendreport(){
  //Button for reporting pests
  $( ".send-report" ).bind( "click", function(event, ui) {

    //Get the current page
    var currentPage = $.mobile.activePage.attr('id');
    currentPage = currentPage.substring(0, currentPage.indexOf("page"));
    window.sessionStorage.currentPage = currentPage;

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

      if (window.sessionStorage.loginstatus === "facebook"){
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
                reportLoginFailure();
            }
        });
      } else if (window.sessionStorage.loginstatus === "phone"){
        navigator.geolocation.getCurrentPosition(onSuccess, onError); 
      } else {
        reportLoginFailure();
      }

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

function bindphonelogin() {
  $("#phone-login").on("click", function(){
    window.sessionStorage.userID = device.name + device.uuid;
    window.sessionStorage.accessToken = "#PHONE";
    window.sessionStorage.loginstatus = "phone";
    $.mobile.changePage($("#mainpage"));
  });
/*
  accessToken
  userID*/
};

function getFacebookID(){
  // UID not returned in login check so make api call for email
  FB.api('/me?fields=email,id', function(response){
    window.sessionStorage.userID = response.id;
    if (response.id === undefined) {
      alert("Could not retreive your ID");
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
    bindphonelogin();
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

        if(window.sessionStorage.loginstatus === "phone"){
          $.mobile.changePage($("#mainpage"));
        } else {
          // check if user is already signed in, if so forward to report screen
          FB.getLoginStatus(function(response){
            if (response.status === 'connected') {
              window.sessionStorage.loginstatus = "facebook";
              getFacebookID();
              $.mobile.changePage($("#mainpage"));
            }
          });
        }

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

//this will fire when user navigates to a detailed page, it replaces a div with the count of pests they've spotted
$(document).on("pageshow","#catpage",function(){
  if (window.sessionStorage.userID != undefined){
    var jsonUrl = "http://judas.herokuapp.com/pestspotted/Matt/cat";
    $.get(jsonUrl, function(data) {
      if (data.count != undefined){
        $("#count-div-cat").html("<div class='statistics-div'>" + data.count + "</div>");
        }
      }, 'json');
  }
});

//this will fire when user navigates to a detailed page, it replaces a div with the count of pests they've spotted
$(document).on("pageshow","#possumpage",function(){
  if (window.sessionStorage.userID != undefined){
    var jsonUrl = "http://judas.herokuapp.com/pestspotted/" + window.sessionStorage.userID + "/possum";
    $.get(jsonUrl, function(data) {
      if (data.count != undefined){
        $("#count-div-possum").html("<div class='statistics-div'>" + data.count + "</div>");
        }
      }, 'json');
  }
});

//this will fire when user navigates to a detailed page, it replaces a div with the count of pests they've spotted
$(document).on("pageshow","#ratpage",function(){
  if (window.sessionStorage.userID != undefined){
    var jsonUrl = "http://judas.herokuapp.com/pestspotted/" + window.sessionStorage.userID + "/rat";
    $.get(jsonUrl, function(data) {
      if (data.count != undefined){
        $("#count-div-cat").html("<div class='statistics-div'>" + data.count + "</div>");
        }
      }, 'json');
  }
});

//this will fire when user navigates to a detailed page, it replaces a div with the count of pests they've spotted
$(document).on("pageshow","#stoatpage",function(){
  if (window.sessionStorage.userID != undefined){
    var jsonUrl = "http://judas.herokuapp.com/pestspotted/" + window.sessionStorage.userID + "/stoat";
    $.get(jsonUrl, function(data) {
      if (data.count != undefined){
        $("#count-div-cat").html("<div class='statistics-div'>" + data.count + "</div>");
       }
      }, 'json');
  }
});