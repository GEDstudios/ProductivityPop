class TaskBubble {
    constructor(position, color) {
        let pos = position == null ? editPosition : position;
        this.body = Bodies.circle(pos.x, pos.y, defaultBubbleSize, {
            friction: 1,
            frictionAir: 0.1,

            render: {
                fillStyle: color == null ? ColorScheme[2] : color,
                strokeStyle: 'black',
            }

        });
        this.body.title = defaultTaskTitle;
        this.body.taskBubble = this;
        Composite.add(bubbleStack, this.body);
        Body.scale(this.body, ClusterScaler, ClusterScaler);
        this.StartModify();
    }

    StartModify() {
        titleInput.value = this.body.title;
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
    }

    StartPress() {

    }

    EndPress() {
        Body.setVelocity(this.body, { x: 0, y: 0 });
        Body.setAngularVelocity(this.body, 0);
    }

    PopBubble() {
        Composite.remove(bubbleStack, [this.body]);
        Composite.remove(engine.world, [this.body]);
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
        var fontSize = Math.sqrt(area / this.body.title.length) / 2;
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