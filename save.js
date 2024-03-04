
let saveData = [];
function Save() {
    let newData = [];
    bubbleStack.bodies.forEach(bubble => {
        newData.push(new TaskSaveData(bubble.title, bubble.date, bubble.render.fillStyle, bubble.scaler));
    });
    saveData = newData;
}

function RestoreSave() {
    if (saveData == null || saveData.length < 1) return

    saveData.forEach(bubble => {
        new TaskBubble(editPosition, bubble.title, bubble.date, bubble.color, bubble.scale);
    });
}

function ClearSave() {
    saveData = null;
}

class TaskSaveData {
    constructor(title, date, color, scale) {
        this.title = title;
        this.date = date;
        this.color = color;
        this.scale = scale;
    }

}
