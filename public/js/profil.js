// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();

// Create a storage reference from our storage service
var storageRef = storage.ref();



function afficheProfil() {
    var user = firebase.auth().currentUser;
    if (user) {
        // User is signed in.
        clearArea();
        document.getElementById('affiche_connect').style.display = 'none';
    } else {
        // No user is signed in.
        console.log('Grave erreur dans la fonction afficheProfil');
    }
}

document.getElementById('signup').addEventListener('click', function() {
    $(".signin_form").css("display", "block");
    $("#signin").removeClass("mb-3");
    clearArea();
    this.style.display = "none";
    document.getElementById('signin').style.display = "block";
    document.getElementById('error_info').style.display = 'none';
    document.getElementById('error_message').style.display = 'none';
    document.getElementById('affiche_confirm').style.display = 'block';
    document.getElementById('affiche_name').style.display = 'block';
});

document.getElementById('signin').addEventListener('click', function() {
    $(".signin_form").css("display", "block");
    $("#signin").removeClass("mb-3");
    clearArea();
    this.style.display = "none";
    document.getElementById('signup').style.display = "block";
    document.getElementById('error_info').style.display = 'none';
    document.getElementById('error_message').style.display = 'none';
    document.getElementById('affiche_confirm').style.display = 'none';
    document.getElementById('affiche_name').style.display = 'none';
});

document.getElementById('log_out').addEventListener('click', function() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        logMode();
        document.getElementById("admin_container").style.display = "none";
        document.getElementById("profil_picture").src = "../blank_profile.png";
        $(".signin_form").css("display", "block");
        $("#signin").removeClass("mb-3");
        document.getElementById('affiche_connect').style.display = 'block';
        clearArea();
        console.log("logout");
        document.getElementById('welcome_message').innerHTML = "Hey ";
        this.style.display = "none";
        document.getElementById('signup').style.display = "block";
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
    // $('#password_input').removeClass('is-invalid');
    // $('#password_confirm_input').removeClass('is-invalid');
    // Get informations
    var name = document.getElementById('name_input').value;
    var last_name = document.getElementById('lastname_input').value;
    var email = document.getElementById('ID_input').value;
    var password = document.getElementById('password_input').value;
    var password_confirm = document.getElementById('password_confirm_input').value;
    var signin = document.getElementById('signup').style.display == "block";
    document.getElementById('log_in').disabled = false;
    //SIGN IN
    if (email != '' && password != '' && signin == true) {
        document.getElementById("log_in").disabled = true;
        document.getElementById("log_in").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
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
            errortxt.textContent = 'Adresse e-mail ou mot de passe incorrect';
            document.getElementById("log_in").disabled = false;
            document.getElementById("log_in").innerHTML = "Se connecter";
        });
    } else if (email != '' && password != '' && signin == false) {
        //SIGN UP code is executed when signin radio button isn't checked, and that ID and Password is not empty
        //The first thing to create an account is to put a name, a mail and a proper password
        if (password == password_confirm) {
            document.getElementById("log_in").disabled = true;
            document.getElementById("log_in").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(function(user) {
                    var user = firebase.auth().currentUser;
                    user.updateProfile({
                        displayName: document.getElementById('name_input').value + ' ' + document.getElementById('lastname_input').value
                    }).then(function() {
                        document.getElementById('welcome_message').innerHTML += user.displayName + ' <i class="em em-wave"></i>';
                    });
                    document.getElementById("log_in").disabled = false;
                    document.getElementById("log_in").innerHTML = "Créer un compte";
                })
                .catch(function(error) {
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
                    document.getElementById("log_in").disabled = false;
                    document.getElementById("log_in").innerHTML = "Créer un compte";
                });
        } else {
            document.getElementById('error_info').style.display = 'block';
            document.getElementById('error_message').style.display = 'block';
            var errortxt = document.getElementById('error_message');
            errortxt.textContent = 'Les mots de passe sont différents';
            $('#password_input').addClass('is-invalid');
            $('#password_confirm_input').addClass('is-invalid');
        }
    } else {
        if (name == '')
            $('name_input').addClass('is-invalid');
        if (last_name == '')
            $('#lastname_input').addClass('is-invalid');
        if (email == '')
            $('#ID_input').addClass('is-invalid');
        if (password == '')
            $('#password_input').addClass('is-invalid');
        if (password == '')
            $('#password_confirm_input').addClass('is-invalid');
    }
});



