import json
import os

from flask_restful import Resource, reqparse
from flask import request

import glob

from sqlalchemy.exc import SQLAlchemyError

from libs.model.Icon import Icon
from libs.model.models import db
from libs.utils.tools import read_json, result
from libs.utils.website import md5
from tqdm import tqdm


class IconResource(Resource):
    def get(self):
        search_name = request.args.get('name')  # Retrieve 'name' parameter from URL
        glob.glob('./react_app/assets/svg/**/*.json')
        if not search_name:
            icons = Icon.query.limit(500)
        else:
            icons = Icon.query.filter(Icon.name.like('%{}%'.format(search_name))).limit(500)
        icons = [icon.to_dict() for icon in icons]
        return result(data = icons)

    def put(self):
        icons = glob.glob('./react_app/assets/svg/**/*.json')
        icon_list = []

        for icon_path in tqdm(icons):
            filename = os.path.splitext(os.path.basename(icon_path))[0]
            normalized_name = filename.lower().replace(' ', '_')

            # 计算id为文件路径的MD5值
            id_value = md5(icon_path)
            # 读取json文件内容
            path_content = read_json(icon_path)
            icon = Icon(id = id_value, name = normalized_name, path = json.dumps(path_content))
            icon_list.append(icon.to_dict())
        try:
            # 批量插入数据库
            db.session.bulk_insert_mappings(Icon, icon_list)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            raise Exception(f'Failed to insert icons: {e}')

        return {'message': f'Successfully inserted {len(icon_list)} icons.'}, 201
