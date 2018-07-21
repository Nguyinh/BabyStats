// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// User profil display
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('profile_name').innerHTML = '<img id="profile_picture" alt="Photo" src="blank_profile.png" style="width: 2rem; height:2rem; border-radius: 50%;" class="mr-2">' + user.displayName
        document.getElementById('profile_picture').src = (user.photoURL != null ? user.photoURL : "../blank_profile.png");
        document.getElementById('player_selector_picture').src = (user.photoURL != null ? user.photoURL : "../blank_profile.png");
    } else {
        console.log("no user connected");
    }
});





// --------------- Players list ---------------
var player1select = document.getElementById('player1_input');
var player2select = document.getElementById('player2_input');
var player3select = document.getElementById('player3_input');
var player4select = document.getElementById('player4_input');

var selectsElements = [player1select, player2select, player3select, player4select];

var dotLoadingInterval = setInterval(function() {
    for (var s = 0; s < selectsElements.length; s++) { // Foreach option boxes
        var elmt = selectsElements[s].options[0].innerHTML;

        selectsElements[s].options[0].innerHTML = (elmt == "" ? "." : (elmt == "." ? ".." : (elmt == ".." ? "..." : (elmt == "..." ? "" : ""))));
    }
}, 350);


window.onbeforeunload = function() {
    for (var s = 0; s < selectsElements.length; s++) {
        if (selectsElements[s].selectedIndex != 0)
            return "Si vous quittez cette page, les scores seront effacés";
    }
};


// Get all players from database and PSA teams then fill 'select' elements with it
db.collection("players")
    .orderBy("team")
    .get()
    .then(function(querySnapshot) {
        // var n = 0;
        var team_name = "";
        var player_buffer = [];
        querySnapshot.forEach(function(doc) {
            if (!doc.data().isActive)
                return;
            if (team_name == "") { // Initialization
                team_name = doc.data().team;
                for (var j = 0; j < selectsElements.length; j++) { // Foreach option boxes
                    selectsElements[j].insertAdjacentHTML('beforeend', "<optgroup label=\"" + team_name + "\">"); // insert team name as title
                }
            } else if (team_name != doc.data().team) { // When team changes
                // Sort and place sorted players in swal (1 team)
                player_buffer.sort();
                for (var j = 0; j < selectsElements.length; j++) { // Foreach option boxes
                    for (var i = 0; i < player_buffer.length; i++) {
                        var opt = document.createElement('option');
                        opt.value = player_buffer[i];
                        opt.innerHTML = player_buffer[i];
                        selectsElements[j].appendChild(opt);
                    }
                }
                player_buffer = [];
                team_name = doc.data().team;
                for (var j = 0; j < selectsElements.length; j++) { // Foreach option boxes
                    selectsElements[j].insertAdjacentHTML('beforeend', "<optgroup label=\"" + team_name + "\">"); // insert team name as title
                }
            }
            player_buffer.push(doc.data().name);
        })

        // Sort and place sorted players in swal for the last team
        player_buffer.sort(); // sort players
        for (var j = 0; j < selectsElements.length; j++) { // Foreach option boxes
            for (var i = 0; i < player_buffer.length; i++) {
                var opt = document.createElement('option');
                opt.value = player_buffer[i];
                opt.innerHTML = player_buffer[i];
                selectsElements[j].appendChild(opt);
            }
            selectsElements[j].disabled = false;
            selectsElements[j].options[0].innerHTML = "Joueur " + (j + 1);
        }

        clearInterval(dotLoadingInterval);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });



var score1 = document.getElementById("score1");
var score2 = document.getElementById("score2");

var goalJ1 = document.getElementById("goalJ1score");
var goalJ2 = document.getElementById("goalJ2score");
var goalJ3 = document.getElementById("goalJ3score");
var goalJ4 = document.getElementById("goalJ4score");

var gamJ1 = document.getElementById("gamelleJ1score");
var gamJ2 = document.getElementById("gamelleJ2score");
var gamJ3 = document.getElementById("gamelleJ3score");
var gamJ4 = document.getElementById("gamelleJ4score");

var betrayJ1 = document.getElementById("betrayJ1score");
var betrayJ2 = document.getElementById("betrayJ2score");
var betrayJ3 = document.getElementById("betrayJ3score");
var betrayJ4 = document.getElementById("betrayJ4score");

