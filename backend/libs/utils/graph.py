import json
import re
import time
import subprocess
import urllib
import webbrowser
from urllib.parse import urlencode
from flask import render_template_string

import pyautogui
import pyperclip
from string import Template

import requests

from libs.utils.log import Logger
from libs.utils.tools import read_json, write_json


def nodeOutput(code, node, name = 'cmd', data = None):
    return {"code": code, "id": node['id'], "type": node['type'], "name": name,
            "data": data if data is not None else ""}


class XbladeGraph:
    decorated_funcs = {}

    @classmethod
    def decorator(cls, alias):
        def wrapper(func):
            names = alias.split('(')
            if len(alias) == 2:
                names[1] = names[1].replace(')', '')
            for name in names:
                cls.decorated_funcs[name] = func
            cls.decorated_funcs[alias] = func

            return func

        return wrapper

    @classmethod
    def call_func_by_alias(cls, alias, *args, **kwargs):
        for name in alias:
            if name in cls.decorated_funcs:
                return cls.decorated_funcs[name](*args, **kwargs)
        return None


@XbladeGraph.decorator("基础/结束(CMDEnd)")
def CMDEnd(node):
    return nodeOutput(3, node, 'out', [''])


@XbladeGraph.decorator("基础/合并运行(MultiMerge)")
def MultiMerge(node):
    return nodeOutput(1, node, 'out', [''])


@XbladeGraph.decorator("绘图/布局(DisplayGrid)")
def DisplayGrid(node):
    style = getInput(node['inputs'], 1)
    nodes = []
    if len(node['inputs']) > 2:
        for input in node['inputs'][2:]:
            input['value']['id'] = input['name'].split('_')[1]
            nodes.append(input['value'])
    data = {
        "style" : InitStyle(style),
        "layout": json.loads(node['properties']['layout']),
        "nodes" : nodes
    }
    layouts = data['layout']['children']
    for layout in layouts:
        data_type, image_id = extract_data_from_html(layout['content'])
        idx = 0
        for index, node in enumerate(nodes):
            if node['id'] == image_id:
                idx = index
                break
        data['nodes'][idx]['id'] = image_id
        data['nodes'][idx]['type'] = data_type
        data['nodes'][idx]['style']['gridArea'] = image_id
        data['nodes'][idx]['style']['height'] = data['nodes'][idx]['style'].get('height', '100%')
        data['nodes'][idx]['style']['width'] = data['nodes'][idx]['style'].get('width', '100%')
        data['nodes'][idx]['style']['margin'] = data['nodes'][idx]['style'].get('margin', 0)
        data['nodes'][idx]['style']['padding'] = data['nodes'][idx]['style'].get('padding', 0)
        data['nodes'][idx]['w'] = layout['w'] if 'w' in layout else 1
        data['nodes'][idx]['h'] = layout['h'] if 'h' in layout else 1
        data['nodes'][idx]['x'] = layout['x'] if 'x' in layout else 1
        data['nodes'][idx]['y'] = layout['y'] if 'y' in layout else 1
    data['grid-template-areas'] = json_to_layout_string_with_xy(data['nodes'])
    data['style']['gridTemplateAreas'] = [f"'{area}'" for area in data['grid-template-areas'].split('\n')]
    data['style']['gridTemplateAreas'] = ' '.join(data['style']['gridTemplateAreas'])
    data['style']['gridTemplateColumns'] = f"repeat({data['layout']['column']},1fr)"
    data['style']['gridTemplateRows'] = f"repeat({data['layout']['maxRow']},1fr)"

    data['style']['display'] = 'grid'
    data['style']['height'] = data['style'].get('height', '100%')
    data['style']['width'] = data['style'].get('width', '100%')
    data['style']['margin'] = data['style'].get('margin', 0)
    data['style']['padding'] = data['style'].get('padding', 0)

    return nodeOutput(3, node, 'out', data)


@XbladeGraph.decorator("绘图/图片(DisplayImage)")
def DisplayImage(node):
    image = getInput(node['inputs'], 0)
    style = getInput(node['inputs'], 1)
    return nodeOutput(1, node, 'out', [{
        "nid"       : node['id'],
        "type"      : "image",
        "style"     : InitStyle(style),
        "image"     : image,
        "properties": node['properties']
    }, node.get('value', '')])


