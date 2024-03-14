from libs.utils.tools import read_json, list_to_dict, write_json, generate_random_md5_with_timestamp
from libs.utils.website import md5


def read_apps(type="list", file="all"):
    apps_all = read_json(f'./data/apps/{file}.json')
    apps_all = apps_all if apps_all is not None else []
    if type == "list":
        return apps_all
    return list_to_dict(apps_all, 'id')


def read_layout(type="list", filename="layouts"):
    layouts = read_json(f'./data/apps/{filename}.json')
    layouts = layouts if layouts is not None else []
    if type == "list":
        return layouts
    return list_to_dict(layouts, 'i')


def add(data):
    data['type'] = 'file'
    if 'http' in data['path']:
        data['type'] = "link"
    # 添加
    apps_all = read_apps('dict')
    data['id'] = data['id'] if "id" in data else md5(f"{data['type']}|{data['path']}")
    apps_all[data['id']] = data
    write_json('./data/apps/all.json', list(apps_all.values()))
    layouts = read_layout('dict')
    x = 0
    for row in list(layouts.values()):
        if x <= row['x']:
            x = row['x'] + 1
    if data['id'] not in layouts:
        layouts[data['id']] = {'i': data['id'], 'x': x, 'y': 0, 'w': 1, 'h': 1}
    write_json('./data/apps/layouts.json', list(layouts.values()))
    return data


def add_commands(data):
    # 保存指令
    commands = read_apps('dict', 'commands')
    command = {
        "id": data['id'] if "id" in data else generate_random_md5_with_timestamp(),
        "name": data['name'],
        "icon": data['icon'],
        "type": data['type'],
        "path": data['path']
    }
    commands[command['id']] = command
    write_json('./data/apps/commands.json', list(commands.values()))
    # 写入layouts
    layouts = read_layout('dict', f'layouts/{data["appBind"]["id"]}')
    x = 0
    for row in list(layouts.values()):
        if x <= row['x']:
            x = row['x'] + 1
    if command['id'] not in layouts:
        layouts[command['id']] = {'i': command['id'], 'x': x, 'y': 0, 'w': 1, 'h': 1}
    write_json(f'./data/apps/layouts/{data["appBind"]["id"]}.json', list(layouts.values()))
    return command
