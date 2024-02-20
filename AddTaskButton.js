
class AddTaskButton {
    constructor() {
        this.body = Bodies.circle(
            render.bounds.max.x / 2,
            render.bounds.max.y / 2,
            defaultBubbleSize,
            {

                isStatic: true,
                render: {
                    fillStyle: '#11bb33'
                },
            }
        );
        this.body.taskBubble = this;
        this.Pressed = false;
    };


    StartPress() {
        StartCreatingTask();
        this.Pressed = true;
        this.body.render.fillStyle = '#091';

    }

    EndPress() {
        this.Pressed = false;
        this.body.render.fillStyle = '#11bb33';
    }

    DrawPlus() {
        var context = render.context;
        var pos = this.body.position;
        var area = this.body.area;
        var fontSize = 80;
        context.fillStyle = '#fff '; // Text color
        context.font = fontSize + 'px Arial'; // Text size and font
        context.textAlign = 'center';
        context.textBaseline = 'bottom';
        var metrics = context.measureText('+');
        // Adjust positions based on metrics if necessary
        context.fillText('+', pos.x, pos.y + metrics.width);
    }
}
