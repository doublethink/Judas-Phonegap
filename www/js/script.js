$(document).bind('pageinit', function() {

  alert("hello");

  $.ajaxSetup ({
    cache: false
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