import io
import json
import os
import time
import webbrowser
from glob import glob
from urllib.parse import unquote
import pyautogui
from PIL import ImageGrab

from libs.model.Apps import Apps
from libs.model.Layouts import Layouts
from libs.model.models import db
from libs.utils.installedApps import get_installed_apps, init_windows_apps, windows_apps_all
from libs.utils.reg import add_reg, remove_reg, remove_auto_start_key, registry_auto_start_key
from libs.utils.settings import IMAGE_PATH, HTML_PATH
from libs.utils.tools import result, extract_icon_from_exe, generate_random_md5_with_timestamp, \
    open_with_default_program, exec_command, generate_random_filename, generate_date_path
from libs.utils.website import get_page_info, get_domain, md5
from flask import request
from PIL import ImageGrab


def getWallpapers():
    """
    获取壁纸
    :return:
    """
    directory_path = 'react_app/assets/wallpapers/'
    folders = glob(directory_path + '*/')
    videos = []
    for folder in folders:
        folders_name = os.path.basename(os.path.normpath(folder))
        files = os.listdir(f"{directory_path}{folders_name}/")
        files = [f"/assets/wallpapers/{folders_name}/{file}" for file in files]
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
        title, images = get_page_info(path, download_folder)
        imagesIcons = images if images is not None else []
        imagesIcons = [icon.replace("\\", "/") for icon in imagesIcons if icon is not None]
        return result(1, {'title': title, "images": imagesIcons}, "success")
    else:
        # 提取文件名
        filename = os.path.basename(path)
        # 提取文件后缀
        filename_without_extension, file_extension = os.path.splitext(filename)
        filename = f"{generate_random_md5_with_timestamp()}"
        download_folder = './react_app/assets/web/icons'
        iconPath = ''
        if file_extension == ".exe":
            iconPath = f"/assets/web/icons/{filename}.png"
            extract_icon_from_exe(path, filename, download_folder)
        return result(1, {'title': filename_without_extension, "images": [iconPath]}, "success")


def openApp():
    data = request.get_json()
    db_session = db.session
    app = db_session.query(Apps).filter_by(id = data['id']).first()
    app_dict = app.to_dict(include_children = True)

    parent = None
    if app_dict['pid'] is not None:
        parent = db_session.query(Apps).filter_by(id = app_dict['pid']).first()
        parent = parent.to_dict()

    app.open += 1
    db_session.commit()

    if app_dict['type'] == 'link':
        webbrowser.open(app_dict['path'])
    elif app_dict['type'] == 'file':
        if app_dict['path'] == '':
            return result(1, app_dict, 'empty')
        open_with_default_program(app_dict['path'])
    elif app_dict['type'] == 'command':
        exec_command(json.loads(app_dict['path']), parent)
    elif app_dict['type'] == 'desktop':
        return result(1, app_dict['id'], 'newLayout')
    elif app_dict['type'] == 'monitor' and data['position'] is not None:
        icon = app_dict['icon'].split('?')
        icon = icon[1].replace("region=", '')
        icon = unquote(icon)
        icon = [int(row) for row in icon.split(',')]
        pos_x = float(data['position']['x'])
        pos_y = float(data['position']['y'])
        x = icon[0] + int(icon[2] * pos_x / 100)
        y = icon[1] + int(icon[3] * pos_y / 100)
        (x_old, y_old) = pyautogui.position()
        pyautogui.click(x, y)
        pyautogui.moveTo(x_old, y_old)
    if app_dict['children'] is not None:
        return result(1, app_dict, 'empty')
    return result(1, app_dict, 'opened')


