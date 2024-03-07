class TaskBubble {
    constructor(position, title = defaultTaskTitle, date, color = ColorScheme[Math.floor(Math.random() * ColorScheme.length)], scale = 1, id = "") {
        let pos = position == null ? editPosition : position;
        this.body = Bodies.circle(pos.x, pos.y, defaultBubbleSize, {
            friction: 1,
            frictionAir: 0.05,
            restitution: 0.5,
            render: {
                fillStyle: color,
                strokeStyle: 'white',
            },
            collisionFilter: {
                group: 1,
                mask: 1,
                category: 1,
            }
        });

        this.body.title = title;
        this.body.date = date;
        this.body.taskBubble = this;
        this.body.scaler = scale;
        this.body.id = id;
        Composite.add(engine.world, this.body);
        Composite.move(engine.world, this.body, bubbleStack);
        Body.scale(this.body, ClusterScaler * scale, ClusterScaler * scale);
    }

    StartModify() {
        titleInput.value = this.body.title;
        dateInput.value = null;
        if (this.body.date != null) {
            dateInput.value = this.body.date;
        }

        editedBubble = this;
        this.body.isStatic = true;
        Body.setPosition(this.body, editPosition);
        this.body.render.lineWidth = window.innerHeight * 0.01;
    }

    FinishModify() {
        this.body.isStatic = false;
        this.body.render.lineWidth = 0;
        this.EndPress();
        editedBubble = null;
    }

    StartPress() {

    }

    EndPress() {
        Body.setVelocity(this.body, { x: 0, y: 0 });
        Body.setAngularVelocity(this.body, 0);
    }

    PopBubble() {
        DeleteDatabaseTask(this.body);
        Composite.remove(bubbleStack, [this.body]);
        Composite.remove(engine.world, [this.body]);
    }

    SetScale(scale) {
        Body.scale(this.body, scale / this.body.scaler, scale / this.body.scaler);
        this.body.scaler = scale;
    }

    UpdateAttributes() {
        this.body.title = titleInput.value;
        this.body.date = dateInput.value;

    }

    SetColor(color) {
        this.body.render.fillStyle = color;
    }

    DrawText() {
        this.DrawTitle();
        this.DrawDate();
    }

    DrawTitle() {
        var context = render.context;
        var pos = this.body.position;
        var area = this.body.area;
        var fontSize = Math.sqrt(area / this.body.title.length * 0.6) / 2;
        context.fillStyle = '#fff '; // Text color
        context.font = "500 " + fontSize + "px 'Rubik'"; // Text size and font
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.body.title, pos.x, pos.y);
    }

    DrawDate() {
        var context = render.context;
        var area = this.body.area;
        var fontSize = Math.sqrt(Math.sqrt(area) * 1.2) * 0.8;
        let adjustedFontSize = fontSize * rendererScale;
        let pos = { x: this.body.position.x * rendererScale, y: this.body.position.y * rendererScale };
        context.fillStyle = '#ddd '; // Text color
        context.font = adjustedFontSize + 'px Rubik'; // Text size and font
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        // Adjust positions based on metrics if necessary
        context.fillText(this.body.date, pos.x, pos.y + adjustedFontSize * 2);
    }

}