@XbladeGraph.decorator("绘图/文字(DisplayText)")
def DisplayText(node):
    text = getInput(node['inputs'], 0)
    style = getInput(node['inputs'], 1)
    return nodeOutput(1, node, 'out', [{
        "nid"       : node['id'],
        "type"      : "string",
        "style"     : InitStyle(style),
        "text"      : text,
        "properties": node['properties']
    }, node.get('value', '')])


@XbladeGraph.decorator("绘图/输入框(DisplayInput)")
def DisplayInput(node):
    placeholder = getInput(node['inputs'], 0)
    style = getInput(node['inputs'], 1)
    value = getInput(node['inputs'], 2)
    node['properties']['defaultValue'] = '' if value is None else value
    return nodeOutput(1, node, 'out', [{
        "nid"        : node['id'],
        "type"       : "input",
        "style"      : InitStyle(style),
        "placeholder": placeholder,
        "properties" : node['properties']
    }, node.get('value', '')])


@XbladeGraph.decorator("绘图/折线图(DisplayLineChart))")
def DisplayChart(node):
    style = getInput(node['inputs'], 0)
    title = getInput(node['inputs'], 1)
    optionsInput = getInput(node['inputs'], 2)
    data1 = getInput(node['inputs'], 3)
    name1 = getInput(node['inputs'], 4)
    data2 = getInput(node['inputs'], 5)
    name2 = getInput(node['inputs'], 6)
    data3 = getInput(node['inputs'], 7)
    name3 = getInput(node['inputs'], 8)
    data = []
    if data1 is not None:
        name1 = name1 if name1 is not None else title
        data.append({
            "name": name1,
            "data": data1
        })

    if data2 is not None:
        name2 = name2 if name2 is not None else title
        data.append({
            "name": name2,
            "data": data2
        })

    if data3 is not None:
        name3 = name3 if name3 is not None else title
        data.append({
            "name": name3,
            "data": data3
        })

    xAxis = getInput(node['inputs'], 9)
    options = {
        "chart"     : {
            "height"    : "100%",
            "width"     : "100%",
            "background": 'transparent',
            "type"      : 'area',
            "toolbar"   : {
                "show": False
            },
            "zoom"      : {
                "enabled": False  # 缩放控制
            }
        },
        "dataLabels": {
            "enabled": True
        },
        "stroke"    : {
            "curve": 'smooth'
        },
        "grid"      : {
            "row" : {
                "opacity": 0
            },
            "show": False
        },
        "title"     : {
            "text" : title,
            "align": 'left'
        },
        "xaxis"     : {
            "categories": xAxis,
            "labels"    : {
                "show": False
            },
            "axisBorder": {
                "show": False  # 隐藏X轴边框
            },
            "axisTicks" : {
                "show": False  # 隐藏X轴刻度线
            },
        },
        "yaxis"     : {
            "labels"    : {
                "show": False
            },
            "axisBorder": {
                "show": False  # 隐藏X轴边框
            },
            "axisTicks" : {
                "show": False  # 隐藏X轴刻度线
            },
        },
    }
    if optionsInput is not None:
        optionsInput = json.loads(optionsInput)
        options.update(optionsInput)
    return nodeOutput(1, node, 'out', [{
        "nid"       : node['id'],
        "type"      : "line_chart",
        "style"     : InitStyle(style),
        "xAxis"     : xAxis,
        "series"    : data,
        "options"   : options,
        "data"      : data,
        "properties": node['properties']
    }, node.get('value', '')])


@XbladeGraph.decorator("绘图/按钮(DisplayButton)")
def DisplayButton(node):
    placeholder = getInput(node['inputs'], 0)
    style = getInput(node['inputs'], 1)
    return nodeOutput(1, node, 'out', [{
        "nid"        : node['id'],
        "type"       : "button",
        "placeholder": placeholder,
        "style"      : InitStyle(style),
        "properties" : node['properties']
    }, node.get('value', '')])


@XbladeGraph.decorator("编程/等待(TimeWait)")
def TimeWait(node):
    wait_time = int(node['properties']['value']) / 1000
    time.sleep(wait_time)
    return nodeOutput(1, node, 'out', '')


@XbladeGraph.decorator("编程/请求接口(FetchApi)")
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

    response = requests.request(method, url, headers = headers, proxies = proxies, timeout = 5,
                                data = data if data is not None and method.lower() != 'get' else None)
    return nodeOutput(1, node, 'out', ['', response.text, ''])


