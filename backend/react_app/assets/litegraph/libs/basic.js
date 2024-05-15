function CMDStart() {
    this.addOutput("out", "cmd")
    this.size = [80, 30];
}

CMDStart.title = "开始";
CMDStart.desc = "程序开始";
CMDStart.prototype.onExecute = function () {
    this.setOutputData(0, 'start');
};



function CMDEnd() {
    this.addInput("in", "cmd");
    this.size = [80, 30];
}

CMDEnd.title = "结束";
CMDEnd.desc = "程序结束";

function TimeWait() {
    this.addInput("cmd", "cmd");
    this.addOutput("cmd", "cmd");
    this._value = [];
    this.addProperty("value", "500");
    this.widget = this.addWidget("text", "w", this.properties.value, "value");
    this.widgets_up = true;
    this.size = [100, 30];
}

TimeWait.title = "等待(ms)";
TimeWait.desc = "在等待N毫秒"


function isNumeric(str) {
    return /^\d+$/.test(str);
}


TimeWait.prototype.onPropertyChanged = function (name, value) {
    this.widget.value = value;
    if (value == null || value === "") {
        return;
    }
    if(isNumeric(value)){
        this.boxcolor = "#AEA";
    }else {
        this.boxcolor = "red";
        alert("只能输入整数")
    }
};

function MultiMerge(){
    this.addInput("cmd", "cmd");
    this.addInput("cmd", "cmd");
    this.addInput("cmd", "cmd");

    this.addOutput("cmd", "cmd");
    this.horizontal = true;

    this.size = [100, 20];
}

MultiMerge.title = "合并运行";
MultiMerge.desc = "多个执行合并成一个";



function CMDDebug() {
    this.addInput("in", "cmd");
    this.addOutput("out", "cmd");
    this.size = [80, 30];
}

CMDDebug.title = "调试";
CMDDebug.desc = "从调试节点开始运行";
CMDDebug.prototype.onExecute = function () {
    this.setOutputData(0, 'start');
};
