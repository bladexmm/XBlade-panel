import os

from flask import Flask, send_from_directory, Response, request
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
from libs.utils.tools import get_local_ip

app = Flask(__name__, static_folder='react_app/')
api = Api(app)
data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(data_dir, "database.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
db.init_app(app)
current_file = os.path.abspath(__file__)
current_dir = os.path.dirname(current_file)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
socket = SocketIO(app, cors_allowed_origins="*")


@socket.on('connect')
def test_connect():
    emit('custom-server-msg',
         {'data': 'Print this out via data.data in your client'})


@socket.on("chat")
def handle_chat(data):
    emit("chat", data, broadcast=True)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/system/<info>', methods=['GET'])
def system_config(info):
    return systemInfo(info)


for resource, route in router.resources:
    api.add_resource(resource, route)

with app.app_context():
    db.create_all()


def windows():
    host = get_local_ip()
    port = 54321

    def quit_window(shortIcon: pystray.Icon):
        shortIcon.stop()
        flask_App.join(timeout=1)
        win.destroy()

    def on_exit():
        win.withdraw()

    def open_panel():
        webbrowser.open(f'http://{host}:{port}')

    def run_flask():
        try:
            # app.run(host="0.0.0.0", port=port, debug=False)
            socket.run(app=app, host="0.0.0.0", port=54321, allow_unsafe_werkzeug=True)
        except Exception as e:
            print(f"Flask app failed to basic: {e}")

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
    win.mainloop()


if __name__ == "__main__":
    windows()
    # app.run(host = "0.0.0.0", port = 54321, debug = True)
    # socket.run(app=app, host="0.0.0.0", port=54321, debug=True, allow_unsafe_werkzeug=True)