@XbladeGraph.decorator("编程/获取JSON参数(GetJson)")
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
        textOutput = ','.join(result[0])
        ArrayOutput = result[0]
    else:
        # 处理多个参数
        flattened_list = [item for sublist in result for item in sublist if item]
        textOutput = ','.join(flattened_list)
    return nodeOutput(1, node, 'out', ['', '', textOutput, ArrayOutput])


@XbladeGraph.decorator("编程/判断(IfValid)")
def IfValid(node):
    input1 = getInput(node['inputs'], 1)
    input2 = getInput(node['inputs'], 2)
    if input1 == input2:
        return nodeOutput(1, node, 'true', ['', ''])
    else:
        return nodeOutput(1, node, 'false', ['', ''])


@XbladeGraph.decorator("编程/选择结构(switchValid)")
def SwitchValid(node):
    input1 = getInput(node['inputs'], 1)
    if input1 is None:
        return nodeOutput(1, node, 'error', ['', input1])
    for slot in range(2, 11):
        validVal = getInput(node['inputs'], slot)
        if input1 == validVal:
            return nodeOutput(1, node, str(slot - 1), ['', input1])

    return nodeOutput(1, node, 'error', ['', input1])


@XbladeGraph.decorator("编程/格式化字符串(FormatText)")
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


@XbladeGraph.decorator("编程/记录日志(logDebug)")
def logDebug(node):
    for idx in range(1, 5):
        if getInput(node['inputs'], idx) is not None:
            val = getInput(node['inputs'], idx)
            Logger.debug(f"编程/记录日志(logDebug)：{val}")
    return nodeOutput(1, node, 'out', [''])


@XbladeGraph.decorator("编程/配置局部变量(SetLocalVariables)")
def SetLocalVariables(node):
    # 读取或初始化局部变量存储
    localVars_path = f'./data/app/{node["app"]["id"]}.json'
    return setVar(localVars_path, node)


@XbladeGraph.decorator("编程/配置全局变量(SetGlobalVariables)")
def SetGlobalVariables(node):
    localVars_path = './data/globalVars.json'
    return setVar(localVars_path, node)


@XbladeGraph.decorator("编程/获取局部变量(GetLocalVariables)")
def SetGlobalVariables(node):
    localVars_path = f'./data/app/{node["app"]["id"]}.json'
    return getVars(localVars_path, node)


@XbladeGraph.decorator("编程/获取全局变量(GetGlobalVariables)")
def SetGlobalVariables(node):
    localVars_path = './data/globalVars.json'
    return getVars(localVars_path, node)


@XbladeGraph.decorator("输入/文本(TextInput)")
def TextInput(node):
    return nodeOutput(1, node, 'out', [node['properties']['text']])


@XbladeGraph.decorator("输入/列表(ArrayInput)")
def ArrayInput(node):
    return nodeOutput(1, node, 'out', [node['properties']['value'].split('\n')])


@XbladeGraph.decorator("输入/图片(ImageInput)")
def ImageInput(node):
    return nodeOutput(1, node, 'out', [node['properties']['image']])


@XbladeGraph.decorator("自动化/图片定位(LocateOnScreenNode)")
def LocateOnScreenNode(node):
    # 判断是否有外部图片输入
    if len(node['inputs'][1].get('value', '')) > 0:
        image_path = 'react_app' + node['inputs'][1]['value']
    else:
        image_path = 'react_app' + node['properties']['image']
    try:
        x, y = pyautogui.locateCenterOnScreen(
            image_path,
            minSearchTime = node['properties']['searchTime'],
            grayscale = node['properties']['grayscale'],
            confidence = round(node['properties']['confidence'], 2))
    except pyautogui.ImageNotFoundException:
        return nodeOutput(1, node, 'error', '')
    return nodeOutput(1, node, 'out', [[], [int(x), int(y)]])


@XbladeGraph.decorator("自动化/查找图片(FindImage)")
def FindImage(node):
    start_time = time.time()
    search_time = int(node['properties']['searchTime'])
    while time.time() - start_time < search_time:
        for idx, node_input in enumerate(node['inputs']):

            if node_input.get('value', '') == '':
                continue
            image_path = 'react_app' + node_input['value']
            try:
                x, y = pyautogui.locateCenterOnScreen(
                    image_path,
                    grayscale = node['properties']['grayscale'],
                    confidence = round(node['properties']['confidence'], 2))
                return nodeOutput(1, node, str(idx + 1), [[], [int(x), int(y)]])
            except pyautogui.ImageNotFoundException:
                pass
    return nodeOutput(1, node, 'error', [])


