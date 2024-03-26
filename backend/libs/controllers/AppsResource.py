from flask_restful import Resource, reqparse
from pypinyin import lazy_pinyin
import time

from libs.model.Apps import Apps
from libs.model.Layouts import Layouts
from libs.model.models import db
from libs.utils.tools import result
from libs.utils.website import md5


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
        current_timestamp = time.time()

        if args['type'] != 'command':
            if args['type'] == 'default':
                args['type'] = "link" if 'http' in args['path'] else 'file'
            args['id'] = args['id'] if args['id'] is not None else md5(f"{args['type']}|{args['path']}|{current_timestamp}")
        else:
            args['id'] = args['id'] if args['id'] is not None else md5(f"{args['name']}|{args['path']}|{current_timestamp}")
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
