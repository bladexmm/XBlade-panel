import json
import time
import subprocess
import pyautogui
import pyperclip
from string import Template


def nodeOutput(code, name = 'cmd', data = None):
    return {"code": code, "name": name, "data": data if data is not None else ""}


class XbladeGraph:
    decorated_funcs = {}

    @classmethod
    def decorator(cls, alias):
        def wrapper(func):
            cls.decorated_funcs[alias] = func
            return func

        return wrapper

    @classmethod
    def call_func_by_alias(cls, alias, *args, **kwargs):
        if alias in cls.decorated_funcs:
            return cls.decorated_funcs[alias](*args, **kwargs)
        else:
            raise KeyError(f"No function found with alias: {alias}")


@XbladeGraph.decorator("基础/等待")
def wait(next_node):
    wait_time = int(next_node['properties']['value']) / 1000
    time.sleep(wait_time)
    return nodeOutput(1, 'cmd', '')


@XbladeGraph.decorator("输入/文本输入")
def typewrite(next_node):
    pyperclip.copy(next_node['properties']['value'])
    pyautogui.hotkey("ctrl", "v")
    return nodeOutput(1, 'cmd', '')


@XbladeGraph.decorator("输入/快捷键")
def hotkey(next_node):
    keys = json.loads(next_node['properties']['value'])
    type = next_node['properties']['inputType']
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
    return nodeOutput(1, 'cmd', '')


@XbladeGraph.decorator("输入/鼠标左键")
def leftClick(next_node):
    type = next_node['properties']['type']
    if type == 'click':
        pyautogui.click()
    elif type == 'mouseDown':
        pyautogui.mouseDown()
    elif type == 'mouseUp':
        pyautogui.mouseUp()
    return nodeOutput(1, 'cmd', '')


@XbladeGraph.decorator("输入/鼠标中键")
def middleClick(next_node):
    type = next_node['properties']['type']
    if type == 'click':
        pyautogui.middleClick()
    elif type == 'scrollUp':
        pyautogui.scroll(-10)
    elif type == 'scrollDown':
        pyautogui.scroll(10)
    return nodeOutput(1, 'cmd', '')


@XbladeGraph.decorator("输入/鼠标右键")
def rightClick(next_node):
    pyautogui.rightClick()
    return nodeOutput(1, 'cmd', '')


@XbladeGraph.decorator("输入/鼠标移动")
def MouseMoveTO(next_node):
    # 优先用传入的坐标
    if 'value' in next_node['inputs'][1]:
        if next_node['inputs'][1]['value'] is None:
            return nodeOutput(1, 'cmd', '')
        x, y = next_node['inputs'][1]['value']
        # 开始设置点击偏移
        if next_node['properties']['value'] != 'x,y':
            parts = next_node['properties']['value'].split(',')
            offset_x, offset_y = int(parts[0]), int(parts[1])
            x, y = x + offset_x, y + offset_y
    else:
        if next_node['properties']['value'] == 'x,y':
            return nodeOutput(1, 'cmd', '')
        parts = next_node['properties']['value'].split(',')
        x, y = int(parts[0]), int(parts[1])

    pyautogui.moveTo(x, y, duration = next_node['properties']['duration'])
    return nodeOutput(1, 'cmd', '')


@XbladeGraph.decorator("自动化/图片定位")
def LocateOnScreenNode(next_node):
    # 判断是否有外部图片输入
    if len(next_node['inputs'][1].get('value', '')) > 0:
        image_path = 'react_app' + next_node['inputs'][1]['value']
    else:
        image_path = 'react_app' + next_node['properties']['image']
    try:
        x, y = pyautogui.locateCenterOnScreen(
            image_path,
            minSearchTime = next_node['properties']['searchTime'],
            grayscale = next_node['properties']['grayscale'],
            confidence = round(next_node['properties']['confidence'], 2))
    except pyautogui.ImageNotFoundException:
        return nodeOutput(1, 'error', '')
    return nodeOutput(1, 'cmd', [[], [int(x), int(y)]])


@XbladeGraph.decorator("自动化/查找图片")
def FindImage(next_node):
    start_time = time.time()
    search_time = int(next_node['properties']['searchTime'])
    while time.time() - start_time < search_time:
        for idx, node_input in enumerate(next_node['inputs']):

            if node_input.get('value', '') == '':
                continue
            image_path = 'react_app' + node_input['value']
            try:
                x, y = pyautogui.locateCenterOnScreen(
                    image_path,
                    grayscale = next_node['properties']['grayscale'],
                    confidence = round(next_node['properties']['confidence'], 2))
                return nodeOutput(1, str(idx + 1), [])
            except pyautogui.ImageNotFoundException:
                pass
    return nodeOutput(1, 'error', [])


@XbladeGraph.decorator("自动化/运行软件")
def StartApp(next_node):
    app = next_node['properties']['app']
    folder = next_node['properties']['folder']
    if next_node['parent'] is not None:
        templ = Template(app)
        app = templ.safe_substitute(**next_node['parent'])
    subprocess.Popen([app, folder])
    return nodeOutput(1, 'cmd', '')


@XbladeGraph.decorator("基础/合并运行")
def MultiMerge(next_node):
    return nodeOutput(1, 'cmd', '')


@XbladeGraph.decorator("交互/图片")
def imageInput(next_node):
    return nodeOutput(1, 'cmd', [next_node['properties']['image']])


@XbladeGraph.decorator("交互/文本")
def TextInput(next_node):
    return nodeOutput(1, 'cmd', [next_node['properties']['text']])
