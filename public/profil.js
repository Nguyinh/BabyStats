// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

function afficheProfil(){
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    clearArea();
    document.getElementById('affiche_connect').style.display = 'none';
    document.getElementById('affiche_profil').style.display = 'block';
    var name_dispayer = document.getElementById("player_name")
    name_dispayer.innerHTML = user.displayName;
    } else {
      // No user is signed in.
      console.log('Grave erreur gros dans la fonction afficheProfil');
    }
}

$('input[type=radio]').change(function() {
    var signin = document.getElementById('signin').checked;
    clearArea();
      if (signin == false) {
        document.getElementById('error_info').style.display = 'none';
        document.getElementById('error_message').style.display = 'none';
        document.getElementById('affiche_confirm').style.display = 'block';
        document.getElementById('affiche_name').style.display = 'block';
      } else {
        document.getElementById('error_info').style.display = 'none';
        document.getElementById('error_message').style.display = 'none';
        document.getElementById('affiche_confirm').style.display = 'none';
        document.getElementById('affiche_name').style.display = 'none';
      }
});

document.getElementById('log_out').addEventListener('click', function() {
  firebase.auth().signOut().then(function() {
      // Sign-out successful.
      document.getElementById("signin").checked = true;
      document.getElementById('error_info').style.display = 'none';
      document.getElementById('error_message').style.display = 'none';
      document.getElementById('affiche_confirm').style.display = 'none';
      document.getElementById('affiche_name').style.display = 'none';
    }).catch(function(error) {
      // An error happened.
    });
  });

// Button add player listener
document.getElementById('log_in').addEventListener('click', function() {
    // Clear color inputs
    $('#ID_input').removeClass('is-invalid');
    $('#password_input').removeClass('is-invalid');
    $('#password_confirm_input').removeClass('is-invalid');
    // Clear color inputs
    var email = document.getElementById('ID_input').value;
    var password = document.getElementById('password_input').value;
    var password_confirm = document.getElementById('password_confirm_input').value;
    var signin = document.getElementById('signin').checked;
    document.getElementById('log_in').disabled = false;
    //SIGN IN
    if (email != '' && password != '' && signin == true) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            $('#ID_input').addClass('is-invalid');
            $('#password_input').addClass('is-invalid');
            $('#error_message').removeClass('text-success');
            $('#error_message').addClass('text-danger');
            var errortxt = document.getElementById('error_message');
            document.getElementById('error_info').style.display = 'block';
            document.getElementById('error_message').style.display = 'block';
            errortxt.textContent = 'Wrong Email adress or Passeword please try again.';
        });}
    else if (email != '' && password != '' && signin == false) {
    //SIGN UP code is executed when signin radio button isn't checked, and that ID and Password is not empty
    //The first thing to create an account is to put a name, a mail and a proper password
          if (password == password_confirm) {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                document.getElementById('error_info').style.display = 'block';
                document.getElementById('error_message').style.display = 'block';
                $('#error_message').removeClass('text-success');
                $('#error_message').addClass('text-danger');
                var errortxt = document.getElementById('error_message');
                errortxt.textContent = errorMessage;
                if (errorCode == 'auth/invalid-email') {
                    $('#ID_input').addClass('is-invalid');
                }
                if (errorCode == 'auth/weak-password') {
                    $('#password_input').addClass('is-invalid');
                    $('#password_confirm_input').addClass('is-invalid');
                }
            });
        }
        else {
          document.getElementById('error_info').style.display = 'block';
          document.getElementById('error_message').style.display = 'block';
          var errortxt = document.getElementById('error_message');
          errortxt.textContent = 'Password and Password confirmation must be the same.';
          $('#password_input').addClass('is-invalid');
          $('#password_confirm_input').addClass('is-invalid');
        }}
    else {
      if (id == '')
          $('#ID_input').addClass('is-invalid');
      if (password == '')
          $('#password_input').addClass('is-invalid');
      if (password == '')
          $('#password_confirm_input').addClass('is-invalid');
    }
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if(document.getElementById('signin').checked == true){
      afficheProfil();
      clearArea();
    } else{
      var user = firebase.auth().currentUser;
      user.updateProfile({
      displayName: document.getElementById('name_input').value,
      }).then(function() {
        document.getElementById('error_info').style.display = 'block';
        document.getElementById('error_message').style.display = 'block';
        $('#error_message').removeClass('text-danger');
        $('#error_message').addClass('text-success');
        var errortxt = document.getElementById('error_message');
        errortxt.textContent = 'Successfull profil creation.';
        afficheProfil()

      }).catch(function(error) {
        document.getElementById('error_info').style.display = 'block';
        document.getElementById('error_message').style.display = 'block';
        $('#error_message').removeClass('text-success');
        $('#error_message').addClass('text-danger');
        var errortxt = document.getElementById('error_message');
        console.log(error.message);
        errortxt.textContent = error.errorMessage;
      });
    }
  } else {
    afficheSignin();
    clearArea();
  }
});

function afficheSignin(){
  document.getElementById('affiche_profil').style.display = 'none';
  document.getElementById('affiche_connect').style.display = 'block';
}

function clearArea(){
  $('#name_input').val('');
  $('#ID_input').val('');
  $('#password_input').val('');
  $('#password_confirm_input').val('');
}
