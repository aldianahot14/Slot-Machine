(function () {
    "use strict";

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

    document.querySelector('.info').textContent = items.join(" ");
    const doors = document.querySelectorAll(".door");
    document.querySelector("#spinner").addEventListener("click", spin);
    document.querySelector("#reseter").addEventListener("click", reset);

    async function spin() {
        init(false, 1, 2);
        for (const door of doors) {
            const boxes = door.querySelector(".boxes");
            const duration = parseInt(boxes.style.transitionDuration);
            boxes.style.transform = "translateY(0)";
            await new Promise((resolve) => setTimeout(resolve, duration * 100));
        }
    }

    function init(firstInit = true, groups = 1, duration = 1) {
        for (const door of doors) {
            if (firstInit) {
                door.dataset.spinned = "0";
            } else if (door.dataset.spinned === "1") {
                return;
            }

            