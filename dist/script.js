$(document).ready(function() {
    $(".box").fadeTo(0, .75);

    
//Generates a randoms sequence to be used for the game
    var sequenceFinder = function() {
        //Generates a list of random numbers from 1 through 4
        var randomNumGenerator = function() {
            var randomNumbers = [];
            while (randomNumbers.length < 20) {
                randomNumbers.push(Math.floor((Math.random() * 4) + 1));
            }
            return randomNumbers;
        };

        //Assigns number to a given color
        var numToColor = function (numbers) {
            return numbers.map(function(obj){
                switch(obj) {
                    case 1:
                        return "red";
                        break;
                    case 2:
                        return "green";
                        break;
                    case 3:
                        return "yellow";
                        break;
                    case 4:
                        return "blue";
                        break;
                }
            })
        };
        randomNumbers = randomNumGenerator();
        return {
            numbers: randomNumbers,
            colors: numToColor(randomNumbers)
        }
    }
    //Assigns a number to a given color
    var colorToNum = function (color) {
        switch(color) {
                    case "red":
                        return 1;
                        break;
                    case "green":
                        return 2;
                        break;
                    case "yellow":
                        return 3;
                        break;
                    case "blue":
                        return 4;
                        break;
                }
    }
    
    var game = {
        counter: 0,
        sequence: [],
        playerMoves: [],
        strict: false,
        inProgress: false,
        correctTries: 0,
        playSequencing: false
    }

    game.start = function() {
        if (game.inProgress === false) {
            game.reset();
            game.inProgress = true;
            playSequence();
        }
    }

    game.reset = function() {
        game.counter = 0;
        game.correctTries = 0;
        game.inProgress = false;
        game.playerMoves = [];
        game.sequence = sequenceFinder();
        game.playSequencing = false;
        $("#red, #green, #yellow, #blue").removeClass("boxactive");
        $(".status").css("display", "none");
        $("#counter").text(game.counter).css("background-color", "rgba(211, 224, 211, 1)");

    }

    //Plays the sequence up to the counter
    //setTimeout and for loop reference - http://brackets.clementng.me/post/24150213014/example-of-a-javascript-closure-settimeout-inside
    function playSequence() {
        if (game.inProgress === true && game.playSequencing === false) {
            game.playSequencing = true;
            function playSeq2(k) {
                setTimeout(
                    function() {
                        $("#" + game.sequence.colors[k]).fadeTo(0, .75);
                        $("#" + game.sequence.colors[k]).removeClass(".boxactive");
                    }, 500)
            }
            for (i = 0; i <= game.counter; i++) {
                if (game.inProgress === true) {
                    setTimeout(
                        function(x) {
                            return function() {
                                $("#" + game.sequence.colors[x]).fadeTo(0, 1);
                                $("#" + game.sequence.colors[x]).addClass("boxactive");
                                new Audio("https://s3.amazonaws.com/freecodecamp/simonSound" + game.sequence.numbers[x] + ".mp3").play();
                                playSeq2(x)
                            }
                        }(i), 1000 * i);
                }
                game.correctTries = 0;
                setTimeout(function() {
                    game.playSequencing = false;
                }, game.counter * 1000);
            }
        }
    }

    function checkSequence(x) {
        if (game.inProgress === true) {
            if (game.correctTries < game.counter + 1) {
                if (x == game.sequence.colors[game.correctTries]) {
                    game.correctTries++;
                    if (game.correctTries > game.counter) {
                        if (game.correctTries > 19) { //Win case
                            $(".status").css("display", "block");
                        } else { //Succesfull series of clicks
                            game.counter++;
                            $("#counter").text(game.counter).css("background-color", "rgba(0, 245, 20, 0.35)")
                            setTimeout(function() {
                                playSequence()
                            }, 1000);
                        }
                    }
                } else if (game.strict === true) { //If strict is on start game over
                    game.start();
                } else { //Else start the same sequence
                    $("#counter").css("background-color", "rgba(255, 100, 100, .80)")
                    setTimeout(function() {
                        playSequence()
                    }, 500);
                }
            }
        }
    }
    
    function setStrict() {
        if (!game.strict) {
            game.strict = true;
            $("#strict").css("background-color", "rgba(255, 255, 255, .50)");
        } else if (game.strict) {
            game.strict = false;
            $("#strict").css("background-color", "rgba(211, 224, 211, 1)");
        }
    }
    
    //Click start
    $("#start").click(function() {
        game.start();
    });

    //Click reset
    $("#reset").click(function() {
        game.reset();
    });

    //Click strict
    $("#strict").click(function() {
        setStrict();
    });

    //Clicking a color
    $("#red, #green, #yellow, #blue").mousedown(function() {
        if (!game.playSequencing && game.inProgress) {
            $(this).addClass("");
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound" + colorToNum($(this).attr("id")) + ".mp3").play();
        }
    });
    $("#red, #green, #yellow, #blue").click(function() {
        if (game.playSequencing === false) {
            $(this).removeClass(".boxactive");
            checkSequence(this.id);
        }
    });

})