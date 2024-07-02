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