def generate_video(region):
    screen_width, screen_height = pyautogui.size()
    frame_wait = 0.08
    region[2] = screen_width if region[2] == 0 else region[2]
    region[3] = screen_height if region[3] == 0 else region[3]
    region = tuple(region)
    # 计算右下角坐标
    right = region[0] + region[2]
    bottom = region[1] + region[3]

    # 构建bbox参数
    bbox = (region[0], region[1], right, bottom)
    while True:
        start_time = time.time()
        # 捕获屏幕截图
        screenshot = ImageGrab.grab(bbox = bbox)
        # 将PIL图像转换为JPEG格式的字节数据
        with io.BytesIO() as output:
            screenshot.save(output, format = 'JPEG')
            frame = output.getvalue()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        # 控制帧率
        processing_time = time.time() - start_time
        if processing_time < frame_wait:
            time.sleep(frame_wait - processing_time)


def update_layouts():
    data = request.get_json()
    incoming_layout_ids = [md5(f"{data['table']}|{layout['i']}") for layout in data['layouts']]
    existing_layouts = Layouts.query.filter_by(name = data['table']).all()
    layouts_to_remove = [layout.id for layout in existing_layouts if layout.id not in incoming_layout_ids]
    # 删除这些布局
    for layout_id in layouts_to_remove:
        layout = Layouts.query.filter_by(id = layout_id).first()
        if layout is not None:
            db.session.delete(layout)

    for layout in data['layouts']:
        new_layout = Layouts(
            id = md5(f"{data['table']}|{layout['i']}"),
            name = data['table'],
            i = layout['i'],
            x = layout['x'],
            y = layout['y'],
            w = layout['w'],
            h = layout['h'],
            moved = layout.get('moved', False),
            static = layout.get('static', False)
        )
        db.session.merge(new_layout)
        db.session.commit()
    return result(1, data, 'opened')


def uploadFile(file_path = "assets/web/icons/", resType = 'Response'):
    if 'file' not in request.files:
        return result(0, 'No selected', 'fail')

    file = request.files['file']

    if file.filename == '':
        return result(0, 'No selected', 'fail')

    if file:
        download_folder = f'react_app/{file_path}'
        if not os.path.exists(download_folder):
            os.makedirs(download_folder)
        file_ext = file.filename.rsplit('.', 1)
        if file_path == 'img/':
            filename = f"{download_folder}{generate_date_path()}{generate_random_filename(5)}.{file_ext[1]}"
        else:
            filename = f"{download_folder}{generate_random_md5_with_timestamp()}.{file_ext[1]}"
        # 这里可以指定保存上传文件的路径
        dir_name = os.path.dirname(filename)  # 获取目录名
        if not os.path.isdir(dir_name):
            os.makedirs(dir_name)
        file.save(filename)
        if resType == 'Response':
            return result(1, filename.replace('react_app', ''), 'success')
        else:
            return filename


def systemInfo(info):
    if info == 'screen_size':
        screen_width, screen_height = pyautogui.size()
        return result(1, [screen_width, screen_height], 'success')
    elif info == 'menu':
        data = json.loads(request.data)
        if data['type'] == 'add':
            add_reg()
        elif data['type'] == 'remove':
            remove_reg()
        return result(1, data, '注册成功')
    elif info == 'startup':
        data = json.loads(request.data)
        if data['type'] == 'add':
            registry_auto_start_key()
        elif data['type'] == 'remove':
            remove_auto_start_key()
        return result(1, data, '注册成功')
    elif info == 'apps':
        windows_apps = windows_apps_all()
        return result(1, windows_apps, '获取成功')

    elif info == 'grabclipboard':
        # 尝试从剪贴板获取图像
        image = ImageGrab.grabclipboard()
        image_path = None
        if image is not None:
            image_path = f'{IMAGE_PATH}/{generate_date_path()}{generate_random_filename(5)}.png'
            # 如果剪贴板中包含图像数据，则可以进一步处理
            # 例如，使用OCR识别图片中的文本，或者保存图片到磁盘
            dir_name = os.path.dirname(image_path)  # 获取目录名
            if not os.path.isdir(dir_name):
                os.makedirs(dir_name)
            image.save(image_path)
            image_path = image_path.replace(HTML_PATH, '')
        return result(1, image_path, '获取成功')