@XbladeGraph.decorator("自动化/运行软件(startApp)")
def StartApp(node):
    app = node['properties']['app']
    folder = node['properties']['folder']
    if node['parent'] is not None:
        templ = Template(app)
        app = templ.safe_substitute(**node['parent'])
    subprocess.Popen([app, folder])
    return nodeOutput(1, node, 'out', '')


@XbladeGraph.decorator("自动化/打开链接(openLink)")
def openLink(node):
    link = getInput(node['inputs'], 1)
    if link is not None:
        webbrowser.open(link)
    return nodeOutput(1, node, 'out', [''])


@XbladeGraph.decorator("组件/实例化(Subgraph)")
def Subgraph(node):
    outputNode = node['result'][-1]
    outputs = []
    SubgraphOutputNodes = [node for node in node['subgraph']['nodes'] if 'SubgraphOutput' in node['type']]
    for output in SubgraphOutputNodes:
        output['inputs'][0]['name'] = output['properties']['name']
    for output in node['outputs']:
        if output['type'] == 'cmd':
            outputs.append('')
            continue
        for subNode in SubgraphOutputNodes:
            properties = subNode['properties']
            if properties['name'] == output['name'] and properties['type'] == output['type']:
                outputs.append(subNode['inputs'][0]['value'])
        outputs.append(None)

    return nodeOutput(1, node, outputNode['name'], outputs)


@XbladeGraph.decorator("组件/输入(SubgraphInput)")
def SubgraphInput(node):
    return nodeOutput(1, node, 'out', [node['properties']['value']])


@XbladeGraph.decorator("组件/输出(SubgraphOutput)")
def SubgraphOutput(node):
    InputSlot = getInput(node['inputs'], 0)
    return nodeOutput(1, node, node['properties']['name'], [InputSlot])


def getInput(inputs, slot, default = None):
    inputSlot = inputs[slot]
    return inputSlot.get('value', default)


@XbladeGraph.decorator("模拟/快捷键(Hotkeys)")
def hotkey(node):
    keys = json.loads(node['properties']['value'])
    type = node['properties']['inputType']
    if type == 'hotkeys':
        pyautogui.hotkey(*keys)
    elif type == 'keyDown':
        for key in keys:
            pyautogui.keyDown(key)
    elif type == 'keyUp':
        for key in keys:
            pyautogui.keyUp(key)
    elif type == 'typeWrite':
        pyautogui.typewrite(keys, interval = 0.05)
    return nodeOutput(1, node, 'out', '')


@XbladeGraph.decorator("模拟/文本输入(TypeText)")
def typewrite(node):
    pyperclip.copy(node['properties']['value'])
    pyautogui.hotkey("ctrl", "v")
    return nodeOutput(1, node, 'out', '')


@XbladeGraph.decorator("模拟/鼠标移动(MouseMove)")
def MouseMoveTO(node):
    # 优先用传入的坐标
    if 'value' in node['inputs'][1]:
        if node['inputs'][1]['value'] is None:
            return nodeOutput(1, node, 'out', '')
        x, y = node['inputs'][1]['value']
        # 开始设置点击偏移
        if node['properties']['value'] != 'x,y':
            parts = node['properties']['value'].split(',')
            offset_x, offset_y = int(parts[0]), int(parts[1])
            x, y = x + offset_x, y + offset_y
    else:
        if node['properties']['value'] == 'x,y':
            return nodeOutput(1, node, 'out', '')
        parts = node['properties']['value'].split(',')
        x, y = int(parts[0]), int(parts[1])

    pyautogui.moveTo(x, y, duration = node['properties']['duration'])
    return nodeOutput(1, node, 'out', '')


@XbladeGraph.decorator("模拟/鼠标左键(MouseLeft)")
def leftClick(node):
    type = node['properties']['type']
    if type == 'click':
        pyautogui.click()
    elif type == 'mouseDown':
        pyautogui.mouseDown()
    elif type == 'mouseUp':
        pyautogui.mouseUp()
    return nodeOutput(1, node, 'out', '')


@XbladeGraph.decorator("模拟/鼠标中键(MouseMiddle)")
def middleClick(node):
    type = node['properties']['type']
    if type == 'click':
        pyautogui.middleClick()
    elif type == 'scrollUp':
        pyautogui.scroll(-10)
    elif type == 'scrollDown':
        pyautogui.scroll(10)
    return nodeOutput(1, node, 'out', '')


