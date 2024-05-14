const keyboards = ['\t', '\n', '\r', ' ', '!', '"', '#', '$', '%', '&', "'", '(',
    ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~',
    'accept', 'add', 'alt', 'altleft', 'altright', 'apps', 'backspace',
    'browserback', 'browserfavorites', 'browserforward', 'browserhome',
    'browserrefresh', 'browsersearch', 'browserstop', 'capslock', 'clear',
    'convert', 'ctrl', 'ctrlleft', 'ctrlright', 'decimal', 'del', 'delete',
    'divide', 'down', 'end', 'enter', 'esc', 'escape', 'execute', 'f1', 'f10',
    'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f2', 'f20',
    'f21', 'f22', 'f23', 'f24', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9',
    'final', 'fn', 'hanguel', 'hangul', 'hanja', 'help', 'home', 'insert', 'junja',
    'kana', 'kanji', 'launchapp1', 'launchapp2', 'launchmail',
    'launchmediaselect', 'left', 'modechange', 'multiply', 'nexttrack',
    'nonconvert', 'num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6',
    'num7', 'num8', 'num9', 'numlock', 'pagedown', 'pageup', 'pause', 'pgdn',
    'pgup', 'playpause', 'prevtrack', 'print', 'printscreen', 'prntscrn',
    'prtsc', 'prtscr', 'return', 'right', 'scrolllock', 'select', 'separator',
    'shift', 'shiftleft', 'shiftright', 'sleep', 'space', 'stop', 'subtract', 'tab',
    'up', 'volumedown', 'volumemute', 'volumeup', 'win', 'winleft', 'winright', 'yen',
    'command', 'option', 'optionleft', 'optionright'];

let virtual_keyboard_id = 0;

function findKeyLabel(keys){
    let key_labels = []
    for (let x = 0; x < keys.length; x++) {
        let label = '';
        for (let i = 0; i < virtual_keyboards.length; i++) {
            let cols = virtual_keyboards[i]['cols']
            if (label !== ''){
                break;
            }
            for (let j = 0; j < cols.length; j++) {
                if (cols[j]['values'].includes(keys[x])){
                    label = cols[j]['label'][0]
                    break;
                }
            }
        }
        key_labels.push(label)
    }
    return JSON.stringify(key_labels);

}

function Hotkeys() {
    this.addInput("cmd", "cmd");
    this.addOutput("cmd", "cmd");
    this._value = [];
    this.addProperty("value", '["win","r"]');
    this.addProperty("inputType", 'hotkeys');
    this.inputTypeWidget = this.addWidget("combo", "inputType", 'hotkeys', {
        values: ["hotkeys", "typeWrite", "keyDown", "keyUp"],
        property: "inputType"
    });

    this.widget = this.addWidget("text", "keys", this.properties.value, 'value');
    const keyboard_preview = document.querySelector('.virtual-keys-input');
    const keyboard = document.querySelector('.virtual-keyboard');

    this.addWidget("button", "打开虚拟键盘", null, function () {
        keyboard.classList.remove('hidden');
        keyboard_preview.innerHTML = findKeyLabel(JSON.parse(self.properties.value));
        virtual_keyboard_id = self.id
    });
    // 获取具有 virtual-keys-click 类名的所有元素
    const virtual_keys = document.querySelectorAll('.virtual-keys-click');
    const self = this;
    const keyboard_del = document.querySelector('.virtual-keys-delete');
    keyboard_del.addEventListener('click', function () {
        if (virtual_keyboard_id !== self.id) {
            return;
        }
        let keysPressed = JSON.parse(self.properties.value);
        keysPressed.pop();
        self.setProperty('value', JSON.stringify(keysPressed));
        keyboard_preview.innerHTML = findKeyLabel(keysPressed);
    })

    // 遍历所有元素，并为其添加点击事件监听器
    virtual_keys.forEach(function (virtual_key) {
        virtual_key.addEventListener('click', function () {
            if (virtual_keyboard_id !== self.id) {
                return;
            }
            const keys = virtual_key.getAttribute('data-keys');
            const key = keys.split(',');
            const keyPress = key[0];
            let keysPressed = JSON.parse(self.properties.value);
            if (keyPress === 'del') {
                keysPressed.pop();
            } else {
                keysPressed.push(keyPress);
            }
            self.setProperty('value', JSON.stringify(keysPressed));
            keyboard_preview.innerHTML = findKeyLabel(keysPressed);
        });
    });
    this.widgets_up = true;
    this.size = [180, 90];
}

Hotkeys.title = "组合键";
Hotkeys.desc = "同时按下多个按键";


function Type_Text() {
    this.addInput("cmd", "cmd");
    this.addOutput("cmd", "cmd");
    this.addProperty("value", "");
    this.widget = this.addWidget("text", "value", "", "value");  //link to property value
    this.widgets_up = true;
    this.size = [180, 30];
}

Type_Text.title = "文本输入";
Type_Text.desc = "文本输入";


function MouseLeft() {
    this.addInput("cmd", "cmd");
    this.addOutput("cmd", "cmd");
    this.addProperty("type", 'click');
    this.addWidget("combo", "type", "click", {values: ["click", "mouseDown", "mouseUp"], property: "type"});
    this.widgets_up = true;
    this.size = [150, 30];
}

MouseLeft.title = "鼠标左键";
MouseLeft.desc = "鼠标左键";


function MouseMiddle() {
    this.addInput("cmd", "cmd");
    this.addOutput("cmd", "cmd");
    this.addProperty("type", 'click');
    this.addWidget("combo", "type", "click", {values: ["click", "scrollUp", "scrollDown"], property: "type"});
    this.widgets_up = true;
    this.size = [150, 30];
}

MouseMiddle.title = "鼠标中键";
MouseMiddle.desc = "鼠标中键";


function MouseRight() {
    this.addInput("cmd", "cmd");
    this.addOutput("cmd", "cmd");
    this.widgets_up = true;
    this.size = [120, 30];
}

MouseRight.title = "鼠标右键";
MouseRight.desc = "鼠标右键";


function MouseMove() {
    this.addInput("cmd", "cmd");
    this.addInput("location", "location");
    this.addOutput("cmd", "cmd");
    this.addProperty("value", "x,y");
    this.widget = this.addWidget("text", "location", "x,y", "value");

    this.addProperty("duration", 0);
    this.widget = this.addWidget("number", "duration", 0, "duration");
    this.widgets_up = true;
    this.size = [190, 60];

}

MouseMove.title = "鼠标移动";
MouseMove.desc = "鼠标移动";