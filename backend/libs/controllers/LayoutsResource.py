from flask_restful import Resource, reqparse
from flask import request

from libs.model.Apps import Apps
from libs.model.Layouts import Layouts
from libs.model.models import db
from libs.service import update_layouts
from libs.utils.tools import result


class LayoutsResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type = str, required = True, help = 'Need Layout name')
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
        if name_param == 'pane':
            apps = Apps.query.filter(Apps.pid.is_(None)).all()
            apps = [app.to_dict(include_children = True) for app in apps]
        else:
            apps = [row['apps'] for row in rows if row['apps'] is not None]
        return result(data = {"layouts": rows, "apps": apps}, msg = 'success')


class SaveResource(Resource):
    def post(self):
        return update_layouts()
