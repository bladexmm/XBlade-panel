# XBlade-Panel
## 项目软件版本
python: 3.10.4
## 项目打包
```shell
nuitka --standalone --include-data-dir=data=data --windows-icon-from-ico=data/blade.ico --include-data-dir=react_app=react_app --plugin-enable=tk-inter --disable-console --include-package=flask main.py
```
