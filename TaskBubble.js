class TaskBubble {
    constructor(position, size, name) {
        this.body = Bodies.circle(position.x, position.y, size, {
            friction: 1,
            frictionAir: 0.05
        });
        Composite.add(bubbleStack, this.body);
        Body.scale(this.body, ClusterScaler, ClusterScaler);
        this.body.taskBubble = this;
        this.body.name = this.body.id;
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

}