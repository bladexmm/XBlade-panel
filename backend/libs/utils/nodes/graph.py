import re
import time

from libs.utils.nodes.base import GraphFunc
# 引入节点函数，并初始化
import libs.utils.nodes.A00_basic
import libs.utils.nodes.A01_draw
import libs.utils.nodes.A02_program
import libs.utils.nodes.A03_input
import libs.utils.nodes.A04_auto
import libs.utils.nodes.A05_components
import libs.utils.nodes.A06_simulation


def call_by_alias(aliasFunctions, *args, **kwargs):
    for name in aliasFunctions:
        if name in GraphFunc:
            return GraphFunc[name](*args, **kwargs)
    return None
