(function () {
    "use strict";

    // Define the array of emojis
    const items = [
        "🌸",
        "💖",
        "🎀",
        "🌷",
        "💘",
        "🌺",
        "🐷",
        "💋",
    ];

    // Display emojis in the information section where it's places in the HTML
    document.querySelector('.info').textContent = items.join(" ");

    // Define doors variable to store the door elements
    const doors = document.querySelectorAll(".door");

    //  these var will keep track of wins and losses
    let winCount = 0;
    let lossCount = 0;

    // Define score display elements so they player can see it below the boxes!
    const winCountDisplay = document.querySelector('#winCount');
    const lossCountDisplay = document.querySelector('#lossCount');

    // Update the initial score display
    winCountDisplay.textContent = winCount;
    lossCountDisplay.textContent = lossCount;

    // Define spinner and reset button event listeners
    document.querySelector("#spinner").addEventListener("click", spin);
    document.querySelector("#reseter").addEventListener("click", reset);

    // select the HTML with id to reset the score Define reset score button event listener
    const resetScoreButton = document.getElementById('resetScore');
    resetScoreButton.addEventListener('click', resetScore);

    // Define spin function-async will return a promise
    async function spin() {
        // Call init function with parameters for animation
        init(false, 1, 2);

        // For each door, animate the door boxes to simulate spinning
        for (const door of doors) {
            // Get the boxes element within the current door using "querySelector"
            const boxes = door.querySelector(".boxes");

            // Get the transition duration of the boxes element
            const duration = parseInt(boxes.style.transitionDuration);

            // Set the transform property of the boxes element to translate along the Y-axis by 0 pixels
            //preparing for spinning effect 
            boxes.style.transform = "translateY(0)";
    
        }

        // Check the result of the spin using checkResult function
        const result = checkResult();
        // If all doors have the same emoji, display winning message
        if (result) {
            displayWin();
        } else {
            // If doors have different emojis, display losing message
            displayLoss();
        }
    }

    // Define checkResult function
    function checkResult() {


        // check the emoji from the first door
        const firstEmoji = doors[0].querySelector(".box").textContent;

        // Check if all doors have the same emoji 'spread' 
        const allDoorsSame = [...doors].every(door => {
            const emoji = door.querySelector(".box").textContent;
            return emoji === firstEmoji;
        });

        return allDoorsSame; // Return true if all doors are the same, which means a win
                             // Return false if doors have different emojis
    }

    // Define displayWin function
    function displayWin() {
        winCount++;
        winCountDisplay.textContent = winCount;
        document.querySelector('.info').textContent = "You're lucky! You Win!";
    }

    // Define displayLoss function
    function displayLoss() {
        lossCount++;
        lossCountDisplay.textContent = lossCount;
        document.querySelector('.info').textContent = "Sorry, You're not so lucky. Try Again!";
    }

    // Define init function with optional parameters (firstInit, groups, duration)
    function init(firstInit = true, groups = 1, duration = 1) {
        // For each door
        for (const door of doors) {
            // If it's the first initialization or the door hasn't been spun yet
            if (firstInit) {
                door.dataset.spinned = "0";
            } else if (door.dataset.spinned === "1") {
                return; // Return to prevent reinitialization
            }

            // Find the first element inside the 'door' element with the class 'boxes'
            const boxes = door.querySelector(".boxes");
        // Create a copy of the 'boxes' element without copying its children
            const boxesClone = boxes.cloneNode(false);

            // Create a pool array with a placeholder emoji "👄" so it can always show when reset
            const pool = ["👄"];

            // If it's not true
            if (!firstInit) {
                // Shuffle and push emojis from items array into the pool
                const arr = [];
                for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                //The loop continues as long as n is less than the value inside the parentheses. each time n will be increaed by 1 ++

                //in the () the (? :) is what  checks if groups is greater than 0.
                    arr.push(...items);
                }

                pool.push(...shuffle(arr));
                // shuffling the elements in the array.


                // Add an event listener to 'boxesClone' for the 'transitionstart' event
                boxesClone.addEventListener(
                    "transitionstart",
                    function () {
                        // When the transition starts, do the following:
                         // Set the 'spinned' attribute of the 'door' to "1"
                        door.dataset.spinned = "1";
                        this.querySelectorAll(".box").forEach((box) => {
                            //box.style.filter = "blur(1px)";
                        });
                    },
                    { once: true }
                );
                
                boxesClone.addEventListener(
                    "transitionend",
                    function () {
                        this.querySelectorAll(".box").forEach((box, index) => {
                            //box.style.filter = "blur(0)";
                            if (index > 0) this.removeChild(box);
                        });
                    },
                    { once: true }
                );

                // Replace the current boxes with the cloned boxes with emojis
                for (let i = pool.length - 1; i >= 0; i--) {
                    const box = document.createElement("div");
                    box.classList.add("box");
                    box.style.width = door.clientWidth + "px";
                    box.style.height = door.clientHeight + "px";
                    boxesClone.appendChild(box);
                    box.textContent = pool[i];
                }

                // Set transition duration and animate the boxes to simulate spinning
                boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
                // Move the cloned boxes upward to simulate spinning
                boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
                // Replace the original boxes with the cloned boxes
                door.replaceChild(boxesClone, boxes);
            }
        }

        // Shuffle function to shuffle an array
        function shuffle([...arr]) {
            let m = arr.length;
            //enter a while loop that continues as long as m is truthy
            while (m) {
                const i = Math.floor(Math.random() * m--);
                [arr[m], arr[i]] = [arr[i], arr[m]];
            }
            //return shuffle array
            return arr;
        }
    }

        // Define reset function
    function reset() {
        // For each door
        for (const door of doors) {
            // Clone the current boxes element for each door
            const boxes = door.querySelector(".boxes");
            const boxesClone = boxes.cloneNode(false);

            // Display the mouth emoji "👄" in the reset box
            //create a new <div> element
            const resetBox = document.createElement("div");
            //add the box class to the new element
            resetBox.classList.add("box");
            //set the width of the new element to mstch the width of the 'door'
            resetBox.style.width = door.clientWidth + "px";
            //same with the height 
            resetBox.style.height = door.clientHeight + "px";   
            boxesClone.appendChild(resetBox);
            //set the emojiii
            resetBox.textContent = "👄";

            // Set door's spinned data attribute to "0"
            door.dataset.spinned = "0";

            // Replace the current boxes with the cloned boxes with the mouth emoji
            door.replaceChild(boxesClone, boxes);

            // Add event listener to remove the mouth emoji when spinning
            //  Select the button with the id "spinner"
        const spinnerButton = document.querySelector("#spinner");
        // Add a click event listener to the button
        spinnerButton.addEventListener("click", function removeEmoji() {
        // Replace a child element of the element with id "door"
  //         Replace the child element boxesClone with boxes
  door.replaceChild(boxes, boxesClone);

  //Remove the click event listener to avoid further executions
  spinnerButton.removeEventListener("click", removeEmoji);
});

        }


        // Clear the winning/losing message
        document.querySelector('.info').textContent = "";
    }

    // Define a function to reset the score
    function resetScore() {
        winCount = 0;
        lossCount = 0;
        winCountDisplay.textContent = winCount;
        lossCountDisplay.textContent = lossCount;
    }

    // Call init function to initialize the slot machine when the page loads
    init();
})();
