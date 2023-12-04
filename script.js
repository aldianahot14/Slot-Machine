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

    // Display emojis in the information section in hTML 
    document.querySelector('.info').textContent = items.join(" ");

    // Define doors variable to store the door elements
    const doors = document.querySelectorAll(".door");

    // Define spinner and reset button event listeners!!
    document.querySelector("#spinner").addEventListener("click", spin);
    document.querySelector("#reseter").addEventListener("click", reset);

    // Define spin function-async will return a promise 
    async function spin() {
        // Call init function with parameters for animation 
        init(false, 1, 2);

      // For each door, animate the door boxes to simulate spinning
for (const door of doors) {
    // Get the boxes element within the current door using the "querySelector" 
    const boxes = door.querySelector(".boxes");

    // Get the transition duration of the boxes element
    const duration = parseInt(boxes.style.transitionDuration);

    // Set the transform property of the boxes element to translate along the Y-axis by 0 pixels
    boxes.style.transform = "translateY(0)";

    // Pause the execution for a certain duration to simulate the spinning animation
    await new Promise((resolve) => setTimeout(resolve, duration * 100));
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
        // Get the emoji from the first door
        const firstEmoji = doors[0].querySelector(".box").textContent;

        // Check if all doors have the same emoji
        const allDoorsSame = [...doors].every(door => {
            const emoji = door.querySelector(".box").textContent;
            return emoji === firstEmoji;
        });

        return allDoorsSame; // Return true if all doors are the same, indicating a win
                            // Return false if doors have different emojis
    }

    // Define displayWin function
    function displayWin() {
        document.querySelector('.info').textContent = "Congratulations! You Win!";
    }

    // Define displayLoss function
    function displayLoss() {
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

            // Clone the current boxes element for each door
            const boxes = door.querySelector(".boxes");
            const boxesClone = boxes.cloneNode(false);

            // Create a pool array with a placeholder emoji "👄"
            const pool = ["👄"];

            // If it's not the first initialization
            if (!firstInit) {
                // Shuffle and push emojis from items array into the pool
                const arr = [];
                for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                    arr.push(...items);
                }
                pool.push(...shuffle(arr));

                // Add event listeners for transition start and end to handle animation
                boxesClone.addEventListener(
                    "transitionstart",
                    function () {
                        door.dataset.spinned = "1";
                        this.querySelectorAll(".box").forEach((box) => {
                            box.style.filter = "blur(1px)";
                        });
                    },
                    { once: true }
                );
                boxesClone.addEventListener(
                    "transitionend",
                    function () {
                        this.querySelectorAll(".box").forEach((box, index) => {
                            box.style.filter = "blur(0)";
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
                boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
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

    