function TimeWait() {
    this.addInput("in", "cmd");
    this.addOutput("out", "cmd");
    this._value = [];
    this.addProperty("value", "500");
    this.widget = this.addWidget("text", "w", this.properties.value, "value");
    this.widgets_up = true;
    this.size = [100, 30];
}

TimeWait.title = "等待(ms)";
TimeWait.desc = "在等待N毫秒";



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

function FetchApi() {
    this.desc = "fetch";
    this.addInput("in", "cmd")
    this.addOutput("out", "cmd")

    this.addInput("url", "text")
    this.addInput("data", "text")
    this.addInput("header", "text")
    this.addOutput("response", "response")
    this.addOutput("error", "cmd")

    this.addProperty("method", 'GET');
    this.inputTypeWidget = this.addWidget("combo", "method", 'GET', {
        values: ["GET", "POST", "PUT", "DELETE"],
        property: "method"
    });


    this.addProperty("type", 'form-data');
    this.inputTypeWidget = this.addWidget("combo", "type", 'form-data', {
        values: ["form-data", "x-www-form-urlencoded", "json"],
        property: "contentType"
    });

    this.size = [180, 150];
}

FetchApi.title = "请求接口";



function GetJson() {
    this.desc = "获取JSON参数";
    this.addInput("in", "cmd")
    this.addOutput("out", "cmd")
    this.addOutput("error", "cmd")

    this.addInput("response", "response")
    this.addInput("path", "text")
    this.addOutput("out", "text")
    this.addOutput("out", "array")

    this.size = [140, 90];
}


GetJson.title = "获取JSON参数";









function IfValid() {
    this.desc = "if";
    this.addInput("in", "cmd")
    this.addOutput("true", "cmd")
    this.addOutput("false", "cmd")

    this.addInput("input1", "text")
    this.addInput("input2", "text")

    this.size = [120, 90];
}


IfValid.title = "判断(eq)";



function SwitchValid(){
    this.desc = "switch";
    this.addInput("in", "cmd")
    this.addOutput("error", "cmd")

    this.addInput("input", "text")
    this.addInput("valid_1", "text")
    this.addInput("valid_2", "text")
    this.addInput("valid_3", "text")
    this.addInput("valid_4", "text")
    this.addInput("valid_5", "text")
    this.addInput("valid_6", "text")
    this.addInput("valid_7", "text")
    this.addInput("valid_8", "text")
    this.addInput("valid_9", "text")

    this.addOutput("input", "text")
    this.addOutput("1", "cmd")
    this.addOutput("2", "cmd")
    this.addOutput("3", "cmd")
    this.addOutput("4", "cmd")
    this.addOutput("5", "cmd")
    this.addOutput("6", "cmd")
    this.addOutput("7", "cmd")
    this.addOutput("8", "cmd")
    this.addOutput("9", "cmd")

    this.size = [120, 230];
}

SwitchValid.title = "选择结构(switch)";



function FormatText() {
    this.desc = "格式化字符串";
    this.addInput("in", "cmd")
    this.addOutput("out", "cmd")
    this.addOutput("out", "text")

    this.addInput("text1", "text")
    this.addInput("text2", "text")
    this.addInput("array1", "array")
    this.addInput("array2", "array")

    this.addProperty("text", '');
    this.addWidget("text","text", '', "text",{multiline:true});
    this.size = [120, 130];
}


FormatText.title = "格式化字符串";


function logDebug() {
    this.desc = "记录日志(logDebug)";
    this.addInput("in", "cmd")
    this.addOutput("out", "cmd")
    this.addInput("text", "text")
    this.addInput("array", "array")
    this.addInput("location", "location")
    this.addInput("response", "response")
    this.size = [120, 130];
}


logDebug.title = "记录日志";



function SetLocalVariables() {
    this.desc = "配置局部变量";
    this.addInput("in", "cmd")
    this.addOutput("out", "cmd")

    this.addInput("text", "text")
    this.addInput("array", "array")
    this.addInput("location", "location")
    this.addInput("response", "response")
    this.addProperty("name", '');
    this.addWidget("text","name", '', "name",{multiline:true});
    this.size = [120, 130];
}


SetLocalVariables.title = "配置局部变量";



function GetLocalVariables() {
    this.desc = "获取局部变量";
    this.addInput("in", "cmd")
    this.addOutput("out", "cmd")

    this.addOutput("text", "text")
    this.addOutput("array", "array")
    this.addOutput("location", "location")
    this.addOutput("response", "response")
    this.addProperty("name", '');
    this.addWidget("text","name", '', "name",{multiline:true});
    this.size = [120, 130];
}


GetLocalVariables.title = "获取局部变量";


function SetGlobalVariables() {
    this.desc = "配置全局变量";
    this.addInput("in", "cmd")
    this.addOutput("out", "cmd")

    this.addInput("text", "text")
    this.addInput("array", "array")
    this.addInput("location", "location")
    this.addInput("response", "response")
    this.addProperty("name", '');
    this.addWidget("text","name", '', "name",{multiline:true});
    this.size = [120, 130];
}



SetGlobalVariables.title = "配置全局变量";


function GetGlobalVariables() {
    this.desc = "获取全局变量";
    this.addInput("in", "cmd")
    this.addOutput("out", "cmd")

    this.addOutput("text", "text")
    this.addOutput("array", "array")
    this.addOutput("location", "location")
    this.addOutput("response", "response")
    this.addProperty("name", '');
    this.addWidget("text","name", '', "name",{multiline:true});
    this.size = [120, 130];
}



GetGlobalVariables.title = "获取全局变量";