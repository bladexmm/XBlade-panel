import os

from flask import Flask, send_from_directory
from flask_restful import Api

import threading
import tkinter as tk
import pystray
from pystray import MenuItem, Menu
from PIL import Image
import webbrowser
from flask_socketio import SocketIO, emit

from libs import router

from libs.model.models import db
from flask_cors import CORS
from libs.service import systemInfo
from libs.utils.installedApps import init_windows_apps
from libs.utils.tools import get_local_ip, default_port

app = Flask(__name__, static_folder = 'react_app/')
api = Api(app)
data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(data_dir, "database.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
db.init_app(app)
current_file = os.path.abspath(__file__)
current_dir = os.path.dirname(current_file)
cors = CORS(app, resources = {r"/api/*": {"origins": "*"}})
socket = SocketIO(app, cors_allowed_origins = "*")


@socket.on('connect')
def test_connect():
    emit('custom-server-msg',
         {'data': 'Print this out via data.data in your client'})


@socket.on("chat")
def handle_chat(data):
    emit("chat", data, broadcast = True)


@app.route('/', defaults = {'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/system/<info>', methods = ['GET', 'POST'])
def system_config(info):
    return systemInfo(info)


for resource, route in router.resources:
    api.add_resource(resource, route)

with app.app_context():
    db.create_all()
    # init_windows_apps()


def init_app():
    with app.app_context():
        init_windows_apps()


def windows():
    host = get_local_ip()
    port = default_port()

    def quit_window(shortIcon: pystray.Icon):
        shortIcon.stop()
        flask_App.join(timeout = 1)

    def open_panel():
        webbrowser.open(f'http://{host}:{port}')

    def run_flask():
        try:
            # 确保Flask应用能够独立于Tkinter运行
            socket.run(app = app, host = "0.0.0.0", port = port, allow_unsafe_werkzeug = True)
        except Exception as e:
            print(f"Flask app failed to start: {e}")

    menu = (
        MenuItem('打开面板', open_panel, default = True),
        Menu.SEPARATOR,
        MenuItem('退出软件', quit_window),
    )
    # 继续使用系统托盘图标
    image = Image.open("data/blade.png")
    icon = pystray.Icon("data/blade.ico", image, "XBlade", menu)
    icon.menu = menu
    flask_App = threading.Thread(target = run_flask, daemon = True)
    threading.Thread(target = init_app, daemon = True).start()
    flask_App.start()
    open_panel()
    icon.run()


if __name__ == "__main__":
    windows()
    # socket.run(app = app, host = "0.0.0.0", port = default_port(), debug = True, allow_unsafe_werkzeug = True)
