(function () {
    "use strict";

    const items = ["🌸", "💖", "🎀", "🌷", "💘", "🌺", "🐷", "💋"];

    document.querySelector('.info').textContent = items.join(" ");

    const doors = document.querySelectorAll(".door");
    let winCount = 0;
    let lossCount = 0;
    let chances = 3; 

    const winCountDisplay = document.querySelector('#winCount');
    const lossCountDisplay = document.querySelector('#lossCount');

    winCountDisplay.textContent = winCount;
    lossCountDisplay.textContent = lossCount;

    const machineSound = document.getElementById('machineSound');

    document.querySelector("#spinner").addEventListener("click", spin);
    document.querySelector("#reseter").addEventListener("click", reset);
    const resetScoreButton = document.getElementById('resetScore');
    resetScoreButton.addEventListener('click', resetScore);

    function spin() {
        if (chances > 0) {
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
                
                setTimeout(displayLoss, 2000); 
            }

            chances--; 
        }

        if (chances === 0) {
            document.querySelector("#spinner").disabled = true; 
            document.querySelector('.info').textContent = "Game Over!"; 
        }

        machineSound.play(); 
    }

    function checkResult() {
        const firstEmoji = doors[0].querySelector(".box").textContent;

        const allDoorsSame = [...doors].every(door => {
            const emoji = door.querySelector(".box").textContent;
            return emoji === firstEmoji;
        });

        return allDoorsSame;
    }

    function displayWin() {
        winCount++;
        winCountDisplay.textContent = winCount;
        
        const infoText = document.querySelector('.info');
        infoText.textContent = "You're lucky! You Win!";
        infoText.style.color = '#000';  
        infoText.style.textShadow = "0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4";
    }
    
    function displayLoss() {
        lossCount++;
        lossCountDisplay.textContent = lossCount;
    
        const infoText = document.querySelector('.info');
        infoText.textContent = "Sorry, You're not so lucky. Try Again!";
        infoText.style.color = '#000';  
        infoText.style.textShadow = "0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4";
    }
    function init(firstInit = true, groups = 1, duration = 1) {
        for (const door of doors) {
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

                for (let i = pool.length - 1; i >= 0; i--) {
                    const box = document.createElement("div");
                    box.classList.add("box");
                    box.style.width = door.clientWidth + "px";
                    box.style.height = door.clientHeight + "px";
                    boxesClone.appendChild(box);
                    box.textContent = pool[i];
                }

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

    function resetScore() {
        winCount = 0;
        lossCount = 0;
        winCountDisplay.textContent = winCount;
        lossCountDisplay.textContent = lossCount;
        chances = 3; 
        document.querySelector("#spinner").disabled = false; 
        document.querySelector('.info').textContent = ""; 
    }

    init();
})();
