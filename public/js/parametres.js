// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();


function emojization(from, to) {
    switch (from) {
        case "Elise G.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-cheese_wedge\"></i>  " + from + "</p>");
            break;
        case "Claire L.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-ambulance\"></i>  " + from + "</p>");
            break;
        case "Mitsuaki V.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-anger\"></i>  " + from + "  </p>");
            break;
        case "Jérémy D.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-ice_hockey_stick_and_puck\"></i>  " + from + "</p>");
            break;
        case "Nicolas E.":
            to.insertAdjacentHTML('beforeend', "<p><i class=\"em em-lying_face\"></i>  " + from + "</p>");
            break;
        default:
            to.insertAdjacentHTML('beforeend', "<p>" + from + "</p>");
            break;
    }
}


// Get all players from database and PSA teams then fill 'select' elements with it
db.collection("players")
    .orderBy("team")
    .get()
    .then(function(querySnapshot) {
        // Clear list
        document.getElementById("players_list").innerHTML = "";

        // Query players list
        var team_id = null;
        querySnapshot.forEach(function(doc) {
            var list = document.getElementById("players_list");
            data = doc.data();

            // If new docSnapshot
            if (team_id == null) {
                team_id = data.team;
                list.insertAdjacentHTML('beforeend', "<h2>" + team_id + "</h2><hr/>");
            }
            // If new team, add some margin
            else if (team_id != data.team) {
                team_id = data.team;
                list.insertAdjacentHTML('beforeend', "<h2 class=\"mt-3\">" + team_id + "</h2><hr/>");
            }
            // Emoji tag
            emojization(data.name, list);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });






// Button add player listener
document.getElementById("add_player").addEventListener("click", function() {

    // Clear color inputs
    $("#name_input").removeClass("is-invalid");
    $("#lastname_input").removeClass("is-invalid");
    $("#team_input").removeClass("is-invalid");

    var name = document.getElementById("name_input").value.trim();
    var lastname = document.getElementById("lastname_input").value.trim();
    var team = document.getElementById("team_input").value.toUpperCase().trim();

    // If inputs are not empty (=valid)
    if (name != "" && lastname != "" && team != "") {
        // Change to loading button
        document.getElementById("add_player").disabled = true;
        document.getElementById("add_player").innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";

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
                                swal(
                                    'Erreur',
                                    'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                                    'error'
                                );

                                // Remove loading button
                                document.getElementById("add_player").disabled = false;
                                document.getElementById("add_player").innerHTML = "Valider";
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
                        // Update player list display
                        setTimeout(function() {
                            db.collection("players")
                                .orderBy("team")
                                .get()
                                .then(function(querySnapshot) {
                                    // Clear list
                                    document.getElementById("players_list").innerHTML = "";

                                    // Query players list
                                    var team_id = null;
                                    querySnapshot.forEach(function(doc) {
                                        var list = document.getElementById("players_list");
                                        data = doc.data();

                                        // If new docSnapshot or if new team in doc
                                        if ((team_id == null) || (team_id != data.team)) {
                                            team_id = data.team;
                                            list.insertAdjacentHTML('beforeend', "<h2>" + team_id + "</h2><hr/>");
                                        }
                                        // If same team as before, do nothing particular

                                        // Emoji tag
                                        emojization(data.name, list);
                                    });
                                })
                                .catch(function(error) {
                                    console.log("Error getting documents: ", error);
                                    swal(
                                        'Erreur',
                                        'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                                        'error'
                                    );
                                });

                            // Clear inputs
                            document.getElementById("name_input").value = "";
                            document.getElementById("lastname_input").value = "";
                            document.getElementById("team_input").value = "";

                            // Remove loading button
                            document.getElementById("add_player").disabled = false;
                            document.getElementById("add_player").innerHTML = "Valider";

                            var quotes = [name + ", c'est un joli prénom <i class=\"em em-smirk\"></i>",
                                "Salut " + name + ", que la force soit avec toi <i class=\"em em-pray\"></i>",
                                "Ah " + name + " ! On t'attendait <i class=\"em em-wink\"></i>",
                                "Penses à bien t'échauffer les poignets " + name + " <i class=\"em em-raised_hands\"></i>"
                            ]

                            swal(
                                'Succès',
                                quotes[Math.floor(Math.random() * quotes.length)],
                                'success'
                            );
                        }, 200);
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                        swal(
                            'Erreur',
                            'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                            'error'
                        );
                    });



            })
            .catch(function(error) {
                console.log("Error getting document:", error);
                swal(
                    'Erreur',
                    'L\'ajout du joueur a échoué <i class=\"em em-confused\"></i>',
                    'error'
                );
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
});




// Delete functionnality on match element hold
var pressTimer;

// Computer navigation
$("#history").mouseup(function(e) {
    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        inputUp(e);
    }


    return false;

}).mousedown(function(e) {
    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        inputDown(e);
    }
    return false;
});




