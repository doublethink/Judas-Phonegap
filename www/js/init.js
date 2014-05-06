

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

function bindlogin(){
  //Facebook login button, redirects to #mainpage if connected
  $(".FB-login").bind("click", function(event, ui){
    alert("login pressed");
    FB.login(function(response) {
        if (response.status === 'connected') {
            $.mobile.changePage($("#mainpage"));
        } else {
            alert('Unable to login');
        }
    },{ scope: "email" });
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
    
    FB.getLoginStatus(function(response){
        if (response.status === 'connected') {
            $.mobile.changePage($("#mainpage"));
        } else {
            $.mobile.changePage($("#login"));
        }
    });
  });
};

function bindsendreport(){
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

function initbuttons(){
    $.ajaxSetup ({
      cache: false
    });
    bindlogin();
    bindlogout();
    bindreportpage();
    bindsendreport(); 
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
                var uid = response.authResponse.userID;
            }
        });

    } catch (e) {
        alert(e);
    }
}, false);