import json
import time
import urllib
from urllib.parse import urlencode

import requests
from flask import render_template_string

from libs.utils.log import Logger
from libs.utils.nodes.base import alias, nodeOutput, getInput, get_value_by_path, setVar, getVars


@alias("编程/等待(TimeWait)")
def TimeWait(node):
    wait_time = int(node['properties']['value']) / 1000
    time.sleep(wait_time)
    return nodeOutput(1, node, 'out', '')


@alias("编程/请求接口(FetchApi)")
def FetchApi(node):
    url = getInput(node['inputs'], 1)
    data_str = getInput(node['inputs'], 2)
    header_str = getInput(node['inputs'], 3)
    method = node['properties']['method']
    req_type = node['properties']['type']
    headers = {}
    if header_str is not None:
        # 解析并转换header
        headers = {k.strip(): v.strip() for k, v in (item.split(':') for item in header_str.split('\n') if item)}
    data = {}
    Logger.debug(f"url:{url}")
    if data_str is not None:
        # GET请求不处理data，除非需要将其转换为查询参数，这里先忽略此情况
        data = [item.split(':') for item in data_str.split('\n') if item]
        data = {k.strip(): v.strip() for k, v in data}
    if method.lower() == 'get':  # 只有非GET请求才处理data
        data_pairs = urlencode(data)
        url += '?' + data_pairs
    elif req_type == 'x-www-form-urlencoded':
        data = urlencode(data)
    elif req_type == 'json':
        headers.update({'Content-Type': 'application/json'})
        data = json.dumps(data)
    elif req_type == 'form-data':
        headers.update({'Content-Type': 'application/form-data'})
    else:
        pass
    # 发送HTTP请求获取图片内容
    proxies = {"http": None, "https": None}
    system_proxies = urllib.request.getproxies()
    if system_proxies:
        proxies.update({"http": system_proxies['http'], "https": system_proxies['http']})
    Logger.debug(f"data:{data}")
    response = requests.request(method, url, headers = headers, proxies = proxies, timeout = 5,
                                data = data if data is not None and method.lower() != 'get' else None)
    
    Logger.debug(f"response:{response.text}")
    return nodeOutput(1, node, 'out', ['', response.text, ''])


@alias("编程/获取JSON参数(GetJson)")
def GetJson(node):
    response = getInput(node['inputs'], 1)
    path = getInput(node['inputs'], 2)
    data = json.loads(response)
    params = path.split('\n')
    params = [sublist for sublist in params if sublist]
    result = []
    for param in params:
        res = get_value_by_path(param, data)
        if res == "404 Not Found Val":
            result.append('')
        else:
            result.append(res)
    # 判断结果是否为空
    filtered_list = [s for s in result if s]
    if len(filtered_list) == 0:
        return nodeOutput(1, node, 'error', ['', '', None, None])

    textOutput = ''
    ArrayOutput = result
    if len(params) == 1:
        # 处理单个参数
        textOutput = str(result[0][0])
        ArrayOutput = result[0]
    else:
        # 处理多个参数
        flattened_list = [item for sublist in result for item in sublist if item]
        textOutput = ','.join(flattened_list)
    return nodeOutput(1, node, 'out', ['', '', textOutput, ArrayOutput])


@alias("编程/判断(IfValid)")
def IfValid(node):
    input1 = getInput(node['inputs'], 1)
    input2 = getInput(node['inputs'], 2)
    if input1 == input2:
        return nodeOutput(1, node, 'true', ['', ''])
    else:
        return nodeOutput(1, node, 'false', ['', ''])


@alias("编程/选择结构(switchValid)")
def SwitchValid(node):
    input1 = getInput(node['inputs'], 1)
    if input1 is None:
        return nodeOutput(1, node, 'error', ['', input1])
    print(f"input1:{input1}")
    for slot in range(2, 11):
        validVal = getInput(node['inputs'], slot)
        print(f"validVal:{validVal}")
        if input1 == validVal:
            print(f"slot:{slot-1}")
            return nodeOutput(1, node, str(slot - 1), ['', input1])

    return nodeOutput(1, node, 'error', ['', input1])


@alias("编程/格式化字符串(FormatText)")
def FormatText(node):
    text = node['properties']['text']
    app = render_template_string(
        text,
        text1 = getInput(node['inputs'], 1),
        text2 = getInput(node['inputs'], 2),
        array1 = getInput(node['inputs'], 3),
        array2 = getInput(node['inputs'], 4)
    )
    return nodeOutput(1, node, 'out', ['', app])


@alias("编程/记录日志(logDebug)")
def logDebug(node):
    for idx in range(1, 5):
        if getInput(node['inputs'], idx) is not None:
            val = getInput(node['inputs'], idx)
            Logger.debug(f"编程/记录日志(logDebug)：{val}")
    return nodeOutput(1, node, 'out', [''])


@alias("编程/配置局部变量(SetLocalVariables)")
def SetLocalVariables(node):
    # 读取或初始化局部变量存储
    localVars_path = f'./data/app/{node["app"]["id"]}.json'
    return setVar(localVars_path, node)


@alias("编程/配置全局变量(SetGlobalVariables)")
def SetGlobalVariables(node):
    localVars_path = './data/globalVars.json'
    return setVar(localVars_path, node)


@alias("编程/获取局部变量(GetLocalVariables)")
def SetGlobalVariables(node):
    localVars_path = f'./data/app/{node["app"]["id"]}.json'
    return getVars(localVars_path, node)


@alias("编程/获取全局变量(GetGlobalVariables)")
def SetGlobalVariables(node):
    localVars_path = './data/globalVars.json'
    return getVars(localVars_path, node)
