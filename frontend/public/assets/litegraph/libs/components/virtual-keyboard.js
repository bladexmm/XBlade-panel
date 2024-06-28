// 虚拟键盘配置
function addCols(col) {
    let keys_html = ''
    for (let i = 0; i < col.label.length; i++) {
        keys_html += '<span>' + col.label[i] + '</span>'
    }
    let keysPress = 'data-keys="' + col.values.join(',') + '"';
    if (col.label.length === 0) {
        return '<div class="virtual-keys virtual-keys-empty"></div>';
    } else {
        return '<div class="virtual-keys virtual-keys-click" ' + keysPress + '>' + keys_html + '</div>';
    }
}



// 获取具有 virtual-keys-close 类名的元素
var closeButton = document.querySelector('.virtual-keys-close');

// 添加点击事件监听器
closeButton.addEventListener('click', function () {
    var keyboard = document.querySelector('.virtual-keyboard');
    keyboard.classList.add('hidden'); // 添加 visible 类
});

virtual_keyboards.forEach(function (keys) {
    const keyboard_col = document.querySelector('.virtual-col.' + keys.name);
    let html = "";
    for (let i = 0; i < keys.cols.length; i++) {
        html += addCols(keys.cols[i]);
    }
    keyboard_col.innerHTML += html;
});