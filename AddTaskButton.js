
class AddTaskButton {
    constructor() {
        this.body = Bodies.circle(
            render.bounds.max.x / 2,
            render.bounds.max.y / 2,
            defaultBubbleSize,
            {

                isStatic: true,
                render: {
                    fillStyle: '#696969'
                },
            }
        );
        this.body.taskBubble = this;
        //this.body.collisionFilter.group = -1;
        this.Pressed = false;
    };


    StartPress() {
        this.Pressed = true;
        this.body.render.fillStyle = '#999';
    }

    EndPress() {
        this.Pressed = false;
        this.body.render.fillStyle = '#696969';
    }

    DrawPlus() {
        var context = render.context;
        var pos = this.body.position;
        var area = this.body.area;
        var fontSize = 80;
        context.fillStyle = '#fff ';
        context.font = fontSize + 'px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'bottom';
        var metrics = context.measureText('+');
        context.fillText('+', pos.x, pos.y + metrics.width);
    }
}
