
const ColorScheme = ['#db522c', '#edb71f', '#15ba57', '#22c5f9', '#832cff'];

let defaultBubbleSize = 200 - Math.sqrt(window.innerWidth * 15);
let defaultTaskTitle = "Task Name";
let popCancelDelay = 300;
let editHoldDelay = 1000;
let editPosition = { x: window.innerWidth / 2, y: window.innerHeight / 4 };
let editMovementBuffer = 50;