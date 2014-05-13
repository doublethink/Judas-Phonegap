

// GPS successfully occured function
var onSuccess = function(position) {
  var jsonUrl = "http://judas.herokuapp.com/pestspotted";
  var position = { "lat" : position.coords.latitude, "long" : position.coords.longitude, "accuracy" : position.coords.accuracy, "timestamp" : position.coords.timestamp };
  var response = { position, sessionStorage.FBresponse };
  alert(response);
  $.post(jsonUrl,response, function(data) {
    alert("post success");
  }, 'json');

};

// onError Callback receives a PositionError object
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
};

function bindlogin(){
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


function bindsendreport(){
  //Button for reporting pests
  $( "#send-report" ).bind( "click", function(event, ui) {

    //Check user is logged into Facebook
    FB.getLoginStatus(function(response){
        sessionStorage.FBresponse = response;
        if (response.status === 'connected') {
            
          navigator.geolocation.getCurrentPosition(onSuccess, onError);

        } else {
            alert("Not logged in");
            $.mobile.changePage($("#login"));
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
      $.mobile.defaultPageTransition   = 'pop';
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
          sessionStorage.FBresponse = response;
          if (response.status === 'connected') {
            $.mobile.changePage($("#mainpage"));
          } else {
            alert("Login Failed");
          }
        });

    } catch (e) {
        alert(e);
    }
}, false);