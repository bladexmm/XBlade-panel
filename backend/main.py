import os

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from libs.model import apps
from libs.model.apps import read_apps, read_layout, add_commands
from libs.utils.tools import read_json, list_to_dict, write_json, generate_random_md5_with_timestamp, \
    extract_icon_from_exe, open_with_default_program, get_local_ip, exec_command
from libs.utils.website import get_page_info, get_domain, get_domain_md5, md5
import webbrowser
from glob import glob

app = Flask(__name__, static_folder='react_app/')
current_file = os.path.abspath(__file__)
current_dir = os.path.dirname(current_file)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


def result(code=1, data=None, msg="success"):
    return jsonify({"code": code, "data": data, "msg": msg})


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
    apps_name = request.args.get('apps', 'all')
    layout_name = request.args.get('layouts', 'layouts')
    apps = read_apps('dict', apps_name)
    layouts = read_layout('list', layout_name)
    return result(1, {"layouts": layouts, "apps": apps}, 'success')


@app.route("/api/dock/list", methods=["GET"])
def layoutList():
    layouts = read_layout('list', 'dock-layout')
    return result(1, layouts, 'success')


@app.route("/api/commands/list", methods=["GET"])
def commands():
    rows = read_json('./data/commands.json')
    return result(1, {'commands': rows, 'apps': read_apps('list')}, 'success')


@app.route("/api/apps/add", methods=["POST"])
def addApp():
    if not request.is_json:
        return result(0, [], 'Invalid JSON format')
    data = request.get_json()
    if data['type'] == 'default':
        data = apps.add(data)
    elif data['type'] == 'command':
        data = add_commands(data)
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
    if data['type'] == 'apps':
        if 'http' in app['path']:
            webbrowser.open(app['path'])
        else:
            if app['path'] != '':
                open_with_default_program(app['path'])
        data = read_layout('list', f"layouts/{data['id']}")
    elif data['type'] == 'command':
        exec_command(data['id'])
        data = []
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
    host = get_local_ip()
    port = 54321

    def quit_window(icon: pystray.Icon):
        icon.stop()
        flask_App.join(timeout=1)
        win.destroy()

    def show_window():
        win.deiconify()

    def on_exit():
        win.withdraw()

    def open_panel():

        webbrowser.open(f'http://{host}:{port}')

    def run_flask():
        try:
            app.run(host="0.0.0.0", port=port, debug=False)
        except Exception as e:
            print(f"Flask app failed to start: {e}")

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
    win.protocol('WM_DELETE_WINDOW', on_exit)

    threading.Thread(target=icon.run, daemon=True).start()
    flask_App = threading.Thread(target=run_flask, daemon=True)
    flask_App.start()
    open_panel()
    # on_exit()
    win.mainloop()


if __name__ == "__main__":
    # windows()
    app.run(host="0.0.0.0", port=54321, debug=True)
