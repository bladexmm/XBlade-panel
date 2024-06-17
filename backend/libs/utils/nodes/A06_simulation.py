import json

import pyautogui
import pyperclip

from libs.utils.nodes.base import alias, nodeOutput


@alias("模拟/快捷键(Hotkeys)")
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


@alias("模拟/文本输入(TypeText)")
def typewrite(node):
    pyperclip.copy(node['properties']['value'])
    pyautogui.hotkey("ctrl", "v")
    return nodeOutput(1, node, 'out', '')


@alias("模拟/鼠标移动(MouseMove)")
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


@alias("模拟/鼠标左键(MouseLeft)")
def leftClick(node):
    type = node['properties']['type']
    if type == 'click':
        pyautogui.click()
    elif type == 'mouseDown':
        pyautogui.mouseDown()
    elif type == 'mouseUp':
        pyautogui.mouseUp()
    return nodeOutput(1, node, 'out', '')


@alias("模拟/鼠标中键(MouseMiddle)")
def middleClick(node):
    type = node['properties']['type']
    if type == 'click':
        pyautogui.middleClick()
    elif type == 'scrollUp':
        pyautogui.scroll(-10)
    elif type == 'scrollDown':
        pyautogui.scroll(10)
    return nodeOutput(1, node, 'out', '')


@alias("模拟/鼠标右键(MouseRight)")
def rightClick(node):
    pyautogui.rightClick()
    return nodeOutput(1, node, 'out', '')
