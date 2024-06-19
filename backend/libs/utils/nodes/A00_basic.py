from libs.utils.nodes.base import nodeOutput, alias


@alias("基础/结束(CMDEnd)")
def CMDEnd(node):
    return nodeOutput(3, node, 'out', [''])


@alias("基础/合并运行(MultiMerge)")
def MultiMerge(node):
    return nodeOutput(1, node, 'out', [''])


@alias("基础/跳转运行(JumpNode)")
def JumpNode(node):
    return nodeOutput(1, node, 'out', ['', node['properties']['name']])
