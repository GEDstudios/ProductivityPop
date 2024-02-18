
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

let defaultBubbleSize = 40;

let addTaskButton = new AddTaskButton();
let bubbleStack = Composites.stack();
let ClusterScaler = 1;

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
    lastMouseReleaseTime = 0;
  }
});

Events.on(mouseConstraint, "enddrag", function (e) {

  if (e.body == addTaskButton.body) {
    addTaskButton.EndPress();
  }

  else if (bubbleStack.bodies.includes(e.body)) {
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

//#region UPDATE
Events.on(engine, "beforeUpdate", function () {

  if (addTaskButton.Pressed) {
    addTaskButton.ScaleWithTime();
  }


  ScaleBoard();
  SetBubblesCenterAttraction();


});

//#region GlobalScaling
function ScaleBoard() {
  let scale = Matter.Common.clamp(1 + StackToScreenDifference() * 0.05, 0.99, 1.01);

  if (bubbleStack.bodies.length > 0)
    ClusterScaler *= scale;
  else {
    ClusterScaler = 1;
  }

  Composite.scale(bubbleStack, scale, scale, addTaskButton.body.position);
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

  if (!addTaskButton.Pressed)
    DrawTextOnBubble(addTaskButton.body, 'bottom', true, 10, true);

  bubbleStack.bodies.forEach(bubble => {
    DrawTextOnBubble(bubble, 'middle', true);
  });

});

function DrawTextOnBubble(body, textBaseline, sizeRelativeToArea = false, customSize = 1, addBtn = false) {
  var context = render.context;
  var pos = body.position;
  var area = body.area;
  var fontSize = customSize * (sizeRelativeToArea ? Math.sqrt(area * 0.5) * 0.2 : 1);
  context.fillStyle = '#000'; // Text color
  context.font = fontSize + 'px Arial'; // Text size and font
  context.textAlign = 'center';
  context.textBaseline = textBaseline;
  var metrics = context.measureText(body.name);
  // Adjust positions based on metrics if necessary
  context.fillText(`${body.name}`, pos.x, pos.y + (addBtn ? metrics.width : 0));
}
//#endregion

// Add bodies to the world
World.add(engine.world, [bubbleStack, addTaskButton.body, mouseConstraint]);

// Run the engine and render
Runner.run(runner, engine);
Render.run(render);
