
function initHosts() {
    let hosts = getUserSettings('settings.hosts', []);
    let host = getUserSettings('settings.host');
    // 假设你要清空类名为 'container' 的元素内的所有子元素
    var containerElement = document.querySelector('.list');

    // 清空选定元素的所有子元素
    while (containerElement.firstChild) {
        containerElement.removeChild(containerElement.firstChild);
    }
    let hostsCode = ''
    hosts.forEach(element => {
        let defaultText = element === host ? '当前默认' : '设为默认';
        hostsCode += `
            <div class="host">
                <h3>${element}</h3>
                <button class="button-86 small" onclick="setDefaultHost('${element}')">${defaultText}</button>
                <button class="button-86 small" onclick="delHost('${element}')">删除</button>
            </div>
        `;
    });
    containerElement.insertAdjacentHTML('beforeend', hostsCode);
}

function setDefaultHost(host) {
    saveUserSettings('settings.host', host);
    initHosts()
}

function delHost(host) {
    let hosts = getUserSettings('settings.hosts', []);
        // 查找元素的索引
    let index = hosts.indexOf(host);

    // 如果找到了该元素，使用 splice 删除它
    if (index > -1) {
        hosts.splice(index, 1);
    }
    saveUserSettings('settings.hosts', hosts);
    initHosts()
}

function addHost() {
    let input = document.getElementsByClassName('host-input');
    let inputVal = input[0].value;
    let hosts = getUserSettings('settings.hosts', []);
    if (hosts.includes(inputVal) == false) {
        hosts.push(inputVal)
        saveUserSettings('settings.hosts', hosts);
    }
    initHosts()
}


function addHostScan(hostName) {
    let hosts = getUserSettings('settings.hosts', []);
    if (hosts.includes(hostName) == false) {
        hosts.push(hostName)
        saveUserSettings('settings.hosts', hosts);
    }
    saveUserSettings('settings.host', hostName);
    initHosts()
}

function GoHome(){
    window.location.href="./index.html"
}