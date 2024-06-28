const getUserSettings = (path, defaultValue = "") => {
    // 从本地存储中获取当前用户配置
    const storedSettings = localStorage.getItem('userSettings');
    let settings = {};
    if (storedSettings) {
        settings = JSON.parse(storedSettings);
    }

    const pathArray = path.split('.');
    let temp = settings;
    for (let i = 0; i < pathArray.length; i++) {
        if (temp.hasOwnProperty(pathArray[i])) {
            if (i === pathArray.length - 1) {
                return temp[pathArray[i]];
            }
            temp = temp[pathArray[i]];
            continue
        }
        if (defaultValue !== ""){
            saveUserSettings(path, defaultValue)
        }
        // 如果路径中的某个键不存在，则返回默认值
        return defaultValue;
    }

};



// 将用户配置存储到本地存储中
const saveUserSettings = (path, value) => {
    // 从本地存储中获取当前用户配置
    const storedSettings = localStorage.getItem('userSettings');
    let settings = {};
    if (storedSettings) {
        settings = JSON.parse(storedSettings);
    }

    // 创建新的设置对象
    const newSettings = {...settings};

    // 设置路径中的值
    const pathArray = path.split('.');
    let temp = newSettings;
    for (let i = 0; i < pathArray.length; i++) {
        if (i === pathArray.length - 1) {
            temp[pathArray[i]] = value;
        } else {
            temp[pathArray[i]] = {...temp[pathArray[i]]};
            temp = temp[pathArray[i]];
        }
    }

    // 将新的用户配置保存到本地存储
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
};