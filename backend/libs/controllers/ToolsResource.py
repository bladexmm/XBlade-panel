import json
import os
import time

from flask_restful import Resource, reqparse

from libs.model.Apps import Apps
from libs.model.Layouts import Layouts
from libs.model.models import db
from libs.service import generate_video, getWallpapers, uploadFile
from libs.utils.LiteGraph import LiteGraph
from libs.utils.tools import read_json, result, copy, zipFolder, format_date, delete_folder, unzip_file, copy_dir, \
    copy_app_images, list_to_dict, generate_random_filename
from flask import Response, request

from libs.utils.website import md5


class ToolsResource(Resource):
    def post(self):
        pass


class CMDResource(Resource):
    def get(self):
        rows = read_json('./data/commands.json')
        return result(1, {'commands': rows}, 'success')

    def post(self):
        cmd = request.form.get('cmd', '{}')
        cmd = json.loads(cmd)
        app = {
            'id': 'debug',
            'path': cmd
        }
        dg = LiteGraph(app, None, {"type": "CMDStart", "slot": "out"})
        logs = dg.execute()
        return result(1, logs, 'success')


class StreamResource(Resource):
    def get(self):
        region = request.args.get('region')
        if region is None:
            region = [0, 0, 0, 0]
        else:
            region = region.split(',')
            region = [int(row) for row in region]
        return Response(generate_video(region), mimetype = 'multipart/x-mixed-replace; boundary=frame')


class WallpaperResource(Resource):
    def get(self):
        return getWallpapers()

    def post(self):
        absolute_path = os.path.abspath('./react_app/assets/wallpapers/')
        os.system(f"start {absolute_path}")
        # script_dir = os.path.dirname(os.path.abspath(__file__))
        # absolute_path = os.path.join(script_dir, 'react_app/assets/wallpapers/')
        # os.system(f'start {absolute_path}')
        return result(1, '', '打开文件夹成功')


class UploadResource(Resource):

    def post(self):
        return uploadFile()


class ScriptResource(Resource):
    def post(self):
        return uploadFile("img/")


class BackupResource(Resource):
    def get(self):
        db_session = db.session
        apps = db_session.query(Apps).all()
        apps = [app.to_dict() for app in apps]
        copy_app_images(apps)  # 复制图片
        copy('./data/database.db', './temp/database.db')  # 复制数据库
        zipFile = f"/backup/backup_{format_date()}.zip"
        zipFolder('./temp/', f'./react_app{zipFile}')  # 压缩文件
        delete_folder('./temp')  # 删除文件
        return result(data = zipFile, msg = '备份成功')

    def delete(self):
        delete_folder('./react_app/backup')  # 删除文件
        return result(data = "", msg = '清空完成')

    def put(self):
        zip_file = uploadFile('backup/', 'other')
        unzip_file(zip_file, './temp')
        copy('./temp/database.db', './data/database.db', True)  # 复制文件
        files = copy_dir('./temp/images', './react_app')
        delete_folder('./temp')
        return result(data = files, msg = "恢复成功")


class ImportResource(Resource):
    def put(self):
        layout_open = request.form.get('layout', 'pane')
        zip_file = uploadFile('backup/', 'other')
        unzip_file(zip_file, './temp')
        files = copy_dir('./temp/images', './react_app')
        apps = read_json('./temp/apps.json')
        first_app_id = apps[0]['id']
        apps_dict = list_to_dict(apps, 'id')
        apps_add = []
        for app in apps:
            current_timestamp = time.time()
            app_id = app['id']
            apps_dict[app['id']]['id'] = md5(f"{generate_random_filename(12)}|{current_timestamp}")
            pid = None
            if app['pid'] is not None:
                pid = apps_dict[app['pid']]['id'] if app['pid'] in apps_dict else None
            app_new = Apps(
                id = apps_dict[app_id]['id'],
                pid = pid,
                name = app['name'],
                icon = app['icon'],
                pinyin = app['pinyin'],
                path = app['path'],
                type = app['type'],
            )
            apps_add.append(app_new)
        db.session.add_all(apps_add)
        layouts = read_json('./temp/layouts.json')
        layouts_add = []
        layouts_ids = []
        for layout in layouts:
            app_id = apps_dict[layout['i']]['id']
            layout_name = layout['name']
            if len(layout['name']) >= 30:
                layout_name = apps_dict[layout['name']]['id'] if layout['name'] in apps_dict else 'pane'

            if first_app_id == layout['i']:
                layout_name = layout_open
            if md5(f"{layout_name}|{app_id}") in layouts_ids:
                continue
            layouts_ids.append(md5(f"{layout_name}|{app_id}"))
            layout_new = Layouts(
                id = md5(f"{layout_name}|{app_id}"),
                name = layout_name,
                i = app_id,
                x = layout['x'],
                y = layout['y'],
                w = layout['w'],
                h = layout['h'],
            )
            layouts_add.append(layout_new)
        db.session.add_all(layouts_add)
        db.session.commit()
        delete_folder('./temp')
        return result(data = files, msg = "导入成功")