var scores_indicators = [goalJ1, goalJ2, goalJ3, goalJ4, gamJ1, gamJ2, gamJ3, gamJ4, betrayJ1, betrayJ2, betrayJ3, betrayJ4];


// Cast string number to integer
function int(element) {
    return parseInt(element.innerHTML);
}

// Return if team score is maximum (10)
function isMax(element) {
    if (int(element) < 10)
        return false;
    else
        return true;
}

// Return if team score is minimum (-10)
function isMin(element) {
    if (int(element) > -10)
        return false;
    else
        return true;
}

// Return if player score is correct (>0)
function isCorrect(element) {
    if (int(element) > 0)
        return true;
    else
        return false;
}

// Add +1 to a score
function add(element) {
    element.innerHTML = int(element) + 1;
}

// Substract -1 to a score
function minus(element) {
    element.innerHTML = int(element) - 1;
}


// Contains all logic for score changes conditions
function updateScore(team, type, change) {
    switch (team) {
        // ----------------- PLAYER 1 -----------------
        case "J1":
            switch (type) {
                case "goal":
                    switch (change) {
                        case "+":
                            if (!isMax(score1)) {
                                add(score1);
                                add(goalJ1);
                            }
                            break;

                        case "-":
                            if (!isMin(score1) && isCorrect(goalJ1)) {
                                minus(score1);
                                minus(goalJ1);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "gamelle":
                    switch (change) {
                        case "+":
                            if (!isMin(score2)) {
                                minus(score2);
                                add(gamJ1);
                            }
                            break;

                        case "-":
                            if (!isMax(score2) && isCorrect(gamJ1)) {
                                add(score2);
                                minus(gamJ1);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "betray":
                    switch (change) {
                        case "+":
                            if (!isMax(score2)) {
                                add(score2);
                                add(betrayJ1);
                            }
                            break;

                        case "-":
                            if (!isMin(score2) && isCorrect(betrayJ1)) {
                                minus(score2);
                                minus(betrayJ1);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                default:
                    break;

            }
            break;

            // ----------------- PLAYER 2 -----------------
        case "J2":
            switch (type) {
                case "goal":
                    switch (change) {
                        case "+":
                            if (!isMax(score1)) {
                                add(score1);
                                add(goalJ2);
                            }
                            break;

                        case "-":
                            if (!isMin(score1) && isCorrect(goalJ2)) {
                                minus(score1);
                                minus(goalJ2);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "gamelle":
                    switch (change) {
                        case "+":
                            if (!isMin(score2)) {
                                minus(score2);
                                add(gamJ2);
                            }
                            break;

                        case "-":
                            if (!isMax(score2) && isCorrect(gamJ2)) {
                                add(score2);
                                minus(gamJ2);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "betray":
                    switch (change) {
                        case "+":
                            if (!isMax(score2)) {
                                add(score2);
                                add(betrayJ2);
                            }
                            break;

                        case "-":
                            if (!isMin(score2) && isCorrect(betrayJ2)) {
                                minus(score2);
                                minus(betrayJ2);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                default:
                    break;

            }
            break;


            // ----------------- PLAYER 3 -----------------
        case "J3":
            switch (type) {
                case "goal":
                    switch (change) {
                        case "+":
                            if (!isMax(score2)) {
                                add(score2);
                                add(goalJ3);
                            }
                            break;

                        case "-":
                            if (!isMin(score2) && isCorrect(goalJ3)) {
                                minus(score2);
                                minus(goalJ3);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "gamelle":
                    switch (change) {
                        case "+":
                            if (!isMin(score1)) {
                                minus(score1);
                                add(gamJ3);
                            }
                            break;

                        case "-":
                            if (!isMax(score1) && isCorrect(gamJ3)) {
                                add(score1);
                                minus(gamJ3);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "betray":
                    switch (change) {
                        case "+":
                            if (!isMax(score1)) {
                                add(score1);
                                add(betrayJ3);
                            }
                            break;

                        case "-":
                            if (!isMin(score1) && isCorrect(betrayJ3)) {
                                minus(score1);
                                minus(betrayJ3);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                default:
                    break;

            }
            break;

            // ----------------- PLAYER 4 -----------------
        case "J4":
            switch (type) {
                case "goal":
                    switch (change) {
                        case "+":
                            if (!isMax(score2)) {
                                add(score2);
                                add(goalJ4);
                            }
                            break;

                        case "-":
                            if (!isMin(score2) && isCorrect(goalJ4)) {
                                minus(score2);
                                minus(goalJ4);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "gamelle":
                    switch (change) {
                        case "+":
                            if (!isMin(score1)) {
                                minus(score1);
                                add(gamJ4);
                            }
                            break;

                        case "-":
                            if (!isMax(score1) && isCorrect(gamJ4)) {
                                add(score1);
                                minus(gamJ4);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                case "betray":
                    switch (change) {
                        case "+":
                            if (!isMax(score1)) {
                                add(score1);
                                add(betrayJ4);
                            }
                            break;

                        case "-":
                            if (!isMin(score1) && isCorrect(betrayJ4)) {
                                minus(score1);
                                minus(betrayJ4);
                            }
                            break;

                        default:
                            break;

                    }
                    break;

                default:
                    break;

            }
            break;

        default:
            break;

    }
}


// Add event listener on all buttons
var buttons = document.getElementsByTagName('button');
for (i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
        if (this.id.split("|")[0] == "validate_button")
            validate();
        else if (this.id.split("|")[0] == "random_button") {
            // Get all choosen players
            var choosenPlayers = [document.getElementById("player1_input").options[document.getElementById("player1_input").selectedIndex].value,
                document.getElementById("player2_input").options[document.getElementById("player2_input").selectedIndex].value,
                document.getElementById("player3_input").options[document.getElementById("player3_input").selectedIndex].value,
                document.getElementById("player4_input").options[document.getElementById("player4_input").selectedIndex].value
            ];

            function shuffle(array) {
                var currentIndex = array.length,
                    temporaryValue, randomIndex;
                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                return array;
            }

            // Shuffle and replace players
            choosenPlayers = shuffle(choosenPlayers);
            $("#player1_input")[0].value = choosenPlayers[0];
            $("#player2_input")[0].value = choosenPlayers[1];
            $("#player3_input")[0].value = choosenPlayers[2];
            $("#player4_input")[0].value = choosenPlayers[3];

            updateButtons();
        } else {
            updateScore(this.id.split("|")[0], this.id.split("|")[1], this.id.split("|")[2]);
            // Display random button if scores are at 0
            for (var n = 0; n < scores_indicators.length; n++) {
                if (scores_indicators[n].innerHTML != 0) {
                    document.getElementById('random_button').style.display = 'none';
                    break;
                }
                document.getElementById('random_button').style.display = 'block';
            }
        }
    });
};




function validate() {

    // Get all inputs
    var inputs = [
        document.getElementById("player1_input"),
        document.getElementById("player2_input"),
        document.getElementById("player3_input"),
        document.getElementById("player4_input")
    ];

    // Clear color for all inputs
    for (var i = 0; i < inputs.length; i++) {
        $("#" + inputs[i].id).removeClass("is-invalid");
        document.getElementsByClassName("score_border").item(0).style.borderColor = "rgb(121, 121, 121)";
        document.getElementsByClassName("score_border").item(1).style.borderColor = "rgb(121, 121, 121)";
    }

    // Check for errors
    var errorFlag = false;
    if ((inputs[0].options[inputs[0].selectedIndex].value == "" && inputs[1].options[inputs[1].selectedIndex].value == "") ||
        (inputs[2].options[inputs[2].selectedIndex].value == "" && inputs[3].options[inputs[3].selectedIndex].value == "") ||
        ((int(score1) == 0) && (int(score2) == 0))) {
        // ((int(score1) == 10) && (int(score2) == 10)) ||
        // ((int(score1) != 10) && (int(score2) != 10))) {

        if ((inputs[0].options[inputs[0].selectedIndex].value == "" && inputs[1].options[inputs[1].selectedIndex].value == "")) {
            $("#player1_input").addClass("is-invalid");
            $("#player2_input").addClass("is-invalid");
        }
        // if (((int(score1) == 10) && (int(score2) == 10)) ||
        //     ((int(score1) != 10) && (int(score2) != 10))) {
        if ((int(score1) == 0) && (int(score2) == 0)) {
            document.getElementsByClassName("score_border").item(0).style.borderColor = "rgb(194, 57, 57)";
            document.getElementsByClassName("score_border").item(1).style.borderColor = "rgb(194, 57, 57)";
        }
        if ((inputs[2].options[inputs[2].selectedIndex].value == "" && inputs[3].options[inputs[3].selectedIndex].value == "")) {
            $("#player3_input").addClass("is-invalid");
            $("#player4_input").addClass("is-invalid");
        }

        // Exit method if error(s)
        errorFlag = true;
    }

    inputsValues = [];
    for (var i = 0; i < inputs.length; i++) {
        inputsValues.push(inputs[i].options[inputs[i].selectedIndex].value);
    }

    for (a = 0; a < inputsValues.length; a++) {
        for (b = a + 1; b < inputsValues.length; b++) {
            if (inputsValues[a] == inputsValues[b] && inputsValues[a] != "") {
                $("#player" + (a + 1) + "_input").addClass("is-invalid");
                $("#player" + (b + 1) + "_input").addClass("is-invalid");
                errorFlag = true;
            }
        }
    }
    if (errorFlag)
        return;



    // Disable button while match not added
    document.getElementById("validate_button").disabled = true;
    document.getElementById("validate_button").innerHTML = "<i class=\"fas fa-circle-notch fa-spin\"></i>";


    // Get active season then publish match to database
    db.collection("seasons")
        .where("active", "==", true)
        .limit(1)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // Create match object
                var reported_match = {
                    player1: inputs[0].options[inputs[0].selectedIndex].value,
                    player2: inputs[1].options[inputs[1].selectedIndex].value,
                    player3: inputs[2].options[inputs[2].selectedIndex].value,
                    player4: inputs[3].options[inputs[3].selectedIndex].value,
                    score1: int(score1),
                    score2: int(score2),
                    player1_goals: int(goalJ1),
                    player2_goals: int(goalJ2),
                    player3_goals: int(goalJ3),
                    player4_goals: int(goalJ4),
                    player1_gamelles: int(gamJ1),
                    player2_gamelles: int(gamJ2),
                    player3_gamelles: int(gamJ3),
                    player4_gamelles: int(gamJ4),
                    player1_betray: int(betrayJ1),
                    player2_betray: int(betrayJ2),
                    player3_betray: int(betrayJ3),
                    player4_betray: int(betrayJ4),
                    number: 0, // number and invert_number are used to sort data from database
                    invert_number: 0,
                    season: doc.id,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };


                // Publish to Database
                db.collection("matches")
                    .orderBy("number")
                    .get()
                    .then(function(documentSnapshots) {
                        // Get the last visible document (= last match played)
                        var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

                        reported_match["number"] = (parseInt(lastVisible.id.split("match")[1]) + 1);
                        reported_match["invert_number"] = -(parseInt(lastVisible.id.split("match")[1]) + 1);

                        db.collection("matches")
                            .doc("match" + (parseInt(lastVisible.id.split("match")[1]) + 1))
                            .set(reported_match)
                            .then(function(docRef) {

                                // Choose a quote
                                var goal_type = [];
                                var high_low = Math.random() >= 0.5; // true = max, false = min

                                // Get all players scores
                                var players = [];
                                for (var i = 0; i < inputs.length; i++) {
                                    var nb = inputs[i].id.split("player")[1].split("_")[0];
                                    if (inputs[i].value != "")
                                        players.push([
                                            inputs[i],
                                            parseInt($("#goalJ" + nb + "score")[0].innerHTML),
                                            parseInt($("#gamelleJ" + nb + "score")[0].innerHTML),
                                            parseInt($("#betrayJ" + nb + "score")[0].innerHTML)
                                        ]);
                                }

                                // Check which type of goals have been added to the match
                                for (var i = 0; i < players.length; i++) {
                                    if (players[i][1] != 0 && !goal_type.includes("goal")) {
                                        goal_type.push("goal");
                                    }
                                    if (players[i][2] != 0 && !goal_type.includes("gamelle")) {
                                        goal_type.push("gamelle");
                                    }
                                    if (players[i][3] != 0 && !goal_type.includes("betray")) {
                                        goal_type.push("betray");
                                    }
                                }

                                quote = "Le match a bien été enregistré !";

                                switch (goal_type[Math.floor(Math.random() * goal_type.length)]) {
                                    case "goal": // sort with goals
                                        players.sort(function(a, b) {
                                            if (a[1] === b[1]) {
                                                return 0;
                                            } else {
                                                return (a[1] < b[1]) ? (high_low ? 1 : -1) : (high_low ? -1 : 1);
                                            }
                                        });

                                        if (high_low)
                                            quote = "Woah ! " + players[0][0].value.split(" ")[0] +
                                            " est en grande forme aujourd'hui avec ses " +
                                            players[0][1] +
                                            " points <i class=\"em em-open_mouth\"></i>";
                                        else
                                            quote = players[0][0].value.split(" ")[0] +
                                            ", faut dormir plus la nuit <i class=\"em em-smiling_face_with_smiling_eyes_and_hand_covering_mouth\"></i>";
                                        break;

                                    case "gamelle": // sort with gamelles
                                        players.sort(function(a, b) {
                                            if (a[2] === b[2]) {
                                                return 0;
                                            } else {
                                                return (a[2] < b[2]) ? (high_low ? 1 : -1) : (high_low ? -1 : 1);
                                            }
                                        });

                                        if (players[0][2] != 0) {
                                            if (players[0][2] > 1) { // If there was more than 1 gamelles
                                                quote = players[0][0].value.split(" ")[0] +
                                                    " a le poignet en feu avec ses " +
                                                    players[0][2] +
                                                    " gamelles <i class=\"em em-clap\"></i>";
                                            } else { // If there was just 1 gamelle
                                                quote = "Bravo " +
                                                    players[0][0].value.split(" ")[0] +
                                                    " pour cette exceptionnelle gamelle <i class=\"em em-open_mouth\"></i>";
                                            }
                                        } else {
                                            if (high_low)
                                                quote = "Pas de gamelle aujourd'hui ? <i class=\"em em-cry\"></i>";
                                            else {
                                                if (players[players.length - 1][2] > 1) { // If there was more than 1 gamelles
                                                    quote = players[players.length - 1][0].value.split(" ")[0] +
                                                        " a le poignet en feu avec ses " +
                                                        players[players.length - 1][2] +
                                                        " gamelles <i class=\"em em-clap\"></i>";
                                                } else { // If there was just 1 gamelle
                                                    quote = "Bravo " +
                                                        players[players.length - 1][0].value.split(" ")[0] +
                                                        " pour cette exceptionnelle gamelle <i class=\"em em-open_mouth\"></i>";
                                                }
                                            }
                                        }
                                        break;

                                    case "betray": // sort with betrays
                                        players.sort(function(a, b) {
                                            if (a[3] === b[3]) {
                                                return 0;
                                            } else {
                                                return (a[3] < b[3]) ? (high_low ? 1 : -1) : (high_low ? -1 : 1);
                                            }
                                        });


                                        if (players[0][3] != 0) {
                                            if (players[0][3] > 1) { // If there was more than 1 betrays
                                                quote = "Une ovation pour " +
                                                    players[0][0].value.split(" ")[0] +
                                                    " et ses " +
                                                    players[0][3] +
                                                    " buts contre son camp <i class=\"em em-upside_down_face\"></i>";
                                            } else { // If there was just 1 betray
                                                quote = "Bravo la trahison " +
                                                    players[0][0].value.split(" ")[0] +
                                                    " <i class=\"em em-anguished\"></i>";
                                            }
                                        } else
                                            quote = "L'avant-bras de " +
                                            players[0][0].value.split(" ")[0] +
                                            " est plus gros qu'hier non ? <i class=\"em em-fist\"></i><i class=\"em em-smirk\"></i>";
                                        break;
                                    default:
                                        break;
                                }


                                swal({
                                    toast: true,
                                    position: 'bottom-start',
                                    showConfirmButton: false,
                                    timer: 6000,
                                    title: quote,
                                    type: 'success',
                                    showConfirmButton: true,
                                    confirmButtonText: "<i class='em em-trophy m-2' style='font-size: 1.75rem;'></i>"
                                }).then(function(result) {
                                    // if (result.dismiss)
                                    //     console.log("dismiss");
                                    // else
                                    if (result.value) {
                                        swal({
                                            title: 'Variations d\'ELO',
                                            html: 'Ici seront affiché les changements d\'ELOs',
                                            showCloseButton: true,
                                            showCancelButton: false,
                                            confirmButtonColor: '#3ab02b',
                                            confirmButtonClass: 'btn btn-success mr-1'
                                        });
                                    }
                                });

                                setTimeout(function() {
                                    document.getElementById("validate_button").disabled = false;
                                    document.getElementById("validate_button").innerHTML = "Valider";
                                    var indicators = document.getElementsByClassName("score_indicator");
                                    for (i = 0; i < indicators.length; i++)
                                        indicators[i].innerHTML = 0;

                                    for (var i = 0; i < inputs.length; i++) {
                                        $("#" + inputs[i].id).removeClass("is-invalid");
                                        inputs[i].value = "";
                                    }

                                    updateButtons();

                                    document.getElementById('random_button').style.display = 'block'
                                    document.getElementById("shuffle_container").style.display = "block";
                                    document.getElementById("score_indicators").style.display = "none";
                                }, 500);
                            })
                    });
            });
        });
}






var begin_template = '<div class="container">' +
    '<div class="row align-items-center" id="container_row">' +
    '<div class="col-12 col-xl-10 offset-xl-1" id="sw_container">';

function addPlayerCheckbox(name, n) {
    return '<div class="container mt-2">' +
        '<div class="row">' +
        '<span class="switch switch-lg">' +
        '<input type="checkbox" class="switch" id="sw_id' + n + '"></input>' +
        '<label for="sw_id' + n + '" id="sw_name_id' + n + '">' + name + '</label>' +
        '</div>' +
        '</div>' +
        '<hr/>';
}

var end_template = '</div>' +
    '</div>' +
    '</div>'

var borders_template = begin_template + end_template;



// --------------- Shuffle button listener ---------------
document.getElementById("shuffle_button").addEventListener("click", function() {
    swal({
        title: 'Selectionnez les joueurs',
        html: '<div id="swal_container_custom"></div>',
        showCloseButton: true,
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonClass: 'btn btn-success ml-1 btn-lg',
        cancelButtonClass: 'btn btn-danger mr-1 btn-lg',
        buttonsStyling: false,
        confirmButtonText: 'Let\'s <i class="em em-soccer"></i>',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
        onOpen: () => {
            $("#swal_container_custom")[0].innerHTML = '<i class="fas fa-circle-notch fa-spin" style="font-size: 2rem;"></i>';

            db.collection("matches").orderBy('invert_number').limit(1).get().then(function(querySnapshot) {
                if (querySnapshot.docs != undefined)
                    var last_players = [querySnapshot.docs[0].data().player1, querySnapshot.docs[0].data().player2, querySnapshot.docs[0].data().player3, querySnapshot.docs[0].data().player4];
                else
                    var last_players = ['x', 'x', 'x', 'x'];

                // Get players from database and display it when ready
                db.collection("players")
                    .orderBy("team")
                    .get()
                    .then(function(querySnapshot) {
                        var n = 0;
                        $("#swal_container_custom")[0].innerHTML = borders_template;
                        var team_name = "";
                        var player_buffer = [];
                        querySnapshot.forEach(function(doc) {
                            if (!doc.data().isActive)
                                return;
                            if (team_name == "") {
                                team_name = doc.data().team;
                                $("#sw_container")[0].insertAdjacentHTML('beforeend', '<h2 class="mt-3">' + team_name + '</h2>'); // insert team name in swal
                            } else if (team_name != doc.data().team) {
                                // Sort and place sorted players in swal (1 team)
                                player_buffer.sort();
                                for (var i = 0; i < player_buffer.length; i++) {
                                    // Insert markers for players who played in last match
                                    for (var l = 0; l < last_players.length; l++) {
                                        if (player_buffer[i] == last_players[0] || player_buffer[i] == last_players[1])
                                            player_buffer[i] += ' <i class="em em-large_blue_circle mb-1" style="font-size: 0.75rem;"></i>';
                                        else if (player_buffer[i] == last_players[2] || player_buffer[i] == last_players[3])
                                            player_buffer[i] += ' <i class="em em-red_circle mb-1" style="font-size: 0.75rem;"></i>';
                                    }
                                    $("#sw_container")[0].insertAdjacentHTML('beforeend', addPlayerCheckbox(player_buffer[i], n++));
                                }
                                player_buffer = [];
                                team_name = doc.data().team;
                                $("#sw_container")[0].insertAdjacentHTML('beforeend', '<h2 class="mt-3">' + team_name + '</h2>');
                            }
                            player_buffer.push(doc.data().name);
                        })

                        // Sort and place sorted players in swal for the last team
                        player_buffer.sort(); // sort players
                        for (var i = 0; i < player_buffer.length; i++) {
                            // Insert markers for players who played in last match
                            for (var l = 0; l < last_players.length; l++) {
                                if (player_buffer[i] == last_players[0] || player_buffer[i] == last_players[1])
                                    player_buffer[i] += ' <i class="em em-large_blue_circle mb-1" style="font-size: 0.75rem;"></i>';
                                else if (player_buffer[i] == last_players[2] || player_buffer[i] == last_players[3])
                                    player_buffer[i] += ' <i class="em em-red_circle mb-1" style="font-size: 0.75rem;"></i>';
                            }
                            $("#sw_container")[0].insertAdjacentHTML('beforeend', addPlayerCheckbox(player_buffer[i], n++));
                        }
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                        swal.showValidationError('Un petit problème est survenu ... Nos meilleurs ingénieurs sont sur le coup !');
                    });
            });
        },
        preConfirm: () => {
            var names = [];
            // PUT HERE ALL CONDITIONS

            // Get all names from swal
            $('[id*="sw_id"]').each(function() {
                if (!this.checked) {

                } else {
                    names.push($("#sw_name_id" + this.id.split("sw_id")[1])[0].innerHTML.split(' <i')[0]);
                }
            })

            // If less than 2 players are selected
            if (names.length < 2)
                swal.showValidationError('Veuillez selectionner au moins 2 joueurs <i class=\"em em-v\"></i>');
            // If only 2 players are selected
            else if (names.length == 2) {
                $("#player1_input")[0].value = names[0];
                $("#player3_input")[0].value = names[1];
                document.getElementById("shuffle_container").style.display = "none";
                document.getElementById("score_indicators").style.display = "block";
            }
            // If 3 or more players are selected
            else {
                // Request to Statistiques HERE
                $('select[id*="_input"][id*="player"]').each(function() {
                    if (names.length == 0)
                        return; // if only 3 players have been selected, exit function if names array is empty
                    var rand_nb = Math.floor(Math.random() * names.length);
                    this.value = names[rand_nb]; // place random name in select element
                    names.splice(rand_nb, 1); // remove name from array
                });
                document.getElementById("shuffle_container").style.display = "none";
                document.getElementById("score_indicators").style.display = "block";
            }
            updateButtons();
        }
    })
});
// -------------------------------------------------------



// Listener if players have been added
$("select").change(function() {
    var sel_player = 0;
    $('select[id*="_input"][id*="player"]').each(function() {
        if (this.value != "")
            sel_player++;
    });

    if (sel_player < 2) {
        document.getElementById("shuffle_container").style.display = "block";
        document.getElementById("score_indicators").style.display = "none";
    } else {
        document.getElementById("shuffle_container").style.display = "none";
        document.getElementById("score_indicators").style.display = "block";
    }

    updateButtons();
});



function updateButtons() {
    // Get all players selected
    var inputs = [
        document.getElementById("player1_input").value,
        document.getElementById("player2_input").value,
        document.getElementById("player3_input").value,
        document.getElementById("player4_input").value
    ];

    for (j = 0; j < inputs.length; j++) {
        // For each one, check if there is one
        var nb = j + 1;
        var buttons = $('[id*="J' + nb + '|"]');

        // Activate or disable buttons
        for (i = 0; i < buttons.length; i++) {
            if (inputs[j] != "") {
                buttons[i].disabled = false;
            } else {
                buttons[i].disabled = true;
            }
        }
    }
}




[].forEach.call(document.getElementsByClassName('debug_hide'), function(el) {
    el.style.display = 'none';
});



var begin = '<div class="container">' +
    '<div class="row align-items-center" id="container_row">' +
    '<div class="col-12 col-xl-10 offset-xl-1" id="sw_container">';

function addPlayerChooser(name, n) {
    return '<div class="container mt-2">' +
        '<div class="row">' +
        '<span class="switch switch-lg">' +
        '<input type="checkbox" class="switch" id="sw_id' + n + '"></input>' +
        '<label for="sw_id' + n + '" id="sw_name_id' + n + '">' + name + '</label>' +
        '</div>' +
        '</div>' +
        '<hr/>';
}

var end = '</div>' +
    '</div>' +
    '</div>'

var bt = begin + end;

// document.getElementById('player_placeholder').addEventListener('click', function(event) {
//     console.log('coucou');
// });

var fetchedPlayers = {};

document.getElementById('debug_button2').addEventListener('click', function() {
    swal({
        title: 'Selectionnez les joueurs',
        html: '<div id="swal_container_choose" class="row"></div>',
        showCloseButton: true,
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonClass: 'btn btn-success ml-1 btn-lg',
        cancelButtonClass: 'btn btn-danger mr-1 btn-lg',
        buttonsStyling: false,
        confirmButtonText: 'Let\'s <i class="em em-soccer"></i>',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
        onOpen: () => {
            $("#swal_container_choose")[0].innerHTML = '<i class="fas fa-circle-notch fa-spin col-12" style="font-size: 3rem;"></i>';

            var player_element_template = document.getElementById('player_placeholder').cloneNode(true);

            db.collection("players")
                .where("isActive", "==", true)
                // .orderBy("team")
                .get()
                .then(function(querySnapshot) {

                    $("#swal_container_choose")[0].innerHTML = '';

                    querySnapshot.forEach(function(doc) {
                        fetchedPlayers[doc.id] = doc.data();





                    });

                    // Tri
                    var teamSet = new Set();

                    for (var p in fetchedPlayers) {
                        teamSet.add(fetchedPlayers[p].team);
                    }
                    console.log(teamSet);
                    var sortedPlayers = {};
                    for (var t of teamSet) {
                        sortedPlayers[t] = {};
                        for (var p in fetchedPlayers) {
                            if (fetchedPlayers[p].team === t)
                                sortedPlayers[t][p] = fetchedPlayers[p];
                        }

                        // Teams are sorted

                        var arr = [];

                        for (var i in sortedPlayers[t]) {
                            arr.push([t, i, sortedPlayers[t][i]]);
                        }

                        arr.sort(function(a, b) {
                            if (a[2].name === b[2].name) {
                                return 0;
                            } else {
                                return a[2].name > b[2].name;
                            }
                        });

                        console.log(arr);

                        $("#swal_container_choose")[0].innerHTML += '<h2 class="col-12">' + arr[0][0] + '</h2>';
                        for (var a=0 ; a<arr.length; a++) {
                            player_element_template.id = arr[a][1];
                            player_element_template.querySelector('.pic').id = arr[a][1] + '_pic';
                            // player_element_template.style.minHeight = '95px';
                            if (arr[a][2].photoURL != null)
                                player_element_template.querySelector('.pic').src = arr[a][2].photoURL;
                            else
                                player_element_template.querySelector('.pic').src = 'blank_profile.png';
                                player_element_template.querySelector('.player_selector_name').innerHTML = arr[a][2].name;
                                $("#swal_container_choose")[0].innerHTML += player_element_template.outerHTML;
                        }
                        $("#swal_container_choose")[0].innerHTML += '<div class="col-12 mb-2"/>';
                    }



                    // Get all player selectors
                    var elements = $("#swal_container_choose")[0].children;

                    for (var e = 0; e < elements.length; e++) {
                        // Display it
                        elements[e].style.display = 'block';
                        // Add click listener
                        elements[e].addEventListener('click', function(event) {
                            var player_container = event.target.closest('.player_placeholder');
                            var actualOpacity = player_container.querySelector('.overlay').style.opacity;
                            if (actualOpacity < 0.75) {
                                player_container.querySelector('.overlay').style.opacity = 0.75;
                                player_container.classList.add('player_selected');
                            } else {
                                player_container.querySelector('.overlay').style.opacity = 0;
                                player_container.classList.remove('player_selected');
                            }

                            $('#' + player_container.id + ' .pic').animate({width: "95%"}, 35, function() {
                                $(this).animate({width: "100%"}, 35);
                            });
                            // $('#' + player_container.querySelector('.pic').id + '.validator').animate({width: "95%"}, 200, function() {
                            //     $(this).animate({width: "100%"}, 200);
                            // });
                            // player_container.animate([
                            //   // keyframes
                            //   { transform: 'translateY(0px)' },
                            //   { transform: 'translateY(-300px)' }
                            // ], {
                            //   // timing options
                            //   duration: 1000
                            // });
                        })
                    }
                });
        },
        preConfirm: () => {
            for (var t of document.getElementsByClassName('player_selected')) {
                console.log(t.id);
            }

        }
    });
});
