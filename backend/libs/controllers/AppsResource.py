import base64
import json

from flask_restful import Resource, reqparse
from pypinyin import lazy_pinyin
import time
from flask import request
from sqlalchemy import or_

from libs.model.Apps import Apps, flatten_tree
from libs.model.Layouts import Layouts
from libs.model.models import db
from libs.service import openApp, parseApps

from libs.utils.LiteGraph import LiteGraph
from libs.utils.log import Logger
from libs.utils.tools import result, write_json, copy_app_images, format_date, zipFolder, delete_folder, \
    sanitize_filename
from libs.utils.website import md5


class AppsResource(Resource):

    def get(self):
        id = request.args.get('id')
        app = Apps.query.filter_by(id = id).first()
        return result(1, app.to_dict(), '获取成功')

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type = str, required = False, help = 'App Id')
        parser.add_argument('pid', type = str, required = False, help = 'App path')
        parser.add_argument('name', type = str, required = True, help = 'App name')
        parser.add_argument('icon', type = str, required = False, help = 'App icon')
        parser.add_argument('path', type = str, required = True, help = 'App path')
        parser.add_argument('type', type = str,
                            choices = ['default', 'file', 'link', 'command', 'monitor', 'desktop', 'component'],
                            required = True,
                            help = 'App type')
        parser.add_argument('open', type = int, required = False, help = 'App open')
        args = parser.parse_args()

        pinyin = ''.join(lazy_pinyin(args['name']))
        current_timestamp = time.time()
        if args['id'] is not None:
            app_old = Apps.query.filter_by(id = args['id']).first()
            app_old = app_old.to_dict()
            if app_old['pid'] != args['pid']:
                Layouts.query.filter_by(i = args['id']).delete()
        if args['type'] != 'command':
            if args['type'] == 'default':
                args['type'] = "link" if 'http' in args['path'] else 'file'
            args['id'] = args['id'] if args['id'] is not None else md5(
                f"{args['type']}|{args['path']}|{current_timestamp}")
        else:
            args['id'] = args['id'] if args['id'] is not None else md5(
                f"{args['name']}|{args['path']}|{current_timestamp}")
        args['path'] = args['path'] if args['type'] == 'command' else args['path']

        new_app = Apps(
            id = args['id'],
            pid = args['pid'],
            name = args['name'],
            icon = args['icon'],
            pinyin = pinyin,
            path = args['path'],
            type = args['type']
        )
        layouts_name = 'pane' if args['pid'] is None else args['pid']

        new_layout = Layouts(
            id = md5(f"{layouts_name}|{args['id']}"),
            name = 'pane' if args['pid'] is None else args['pid'],
            i = args['id']
        )

        db.session.merge(new_app)
        db.session.merge(new_layout)
        db.session.commit()
        return result(data = args, msg = '添加应用成功')

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type = str, required = False, help = 'App Id')
        args = parser.parse_args()
        app = Apps.query.get(args['id'])
        app_dict = app.to_dict()
        if app:
            Layouts.query.filter_by(i = args['id']).delete()
            Layouts.query.filter_by(name = args['id']).delete()
            Apps.query.filter_by(pid = args['id']).delete()
            db.session.delete(app)
            db.session.commit()
            apps = []
            if app_dict['pid'] is None:
                apps = Apps.query.filter(Apps.pid.is_(None)).all()
            else:
                apps = Apps.query.filter(Apps.pid.is_(app_dict['pid'])).all()
            apps_list = [app.to_dict() for app in apps]
            return {'data': apps_list, 'message': f"App with id {args['id']} deleted successfully"}
        else:
            return {'message': f"App with id {args['id']} not found"}, 404


class OpenResource(Resource):
    def post(self):
        return openApp()

    def get(self):
        id = request.args.get('id')
        nodes = request.args.get('nodes', None)
        start = request.args.get('startNode', None)

        db_session = db.session
        app = db_session.query(Apps).filter_by(id = id).first()
        if app is None:
            return result(1, app, '数据已经生成')
        app = app.to_dict()
        app['path'] = json.loads(app['path'])
        parent = None
        if app['pid'] is not None:
            parent = db_session.query(Apps).filter_by(id = app['pid']).first()
            parent = parent.to_dict()
        startNode = {"type": "DisplayStart", "slot": "out"}

        if nodes is not None:
            nodes = json.loads(nodes)
            start = json.loads(start)
            initNode = [node for node in nodes if node["type"] in ["grid_input","grid_selector"]]
            for node in app['path']['nodes']:
                findInputNode = [nd for nd in initNode if nd["nid"] == node['id']]
                if start['nid'] == node['id']:
                    startNode = {"id": node['id'], "slot": start['method']}
                if len(findInputNode) == 0:
                    continue
                node['value'] = findInputNode[0]['value']
        dg = LiteGraph(app, parent, startNode)
        logs = dg.execute()
        if 'data' not in logs[-1]:
            return result(3, logs, '数据已经生成')
        layout = logs[-1]['data'] if 'grid-template-areas' in logs[-1]['data'] else None
        return result(1, layout, '数据已经生成')


class FetchResource(Resource):
    def post(self):
        return parseApps()


class ShareResource(Resource):

    def get(self):
        id = request.args.get('id')
        # 保存apps配置
        target_app = db.session.query(Apps).filter_by(id = id).first()
        apps = flatten_tree(target_app)
        app_ids = [app['id'] for app in apps]
        write_json('./temp/apps.json', apps)
        copy_app_images(apps)
        # 保存apps布局
        layouts = db.session.query(Layouts).filter(or_(Layouts.i.in_(app_ids), Layouts.name.in_(app_ids))).all()
        layouts = [layout.to_dict() for layout in layouts]
        write_json('./temp/layouts.json', layouts)
        # 开始压缩数据
        filename = target_app.to_dict()['name']
        zipFile = f"/backup/{sanitize_filename(filename)}_share_{format_date()}.zip"
        zipFolder('./temp/', f'./react_app{zipFile}')  # 压缩文件
        delete_folder('./temp')  # 删除文件

        return result(1, zipFile, '数据已经生成')
