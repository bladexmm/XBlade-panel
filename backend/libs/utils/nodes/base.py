import re

from libs.utils.tools import read_json, write_json

GraphFunc = {}


def alias(name):
    def decorator(func):
        # 将函数存储在全局字典中
        aliasNames = name.split('(')
        if len(aliasNames) == 2:
            aliasNames[1] = aliasNames[1].replace(')', '')
        for aliasName in aliasNames:
            GraphFunc[aliasName] = func
        GraphFunc[name] = func
        return func

    return decorator


def nodeOutput(code, node, name = 'cmd', data = None):
    return {"code": code, "id": node['id'], "type": node['type'], "name": name,
            "data": data if data is not None else ""}


def getInput(inputs, slot, default = None):
    inputSlot = inputs[slot]
    return inputSlot.get('value', default)


def get_value_by_path(path, value):
    current = value
    paths = path.split('.')
    data = []
    for idx, path in enumerate(paths):
        array = False
        arrayEnum = []
        if path == "*":
            array = True
            arrayEnum = current
        elif path.startswith('-') and path.endswith(':'):
            number = path.replace('-', '')
            number = number.replace(':', '')
            array = True
            arrayEnum = current[-int(number):]
        elif path.startswith(':'):
            number = path.replace(':', '')
            array = True
            arrayEnum = current[:int(number)]
        if array:
            for subData in arrayEnum:
                values = get_value_by_path('.'.join(paths[idx + 1:]), subData)
                if values == "404 Not Found Val":
                    return "404 Not Found Val"
                data = data + values
            break
        # 判断是否为 下标
        if check_first_char(path):
            path = int(path)
            if not has_element_at_index(current, path):
                return "404 Not Found Val"
            current = current[path]
            if idx == len(paths) - 1:
                data.append(current)
            continue
        # 判断key是否妇女在
        if path not in current:
            return "404 Not Found Val"
        current = current[path]
        if idx == len(paths) - 1:
            data.append(current)
    return data


def check_first_char(s):
    first_char = s[0] if s else ''  # 防止字符串为空时出现索引错误
    return first_char == '-' or first_char.isdigit()


def has_element_at_index(path, index):
    try:
        _ = path[index]
        return True
    except IndexError:
        return False


def InitStyle(style):
    if style is None:
        return {}
    style = {k.strip(): v.strip() for k, v in (item.split(':') for item in style.split('\n') if item)}
    return style


def InitData(rows):
    data = {k.strip(): v.strip() for k, v in (row.split(':') for row in rows if row)}
    return data


def extract_data_from_html(html_string):
    """
    从给定的HTML字符串中提取data-type属性的值以及图片标识。

    参数:
    html_string (str): 包含特定结构的HTML字符串。

    返回:
    tuple: 包含两个元素的元组，第一个是data-type的值，第二个是图片标识。
           如果未找到匹配内容，返回(None, None)。
    """
    pattern = r'data-type=\"(.*?)\">(.*?)</span>'
    match = re.search(pattern, html_string)

    if match:
        data_type = match.group(1)
        # 假设图片标识是"data-type"和">"之间的内容，如果实际情况不同请调整
        image_identifier = match.group(2).split('_')[-1]  # 这里假设图片标识是下划线后的部分
        return data_type, image_identifier
    else:
        return None, None


def json_to_layout_string_with_xy(data):
    """
    尝试模拟考虑了x、y坐标的布局输出，但请注意文本输出的局限性。

    参数:
    data (list): 带有x, y, w, h属性的布局元素列表。

    返回:
    str: 近似模拟了x, y坐标的布局字符串。
    """
    # 初始化一个二维列表来模拟布局
    max_y = max(item.get('y', 0) + item.get('h', 0) for item in data)
    layout_grid = [['' for _ in range(100)] for _ in range(max_y)]  # 假设最大宽度为100，可根据实际情况调整

    for item in data:
        id_to_repeat = item.get("id", "")
        x = item.get("x", 0)
        y = item.get("y", 0)
        width = item.get("w", 0)
        height = item.get("h", 0)

        for row in range(y, y + height):
            for col in range(x, x + width):
                if col < len(layout_grid[row]):
                    layout_grid[row][col] = id_to_repeat

    # 将二维列表转换为字符串
    output_lines = [' '.join(row).rstrip() for row in layout_grid]
    return '\n'.join(output_lines)


def setVar(localVars_path, node):
    # 获取输入值
    inputs = {key: getInput(node['inputs'], index) for index, key in
              enumerate(['cmd', 'text', 'array', 'location', 'response'])}
    name = node['properties']['name']

    localVars = read_json(localVars_path) or []
    # 根据输入确定要设置的值
    for key, value in inputs.items():
        if value is not None:
            value_to_set = {"name": name, "type": key, "value": value}
            # 更新或添加局部变量
            for var in localVars:
                if var['name'] == name and var['type'] == value_to_set['type']:
                    var.update(value_to_set)
                    break
            else:
                localVars.append(value_to_set)
            # 写回局部变量到文件
            write_json(localVars_path, localVars, 'w')
            break  # 只处理第一个非None的输入

    return nodeOutput(1, node, 'out', [''])


def getVars(localVars_path, node):
    localVars = read_json(localVars_path) or []
    name = node['properties']['name']
    result = []
    for output in node['outputs']:
        valFound = [var for var in localVars if var['name'] == name and var['type'] == output['type']]
        if len(valFound) == 0:
            result.append('')
        else:
            result.append(valFound[0]['value'])
    return nodeOutput(1, node, 'out', result)