// Observer triggered for each sign in/sign up/sign out
firebase.auth().onAuthStateChanged(function(user) {
    // Display admin actions if user is admin
    refreshHistory(matchs_buffer.length);

    // If log in/sign up
    if (user) {
        // Check if user has picture URL
        if (user.photoURL != null)
            document.getElementById("profil_picture").src = user.photoURL;
        else
            document.getElementById("profil_picture").src = "../blank_profile.png";

        // Check for user name
        if (user.displayName != null)
            document.getElementById('welcome_message').innerHTML += user.displayName + ' <i class="em em-wave"></i>';

        document.getElementById("log_in").disabled = false;
        document.getElementById("log_in").innerHTML = "Se connecter";

        connectedMode();

        db.collection("players")
            .where("uid", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                // Firestore player already has uid
                if (querySnapshot.docs.length != 0) {
                    document.getElementById("link_button_container").style.display = 'none';
                    if (!querySnapshot.docs[0].data().isActive) {
                        document.getElementById("is_active_container").style.display = 'block';
                    } else {
                        document.getElementById("is_active_container").style.display = 'none';
                    }
                }
                // Firestore player already has not uid
                else {
                    document.getElementById("link_button_container").style.display = 'block';
                }
            });
    }
    // If not connected on page refresh
    else {
        logMode();
        document.getElementById('affiche_connect').style.display = 'block';
        clearArea();
        document.getElementById("profil_picture").src = "../blank_profile.png";
    }
});

function clearArea() {
    $('#name_input').val('');
    $('#lastname_input').val('');
    $('#ID_input').val('');
    $('#password_input').val('');
    $('#password_confirm_input').val('');
    $('#name_input').removeClass('is-invalid');
    $('#lastname_input').removeClass('is-invalid');
    $('#ID_input').removeClass('is-invalid');
    $('#password_input').removeClass('is-invalid');
    $('#password_confirm_input').removeClass('is-invalid');
}




// Upload profile picture
document.getElementById("imageUploadButton").addEventListener('change', function(e) {
    document.getElementById('load_icon').style.display = 'block';
    document.getElementById('profil_picture').style.display = 'none';

    var user = firebase.auth().currentUser;

    // Check if player has user uid
    db.collection("players")
        .where("uid", "==", user.uid)
        .get()
        .then(function(querySnapshot) {
            // Firestore player already has uid
            if (querySnapshot.docs.length != 0) {

                // File or Blob named mountains.jpg
                var file = e.target.files[0];

                var user = firebase.auth().currentUser;

                // Create the file metadata
                var metadata = {
                    contentType: 'image/png'
                };

                // Upload file and metadata to the object 'images/mountains.jpg'
                var uploadTask = storageRef.child('profile_pictures/' + user.uid).put(file, metadata);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function(snapshot) {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log('Upload is paused');
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log('Upload is running');
                                break;
                        }
                    },
                    function(error) {
                        swal({
                            toast: true,
                            position: 'top-start',
                            showConfirmButton: false,
                            timer: 3000,
                            type: 'error',
                            title: 'Echec'
                        });
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case 'storage/unauthorized':
                                // User doesn't have permission to access the object
                                break;

                            case 'storage/canceled':
                                // User canceled the upload
                                break;

                            case 'storage/unknown':
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                        }
                    },
                    function() {
                        // Upload completed successfully, now we can get the download URL
                        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                            console.log('File available at', downloadURL);

                            document.getElementById("profil_picture").src = downloadURL;

                            // Update user profile
                            user.updateProfile({
                                photoURL: downloadURL
                            });

                            // Update player database
                            db.collection("players")
                                .doc(querySnapshot.docs[0].id)
                                .update({
                                    photoURL: downloadURL
                                })
                                .then(function(querySnapshot) {
                                    document.getElementById('load_icon').style.display = 'none';
                                    document.getElementById('profil_picture').style.display = 'block';

                                    swal({
                                        toast: true,
                                        position: 'top-start',
                                        showConfirmButton: false,
                                        timer: 3000,
                                        type: 'success',
                                        title: 'Image enregistrée'
                                    });

                                    e.target.value = "";

                                }).catch(function(error) {
                                    document.getElementById('load_icon').style.display = 'none';
                                    document.getElementById('profil_picture').style.display = 'block';
                                    e.target.value = "";
                                });
                        });
                    });
            }
            // No uid found for connected user in Firestore
            else {
                // console.log("no user");

                swal({
                    toast: true,
                    position: 'top-start',
                    showConfirmButton: false,
                    timer: 4500,
                    type: 'error',
                    title: 'Lie ton compte pour ajouter une photo de profil <i class="em em-wink"></i>'
                });

                e.target.value = "";

                document.getElementById('load_icon').style.display = 'none';
                document.getElementById('profil_picture').style.display = 'block';
            }
        });




})




