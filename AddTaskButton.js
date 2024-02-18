
class AddTaskButton {
    constructor() {
        this.body = Bodies.circle(
            render.bounds.max.x / 2,
            render.bounds.max.y / 2,
            defaultBubbleSize,
            {
                isStatic: true,

                render: {
                    fillStyle: '#fff', // Sets the fill color to red
                    strokeStyle: 'black', // Sets the border color to black
                    lineWidth: 1 // Sets the border width
                },
            }
        );

        this.body.taskBubble = this;
        this.body.name = '+';
    };

    Scaler = 1;
    ScalerMulti = 1;

    Pressed = false;

    StartPress() {
        this.Pressed = true;
        this.body.render.fillStyle = '#22cc44';
    }

    EndPress() {
        this.CreateTaskBubble(this.GetRandomPositionOutsideScreen(defaultBubbleSize * this.ScalerMulti * Math.PI * 2), defaultBubbleSize * (this.ScalerMulti / ClusterScaler));
        Body.scale(addTaskButton.body, this.Scaler / this.ScalerMulti, this.Scaler / this.ScalerMulti);
        this.ScalerMulti = 1;
        this.Scaler = 1;
        this.Pressed = false;
        this.body.render.fillStyle = '#11bb33';
    }


    CreateTaskBubble(position, size) {
        new TaskBubble(position, size);
    }

    GetRandomPositionOutsideScreen(extraPadding) {

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

    ScaleWithTime() {
        addTaskButton.Scaler += engine.timing.lastDelta * 0.00001;
        addTaskButton.ScalerMulti *= addTaskButton.Scaler;
        Body.scale(addTaskButton.body, addTaskButton.Scaler, addTaskButton.Scaler);
    }
}

