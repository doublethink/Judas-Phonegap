$(document).bind('pageinit', function() {
  
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

    // Proceed to send location if logged in
    FB.getLoginStatus(function(response){
        if (response.status === 'connected') {

            // Get GPS location
            var location = navigator.geolocation.getCurrentPosition(function(position){
              alert('Latitude: '          + position.coords.latitude          + '\n' +
                'Longitude: '         + position.coords.longitude         + '\n' +
                'Altitude: '          + position.coords.altitude          + '\n' +
                'Accuracy: '          + position.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + position.coords.heading           + '\n' +
                'Speed: '             + position.coords.speed             + '\n' +
                'Timestamp: '         + position.timestamp                + '\n');
            }, function(error){
              alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
            });
        } else {
          alert("You are not signed in");
          $.mobile.changePage($("#login"));
        }
    });
/*
    alert("Sending report");
    var jsonUrl = "http://judas.herokuapp.com/pestspotted";
    var newQuote = { "author" : author, "text" : quote };
    $.post(jsonUrl,newQuote, function(data) {
      alert("Added quote number " + data.pos + " " + data.author + " " + data.text);
    }, 'json');
  });*/

});