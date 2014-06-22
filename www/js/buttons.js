//This script file is for inoccuous, unlikely to change functions

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

  // Swipe function for possum page
  $( document ).on( "swipeleft swiperight", "#possumpage", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
          if ( e.type === "swiperight" ) {
              $( "#possum-panel" ).panel( "open" );
          }
        } else {
          if ( e.type === "swipeleft" ) {
              $( "#possum-panel" ).panel( "close" );
          }
        }
    });

  // Swipe function for stoat page
  $( document ).on( "swipeleft swiperight", "#ratpage", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
          if ( e.type === "swiperight" ) {
              $( "#rat-panel" ).panel( "open" );
          }
        } else {
          if ( e.type === "swipeleft" ) {
              $( "#rat-panel" ).panel( "close" );
          }
        }
    });

  // Swipe function for stoat page
  $( document ).on( "swipeleft swiperight", "#stoatpage", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
          if ( e.type === "swiperight" ) {
              $( "#stoat-panel" ).panel( "open" );
          }
        } else {
          if ( e.type === "swipeleft" ) {
              $( "#stoat-panel" ).panel( "close" );
          }
        }
    });
  // Swipe function for cat page
  $( document ).on( "swipeleft swiperight", "#catpage", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
          if ( e.type === "swiperight" ) {
              $( "#cat-panel" ).panel( "open" );
          }
        } else {
          if ( e.type === "swipeleft" ) {
              $( "#cat-panel" ).panel( "close" );
          }
        }
    });

};

function bindrecordcurrentpest(){
  //hide all pest info initially

    $( '.report-possum' ).on('click',function() {
      window.sessionStorage.currentPest = "possum";
    });

    $( '.report-rat' ).on('click',function() {
      window.sessionStorage.currentPest = "rat";
    });
    $( '.report-stoat' ).on('click',function() {
      window.sessionStorage.currentPest = "stoat";
    });
  $( '.report-cat' ).on('click',function() {
      window.sessionStorage.currentPest = "cat";
    });
};

function bindphotopopup(){
  $( ".photopopup" ).on({
        popupbeforeposition: function() {
            var maxHeight = $( window ).height() - 60 + "px";
            $( ".photopopup img" ).css( "max-height", maxHeight );
        }
    });
}