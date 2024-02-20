class TaskBubble {
    constructor(position, size, name, color, date) {
        this.body = Bodies.circle(position.x, position.y, size, {
            friction: 1,
            frictionAir: 0.1,
            render: {
                fillStyle: color
            }
        });
        Composite.add(bubbleStack, this.body);
        Body.scale(this.body, ClusterScaler, ClusterScaler);
        this.body.taskBubble = this;
        this.body.name = name;
        this.body.date = date;

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
        context.fillStyle = '#000 '; // Text color
        context.font = fontSize + 'px Arial'; // Text size and font
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        // Adjust positions based on metrics if necessary
        context.fillText(this.body.name, pos.x, pos.y);
    }

    DrawDate() {
        var context = render.context;
        var pos = this.body.position;
        var area = this.body.area;
        var fontSize = Math.sqrt(Math.sqrt(area) * 1.2) * 0.8;
        context.fillStyle = '#555 '; // Text color
        context.font = fontSize + 'px Arial'; // Text size and font
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        // Adjust positions based on metrics if necessary
        context.fillText(this.body.date, pos.x, pos.y + fontSize * 2);
    }
}