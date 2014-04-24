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

  $( "#button1" ).bind( "click", function(event, ui) {
    var q = $("#text1").val();
    alert("Click "+q);
    var jsonUrl = "http://sleepy-wildwood-7833.herokuapp.com/quote/"+q;
    alert("Fetching result from "+jsonUrl);
    $.get(jsonUrl, function(data) {
      alert(data.author);
      $("#result").html("<p><b>"+data.author+" said "+data.text+"</b></p>")
    }, 'json');
  });


  $( "#button2" ).bind( "click", function(event, ui) {
    var author = $('input[name=checkListItem]').val();
    var quote = $('input[name=checkListItem2]').val();
    alert("Posting a new quote");
    var jsonUrl = "http://sleepy-wildwood-7833.herokuapp.com/quote";
    var newQuote = { "author" : author, "text" : quote };
    $('input[name=checkListItem]').val("");
    $('input[name=checkListItem2]').val("");
    $.post(jsonUrl,newQuote, function(data) {
      alert("Added quote number " + data.pos + " " + data.author + " " + data.text);
    }, 'json');
  });

});