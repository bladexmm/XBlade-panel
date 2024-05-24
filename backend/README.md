# XBlade-Panel
## 项目软件版本
python: 3.10.4
## 项目打包
```shell
nuitka --standalone `
  --windows-company-name=bladexmm `
  --windows-file-version=1.0.1 `
  --windows-product-name=XBLADE-PANEL `
  --include-data-dir=data=data `
  --include-data-dir=react_app=react_app `
  --windows-icon-from-ico=data/blade.ico `
  --windows-uac-admin `
  --nofollow-imports `
  --disable-console `
  --include-package=flask `
  --plugin-enable=tk-inter `
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