# XBlade-Panel
## 项目软件版本
python: 3.10.4
## 项目打包
```shell
nuitka --standalone `
  --windows-company-name=bladexmm `
  --windows-file-version=2.0.1 `
  --windows-product-name=XBLADE-PANEL `
  --include-data-dir=data=data `
  --include-data-dir=react_app=react_app `
  --windows-icon-from-ico=data/blade.ico `
  --windows-uac-admin `
  --nofollow-imports `
  --disable-console `
  --include-package=flask `
  --include-module=win32com `
  -o XBLADE main.py
```
开发版打包
```shell
nuitka --mingw64 `
  --windows-company-name=bladexmm `
  --windows-file-version=1.0.1 `
  --windows-product-name=XBLADE-PANEL `
  --include-data-dir=data=data `
  --include-data-dir=react_app=react_app `
  --include-package=flask `
  --include-module=win32com `
  --windows-icon-from-ico=data/blade.ico `
  --plugin-enable=tk-inter `
  --nofollow-imports `
  --standalone `
  -o XBLADE main.py 
```
优化包大小版
```shell
nuitka --standalone `
  --onefile `
  --include-data-dir=data=data `
  --include-data-dir=react_app=react_app `
  --nofollow-imports `
  --windows-icon-from-ico=data/blade.ico `
  --plugin-enable=tk-inter `
  --disable-console `
  --include-package=flask `
  -o XBLADE main.py
```
## 节点简介

### 绘图/折线图(DisplayLineChart))
#### options
```python
var = {
    # 基础表格配置
    "chart"     : {
        "height"    : "100%", # 宽度
        "width"     : "100%", # 高度
        "background": 'transparent', # 背景
        "type"      : 'area', # 图标类型： area | line
        "toolbar"   : {
            "show": False # 工具栏显示
        },
        "zoom" :{
            "enabled":False # 缩放控制
        }
    },
    "dataLabels": {
        "enabled": True # 节点显示数据
    },
    "stroke"    : {
        "curve": 'smooth' # 线条类型 smooth (曲线) | straight (直线)
    },
    "grid"      : {
        "row" : {
            "opacity": 0
        },
        "show": False # 横线标线显示
    },
    # 标题
    "title"     : {
        "text" : "温度", # 标题文本
        "align": 'left' # 标题位置
    },
    "xaxis"     : {
        "categories": ["06-13", "06-14"], # x 轴内容
        "labels"    : {
            "show": False # 隐藏标尺内容
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
            "show": False # 标尺内容
        },
        "axisBorder": {
            "show": False  # 隐藏X轴边框
        },
        "axisTicks" : {
            "show": False  # 隐藏X轴刻度线
        },
    },
}
```