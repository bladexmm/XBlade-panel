from libs.utils.nodes.base import alias, nodeOutput, getInput


@alias("组件/实例化(Subgraph)")
def Subgraph(node):
    outputNode = node['result'][-1]
    outputs = []
    SubgraphOutputNodes = [node for node in node['subgraph']['nodes'] if 'SubgraphOutput' in node['type']]
    for output in SubgraphOutputNodes:
        output['inputs'][0]['name'] = output['properties']['name']
    for output in node['outputs']:
        if output['type'] == 'cmd':
            outputs.append('')
            continue
        for subNode in SubgraphOutputNodes:
            properties = subNode['properties']
            if properties['name'] == output['name'] and properties['type'] == output['type']:
                outputs.append(subNode['inputs'][0]['value'])
        outputs.append(None)

    return nodeOutput(1, node, outputNode['name'], outputs)


@alias("组件/输入(SubgraphInput)")
def SubgraphInput(node):
    return nodeOutput(1, node, 'out', [node['properties']['value']])


@alias("组件/输出(SubgraphOutput)")
def SubgraphOutput(node):
    InputSlot = getInput(node['inputs'], 0)
    return nodeOutput(1, node, node['properties']['name'], [InputSlot])
