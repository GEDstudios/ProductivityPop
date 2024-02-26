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
  Query = Matter.Query,
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

//#region Instantiate Objects
let addTaskButton = new AddTaskButton();
let bubbleStack = Composites.stack();
//#endregion

let rendererScale = 1;

let ClusterScaler = 1;

//#region Refrence Html Elements
const addTaskForm = document.querySelector(".add-task");
const backdrop = document.querySelector(".black-backdrop");
const colorButtons = document.querySelectorAll(".colorBtn")
const titleInput = document.getElementById("task-input");
const colorInput = document.getElementById("color-input");
const dateInput = document.getElementById("date-input");
//#endregion

//START
document.addEventListener("DOMContentLoaded", event => {
  colorButtons.forEach((btn, i) => {
    btn.style.backgroundColor = ColorScheme[i];
    btn.addEventListener("click", setNewBubbleColor);
  });

});

//#region Task Editing and Creation
let editedBubble;

function StartCreatingTask() {
  ToggleTaskForm();
  editedBubble = new TaskBubble();
}

function ToggleTaskForm() {
  addTaskForm.classList.toggle("active");
  backdrop.classList.toggle("active");
}

function StartEditingTask(bubble) {
  editTimeout = null;
  editedBubble = bubble;
  bubble.StartModify();
  ToggleTaskForm();
}

function setNewBubbleColor() {
  const colorIndex = parseInt(this.value);
  const selectedColor = ColorScheme[colorIndex];
  editedBubble.SetColor(selectedColor);
}

function IncreaseNewBubbleSize() {
  if (bubbleStack.bodies.length > 1)
    Body.scale(editedBubble.body, 1.25, 1.25);
}

function DecreaseNewBubbleSize() {
  if (bubbleStack.bodies.length > 1)
    Body.scale(editedBubble.body, 0.8, 0.8);
}

function confirmTaskCreation() {
  if (editedBubble == null) return;
  ToggleTaskForm();
  editedBubble.FinishModify();
  editedBubble.EndPress();
  editedBubble = null;
}

function deleteEditedTask() {
  Composite.remove(bubbleStack, editedBubble.body);
  Composite.remove(engine.world, editedBubble.body);
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
let mouseTarget;
let lastMouseDownTime = 0;
let startMousePos = { x: mouseConstraint.mouse.position.x, y: mouseConstraint.mouse.position.y };
let editTimeout;
Events.on(mouseConstraint, "mousedown", function (e) {
  lastMouseDownTime = engine.timing.timestamp;

  mouseTarget = Query.point([addTaskButton.body, ...bubbleStack.bodies], mouseConstraint.mouse.position)[0];

  if (mouseTarget != null) {
    if (addTaskButton.body == mouseTarget) {
      addTaskButton.StartPress();
    }

    else if (bubbleStack.bodies.includes(mouseTarget)) {
      mouseTarget.taskBubble.StartPress();
      startMousePos = Vector.create(mouseConstraint.mouse.position.x, mouseConstraint.mouse.position.y);
      editTimeout = setTimeout(() => StartEditingTask(mouseTarget.taskBubble), editHoldDelay);
    }
  }
})


Events.on(mouseConstraint, "mouseup", function (e) {
  if (addTaskButton.Pressed) addTaskButton.EndPress();

  if (mouseTarget == Query.point([addTaskButton.body, ...bubbleStack.bodies], { x: mouseConstraint.mouse.position.x, y: mouseConstraint.mouse.position.y })[0]) {
    if (mouseTarget != null) {
      if (mouseTarget == addTaskButton.body) {
        StartCreatingTask();
      }

      if (bubbleStack.bodies.includes(mouseTarget)) {
        let bubble = mouseTarget.taskBubble;
        let clickDuration = engine.timing.timestamp - lastMouseDownTime;
        if (clickDuration < popCancelDelay) {
          bubble.PopBubble();
        }

      }
    }
  }
  if (editTimeout != null) {
    clearTimeout(editTimeout);
    editTimeout = null;
  }
});

//#endregion

//#region Bubble Simulation

//#region UPDATE
Events.on(engine, "beforeUpdate", function () {
  ScaleBoard();
  SetBubblesCenterAttraction()

  if (editedBubble != null) {
    editedBubble.UpdateAttributes();
  }

  //Cancel Edit
  if (editTimeout != null && Vector.magnitude(Vector.sub(startMousePos, mouse.position)) > editMovementBuffer) {
    clearTimeout(editTimeout);
    editTimeout = null;
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
  const stackSize = { x: stackBounds.max.x - stackBounds.min.x, y: stackBounds.max.y - stackBounds.min.y };
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



//#region RENDERING

//#endregion
// function ScaleRenderer(amount, relative) {
//   minX = relative ? render.bounds.min.x + amount : amount;
//   minY = relative ? render.bounds.min.y + amount : amount;
//   maxX = relative ? render.bounds.max.x - amount : window.innerWidth - amount;
//   maxy = relative ? render.bounds.max.y - amount : window.innerHeight - amount;
//   Render.lookAt(render, {
//     min: { x: minX, y: minY },
//     max: { x: maxX, y: maxy }
//   });

//   rendererScale = window.innerWidth / (render.bounds.max.x - render.bounds.min.x);
// }


Events.on(render, 'afterRender', function () {
  //ScaleRenderer(1, true);
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