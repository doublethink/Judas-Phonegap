// Add eventlistener for Facebook login, includes warning if objects don't exist
if (typeof CDV === 'undefined') {
        alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    }
    if (typeof FB === 'undefined') {
        alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
    }
     
    document.addEventListener('deviceready', function() {
        try {
            FB.init({
                appId: "628299267250368",
                nativeInterface: CDV.FB,
                useCachedDialogs: false
            });
        } catch (e) {
            alert(e);
        }
}, false);

// Function of login button pressed
// TO DO: add conditional to check if single sign on has already occured
var loginButton = $('#login-with-facebook');

loginButton.on('click', function(e) {
    e.preventDefault();
 
    FB.login(function(response) {
        if (response.status === 'connected') {
            alert('logged in');
        } else {
            alert('not logged in');
        }
    },{ scope: "email" });
 
});