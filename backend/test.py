import os
import webbrowser
from glob import glob

from flask import Flask, request, send_from_directory
from flask_restful import Api

from libs.controllers import LayoutsResource, AppsResource
from libs.models import db, Apps
from sqlalchemy.ext.declarative import DeclarativeMeta
from flask_cors import CORS
import json

from libs.service import getWallpapers, parseApps, openApp, update_layouts
from libs.utils.tools import result, read_json, generate_random_md5_with_timestamp, extract_icon_from_exe, \
    open_with_default_program, exec_command
from libs.utils.website import get_domain, get_page_info

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
with app.app_context():
    db.create_all()

# ... 定义资源类和其他代码 ...

if __name__ == '__main__':
    app.run(host = '0.0.0.0', debug = True)
