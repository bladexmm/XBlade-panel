import os

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from libs.utils.tools import read_json, list_to_dict, write_json, generate_random_md5_with_timestamp, \
    extract_icon_from_exe, open_with_default_program
from libs.utils.website import get_page_info, get_domain, get_domain_md5, md5
import webbrowser
from glob import glob

app = Flask(__name__, static_folder='react_app/')
current_file = os.path.abspath(__file__)
current_dir = os.path.dirname(current_file)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


def result(code=1, data=None, msg="success"):
    return jsonify({"code": code, "data": data, "msg": msg})


def read_apps(type="list"):
    apps_all = read_json('./data/apps/all.json')
    apps_all = apps_all if apps_all is not None else []
    if type == "list":
        return apps_all
    return list_to_dict(apps_all, 'id')


def read_layout(type="list", filename="layouts"):
    layouts = read_json(f'./data/apps/{filename}.json')
    layouts = layouts if layouts is not None else []
    if type == "list":
        return layouts
    return list_to_dict(layouts, 'i')


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route("/api/wallpaper/list", methods=["GET"])
def wallpaperList():
    directory_path = 'react_app/assets/video/'
    folders = glob(directory_path + '*/')
    videos = []
    for folder in folders:
        folders_name = os.path.basename(os.path.normpath(folder))
        files = os.listdir(f"{directory_path}{folders_name}/")
        files = [f"/assets/video/{folders_name}/{file}" for file in files]
        videos.append({'name': folders_name, 'videos': files})
    return result(1, videos, 'success')


@app.route("/api/apps/list", methods=["GET"])
def appList():
    apps = read_apps('dict')
    layouts = read_layout('list')
    return result(1, {"layouts": layouts, "apps": apps}, 'success')


@app.route("/api/dock/list", methods=["GET"])
def layoutList():
    layouts = read_layout('list', 'dock-layout')
    return result(1, layouts, 'success')


@app.route("/api/apps/add", methods=["POST"])
def addApp():
    if not request.is_json:
        return result(0, [], 'Invalid JSON format')
    data = request.get_json()
    data['type'] = 'file'
    if 'http' in data['path']:
        data['type'] = "link"
    # 添加
    apps_all = read_apps('dict')
    data['id'] = md5(f"{data['type']}|{data['path']}")
    apps_all[data['id']] = data
    write_json('./data/apps/all.json', list(apps_all.values()))
    layouts = read_layout('dict')
    x = 0
    for row in list(layouts.values()):
        if x <= row['x']:
            x = row['x'] + 1
    if data['id'] not in layouts:
        layouts[data['id']] = {'i': data['id'], 'x': x, 'y': 0, 'w': 1, 'h': 1}
    write_json('./data/apps/layouts.json', list(layouts.values()))
    return result(1, data, 'success')


@app.route("/api/dock/add", methods=["POST"])
def addLayout():
    if not request.is_json:
        return result(0, [], 'Invalid JSON format')
    data = request.get_json()

    layouts = read_layout('dict', 'dock-layout')
    x = 1
    for row in list(layouts.values()):
        if x <= row['x']:
            x = row['x'] + 1
    if data['id'] not in layouts:
        layouts[data['id']] = {'i': data['id'], 'x': x, 'y': 0, 'w': 1, 'h': 1}
    write_json('./data/apps/dock-layout.json', list(layouts.values()))
    return result(1, list(layouts.values()), 'success')


@app.route("/api/apps/save", methods=["POST"])
def saveLayouts():
    data = request.get_json()
    if data['table'] == 'pane':
        write_json('./data/apps/layouts.json', data['layouts'])
    else:
        write_json('./data/apps/dock-layout.json', data['layouts'])
    return result(1, data, 'opened')


@app.route("/api/apps/del", methods=["POST"])
def delApp():
    data = request.get_json()
    apps_all = read_apps('list')
    appsNew = []
    for app in apps_all:
        if data['id'] != app['id']:
            appsNew.append(app)
    write_json('./data/apps/all.json', appsNew)
    return result(1, list_to_dict(appsNew, 'id'), 'opened')


@app.route("/api/apps/fetch", methods=["POST"])
def fetchUrl():
    if not request.is_json:
        return result(0, [], 'Invalid JSON format')
    data = request.get_json()
    path = data['path']
    # 测试函数
    download_folder = 'react_app/assets/web/{}'.format(get_domain(path))
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)
    if 'http' in path:
        # 处理网页链接
        title, icon, images = get_page_info(path, download_folder)
        imagesIcons = [icon]
        imagesIcons.extend(images if images is not None else [])
        imagesIcons = [icon.replace("\\", "/") for icon in imagesIcons if icon != None]
        return result(1, {'title': title, "images": imagesIcons}, "success")
    else:
        # 提取文件名
        filename = os.path.basename(path)
        # 提取文件后缀
        filename_without_extension, file_extension = os.path.splitext(filename)
        filename = f"{generate_random_md5_with_timestamp()}"
        download_folder = './react_app/assets/web/icons'
        iconPath = ''
        if file_extension == ".exe":
            iconPath = f"/assets/web/icons/{filename}.png"
            extract_icon_from_exe(path, filename, download_folder)

        return result(1, {'title': filename_without_extension, "images": [iconPath]}, "success")
    return result(1, data, 'opened')


@app.route("/api/apps/open", methods=["POST"])
def openUrl():
    data = request.get_json()
    apps_all = read_apps('dict')
    if data['id'] not in apps_all:
        return result(0, data, '未找到该应用')
    app = apps_all[data['id']]
    if 'http' in app['path']:
        webbrowser.open(app['path'])
    else:
        open_with_default_program(app['path'])
    return result(1, data, 'opened')


@app.route('/api/apps/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        download_folder = 'react_app/assets/web/icons/'
        if not os.path.exists(download_folder):
            os.makedirs(download_folder)
        file_ext = file.filename.rsplit('.', 1)
        filename = f"{download_folder}{generate_random_md5_with_timestamp()}.{file_ext[1]}"
        # 这里可以指定保存上传文件的路径
        file.save(filename)
        return result(1, filename.replace('react_app', ''), 'success')


import threading
import tkinter as tk
import pystray
from pystray import MenuItem, Menu
from PIL import Image


def windows():
    def quit_window(icon: pystray.Icon):
        icon.stop()
        flask_App.join(timeout=1)
        win.destroy()

    def show_window():
        win.deiconify()

    def on_exit():
        win.withdraw()

    def open_panel():
        webbrowser.open('http://localhost:5000')

    menu = (
        # MenuItem('显示面板地址', show_window, default=True),
        # Menu.SEPARATOR,
        MenuItem('打开面板', open_panel, default=True),
        Menu.SEPARATOR,
        MenuItem('退出', quit_window),
    )
    image = Image.open("data/blade.png")
    icon = pystray.Icon("data/blade.ico", image, "XBlade", menu)
    win = tk.Tk()
    win.title("XBlade-Panel")
    win.iconbitmap("data/blade.ico")
    win.wm_iconbitmap('data/blade.ico')

    win.geometry("500x300")
    #
    # 重新定义点击关闭按钮的处理
    win.protocol('WM_DELETE_WINDOW', on_exit)

    threading.Thread(target=icon.run, daemon=True).start()
    flask_App = threading.Thread(target=app.run, daemon=True)
    flask_App.start()
    win.mainloop()


if __name__ == "__main__":
    windows()
