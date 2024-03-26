import os

from flask import Flask, send_from_directory
from flask_restful import Api

from libs.controllers.AppsResource import AppsResource
from libs.controllers.IconResource import IconResource
from libs.controllers.LayoutsResource import LayoutsResource
from libs.model.models import db
from flask_cors import CORS
from libs.service import getWallpapers, parseApps, openApp, update_layouts
from libs.utils.tools import result, read_json, get_local_ip

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


@app.route('/', defaults = {'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route("/api/wallpaper", methods = ["GET"])
def wallpaper_list():
    return getWallpapers()


@app.route("/api/commands/default", methods = ["GET"])
def commands():
    rows = read_json('./data/commands.json')
    return result(1, {'commands': rows}, 'success')


@app.route("/api/apps/fetch", methods = ["POST"])
def fetch_url():
    return parseApps()


@app.route("/api/apps/open", methods = ["POST"])
def open_url():
    return openApp()


@app.route("/api/layouts/save", methods = ["POST"])
def save_layouts():
    return update_layouts()


# 添加资源到 API
api.add_resource(LayoutsResource, '/api/layouts')
api.add_resource(AppsResource, '/api/apps')
api.add_resource(IconResource, '/api/icon')
with app.app_context():
    db.create_all()



import threading
import tkinter as tk
import pystray
from pystray import MenuItem, Menu
from PIL import Image
import webbrowser

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
    # windows()
    app.run(host = "0.0.0.0", port = 54321, debug = True)