
const ColorScheme = ['#db522c', '#edb71f', '#15ba57', '#22c5f9', '#832cff'];

let defaultBubbleSize = 200 - Math.sqrt(window.innerWidth * 15);
let defaultTaskTitle = "Task Name";
let popCancelDelay = 200;
let editHoldDelay = 1000;
let editPosition = { x: window.innerWidth / 2, y: window.innerHeight / 4 };
let editMovementBuffer = 50;

//#region Utilities
function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
//#endregion
function GetScale() {

}