
class AddTaskButton {
    constructor() {
        this.body = Bodies.circle(
            render.bounds.max.x / 2,
            render.bounds.max.y / 2,
            defaultBubbleSize,
            {
                isStatic: true,

                render: {
                    fillStyle: '#11bb33', // Sets the fill color to red
                    strokeStyle: 'black', // Sets the border color to black
                    lineWidth: 1 // Sets the border width
                },
            }
        );
        this.body.taskBubble = this;
        this.body.name = '+';
        this.Pressed = false;
    };


    StartPress() {
        ToggleTaskForm();
        this.Pressed = true;
        this.body.render.fillStyle = '#2c4';

    }

    EndPress() {
        this.Pressed = false;
        this.body.render.fillStyle = '#11bb33';
    }
}

