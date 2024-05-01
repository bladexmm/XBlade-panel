# XBlade-Panel
## 项目软件版本
python: 3.10.4
## 项目打包
```shell
nuitka --standalone --include-data-dir=data=data --include-data-dir=react_app=react_app --nofollow-imports --windows-icon-from-ico=data/blade.ico --plugin-enable=tk-inter --windows-uac-admin --disable-console --include-package=flask --include-module=win32com -o XBLADE main.py 
```
开发版打包
```shell
nuitka --mingw64 --standalone --include-data-dir=data=data --include-data-dir=react_app=react_app --nofollow-imports --windows-icon-from-ico=data/blade.ico --plugin-enable=tk-inter --windows-uac-admin --include-package=flask --include-module=win32com -o XBLADE main.py 
```
优化包大小版
```shell
nuitka --standalone --onefile --include-data-dir=data=data --include-data-dir=react_app=react_app --nofollow-imports --windows-icon-from-ico=data/blade.ico --plugin-enable=tk-inter --windows-uac-admin --disable-console --include-package=flask -o XBLADE main.py 
```
用python flask 查询和新增用 restful
数据保存用flask_sqlalchemy sqlite 
并且在启动的时候会自动初始化表接口
实现:

layouts表
id: 主键
name:string 索引0
i:string
x:number
y:number
w:number
h:number
moved:boolean
static:boolean

apps 表
id 字符串 主键
name:string 
icon:string
pinyin:string
path:json
type:enum(file,link,command,components)
open:number
created:date
关联关系 layouts.i == apps.id
我现在要实现增删改查的接口用graph实现
其中layouts的查询接口要支持根据name条件查询，并且会自动关联查询出对于的apps
然后apps的添加接口在添加的时候会自动把name中的中文生成拼音，并自动保存在pinyin这个字段