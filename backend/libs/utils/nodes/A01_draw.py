import json

from libs.utils.log import Logger
from libs.utils.nodes.base import alias, getInput, InitStyle, extract_data_from_html, json_to_layout_string_with_xy, \
    nodeOutput, InitData


@alias("绘图/布局(DisplayGrid)")
def DisplayGrid(node):
    style = getInput(node['inputs'], 1)
    nodes = []
    if len(node['inputs']) > 2:
        for input in node['inputs'][2:]:
            input['value']['id'] = input['name'].split('_')[1]
            nodes.append(input['value'])
    data = {
        "style" : InitStyle(style),
        "layout": json.loads(node['properties']['layout']),
        "nodes" : nodes
    }
    layouts = data['layout']['children']
    for layout in layouts:
        data_type, image_id = extract_data_from_html(layout['content'])
        idx = 0
        for index, node in enumerate(nodes):
            if node['id'] == image_id:
                idx = index
                break
        data['nodes'][idx]['id'] = image_id
        data['nodes'][idx]['type'] = data_type
        data['nodes'][idx]['style']['gridArea'] = image_id
        data['nodes'][idx]['style']['height'] = data['nodes'][idx]['style'].get('height', '100%')
        data['nodes'][idx]['style']['width'] = data['nodes'][idx]['style'].get('width', '100%')
        data['nodes'][idx]['style']['margin'] = data['nodes'][idx]['style'].get('margin', 0)
        data['nodes'][idx]['style']['padding'] = data['nodes'][idx]['style'].get('padding', 0)
        data['nodes'][idx]['w'] = layout['w'] if 'w' in layout else 1
        data['nodes'][idx]['h'] = layout['h'] if 'h' in layout else 1
        data['nodes'][idx]['x'] = layout['x'] if 'x' in layout else 1
        data['nodes'][idx]['y'] = layout['y'] if 'y' in layout else 1
    data['grid-template-areas'] = json_to_layout_string_with_xy(data['nodes'])
    data['style']['gridTemplateAreas'] = [f"'{area}'" for area in data['grid-template-areas'].split('\n')]
    data['style']['gridTemplateAreas'] = ' '.join(data['style']['gridTemplateAreas'])
    data['style']['gridTemplateColumns'] = f"repeat({data['layout']['column']},1fr)"
    data['style']['gridTemplateRows'] = f"repeat({data['layout']['maxRow']},1fr)"

    data['style']['display'] = 'grid'
    data['style']['height'] = data['style'].get('height', '100%')
    data['style']['width'] = data['style'].get('width', '100%')
    data['style']['margin'] = data['style'].get('margin', 0)
    data['style']['padding'] = data['style'].get('padding', 0)

    return nodeOutput(3, node, 'out', data)


@alias("绘图/图片(DisplayImage)")
def DisplayImage(node):
    image = getInput(node['inputs'], 0)
    style = getInput(node['inputs'], 1)
    return nodeOutput(1, node, 'out', [{
        "nid"       : node['id'],
        "type"      : "image",
        "style"     : InitStyle(style),
        "image"     : image,
        "properties": node['properties']
    }, node.get('value', '')])


@alias("绘图/文字(DisplayText)")
def DisplayText(node):
    text = getInput(node['inputs'], 0)
    style = getInput(node['inputs'], 1)
    return nodeOutput(1, node, 'out', [{
        "nid"       : node['id'],
        "type"      : "string",
        "style"     : InitStyle(style),
        "text"      : text,
        "properties": node['properties']
    }, node.get('value', '')])


@alias("绘图/输入框(DisplayInput)")
def DisplayInput(node):
    placeholder = getInput(node['inputs'], 0)
    style = getInput(node['inputs'], 1)
    value = getInput(node['inputs'], 2)
    node['properties']['defaultValue'] = '' if value is None else value
    return nodeOutput(1, node, 'out', [{
        "nid"        : node['id'],
        "type"       : "input",
        "style"      : InitStyle(style),
        "placeholder": placeholder,
        "properties" : node['properties']
    }, node.get('value', '')])


@alias("绘图/折线图(DisplayLineChart))")
def DisplayChart(node):
    style = getInput(node['inputs'], 0)
    title = getInput(node['inputs'], 1)
    optionsInput = getInput(node['inputs'], 2)
    data1 = getInput(node['inputs'], 3)
    name1 = getInput(node['inputs'], 4)
    data2 = getInput(node['inputs'], 5)
    name2 = getInput(node['inputs'], 6)
    data3 = getInput(node['inputs'], 7)
    name3 = getInput(node['inputs'], 8)
    data = []
    if data1 is not None:
        name1 = name1 if name1 is not None else title
        data.append({
            "name": name1,
            "data": data1
        })

    if data2 is not None:
        name2 = name2 if name2 is not None else title
        data.append({
            "name": name2,
            "data": data2
        })

    if data3 is not None:
        name3 = name3 if name3 is not None else title
        data.append({
            "name": name3,
            "data": data3
        })

    xAxis = getInput(node['inputs'], 9)
    options = {
        "chart"     : {
            "height"    : "100%",
            "width"     : "100%",
            "background": 'transparent',
            "type"      : 'area',
            "toolbar"   : {
                "show": False
            },
            "zoom"      : {
                "enabled": False  # 缩放控制
            }
        },
        "dataLabels": {
            "enabled": True
        },
        "stroke"    : {
            "curve": 'smooth'
        },
        "grid"      : {
            "row" : {
                "opacity": 0
            },
            "show": False
        },
        "title"     : {
            "text" : title,
            "align": 'left'
        },
        "xaxis"     : {
            "categories": xAxis,
            "labels"    : {
                "show": False
            },
            "axisBorder": {
                "show": False  # 隐藏X轴边框
            },
            "axisTicks" : {
                "show": False  # 隐藏X轴刻度线
            },
        },
        "yaxis"     : {
            "labels"    : {
                "show": False
            },
            "axisBorder": {
                "show": False  # 隐藏X轴边框
            },
            "axisTicks" : {
                "show": False  # 隐藏X轴刻度线
            },
        },
    }
    if optionsInput is not None:
        optionsInput = json.loads(optionsInput)
        options.update(optionsInput)
    return nodeOutput(1, node, 'out', [{
        "nid"       : node['id'],
        "type"      : "line_chart",
        "style"     : InitStyle(style),
        "xAxis"     : xAxis,
        "series"    : data,
        "options"   : options,
        "data"      : data,
        "properties": node['properties']
    }, node.get('value', '')])


@alias("绘图/按钮(DisplayButton)")
def DisplayButton(node):
    placeholder = getInput(node['inputs'], 0)
    style = getInput(node['inputs'], 1)
    return nodeOutput(1, node, 'out', [{
        "nid"        : node['id'],
        "type"       : "button",
        "placeholder": placeholder,
        "style"      : InitStyle(style),
        "properties" : node['properties']
    }, node.get('value', '')])


@alias("绘图/选择框(DisplaySelector)")
def DisplaySelector(node):
    placeholder = getInput(node['inputs'], 0)
    style = getInput(node['inputs'], 1)
    data = getInput(node['inputs'], 2)
    defaultValue = getInput(node['inputs'], 3)
    Logger.debug(f"DisplaySelector Inputs:{node['inputs']}")
    if defaultValue is not None:
        node['properties']['defaultValue'] = defaultValue
    return nodeOutput(1, node, 'out', [{
        "nid"        : node['id'],
        "type"       : "selector",
        "placeholder": placeholder,
        "style"      : InitStyle(style),
        "options"    : InitData(data),
        "properties" : node['properties']
    }, '', node.get('value', '')])
