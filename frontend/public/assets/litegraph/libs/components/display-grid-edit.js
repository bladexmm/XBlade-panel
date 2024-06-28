
let items = [];

// GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });

let layout = 'list';

function column(n) {
    grid.column(n, layout);
}


function rows(n) {
    grid.row(n, layout);
}

function inputSlots(list) {
    let inputs = [];
    list.forEach(item => {
        // 使用正则表达式匹配data-type的值
        const dataTypeMatch = item.content.match(/data-type="([^"]+)"/);
        const dataTypeValue = dataTypeMatch ? dataTypeMatch[1] : null;

        // 匹配span标签内的文本内容，去除HTML标签
        const textContentMatch = item.content.match(/<span[^>]*>(.*?)<\/span>/);
        const spanTextContent = textContentMatch ? textContentMatch[1] : null;

        inputs.push({ name: spanTextContent, type: dataTypeValue })
    });
    return inputs;

}

function gridAdd(name, type) {
    let n = {
        w: 1,
        h: 1,
        content: '<span class=\"grid-app-new\" data-type=\"' + type + '\">' + name + '_'
            + generateRandomLetter(2) + generateRandomString(5) + '</span>',
    };
    grid.addWidget(n);
}

function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // 定义可能的字符集
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


function generateRandomLetter(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // 定义可能的字符集
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function gridSave() {
    return grid.save(true, true);
}


function gridClose() {
    var keyboard = document.querySelector('.display-grid-edit');
    keyboard.classList.add('hidden'); // 添加 visible 类
}

function gridLoad(layout, firsLoad) {
    if (!firsLoad) {
        grid.destroy();
    }
    document.querySelector('.layout-x').value = layout.column;
    document.querySelector('.layout-y').value = layout.minRow;

    var gridContentElement = document.querySelector('.grid-content');
    gridContentElement.insertAdjacentHTML('beforeend', '<div class="grid-stack"></div>');
    document.querySelector('.grid-stack').style.width = 80 * parseInt(layout.column) + "px";
    grid = GridStack.init(layout);
}

function gridUpdate() {
    // 销毁旧layout
    var layout = grid.save(true, false);
    grid.destroy();

    // 开始新增grid
    var col = document.querySelector('.layout-x').value;
    var row = document.querySelector('.layout-y').value;
    var gridContentElement = document.querySelector('.grid-content');
    gridContentElement.insertAdjacentHTML('beforeend', '<div class="grid-stack"></div>');
    document.querySelector('.grid-stack').style.width = 80 * parseInt(col) + "px";

    // 初始化grid
    grid = GridStack.init({
        column: parseInt(col),
        cellHeight: 80,
        float: true,
        row: parseInt(row),
        margin: 0,
        acceptWidgets: true,
        removable: '#grid-app-trash',
    }).load(layout);
}
