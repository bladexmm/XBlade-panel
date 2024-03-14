import json
import base64
import hashlib
import time
import os

import win32gui
import win32ui
import win32con
import pyautogui
import win32api
from PIL import Image
import subprocess
import platform


def read_json(file_path, encoding = 'utf-8'):
    if not os.path.exists(file_path):
        return None
    with open(file_path, 'r', encoding = encoding) as file:
        data = json.load(file)
    return data


def write_json(file, content, mode = 'w', encoding = 'utf-8'):
    dir_name = os.path.dirname(file)  # 获取目录名
    if not os.path.isdir(dir_name):
        os.makedirs(dir_name)
    with open(file, mode, encoding = encoding) as file:
        json.dump(content, file)


def list_to_dict(rows, key):
    new_arr = {}
    for row in rows:
        new_arr[row[key]] = row
    return new_arr


def image2base64(fileName, fileType = "png"):
    image = Image.open(fileName)  # 打开 PNG 文件
    data = image.tobytes()  # 转换为字节串
    encoded = base64.b64encode(data)  # 转换为 base64 编码的字节串
    encoded = encoded.decode()  # 转换为字符串
    return f"data:image/{fileType};base64,{encoded}"  # 返回 data URI


def generate_random_md5_with_timestamp():
    random_bytes = os.urandom(16)
    timestamp = str(time.time()).encode('utf-8')
    data_with_timestamp = random_bytes + timestamp
    md5_hash = hashlib.md5(data_with_timestamp)
    return md5_hash.hexdigest()


def extract_icon_from_exe(icon_in_path, icon_name, icon_out_path, out_width = 56, out_height = 56):
    """Given an icon path (exe file) extract it and output at the desired width/height as a png image.

    Args                      : 
    icon_in_path (string)     : path to the exe to extract the icon from
    icon_name (string)        : name of the icon so we can save it out with the correct name
    icon_out_path (string)    : final destination (FOLDER) - Gets combined with icon_name for full icon_path
    out_width (int, optional) : desired icon width
    out_height (int, optional): desired icon height

    Returns: 
    string : path to the final icon
    """

    ico_x = win32api.GetSystemMetrics(win32con.SM_CXICON)
    ico_y = win32api.GetSystemMetrics(win32con.SM_CYICON)

    large, small = win32gui.ExtractIconEx(icon_in_path, 0)
    win32gui.DestroyIcon(small[0])

    hdc = win32ui.CreateDCFromHandle(win32gui.GetDC(0))
    hbmp = win32ui.CreateBitmap()
    hbmp.CreateCompatibleBitmap(hdc, ico_x, ico_x)
    hdc = hdc.CreateCompatibleDC()

    hdc.SelectObject(hbmp)
    hdc.DrawIcon((0, 0), large[0])

    bmpstr = hbmp.GetBitmapBits(True)
    icon = Image.frombuffer(
        'RGBA',
        (32, 32),
        bmpstr, 'raw', 'BGRA', 0, 1
    )

    full_outpath = os.path.join(icon_out_path, "{}.png".format(icon_name))
    icon.resize((out_width, out_height))
    icon.save(full_outpath)
    return full_outpath




def exec_command(commands):
    path = [row['command'] for row in commands]
    pyautogui.hotkey(*path)


def open_with_default_program(file_path, type = 'shell'):
    # 确定操作系统
    system = platform.system()

    try:
        # 根据操作系统选择打开程序的命令
        if system == "Windows":
            subprocess.Popen(['start', '', file_path], shell = True)

        elif system == "Darwin":  # macOS
            subprocess.Popen(['open', file_path])
        elif system == "Linux":
            subprocess.Popen(['xdg-open', file_path])
        else:
            print("不支持的操作系统")
    except Exception as e:
        print("打开文件时出错:", e)


import socket


def get_local_ip():
    try:
        host_name = socket.gethostname()

        local_ip = socket.gethostbyname(host_name)

        return local_ip
    except Exception as e:
        print(f"获取本地IP时发生错误：{e}")
        return None


from flask import jsonify


def result(code = 1, data = None, msg = "success"):
    return jsonify({"code": code, "data": data, "msg": msg})