@XbladeGraph.decorator("模拟/鼠标右键(MouseRight)")
def rightClick(node):
    pyautogui.rightClick()
    return nodeOutput(1, node, 'out', '')


def get_value_by_path(path, value):
    current = value
    paths = path.split('.')
    data = []
    for idx, path in enumerate(paths):
        if path == "*":
            for subData in current:
                values = get_value_by_path('.'.join(paths[idx + 1:]), subData)
                if values == "404 Not Found Val":
                    return "404 Not Found Val"
                data = data + values
            break

        # 判断是否为 下标
        if check_first_char(path):
            path = int(path)
            if not has_element_at_index(current, path):
                return "404 Not Found Val"
            current = current[path]
            if idx == len(paths) - 1:
                data.append(current)
            continue
        # 判断key是否妇女在
        if path not in current:
            return "404 Not Found Val"
        current = current[path]
        if idx == len(paths) - 1:
            data.append(current)
    return data


def check_first_char(s):
    first_char = s[0] if s else ''  # 防止字符串为空时出现索引错误
    return first_char == '-' or first_char.isdigit()


def has_element_at_index(path, index):
    try:
        _ = path[index]
        return True
    except IndexError:
        return False


def InitStyle(style):
    if style is None:
        return {}
    style = {k.strip(): v.strip() for k, v in (item.split(':') for item in style.split('\n') if item)}
    return style


def extract_data_from_html(html_string):
    """
    从给定的HTML字符串中提取data-type属性的值以及图片标识。

    参数:
    html_string (str): 包含特定结构的HTML字符串。

    返回:
    tuple: 包含两个元素的元组，第一个是data-type的值，第二个是图片标识。
           如果未找到匹配内容，返回(None, None)。
    """
    pattern = r'data-type=\"(.*?)\">(.*?)</span>'
    match = re.search(pattern, html_string)

    if match:
        data_type = match.group(1)
        # 假设图片标识是"data-type"和">"之间的内容，如果实际情况不同请调整
        image_identifier = match.group(2).split('_')[-1]  # 这里假设图片标识是下划线后的部分
        return data_type, image_identifier
    else:
        return None, None


def json_to_layout_string_with_xy(data):
    """
    尝试模拟考虑了x、y坐标的布局输出，但请注意文本输出的局限性。

    参数:
    data (list): 带有x, y, w, h属性的布局元素列表。

    返回:
    str: 近似模拟了x, y坐标的布局字符串。
    """
    # 初始化一个二维列表来模拟布局
    max_y = max(item.get('y', 0) + item.get('h', 0) for item in data)
    layout_grid = [['' for _ in range(100)] for _ in range(max_y)]  # 假设最大宽度为100，可根据实际情况调整

    for item in data:
        id_to_repeat = item.get("id", "")
        x = item.get("x", 0)
        y = item.get("y", 0)
        width = item.get("w", 0)
        height = item.get("h", 0)

        for row in range(y, y + height):
            for col in range(x, x + width):
                if col < len(layout_grid[row]):
                    layout_grid[row][col] = id_to_repeat

    # 将二维列表转换为字符串
    output_lines = [' '.join(row).rstrip() for row in layout_grid]
    return '\n'.join(output_lines)


def setVar(localVars_path, node):
    # 获取输入值
    inputs = {key: getInput(node['inputs'], index) for index, key in
              enumerate(['cmd','text', 'array', 'location', 'response'])}
    name = node['properties']['name']

    localVars = read_json(localVars_path) or []
    # 根据输入确定要设置的值
    for key, value in inputs.items():
        if value is not None:
            value_to_set = {"name": name, "type": key, "value": value}
            # 更新或添加局部变量
            for var in localVars:
                if var['name'] == name and var['type'] == value_to_set['type']:
                    var.update(value_to_set)
                    break
            else:
                localVars.append(value_to_set)
            # 写回局部变量到文件
            write_json(localVars_path, localVars, 'w')
            break  # 只处理第一个非None的输入

    return nodeOutput(1, node, 'out', [''])


def getVars(localVars_path, node):
    localVars = read_json(localVars_path) or []
    name = node['properties']['name']
    result = []
    for output in node['outputs']:
        valFound = [var for var in localVars if var['name'] == name and var['type'] == output['type']]
        if len(valFound) == 0:
            result.append(None)
        else:
            result.append(valFound[0]['value'])
    return nodeOutput(1, node, 'out', result)
