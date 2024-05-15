from glob import glob
import win32com.client
import os
import ctypes
import io
import base64
import win32ui
import win32con
import win32api
import win32gui
from PIL import Image
from pypinyin import lazy_pinyin

from libs.model.SystemApps import SystemApps
from libs.model.models import db
from libs.utils.website import md5
from libs.utils.xprofile import profile


def is_valid_path(path):
    if os.path.exists(path):
        return True
    else:
        return False


def get_shortcut_target(lnk_path):
    shell = win32com.client.Dispatch("WScript.Shell")
    shortcut = shell.CreateShortCut(lnk_path)
    return shortcut.Targetpath


def get_exe_icon_to_base64(exe_path):
    ico_x = win32api.GetSystemMetrics(win32con.SM_CXICON)
    ico_y = win32api.GetSystemMetrics(win32con.SM_CYICON)
    try:
        large, small = win32gui.ExtractIconEx(exe_path, 0)
        win32gui.DestroyIcon(small[0])

        hdc = win32ui.CreateDCFromHandle(win32gui.GetDC(0))
        hbmp = win32ui.CreateBitmap()
        hbmp.CreateCompatibleBitmap(hdc, ico_x, ico_y)
        hdc = hdc.CreateCompatibleDC()

        hdc.SelectObject(hbmp)
        hdc.DrawIcon((0, 0), large[0])

        bmpstr = hbmp.GetBitmapBits(True)
        img = Image.frombuffer(
            'RGBA',
            (ico_x, ico_y),
            bmpstr, 'raw', 'BGRA', 0, 1
        )

        # 将图片转换为PNG格式并保存到BytesIO对象
        img_io = io.BytesIO()
        img.save(img_io, format = 'PNG')
        # 获取BytesIO对象的值并转化为base64编码
        base64_data = base64.b64encode(img_io.getvalue())
        return base64_data.decode('utf-8')
    except Exception as e:
        return ''


def get_final_directory(path):
    # 移除末尾的斜杠，防止直接获取空字符串
    path = os.path.normpath(path)
    directory_name = os.path.basename(path)

    return directory_name


def get_installed_apps():
    current_user_folder = os.environ['USERPROFILE']
    user_path = rf"{current_user_folder}\AppData\Roaming\Microsoft\Windows\Start Menu\Programs"
    user_apps = glob(rf'{user_path}\**', recursive = True)
    system_path = rf"C:\ProgramData\Microsoft\Windows\Start Menu\Programs"
    system_apps = glob(rf'{system_path}\**', recursive = True)
    files = system_apps + user_apps
    apps = []
    unique_app = []
    for file in files:
        name = file.replace(f'{user_path}\\', '')
        name = name.replace(f'{system_path}\\', '')
        ext = os.path.splitext(file)[1]
        if ext in ['.lnk', '.url']:
            if get_shortcut_target(file) in unique_app:
                continue
            unique_app.append(get_shortcut_target(file))
            apps.append({'name': get_final_directory(get_shortcut_target(file)), 'ext': ext, 'short_path': name,
                         'path': get_shortcut_target(file)})
            continue
        if is_valid_path(file):
            continue
        if file in unique_app:
            continue
        unique_app.append(file)
        apps.append({'name': get_final_directory(get_shortcut_target(file)), 'ext': ext, 'short_path': name,
                     'path': get_shortcut_target(file)})

    for app in apps:
        ext = os.path.splitext(app['path'])[1]
        app['icon'] = ''
        if ext == '.exe':
            app['icon'] = get_exe_icon_to_base64(app['path'])
        if app['icon'] != '':
            app['icon'] = "data:image/png;base64," + app['icon']
    return apps


def init_windows_apps():
    windows_apps = get_installed_apps()
    for app in windows_apps:
        app_old = SystemApps.query.filter_by(id = md5(f"{app['path']}")).first()
        app_old = app_old.to_dict() if app_old is not None else {}
        icon = app_old['icon'] if 'icon' in app_old else ''
        windows_app = SystemApps(
            id = md5(f"{app['path']}"),
            name = app['name'],
            ext = os.path.splitext(app['path'])[1].replace('.', ''),
            pinyin = ''.join(lazy_pinyin(app['name'])),
            short_path = app['short_path'],
            path = app['path'],
            icon = icon if app['icon'] == '' else app['icon'],
        )
        db.session.merge(windows_app)
        db.session.commit()


def windows_apps_all():
    system_apps = SystemApps.query.all()
    system_apps_all = [app.to_dict() for app in system_apps]
    return system_apps_all
