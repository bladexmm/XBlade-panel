import json
import os
import webbrowser
from glob import glob

from libs.model.Apps import Apps
from libs.model.Layouts import Layouts
from libs.model.models import db
from libs.utils.tools import result, extract_icon_from_exe, generate_random_md5_with_timestamp, open_with_default_program, exec_command
from libs.utils.website import get_page_info, get_domain, md5
from flask import request


def getWallpapers():
    """
    获取壁纸
    :return:
    """
    directory_path = 'react_app/assets/video/'
    folders = glob(directory_path + '*/')
    videos  = []
    for folder in folders:
        folders_name = os.path.basename(os.path.normpath(folder))
        files        = os.listdir(f"{directory_path}{folders_name}/")
        files        = [f"/assets/video/{folders_name}/{file}" for file in files]
        videos.append({'name': folders_name, 'videos': files})
    return result(1, videos, 'success')


def parseApps():
    """
    解析链接或者文件
    :return:
    """
    if not request.is_json:
        return result(0, [], 'Invalid JSON format')
    data = request.get_json()
    path = data['path']
    # 测试函数
    download_folder = 'react_app/assets/web/{}'.format(get_domain(path))
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)
    if 'http' in path:
        # 处理网页链接
        title, icon, images = get_page_info(path, download_folder)
        imagesIcons         = [icon]
        imagesIcons.extend(images if images is not None else [])
        imagesIcons         = [icon.replace("\\", "/") for icon in imagesIcons if icon != None]
        return result(1, {'title': title, "images": imagesIcons}, "success")
    else:
        # 提取文件名
        filename = os.path.basename(path)
        # 提取文件后缀
        filename_without_extension, file_extension = os.path.splitext(filename)
        filename = f"{generate_random_md5_with_timestamp()}"
        download_folder = './react_app/assets/web/icons'
        iconPath        = ''
        if file_extension == ".exe":
            iconPath    = f"/assets/web/icons/{filename}.png"
            extract_icon_from_exe(path, filename, download_folder)
        return result(1, {'title': filename_without_extension, "images": [iconPath]}, "success")


def openApp():
    data        = request.get_json()
    db_session  = db.session
    app         = db_session.query(Apps).filter_by(id=data['id']).first()
    app_dict    = app.to_dict()
    app.open   += 1
    db_session.commit()
    if app_dict['type']     == 'link':
        webbrowser.open(app_dict['path'])
    elif app_dict['type']   == 'file':
        if app_dict['path'] == '':
            return result(1, app_dict, 'empty')
        open_with_default_program(app_dict['path'])
    elif app_dict['type']   == 'command':
        exec_command(json.loads(app_dict['path']))

    return result(1, app_dict, 'opened')


def update_layouts():
    data                = request.get_json()
    incoming_layout_ids = [md5(f"{data['table']}|{layout['i']}") for layout in data['layouts']]
    existing_layouts    = Layouts.query.filter_by(name=data['table']).all()
    layouts_to_remove   = [layout.id for layout in existing_layouts if layout.id not in incoming_layout_ids]
    # 删除这些布局
    for layout_id in layouts_to_remove:
        layout = Layouts.query.filter_by(id=layout_id).first()
        if layout is not None:
            db.session.delete(layout)

    for layout in data['layouts']:
        new_layout = Layouts(
            id     = md5(f"{data['table']}|{layout['i']}"),
            name   = data['table'],
            i      = layout['i'],
            x      = layout['x'],
            y      = layout['y'],
            w      = layout['w'],
            h      = layout['h'],
            moved  = layout.get('moved', False),
            static = layout.get('static', False)
        )
        db.session.merge(new_layout)
        db.session.commit()
    return result(1, data, 'opened')
