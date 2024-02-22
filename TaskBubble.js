class TaskBubble {
    constructor(position, color) {
        this.body = Bodies.circle(position.x, position.y, defaultBubbleSize, {
            friction: 1,
            frictionAir: 0.1,
            isStatic: true,
            render: {
                fillStyle: '#15ba57',
                strokeStyle: 'black',
                lineWidth: window.innerHeight * 0.01
            }

        });
        this.body.taskBubble = this;
        Composite.add(bubbleStack, this.body);
        Body.scale(this.body, ClusterScaler, ClusterScaler);

    }

    StartPress() {
        this.body.collisionFilter.group = -1;
        this.body.parts.sensor = true;
    }
    EndPress() {
        Body.setVelocity(this.body, { x: 0, y: 0 });
        Body.setAngularVelocity(this.body, 0);
        this.body.collisionFilter.group = 1;
        this.body.parts.sensor = true;
    }

    PopBubble() {
        Composite.remove(bubbleStack, [this.body]);
        Composite.remove(engine.world, [this.body]);
        bubbleArray.pop();
    }


    UpdateAttributes() {
        this.body.name = nameInput.value;
        this.body.date = dateInput.value;

    }

    SetColor(color) {
        this.body.render.fillStyle = color;
    }

    DrawText() {
        this.DrawName();
        this.DrawDate();
    }

    DrawName() {
        var context = render.context;
        var pos = this.body.position;
        var area = this.body.area;
        var fontSize = Math.sqrt(Math.sqrt(area) * 1.2);
        context.fillStyle = '#fff '; // Text color
        context.font = fontSize + 'px Arial'; // Text size and font
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        // Adjust positions based on metrics if necessary
        context.fillText(this.body.name, pos.x, pos.y);
    }

    DrawDate() {
        var context = render.context;
        var area = this.body.area;
        var fontSize = Math.sqrt(Math.sqrt(area) * 1.2) * 0.8;
        let adjustedFontSize = fontSize * rendererScale;
        let pos = { x: this.body.position.x * rendererScale, y: this.body.position.y * rendererScale };
        context.fillStyle = '#ddd '; // Text color
        context.font = adjustedFontSize + 'px Arial'; // Text size and font
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        // Adjust positions based on metrics if necessary
        context.fillText(this.body.date, pos.x, pos.y + adjustedFontSize * 2);
    }
}