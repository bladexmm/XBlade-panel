import json

from flask_restful import Resource, reqparse
from libs.models import Layouts, Apps, db
from pypinyin import lazy_pinyin
from flask import request

from libs.utils.tools import result
from libs.utils.website import md5


class LayoutsResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type = str, required = True, help = 'Layout name')
        parser.add_argument('i', type = str, required = True, help = 'App ID associated with the layout')
        parser.add_argument('x', type = int, required = False, help = 'X coordinate')
        parser.add_argument('y', type = int, required = False, help = 'Y coordinate')
        parser.add_argument('w', type = int, required = False, help = 'Width')
        parser.add_argument('h', type = int, required = False, help = 'Height')
        parser.add_argument('moved', type = bool, required = False, help = 'Whether the layout was moved')
        parser.add_argument('static', type = bool, required = False, help = 'Whether the layout is static')

        args = parser.parse_args()

        new_layout = Layouts(
            name = args['name'],
            i = args['i'],
            x = args['x'],
            y = args['y'],
            w = args['w'],
            h = args['h'],
            moved = args['moved'],
            static = args['static']
        )

        db.session.add(new_layout)
        db.session.commit()
        return result(data = new_layout, msg = 'Layout created')

    def get(self):
        name_param = request.args.get('name')  # Retrieve 'name' parameter from URL
        if name_param:
            layouts = Layouts.query.filter_by(name = name_param).all()
        else:
            layouts = Layouts.query.all()

        rows = []
        for layout in layouts:
            app_data = Apps.query.filter_by(id = layout.i).first()
            layout_data = layout.to_dict()
            layout_data['apps'] = app_data.to_dict() if app_data else None
            rows.append(layout_data)
        apps = []
        if name_param in ['pane', 'dock']:
            apps = Apps.query.filter(Apps.pid.is_(None)).all()
            apps = [app.to_dict(include_children = True) for app in apps]
        else:
            apps = [row['apps'] for row in rows if row['apps'] is not None]
        return result(data = {"layouts": rows, "apps": apps}, msg = 'success')


class AppsResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type = str, required = False, help = 'App Id')
        parser.add_argument('pid', type = str, required = False, help = 'App path')
        parser.add_argument('name', type = str, required = True, help = 'App name')
        parser.add_argument('icon', type = str, required = False, help = 'App icon')
        parser.add_argument('path', type = str, required = True, help = 'App path')
        parser.add_argument('type', type = str, choices = ['default', 'file', 'link', 'command', 'components'],
                            required = True,
                            help = 'App type')
        parser.add_argument('open', type = int, required = False, help = 'App open')
        args = parser.parse_args()

        pinyin = ''.join(lazy_pinyin(args['name']))
        if args['type'] != 'command':
            if args['type'] == 'default':
                args['type'] = "link" if 'http' in args['path'] else 'file'
            args['id'] = args['id'] if args['id'] is not None else md5(f"{args['type']}|{args['path']}")
        else:
            args['id'] = args['id'] if args['id'] is not None else md5(f"{args['name']}|{args['path']}")
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
        return result(data = args, msg = 'App created')

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', type = str, required = False, help = 'App Id')
        args = parser.parse_args()
        app = Apps.query.get(args['id'])
        if app:
            Layouts.query.filter_by(i = args['id']).delete()
            Layouts.query.filter_by(name = args['id']).delete()
            Apps.query.filter_by(pid = args['id']).delete()
            db.session.delete(app)
            db.session.commit()
            apps = Apps.query.all()
            apps_list = [app.to_dict() for app in apps]
            return {'data': apps_list, 'message': f"App with id {args['id']} deleted successfully"}
        else:
            return {'message': f"App with id {args['id']} not found"}, 404
