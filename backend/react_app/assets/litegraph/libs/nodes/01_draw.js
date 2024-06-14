const MuiColor = ["primary", "neutral","danger","success","warning"];
const MuiVariant = ["plain", "outlined","soft","solid"];
function DisplayStart() {
    this.desc = "绘制图标开始";
    this.addOutput("out", "cmd")
    this.size = [90, 30];
}

DisplayStart.title = "开始绘图";


function DisplayGrid() {
    this.desc = "编辑布局";
    this.addInput("in", "cmd")
    this.addInput("style", "text")

    this.addProperty("layout", '{"column":3,"cellHeight":80,"float":true,"margin":0,"acceptWidgets":true,"removable":"#grid-app-trash","maxRow":3,"minRow":3,"children":[]}');
    const keyboard = document.querySelector('.display-grid-edit');
    const self = this;
    let firstLoad = true;

    this.addWidget("button", "编辑布局", null, function () {
        keyboard.classList.remove('hidden');
        gridLoad(JSON.parse(self.properties.layout),firstLoad);
        if(firstLoad){
            firstLoad = false;
        }
    });

    var gridSaveBtn = document.querySelector('#grid-save');
    gridSaveBtn.addEventListener('click', function() {
        const layout = gridSave();
        self.setProperty('layout', JSON.stringify(layout));
        gridClose();
    
        const inputEle = inputSlots(layout.children);
    
        // 移除不存在的input
        self.inputs.slice().reverse().forEach((slot, index) => {
            if (slot.type === 'cmd') return; // 跳过特定类型
            if (slot.type === 'text') return; // 跳过特定类型
            if (!inputEle.find(element => element.name === slot.name && element.type === slot.type)) {
                self.removeInput(self.inputs.length - 1 - index); // 从后向前移除
            }
        });
    
        // 添加或更新slot
        inputEle.forEach(grid => {
            if (!self.inputs.find(slot => grid.name === slot.name && grid.type === slot.type)) {
                self.addInput(grid.name, grid.type);
            }
            // 注意：根据原始逻辑，似乎不需要处理已存在的slot，因为它们不应该被再次添加
        });
    });

    this.size = [90, 70];
}

DisplayGrid.title = "显示布局";



function DisplayImage() {
    this.desc = "图片组件";
    this.addInput("image", "image")
    this.addInput("style", "text");


    this.addOutput("out", "grid_image")
    this.addOutput("onClick", "cmd")

    this.size = [120, 50];
}

DisplayImage.title = "图片组件";


function DisplayText() {
    this.desc = "文字组件";
    this.addInput("text", "text")
    this.addInput("style", "text");


    this.addOutput("out", "grid_string")
    this.addOutput("onClick", "cmd")

    this.addProperty("level", 'title-sm');
    this.inputTypeWidget = this.addWidget("combo", "level", 'title-sm', {
        values: ["h1", "h2", "h3", "h4","title-lg","title-md","title-sm","body-lg","body-md","body-sm","body-xs"],
        property: "level"
    });

    this.addProperty("color", 'primary');
    this.inputTypeWidget = this.addWidget("combo", "color", 'primary', {
        values: MuiColor,
        property: "color"
    });

    this.addProperty("variant", 'plain');
    this.inputTypeWidget = this.addWidget("combo", "variant", 'plain', {
        values: MuiVariant,
        property: "variant"
    });


    this.addProperty("noWrap", false);
    this.addWidget("toggle","noWrap", false,"noWrap", { on: "on", off:"off"} );


    this.size = [150, 150];
}

DisplayText.title = "文字组件";



function DisplayInput() {
    this.desc = "输入框组件";
    this.addInput("placeholder", "text")
    this.addInput("style", "text");
    this.addInput("value", "text");


    this.addOutput("out", "grid_input")
    this.addOutput("value", "text")
    this.addOutput("Enter", "cmd")

    
    this.addProperty("variant", 'plain');
    this.inputTypeWidget = this.addWidget("combo", "variant", 'plain', {
        values: MuiVariant,
        property: "variant"
    });

    this.addProperty("color", 'primary');
    this.inputTypeWidget = this.addWidget("combo", "color", 'primary', {
        values: MuiColor,
        property: "color"
    });

    this.addProperty("size", 'md');
    this.inputTypeWidget = this.addWidget("combo", "size", 'md', {
        values: ["sm", "md","lg"],
        property: "size"
    });

    this.size = [160, 150];
}

DisplayInput.title = "输入框组件";




function DisplayLineChart() {
    this.desc = "折线图";
    this.addInput("style", "text")
    this.addInput("title", "text")
    this.addInput("options", "text");

    this.addInput("data1", "array")
    this.addInput("name1", "text")

    this.addInput("data2", "array")
    this.addInput("name2", "text")

    this.addInput("data3", "array")
    this.addInput("name3", "text")

    this.addInput("xAxis", "array");

    this.addOutput("out", "grid_line_chart")
    this.addOutput("onClick", "cmd")
    
    this.size = [140, 210];
}

DisplayLineChart.title = "折线图";





function DisplayButton() {
    this.desc = "按钮";
    this.addInput("placeholder", "text")
    this.addInput("style", "text");


    this.addOutput("out", "grid_button")
    this.addOutput("onClick", "cmd")

    this.addProperty("variant", 'plain');
    this.inputTypeWidget = this.addWidget("combo", "variant", 'plain', {
        values: MuiVariant,
        property: "variant"
    });

    this.addProperty("color", 'primary');
    this.inputTypeWidget = this.addWidget("combo", "color", 'primary', {
        values: MuiColor,
        property: "color"
    });

    this.addProperty("size", 'md');
    this.inputTypeWidget = this.addWidget("combo", "size", 'md', {
        values: ["sm", "md","lg"],
        property: "size"
    });

    this.size = [160, 120];
}

DisplayButton.title = "按钮";