// Mobile navigation
$("#players_list").on("touchstart", function(e) {
    inputDown(e);
});

$("#players_list").on("touchend", function(e) {
    inputUp(e);
});

function inputDown(e) {
    if (e.target.tagName == "P") {
        setTimeout( function() {
            $(e.target).stop();
        console.log("coucou");},
    1000);

        $({
            blurRadius: 0
        }).animate({
            blurRadius: 10
        }, {
            duration: 2000,
            easing: 'swing', // or "linear"
            // use jQuery UI or Easing plugin for more options
            step: function() {
                $(e.target).css({
                    "-webkit-filter": "blur(" + this.blurRadius + "px)",
                    "filter": "blur(" + this.blurRadius + "px)"
                });
            }
        });

    }


    // Change background color
    // $("#" + $(e.target)
    //         .parentsUntil(".match_container")
    //         .parent().attr('id'))
    //     .animate({
    //             opacity: 0.6,
    //             color: "rgb(240, 242, 217)",
    //             backgroundColor: "rgb(173, 59, 59)"
    //         },
    //         1000,
    //         'swing');

    // If timeout, restore background color
    // setTimeout(function() {
    // $("#" + $(e.target)
    //         .parentsUntil(".match_container")
    //         .parent()
    //         .attr('id'))
    //     .animate({
    //             opacity: 1,
    //             color: "rgb(0, 0, 0)",
    //             backgroundColor: "#FFFFFFFF"
    //         },
    //         100,
    //         'swing')
    // }, 1250);

    // pressTimer = window.setTimeout(function() {
    //     var match_id = $(e.target).parentsUntil(".match_container").parent().attr('id');
    //
    //     if (new RegExp('match').test(match_id)) {
    //         swal({
    //             title: 'Confirmation',
    //             text: "Êtes vous sûr de vouloir supprimer ce match ?",
    //             type: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'Oui !',
    //             cancelButtonText: 'How about no.',
    //             confirmButtonClass: 'btn btn-success mr-1',
    //             cancelButtonClass: 'btn btn-danger',
    //             buttonsStyling: false
    //         }).then((result) => {
    //             if (result.value) {
    //                 // Add loading icon
    //                 var thisMatch = $("#" + $(e.target)
    //                     .parentsUntil(".match_container")
    //                     .parent().attr('id')).find("#status");
    //                 thisMatch[0].innerHTML = "";
    //                 thisMatch.addClass('fa fa-circle-o-notch fa-spin');
    //                 thisMatch.css("font-size", "1.75rem");
    //
    //                 db.collection("matches")
    //                     .doc(match_id)
    //                     .get()
    //                     .then(function(doc) {
    //                         if (doc.exists) {
    //                             db.collection("matches")
    //                                 .doc(match_id)
    //                                 .delete()
    //                                 .then(function() {
    //                                     console.log(match_id + " successfully deleted!");
    //
    //                                     var match = document.getElementById(match_id);
    //                                     match.parentNode.removeChild(match);
    //
    //                                     swal(
    //                                         'Succès',
    //                                         'Le match a bien été supprimé !',
    //                                         'success'
    //                                     );
    //                                 }).catch(function(error) {
    //                                     swal({
    //                                         type: 'error',
    //                                         title: 'Erreur',
    //                                         text: 'Il y a eu un problème lors de la suppression du match'
    //                                     });
    //                                 });
    //                         } else {
    //                             console.log("No such document!");
    //                         }
    //                     }).catch(function(error) {
    //                         console.log("Error getting document:", error);
    //                     });
    //             }
    //         })
    //     }
    // }, 1000);
}

function inputUp(e) {
    console.log(e.target);
    $(e.target).stop();
    // $({
    //     blurRadius: 0
    // }).animate({
    //     blurRadius: 10
    // }, {
    //     duration: 500,
    //     easing: 'swing', // or "linear"
    //     // use jQuery UI or Easing plugin for more options
    //     step: function() {
    //         $(e.target).css({
    //             "-webkit-filter": "blur(" + this.blurRadius + "px)",
    //             "filter": "blur(" + this.blurRadius + "px)"
    //         });
    //     }
    // });
}