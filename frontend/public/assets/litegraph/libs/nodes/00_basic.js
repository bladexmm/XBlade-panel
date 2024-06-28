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




function MultiMerge(){
    this.addInput("in", "cmd");
    this.addInput("in", "cmd");
    this.addInput("in", "cmd");

    this.addOutput("out", "cmd");
    // this.horizontal = true;

    this.size = [100, 70];
}

MultiMerge.title = "合并运行";
MultiMerge.desc = "多个执行合并成一个";



function JumpNode(){
    this.addInput("in", "cmd");
    this.addOutput("out", "cmd");
    var randomName = Math.random().toString(36).substring(2, 7);
    this.addProperty("name", randomName);
    this.addWidget("text","name", randomName, "name");

    this.size = [130, 50];
}

JumpNode.title = "跳转运行";
JumpNode.desc = "跳转节点跳转到指定节点继续运行";




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
