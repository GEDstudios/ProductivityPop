
//#region Matter.js setup
var Engine = Matter.Engine,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Bounds = Matter.Bounds,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Events = Matter.Events,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Vector = Matter.Vector,
  World = Matter.World;

let engine = Engine.create();

engine.gravity.scale = 0;

let runner = Runner.create({
  isFixed: true
})

let render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width: window.innerWidth,
    height: window.innerHeight,
    background: '#efefef'
  },
});

//#region Mouse Setup
let mouse = Mouse.create(render.canvas);
let mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: { visible: false },
  },
});

render.mouse = mouse;
//#endregion

//#endregion

const addTaskForm = document.querySelector(".add-task");
const backdrop = document.querySelector(".black-backdrop");

const nameInput = document.getElementById("task-input");
const colorInput = document.getElementById("color-input");
const dateInput = document.getElementById("date-input");

const addBtn = document.querySelector(".add-btn");
const cancleBtn = document.querySelector(".cancel-btn");


addBtn.addEventListener("click", confirmTaskCreation);
cancleBtn.addEventListener("click", cancelTaskCreation);
backdrop.addEventListener("click", cancelTaskCreation);



let defaultBubbleSize = 200 - Math.sqrt(window.innerWidth * 15);

let addTaskButton = new AddTaskButton();
let bubbleArray = [];
let bubbleStack = Composites.stack();
let ClusterScaler = 1;

function StartCreatingTask() {
  ToggleTaskForm();
  CreateTask();
}
//#region TaskCreation
function ToggleTaskForm() {
  addTaskForm.classList.toggle("active");
  backdrop.classList.toggle("active");
  addTaskButton.EndPress();
}

let newBubble;
function CreateTask() {
  nameInput.value = "Task Name";
  let position = Vector.sub(addTaskButton.body.position, Vector.create(0, window.innerHeight / 4));
  newBubble = new TaskBubble(position);
  bubbleArray.push(newBubble);
}

function IncreaseNewBubbleSize() {
  if (bubbleStack.bodies.length > 1)
    Body.scale(newBubble.body, 1.25, 1.25);
}

function DecreaseNewBubbleSize() {
  if (bubbleStack.bodies.length > 1)
    Body.scale(newBubble.body, 0.8, 0.8);
}

function confirmTaskCreation() {
  ToggleTaskForm();
  //Composite.move(engine.world, newBubble.body, bubbleStack);
  Body.setStatic(newBubble.body, false);
  newBubble.body.render.lineWidth = 0;
  newBubble = null;
}

function cancelTaskCreation() {
  Composite.remove(bubbleStack, newBubble.body);
  Composite.remove(engine.world, newBubble.body);
  delete bubbleArray.pop();
  ToggleTaskForm();
}

function GetRandomPositionOutsideScreen(extraPadding) {

  let x, y;
  //choose horizontal sides or vertical
  if (Math.random() < 0.5) {
    //choose left or right
    x = Math.random() < 0.5 ? 0 - extraPadding : window.innerWidth + extraPadding;
    y = Math.random() * window.innerHeight;
  }
  else {
    //choose left or right
    x = Math.random() * window.innerWidth;
    y = Math.random() < 0.5 ? 0 - extraPadding : window.innerHeight + extraPadding;
  }

  return { x, y };
}
//#endregion

//#region Mouse Events
let holdingMouse = false;
let lastMouseDownTime = 0;

Events.on(mouseConstraint, "startdrag", function (e) {

  holdingMouse = true;
  lastMouseDownTime = engine.timing.timestamp;

  if (e.body == addTaskButton.body) {
    addTaskButton.StartPress();
  }
  else if (bubbleStack.bodies.includes(e.body)) {
    e.body.taskBubble.StartPress();
  }
  lastMouseReleaseTime = 0;
});

Events.on(mouseConstraint, "enddrag", function (e) {

  addTaskButton.EndPress();
  if (bubbleStack.bodies.includes(e.body)) {
    bubble = e.body.taskBubble;
    bubble.EndPress();

    //allow pop cancel within 300 miliseconds
    if (engine.timing.timestamp - lastMouseDownTime < 300) {
      bubble.PopBubble();
    }
  }

  //TODO allow editing after delay

  holdingMouse = false;
});
//#endregion

//#region Bubble Simulation
//#region UPDATE
Events.on(engine, "beforeUpdate", function () {
  ScaleBoard();
  SetBubblesCenterAttraction();

  if (newBubble != null) {
    newBubble.UpdateAttributes();
  }

});


//#region GlobalScaling
function ScaleBoard() {
  let scale = Matter.Common.clamp(1 + StackToScreenDifference() * 0.05, 0.99, 1.01);

  if (bubbleStack.bodies.length <= 0)
    ClusterScaler = 1;

  else {
    bubbleStack.bodies.forEach(bubble => {
      Body.scale(bubble, scale, scale, bubble.position);
    });
    ClusterScaler *= scale;
  }


}


function StackToScreenDifference() {
  const stackBounds = Composite.bounds(bubbleStack);
  const stackSize = Vector.create(stackBounds.max.x - stackBounds.min.x, stackBounds.max.y - stackBounds.min.y);
  const container = render.bounds;

  let outVect = Vector.create(1 - (1 / (container.max.x / stackSize.x) * 2), 1 - (1 / (container.max.y / stackSize.y) * 2));
  result = Math.min(outVect.x, outVect.y);
  return result;
}
//#endregion


function SetBubblesCenterAttraction() {
  bubbleStack.bodies.forEach(bubble => {

    //attract to center
    let force = Vector.mult(
      Vector.sub(addTaskButton.body.position, bubble.position),
      bubble.area * 0.00000001

    );
    Body.applyForce(bubble, bubble.position, force);

  });
}
//#endregion

//#region RENDERING
Matter.Events.on(render, 'afterRender', function () {
  addTaskButton.DrawPlus();

  bubbleStack.bodies.forEach(bubble => {
    bubble.taskBubble.DrawText();
  });

});


//#endregion

// Add bodies to the world
World.add(engine.world, [bubbleStack, addTaskButton.body, mouseConstraint]);

// Run the engine and render
Runner.run(runner, engine);
Render.run(render);
//#endregionfunction 

//#region Utilities
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}
//#endregion