var begin_template = '<div class="container">' +
    '<div class="row align-items-center" id="container_row">' +
    '<div class="col-12 col-xl-10 offset-xl-1" id="sw_container">';

function addPlayerRadiobox(name, n) {
    return '<div class="container mt-2">' +
        '<div class="row mb-2">' +
        '<label>' +
        '<input type="radio" class="option-input radio" name="player_selection" id="rb_' + n + '_' + name + '"/>' +
        name +
        '</label>' +
        '</div>' +
        '</div>' +
        '<hr/>';
}

function addPlayerCheckbox(name, n, checked) {
    return '<div class="container mt-2">' +
        '<div class="row mb-2">' +
        '<label>' +
        '<input type="checkbox" class="option-input checkbox" name="player_selection" id="rb_' + n + '_' + name + '" ' + (checked ? "checked" : "") + '/>' +
        name +
        '</label>' +
        '</div>' +
        '</div>' +
        '<hr/>';
}

var end_template = '</div>' +
    '</div>' +
    '</div>'

var borders_template = begin_template + end_template;



function linkToPlayer() {
    document.getElementById("link_button").innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';
    document.getElementById("link_button").disabled = true;
    var user = firebase.auth().currentUser;
    db.collection("players")
        .where("uid", "==", user.uid)
        .get()
        .then(function(querySnapshot) {
            // Firestore player already has uid
            if (querySnapshot.docs.length != 0) {
                swal({
                    toast: true,
                    position: 'top-start',
                    showConfirmButton: false,
                    timer: 3000,
                    type: 'warning',
                    title: 'Déjà lié'
                });

                document.getElementById("link_button").innerHTML = 'Lier mon compte';
                document.getElementById("link_button").disabled = false;
                document.getElementById("link_button_container").style.display = 'none';
            }
            // No uid found for connected user in Firestore
            else {
                swal({
                    title: 'Qui êtes-vous ?',
                    html: '<div id="swal_container_custom"></div>',
                    showCloseButton: true,
                    showCancelButton: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonClass: 'btn btn-success mr-1',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: false,
                    confirmButtonText: 'C\'est bien moi <i class="em em-ok_hand"></i>',
                    cancelButtonText: 'Plus tard',
                    onOpen: () => {
                        $("#swal_container_custom")[0].innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';

                        // Get players from database and display it when ready
                        db.collection("players")
                            .orderBy("team")
                            .get()
                            .then(function(querySnapshot) {
                                var n = 0;
                                $("#swal_container_custom")[0].innerHTML = borders_template;
                                var team_name = "";
                                var player_buffer = [];
                                // Query team by team
                                querySnapshot.forEach(function(doc) {
                                    // If player is not linked to an account, display it on swal
                                    if (doc.data().uid == undefined) {
                                        if (team_name == "") {
                                            team_name = doc.data().team;
                                            $("#sw_container")[0].insertAdjacentHTML('beforeend', '<h2 class="mt-3">' + team_name + '</h2>'); // insert team name in swal
                                        } else if (team_name != doc.data().team) {
                                            // Sort and place sorted players in swal (1 team)
                                            player_buffer.sort();
                                            for (var i = 0; i < player_buffer.length; i++) {
                                                $("#sw_container")[0].insertAdjacentHTML('beforeend', addPlayerRadiobox(player_buffer[i], n++));
                                            }
                                            player_buffer = [];
                                            team_name = doc.data().team;
                                            $("#sw_container")[0].insertAdjacentHTML('beforeend', '<h2 class="mt-3">' + team_name + '</h2>');
                                        }
                                        player_buffer.push(doc.data().name);
                                    }
                                })

                                // Sort and place sorted players in swal for the last team
                                player_buffer.sort(); // sort players
                                for (var i = 0; i < player_buffer.length; i++) {
                                    $("#sw_container")[0].insertAdjacentHTML('beforeend', addPlayerRadiobox(player_buffer[i], n++));
                                }


                                // Container for a new player not in database
                                $("#sw_container")[0].insertAdjacentHTML('beforeend', '<h2 class="mt-3">Nouveau joueur</h2>');
                                $("#sw_container")[0].insertAdjacentHTML('beforeend', '<div class="container mt-2">' +
                                    '<div class="row mb-2">' +
                                    '<label>' +
                                    '<input type="radio" class="option-input radio" name="player_selection" id="rb_new_player"/>' +
                                    '<span style="font-weight: bold; font-size: 1.5rem;">Créer un profil <i class="em em-baby"></i></span>' +
                                    '</label>' +
                                    '</div>' +
                                    '<div class="row mb-2">' +
                                    '<input type="text" class="form-control" placeholder="Prénom" aria-describedby="basic-addon1" id="rb_name_input">' +
                                    '<input type="text" class="form-control" placeholder="Nom" aria-describedby="basic-addon1" id="rb_lastname_input">' +
                                    '<input type="text" class="form-control" placeholder="Service (SCFH, SFTA ...)" aria-describedby="basic-addon1" id="rb_team_input">' +
                                    '</div>' +
                                    '</div>' +
                                    '<hr/>');
                            })
                            .catch(function(error) {
                                console.log("Error getting documents: ", error);
                                swal.showValidationError('Un petit problème est survenu ... Nos meilleurs ingénieurs sont sur le coup !');
                            });
                    },
                    preConfirm: () => {
                        // Check which player has been selected
                        var buttons = document.getElementsByName("player_selection");
                        var buttonName;

                        for (var i = 0; i < buttons.length; i++) {
                            if (buttons[i].checked) {
                                buttonName = buttons[i].id;
                                break;
                            }
                        }

                        // If no radio box is selected, display warning
                        if (buttonName == null) {
                            swal({
                                toast: true,
                                position: 'top-start',
                                showConfirmButton: false,
                                timer: 3000,
                                type: 'warning',
                                title: 'Selectionnez ou créez un joueur'
                            });

                            document.getElementById("link_button").innerHTML = 'Lier mon compte';
                            document.getElementById("link_button").disabled = false;
                            return false;
                        }

                        // If create player radio button is checked
                        if (buttonName === 'rb_new_player') {
                            var name = document.getElementById("rb_name_input").value.trim();
                            var lastname = document.getElementById("rb_lastname_input").value.trim();
                            var team = document.getElementById("rb_team_input").value.toUpperCase().trim();

                            // If inputs are not empty( = valid)
                            if (name != "" && lastname != "" && team != "") {
                                name = name.charAt(0).toUpperCase() + name.slice(1);
                                var fullname = name + " " + lastname.charAt(0).toUpperCase() + ".";

                                // Add player to database
                                db.collection("players")
                                    .orderBy("number")
                                    .get()
                                    .then(docSnapshot => {

                                        // Change name if already present
                                        sorted_names = [];
                                        for (i = 0; i < docSnapshot.docs.length; i++) {
                                            sorted_names.push(docSnapshot.docs[i].data().name); // get all names
                                        }
                                        sorted_names = sorted_names.sort(); // sort alphabetically

                                        var past_names = [];
                                        var n = lastname.length - 2;
                                        for (i = 0; i < sorted_names.length; i++) {
                                            if (!past_names.includes(sorted_names[i])) { // if name has already been compared, pass
                                                while (sorted_names[i] == fullname) {
                                                    // Add a letter to the last name until it is different from others
                                                    if (lastname.slice(lastname.length - n - 1, lastname.length - n) == " ")
                                                        n--;
                                                    fullname = name.charAt(0).toUpperCase() + name.slice(1) + " " + lastname.charAt(0).toUpperCase() + lastname.slice(1, lastname.length - n--) + ".";
                                                    if (n < 0) { // if all letters failed, return error
                                                        swal({
                                                            html: 'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                                                            type: 'error',
                                                            toast: true,
                                                            position: 'top-start',
                                                            timer: 3000,
                                                            showConfirmButton: false
                                                        });

                                                        // Remove loading button
                                                        document.getElementById("link_button").innerHTML = 'Lier mon compte';
                                                        document.getElementById("link_button").disabled = false;
                                                        return;
                                                    }
                                                }
                                                past_names.push(sorted_names[i]);
                                            }
                                        }

                                        // New player object
                                        var added_player = {
                                            number: 1, // used to sort data when is get
                                            invert_number: -1,
                                            name: fullname,
                                            last_name: lastname,
                                            first_name: name,
                                            team: team,
                                            goals: 0,
                                            gamelles: 0,
                                            betrays: 0,
                                            wins: 0,
                                            defeats: 0,
                                            isActive: true,
                                            uid: firebase.auth().currentUser.uid,
                                            photoURL: firebase.auth().currentUser.photoURL,
                                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                                        };

                                        // If there is at least one player in "players" collection
                                        if (docSnapshot.docs.length != 0) {
                                            // Get the last visible document (= last match played)
                                            added_player.number = docSnapshot.docs[docSnapshot.docs.length - 1].data().number + 1;
                                            added_player.invert_number = -docSnapshot.docs[docSnapshot.docs.length - 1].data().number - 1;
                                        }

                                        db.collection("players")
                                            .doc("player" + added_player.number)
                                            .set(added_player)
                                            .then(function() {
                                                // Remove loading button
                                                document.getElementById("link_button").innerHTML = 'Lier mon compte';
                                                document.getElementById("link_button").disabled = false;

                                                var quotes = [name + ", c'est un joli prénom <i class=\"em em-smirk\"></i>",
                                                    "Salut " + name + ", que la force soit avec toi <i class=\"em em-pray\"></i>",
                                                    "Ah " + name + " ! On t'attendait <i class=\"em em-wink\"></i>",
                                                    "Penses à bien t'échauffer les poignets " + name + " <i class=\"em em-raised_hands\"></i>"
                                                ]

                                                swal({
                                                    html: quotes[Math.floor(Math.random() * quotes.length)],
                                                    type: 'success',
                                                    toast: true,
                                                    position: 'top-start',
                                                    timer: 3000,
                                                    showConfirmButton: false
                                                });

                                                document.getElementById("link_button_container").style.display = 'none';
                                            })
                                            .catch(function(error) {
                                                console.error("Error writing document: ", error);
                                                swal({
                                                    html: 'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                                                    type: 'error',
                                                    toast: true,
                                                    position: 'top-start',
                                                    timer: 3000,
                                                    showConfirmButton: false
                                                });
                                            });
                                    })
                                    .catch(function(error) {
                                        console.log("Error getting document:", error);
                                        swal({
                                            html: 'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                                            type: 'error',
                                            toast: true,
                                            position: 'top-start',
                                            timer: 3000,
                                            showConfirmButton: false
                                        });
                                    });

                            } else {
                                // Put inputs in red if missing
                                if (name == "")
                                    $("#name_input").addClass("is-invalid");
                                if (name == "")
                                    $("#lastname_input").addClass("is-invalid");
                                if (team == "")
                                    $("#team_input").addClass("is-invalid");
                            }
                        } else {
                            // Update player's UID (in Firestore) with actual connected user
                            var user = firebase.auth().currentUser;
                            db.collection("players")
                                .where("name", "==", buttonName.split('_')[2])
                                .get()
                                .then(function(querySnapshot) {
                                    querySnapshot.forEach(function(doc) {
                                        db.collection("players")
                                            .doc(doc.id)
                                            .update({
                                                uid: user.uid
                                            })
                                            .then(function(querySnapshot) {
                                                swal({
                                                    toast: true,
                                                    position: 'top-start',
                                                    showConfirmButton: false,
                                                    timer: 3000,
                                                    type: 'success',
                                                    title: 'Lié pour la vie <i class="em em-link"></i> <i class="em em-heart"></i>'
                                                });
                                                document.getElementById("link_button").innerHTML = 'Lier mon compte';
                                                document.getElementById("link_button").disabled = false;
                                                document.getElementById("link_button_container").style.display = 'none';
                                                // INSERT HERE USER DATA INSERT HERE USER DATA INSERT HERE USER DATA
                                            });
                                    })
                                });
                        }
                    }
                }).then((result) => {
                    if (result.dismiss === swal.DismissReason.backdrop ||
                        result.dismiss === swal.DismissReason.cancel ||
                        result.dismiss === swal.DismissReason.close ||
                        result.dismiss === swal.DismissReason.esc) {
                        document.getElementById("link_button").innerHTML = 'Lier mon compte';
                        document.getElementById("link_button").disabled = false;
                    }
                });
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}


function setPlayerActive() {
    document.getElementById('set_active_button').innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin fa-lg\"></i>";
    document.getElementById('set_active_button').disabled = true;

    var user = firebase.auth().currentUser;

    // Get player with uid
    db.collection("players")
        .where("uid", "==", user.uid)
        .get()
        .then(function(querySnapshot) {
            // Update isActive property
            db.collection("players")
                .doc(querySnapshot.docs[0].id)
                .update({
                    isActive: true
                })
                .then(function() {
                    swal({
                        toast: true,
                        position: 'top-start',
                        showConfirmButton: false,
                        timer: 3000,
                        type: 'success',
                        title: 'Back in the game <i class="em em-i_love_you_hand_sign"></i>'
                    });

                    document.getElementById('set_active_button').innerHTML = 'Revenir dans le game <i class="em em-muscle"></i><i class="em em-anger"></i>';
                    document.getElementById('set_active_button').disabled = false;
                    document.getElementById('is_active_container').style.display = 'none';
                });
        })
        .catch(function(error) {
            swal({
                toast: true,
                position: 'top-start',
                showConfirmButton: false,
                timer: 3000,
                type: 'error',
                title: 'Il y a eu un problème durant le changement de statut'
            });

            document.getElementById('set_active_button').innerHTML = 'Revenir dans le game <i class="em em-muscle"></i><i class="em em-anger"></i>';
            document.getElementById('set_active_button').disabled = false;
        })
}

// TODO: tester logout

function logMode() {
    document.getElementById('log_user_container').style.display = 'block';
    document.getElementById('connected_container').style.display = 'none';
    document.getElementById('is_active_container').style.display = 'none';
    document.getElementById('link_button_container').style.display = 'none';
}


function connectedMode() {
    document.getElementById('log_user_container').style.display = 'none';
    document.getElementById('connected_container').style.display = 'block';
}




// ADMIN PART : allow matchs to be deleted for good

document.getElementById('new_season_button').addEventListener('click', function() {
    swal({
        title: 'Nouvelle saison',
        html: '<input id="swal-input2" class="swal2-input" placeholder="Titre (\'Saison 2\')">' +
            '<input id="swal-input1" class="swal2-input" placeholder="Pitch (\'Gamelle is bae\')">',
        focusConfirm: false,
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#d63030',
        cancelButtonColor: '#33a321',
        confirmButtonText: '<i class="em em-soccer"></i> Créer',
        cancelButtonText: 'Annuler',
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ]
        }
    }).then((result) => {
        if (result.dismiss == null) {
            if (result.value[0] == "" || result.value[1] == "") {
                swal({
                    toast: true,
                    position: 'top-start',
                    showConfirmButton: false,
                    timer: 3000,
                    type: 'error',
                    title: 'Remplissez tous les champs <i class="em em-hand"></i>'
                });
                return;
            }

            document.getElementById("new_season_button").disabled = true;
            document.getElementById("new_season_button").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin fa-lg\"></i>";

            db.collection("seasons")
                .get()
                .then(function(querySnapshot) {
                    var lastDoc;
                    // Disable all seasons
                    querySnapshot.forEach(function(doc) {
                        lastDoc = doc.data();
                        db.collection("seasons")
                            .doc(doc.id)
                            .update({
                                active: false
                            });
                    });

                    // Create new season and enable it
                    db.collection("seasons")
                        .doc("season" + (parseInt(lastDoc.order) + 1))
                        .set({
                            active: true,
                            order: lastDoc.order + 1,
                            invert_order: -lastDoc.order - 1,
                            pitch: result.value[0],
                            title: result.value[1],
                            start_date: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(function(docRef) {
                            swal({
                                toast: true,
                                position: 'top-start',
                                showConfirmButton: false,
                                timer: 3000,
                                type: 'success',
                                title: 'Saison commencée ! <i class="em em-soccer"></i>'
                            });
                            document.getElementById("new_season_button").disabled = false;
                            document.getElementById("new_season_button").innerHTML = "<strong>Démarrer nouvelle saison</strong>";
                        }).catch(function(error) {
                            swal({
                                toast: true,
                                position: 'top-start',
                                showConfirmButton: false,
                                timer: 3000,
                                type: 'error',
                                title: 'Erreur lors de la création'
                            });
                            document.getElementById("new_season_button").disabled = true;
                            document.getElementById("new_season_button").innerHTML = "<strong>Démarrer nouvelle saison</strong>";
                        });
                });
        }
    });
});


document.getElementById('players_status_button').addEventListener('click', function() {
    swal({
        title: 'Quels sont les joueurs actifs ?',
        html: '<div id="swal_container_custom"></div>',
        showCloseButton: true,
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonClass: 'btn btn-success mr-1',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        confirmButtonText: 'All good',
        cancelButtonText: 'Plus tard',
        onOpen: () => {
            $("#swal_container_custom")[0].innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';

            // Get players from database and display it when ready
            db.collection("players")
                .orderBy("team")
                .get()
                .then(function(querySnapshot) {
                    var n = 0;
                    $("#swal_container_custom")[0].innerHTML = borders_template;
                    var team_name = "";
                    var player_buffer = [];
                    // Query team by team
                    querySnapshot.forEach(function(doc) {
                        if (team_name == "") {
                            team_name = doc.data().team;
                            $("#sw_container")[0].insertAdjacentHTML('beforeend', '<h2 class="mt-3">' + team_name + '</h2>'); // insert team name in swal
                        } else if (team_name != doc.data().team) {
                            // Sort and place sorted players in swal (1 team)
                            player_buffer.sort(function(a, b) {
                                if (a.name.toLowerCase() < b.name.toLowerCase()) //sort string ascending
                                    return -1
                                if (a.name.toLowerCase() > b.name.toLowerCase())
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                            for (var i = 0; i < player_buffer.length; i++) {
                                $("#sw_container")[0].insertAdjacentHTML('beforeend', addPlayerCheckbox(player_buffer[i].name, player_buffer[i].id, player_buffer[i].isActive));
                            }
                            player_buffer = [];
                            team_name = doc.data().team;
                            $("#sw_container")[0].insertAdjacentHTML('beforeend', '<h2 class="mt-3">' + team_name + '</h2>');
                        }
                        player_buffer.push({
                            name: doc.data().name,
                            isActive: doc.data().isActive,
                            id: doc.id
                        });
                    })

                    // Sort and place sorted players in swal for the last team
                    player_buffer.sort(function(a, b) {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) //sort string ascending
                            return -1
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                            return 1
                        return 0 //default return value (no sorting)
                    });
                    for (var i = 0; i < player_buffer.length; i++) {
                        $("#sw_container")[0].insertAdjacentHTML('beforeend', addPlayerCheckbox(player_buffer[i].name, player_buffer[i].id, player_buffer[i].isActive));
                    }
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                    swal.showValidationError('Un petit problème est survenu ... Nos meilleurs ingénieurs sont sur le coup !');
                });
        },
        preConfirm: () => {
            // Check which player has been selected
            var playersCheckboxes = document.getElementsByName("player_selection");
            var playerNames;
            var dbPromises = [];

            document.getElementById("players_status_button").disabled = true;
            document.getElementById("players_status_button").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin fa-lg\"></i>";

            for (var i = 0; i < playersCheckboxes.length; i++) {
                dbPromises.push(db.collection("players")
                    .doc(playersCheckboxes[i].id.split('_')[1])
                    .update({
                        isActive: playersCheckboxes[i].checked
                    })
                );
            }

            Promise.all(dbPromises).then(function() {
                    swal({
                        toast: true,
                        position: 'top-start',
                        showConfirmButton: false,
                        timer: 3000,
                        type: 'success',
                        title: 'Status des joueurs mis à jour <i class="em em---1"></i>'
                    });

                    document.getElementById("players_status_button").disabled = false;
                    document.getElementById("players_status_button").innerHTML = "<strong>Changer statut joueur</strong>";
                })
                .catch(function(error) {
                    swal({
                        toast: true,
                        position: 'top-start',
                        showConfirmButton: false,
                        timer: 3000,
                        type: 'error',
                        title: 'Erreur lors de la mise à jour <i class="em em--1"></i>'
                    });

                    document.getElementById("players_status_button").disabled = false;
                    document.getElementById("players_status_button").innerHTML = "<strong>Changer statut joueur</strong>";
                });
        }
    }).then((result) => {
        if (result.dismiss === swal.DismissReason.backdrop ||
            result.dismiss === swal.DismissReason.cancel ||
            result.dismiss === swal.DismissReason.close ||
            result.dismiss === swal.DismissReason.esc) {
            document.getElementById("players_status_button").disabled = false;
            document.getElementById("players_status_button").innerHTML = "<strong>Changer statut joueur</strong>";
        }
    });
});


var matchs_buffer = [];

// Method called to get matchs from database then display them in History container
function refreshHistory(previous_matchs_number) {
    db.collection("deleted_matchs")
        .orderBy("invert_number")
        .get()
        .then(function(querySnapshot) {
            // Reveal deleted matchs ONLY if user is admin (he would receive matchs data)
            document.getElementById("admin_container").style.display = "block";


            matchs_buffer = []; // reset matchs buffer to re-import previous matchs and new ones
            querySnapshot.forEach(function(doc) {
                var data = doc.data();
                data.id = doc.id;
                data.date = "• " + moment(data.timestamp, "YYYY-MM-DDThh:mm:ss").locale('fr').fromNow();
                // data.date = "• " + moment(data.timestamp, "YYYY-MM-DDThh:mm:ss").add(2, 'hours').locale('fr').fromNow();
                if (data.date == "• Invalid date")
                    data.date = "•";
                matchs_buffer.push(data);
            });

            // Invert match order to display newest on top
            for (var i = previous_matchs_number; i <= matchs_buffer.length - 1; i++) {
                reportMatch(matchs_buffer[i], true);
            }
        })
        .catch(function(error) {
            // If user is not admin, don't display deleted matchs
            document.getElementById("submit_card").style.display = "none";
            console.log("Error getting documents: ", error);
        });
}


function reportMatch(match, addToEnd) {

    var match_template = document.getElementById("template").cloneNode(true); // copy template node
    var history = document.getElementById("history"); // get history div element (contains all matches)
    match_template.id = match.id; // give id depending on match number

    // Add match informations
    match_template.querySelector("#player1").innerHTML = match.player1;
    match_template.querySelector("#player2").innerHTML = match.player2;
    match_template.querySelector("#player3").innerHTML = match.player3;
    match_template.querySelector("#player4").innerHTML = match.player4;
    match_template.querySelector("#team1score").innerHTML = match.score1;
    match_template.querySelector("#team2score").innerHTML = match.score2;
    match_template.querySelector("#timestamp").innerHTML = match.date;
    match_template.querySelector(".reason").innerHTML = match.reason;

    match_template.querySelector("#delete_button").addEventListener("click", function(e) {
        var matchElement = e.composedPath()[4];

        swal({
            title: 'Supression',
            text: 'C\'est irréversible ! Est-ce votre dernier mot ?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui Jean-Pierre',
            cancelButtonText: 'Non'
        }).then((result) => {
            if (result.value) {

                matchElement.children[0].children[1].innerHTML = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:3rem"></i>';

                db.collection("deleted_matchs")
                    .doc(matchElement.id)
                    .delete()
                    .then(function() {
                        db.collection("matches")
                            .doc(matchElement.id)
                            .delete()
                            .then(function() {
                                swal({
                                    toast: true,
                                    position: 'top-start',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    type: 'success',
                                    title: 'Match supprimé'
                                });
                            });
                        // Remove match from html
                        matchElement.parentNode.removeChild(matchElement);
                    }).catch(function(error) {
                        swal({
                            toast: true,
                            position: 'top-start',
                            showConfirmButton: false,
                            timer: 3000,
                            type: 'error',
                            title: 'Erreur durant la suppression'
                        });
                    });
            }
        })
    });

    match_template.querySelector("#restore_button").addEventListener("click", function(e) {
        var matchElement = e.composedPath()[4];
        matchElement.children[0].children[1].innerHTML = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:3rem"></i>';

        db.collection("deleted_matchs")
            .doc(matchElement.id)
            .delete()
            .then(function() {
                db.collection("matches")
                    .doc(matchElement.id)
                    .update({
                        reason: ""
                    })
                    .then(function() {
                        swal({
                            toast: true,
                            position: 'top-start',
                            showConfirmButton: false,
                            timer: 3000,
                            type: 'success',
                            title: 'Match restauré'
                        });

                        // Remove match from html
                        matchElement.parentNode.removeChild(matchElement);
                    });
            }).catch(function(error) {
                swal({
                    toast: true,
                    position: 'top-start',
                    showConfirmButton: false,
                    timer: 3000,
                    type: 'error',
                    title: 'Erreur durant la restauration'
                });
            });
    });

    // Give status to match depending on score
    node_team1 = match_template.querySelector("#status_team1");
    node_team2 = match_template.querySelector("#status_team2");
    if (parseInt(match_template.querySelector("#team1score").innerHTML) > parseInt(match_template.querySelector("#team2score").innerHTML)) {
        node_team1.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-success disabled\">Victoire</button>");
        node_team2.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-danger disabled\">Défaite</button>");
    } else if (parseInt(match_template.querySelector("#team1score").innerHTML) < parseInt(match_template.querySelector("#team2score").innerHTML)) {
        node_team1.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-danger disabled\">Défaite</button>");
        node_team2.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-success disabled\">Victoire</button>");
    } else {
        node_team1.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-warning disabled\">Erreur</button>");
        node_team2.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"btn btn-md btn-warning disabled\">Erreur</button>");
    }

    if (history.firstChild != null) {
        match_template.insertAdjacentHTML('beforeend', "<hr/>");
    }

    match_template.style.display = 'block';

    // Add match to bottom of history
    history.insertBefore(match_template, history.lastChild);
}