(function () {
    "use strict";

    const items = ["🌸", "💖", "🎀", "🌷", "💘", "🌺", "🐷", "💋"]; 
    
    document.querySelector('.info').textContent = items.join(" "); 

    const doors = document.querySelectorAll(".door"); // Initializes a variable to keep track of the number of wins/lossCount and allowing 3 chances
    let winCount = 0;
    let lossCount = 0;
    let chances = 3; 

//Select HTML element with ID 'winCount/loss' and store the reference
    const winCountDisplay = document.querySelector('#winCount'); 
    const lossCountDisplay = document.querySelector('#lossCount');

    winCountDisplay.textContent = winCount;
    lossCountDisplay.textContent = lossCount;

    const machineSound = document.getElementById('machineSound');

    document.querySelector("#spinner").addEventListener("click", spin);
    document.querySelector("#reseter").addEventListener("click", reset);
    const resetScoreButton = document.getElementById('resetScore');
    resetScoreButton.addEventListener('click', resetScore);

    // Function to handle the spin of the slot machine
    function spin() {
        if (chances > 0) {
    // Initialize the spinning animation
            init(false, 1, 2);

            for (const door of doors) {
                const boxes = door.querySelector(".boxes");
                const duration = parseInt(boxes.style.transitionDuration);
                boxes.style.transform = "translateY(0)";
            }

            const result = checkResult();

            if (result) {
                displayWin();
            } else {
     // Delay the display of loss message by 2000 milliseconds (2 seconds)
                setTimeout(displayLoss, 2000); 
            }

            chances--; 
        }

     // Disable the spinner button when chances are zero - only have 3 chances
        if (chances === 0) {
            document.querySelector("#spinner").disabled = true; 
            document.querySelector('.info').textContent = "Game Over!"; 
        }

        machineSound.play(); 
    }

    function checkResult() {
        const firstEmoji = doors[0].querySelector(".box").textContent;

         // Check if all doors have the same emoji
        const allDoorsSame = [...doors].every(door => {
            const emoji = door.querySelector(".box").textContent;
            return emoji === firstEmoji;
        });

        return allDoorsSame;
    }


//display win message

    function displayWin() {
        winCount++;
        winCountDisplay.textContent = winCount;
        
        const infoText = document.querySelector('.info');
        infoText.textContent = "You're lucky! You Win!";
        infoText.style.color = '#000';  
        infoText.style.textShadow = "0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4";
    }
    
// display loose message    
    function displayLoss() {
        lossCount++;
        lossCountDisplay.textContent = lossCount;
    
        const infoText = document.querySelector('.info');
        infoText.textContent = "Sorry, You're not so lucky. Try Again!";
        infoText.style.color = '#000';  
        infoText.style.textShadow = "0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4";
    }
    //initating the spin animation
    function init(firstInit = true, groups = 1, duration = 1) {
        for (const door of doors) {
     // Set 'dataset.spinned' attribute to "0" for first initialization
            if (firstInit) {
                door.dataset.spinned = "0";
            } else if (door.dataset.spinned === "1") {
                return;
            }

            const boxes = door.querySelector(".boxes");
            const boxesClone = boxes.cloneNode(false);
            const pool = ["👄"];

            if (!firstInit) {
                const arr = [];
                for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                    arr.push(...items);
                }

                pool.push(...shuffle(arr));

                boxesClone.addEventListener(
                    "transitionstart",
                    function () {
                        door.dataset.spinned = "1";
                        this.querySelectorAll(".box").forEach((box) => {
                            
                        });
                    },
                    { once: true }
                );

                boxesClone.addEventListener(
                    "transitionend",
                    function () {
                        this.querySelectorAll(".box").forEach((box, index) => {
                            if (index > 0) this.removeChild(box);
                        });
                    },
                    { once: true }
                );

         // Create boxes with shuffled emojis
                for (let i = pool.length - 1; i >= 0; i--) {
                    const box = document.createElement("div");
                    box.classList.add("box");
                    box.style.width = door.clientWidth + "px";
                    box.style.height = door.clientHeight + "px";
                    boxesClone.appendChild(box);
                    box.textContent = pool[i];
                }
            // What makes the emojis actually spin
                boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
                boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
                door.replaceChild(boxesClone, boxes);
            }
        }

        function shuffle([...arr]) {
            let m = arr.length;
            while (m) {
                const i = Math.floor(Math.random() * m--);
                [arr[m], arr[i]] = [arr[i], arr[m]];
            }
            return arr;
        }
    }

    function reset() {
        for (const door of doors) {
            const boxes = door.querySelector(".boxes");
            const boxesClone = boxes.cloneNode(false);
            const resetBox = document.createElement("div");
            resetBox.classList.add("box");
            resetBox.style.width = door.clientWidth + "px";
            resetBox.style.height = door.clientHeight + "px";
            boxesClone.appendChild(resetBox);
            resetBox.textContent = "👄";
            door.dataset.spinned = "0";
            door.replaceChild(boxesClone, boxes);
            const spinnerButton = document.querySelector("#spinner");
            spinnerButton.addEventListener("click", function removeEmoji() {
                door.replaceChild(boxes, boxesClone);
                spinnerButton.removeEventListener("click", removeEmoji);
            });
        }

        document.querySelector('.info').textContent = "";
    }

// Function to reset win and loss counts, chances, and enable spinner button
    function resetScore() {
        winCount = 0;
        lossCount = 0;
        winCountDisplay.textContent = winCount;
        lossCountDisplay.textContent = lossCount;
        chances = 3; 
        document.querySelector("#spinner").disabled = false; //the player can initiate a new spin after resetting the scores.
        document.querySelector('.info').textContent = ""; 
    }

    init();
})();
