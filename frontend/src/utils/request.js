import {getUserSettings} from "./settings";

function request(options) {
    // 使用fetch函数发送请求，并返回一个Promise对象
    let param = {
        method: options.method,
        headers: options.headers,
        body: JSON.stringify(options.body)
    }
    if (options.method === "GET") {
        delete param.body;
    }
    const host = getUserSettings('settings.host');
    return fetch(`${host}${options.url}`, param)
        .then((response) => {
            // 请求成功，检查响应状态码
            if (response.ok) {
                return response.json();
            } else {
                // 状态码为其他，抛出错误
                throw new Error("Error: " + response.statusText);
            }
        })
        .catch((error) => {
            // 处理错误，例如打印
            console.log(error);
        });
}

export default request;