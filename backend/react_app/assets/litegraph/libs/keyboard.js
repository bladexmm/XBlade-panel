const keyboards = [
    "enter",
    "tab",
    "esc",
    "delete",
    "backspace",
    " ",
    "up",
    "down",
    "left",
    "right",
    "home",
    "end",
    "pageup",
    "pagedown",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "f10",
    "f11",
    "f12",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
    "-",
    "=",
    "[",
    "]",
    "{",
    "}",
    ";",
    ":",
    "'",
    "\"",
    ",",
    ".",
    "/",
    "\\",
    "<",
    ">",
    "?",
    "`",
    "~",
    "ctrlleft",
    "ctrlright",
    "altleft",
    "altright",
    "shiftleft",
    "shiftright",
    "win",
    "winleft",
    "winright",
    "printscreen",
    "scrolllock",
    "pause",
    "numlock",
    "capslock",
    "insert"
];

function Hotkeys() {
    this.addInput("in", "cmd");
    this.addOutput("out", "cmd");
    this._value = [];
    this.addProperty("value", '["win","r"]');
    this.widget = this.addWidget("text", "keys", this.properties.value, "value");
    this.addProperty("type", 'hotkeys');
    this.addWidget("combo","type", "hotkeys", { values:["hotkeys","keyDown","keyUp"], property: "type"} );

    this.widgets_up = true;
    this.size = [180, 60];
}

Hotkeys.title = "组合键";
Hotkeys.desc = "同时按下多个按键";
Hotkeys.prototype.onPropertyChanged = function (name, value) {
    if(name === 'type'){
        return;
    }
    this.widget.value = value;
    if (value == null || value === "") {
        return;
    }

    try {

        if (value[0] !== "[")
            this._value = JSON.parse("[" + value + "]");
        else
            this._value = JSON.parse(value);
        for (let i = 0; i < this._value.length; i++) {
            if (!keyboards.includes(this._value[i])) {
                this.boxcolor = "red";
                alert("非法输入内容：" + this._value[i])
                break;
            }
            this.boxcolor = "#AEA";
        }
    } catch (err) {
        this.boxcolor = "red";
    }
};


function Type_Text() {
    this.addInput("in", "cmd");
    this.addOutput("out", "cmd");
    this.addProperty("value", "");
    this.widget = this.addWidget("text", "value", "", "value");  //link to property value
    this.widgets_up = true;
    this.size = [180, 30];
}

Type_Text.title = "文本输入";
Type_Text.desc = "文本输入";



function MouseLeft() {
    this.addInput("in", "cmd");
    this.addOutput("out", "cmd");
    this.addProperty("type", 'click');
    this.addWidget("combo","type", "click", { values:["click","mouseDown","mouseUp"], property: "type"} );
    this.widgets_up = true;
    this.size = [150, 30];
}

MouseLeft.title = "鼠标左键";
MouseLeft.desc = "鼠标左键";


function MouseMiddle() {
    this.addInput("in", "cmd");
    this.addOutput("out", "cmd");
    this.addProperty("type", 'click');
    this.addWidget("combo","type", "click", { values:["click","scrollUp","scrollDown"], property: "type"} );
    this.widgets_up = true;
    this.size = [150, 30];
}

MouseMiddle.title = "鼠标中键";
MouseMiddle.desc = "鼠标中键";



function MouseRight() {
    this.addInput("in", "cmd");
    this.addOutput("out", "cmd");
    this.addProperty("type", 'click');
    this.addWidget("combo","type", "click", { values:["click","down","up"], property: "type"} );
    this.widgets_up = true;
    this.size = [150, 30];
}

MouseRight.title = "鼠标右键";
MouseRight.desc = "鼠标右键";