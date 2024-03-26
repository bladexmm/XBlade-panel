import json
import time

import pyautogui


class XbladeGraph():
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
    return 'success'


@XbladeGraph.decorator("输入/文本输入")
def typewrite(next_node):
    pyautogui.typewrite(next_node['properties']['value'])
    return 'success'


@XbladeGraph.decorator("输入/快捷键")
def hotkey(next_node):
    keys = json.loads(next_node['properties']['value'])
    type = next_node['properties']['type']
    if type == 'hotkeys':
        pyautogui.hotkey(*keys)
    elif type == 'keyDown':
        for key in keys:
            pyautogui.keyDown(key)
    elif type == 'keyUp':
        for key in keys:
            pyautogui.keyDown(key)
    return 'success'


@XbladeGraph.decorator("输入/鼠标左键")
def leftClick(next_node):
    type = next_node['properties']['type']
    if type == 'click':
        pyautogui.click()
    elif type == 'mouseDown':
        pyautogui.mouseDown()
    elif type == 'mouseUp':
        pyautogui.mouseUp()
    return 'success'


@XbladeGraph.decorator("输入/鼠标中键")
def middleClick(next_node):
    type = next_node['properties']['type']
    if type == 'click':
        pyautogui.middleClick()
    elif type == 'scrollUp':
        pyautogui.scroll(10)
    elif type == 'scrollDown':
        pyautogui.scroll(-10)
    return 'success'


@XbladeGraph.decorator("输入/鼠标右键")
def rightClick(next_node):
    pyautogui.rightClick()
    return 'success'