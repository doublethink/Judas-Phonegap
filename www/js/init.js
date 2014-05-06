// GPS successfully occured function
var onSuccess = function(position) {
alert('Latitude: '          + position.coords.latitude          + '\n' +
      'Longitude: '         + position.coords.longitude         + '\n' +
      'Altitude: '          + position.coords.altitude          + '\n' +
      'Accuracy: '          + position.coords.accuracy          + '\n' +
      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
      'Heading: '           + position.coords.heading           + '\n' +
      'Speed: '             + position.coords.speed             + '\n' +
      'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function initBindings(){
  $.ajaxSetup ({
    cache: false
  });

  //Facebook login button, redirects to #mainpage if connected
  $(".FB-login").bind("click", function(event, ui){
 
    FB.login(function(response) {
        if (response.status === 'connected') {
            $.mobile.changePage($("#mainpage"));
        } else {
            alert('Unable to login');
        }
    },{ scope: "email" });
  });

  //Facebook logout button, redirects to #login screen
  $(".FB-logout").bind("click", function(event, ui){
    FB.logout(function(response){
      $.mobile.changePage($("#login"));
    });
  });

  //Slider button to report page, checks person is logged into Facebook
  $(".report-button").bind("click", function(event, ui){
    
    FB.getLoginStatus(function(response){
        if (response.status === 'connected') {
            $.mobile.changePage($("#mainpage"));
        } else {
            $.mobile.changePage($("#login"));
        }
    });
  });

  //Button for reporting pests
  $( "#send-report" ).bind( "click", function(event, ui) {

    //Show loading image
    $.mobile.loading( "show");

    //Check user is logged into Facebook
    FB.getLoginStatus(function(response){
        if (response.status === 'connected') {
            
          navigator.geolocation.getCurrentPosition(onSuccess, onError);

        } else {
            alert("Not logged in");
            $.mobile.changePage($("#login"));
        }
    });

    $.mobile.loading("hide");
    
/*
    alert("Sending report");
    var jsonUrl = "http://judas.herokuapp.com/pestspotted";
    var newQuote = { "author" : author, "text" : quote };
    $.post(jsonUrl,newQuote, function(data) {
      alert("Added quote number " + data.pos + " " + data.author + " " + data.text);
    }, 'json');*/
  });
};

// Initialisation functions
function initjQuery(){
  initBindings();
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
                    var uid = response.authResponse.userID;
                }
            });

        } catch (e) {
            alert(e);
        }

        initjQuery();
}, false);