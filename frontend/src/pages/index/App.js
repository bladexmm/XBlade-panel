import './App.css';
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import HorizontalScrollbar from '../../components/HorizontalScrollbar';
import XBladeIcon from "../../components/XBladeIcon";

import * as React from 'react';
import {useEffect, useState} from "react";

import SettingsDialog from "../../components/Settings";
import {getUserSettings, saveUserSettings} from "../../utils/settings";
import AddApplication from "../../components/AddApplication";
import request from "../../utils/request";
import Header from "../../components/Header";
import RightClickMenu from "../../components/RightClickMenu";
import Search from "../../components/Search";
import Grid from '@mui/joy/Grid';
import WallpaperBasicGrid from "../../components/Settings/Wallpapers";
import {CssVarsProvider} from '@mui/joy/styles';
import {Divider, ThemeProvider} from "@mui/joy";
import Layouts from "../../components/Layouts";
import Commands from "../../components/Commands";
import {SnackbarProvider} from "../../components/SnackbarUtil/SnackbarUtil";

function App() {

    const widthBox = 3600;
    const [paneDraggable, setPaneDraggable] = React.useState(false);
    const [paneLayouts, setPaneLayouts] = React.useState([]);
    const [appsAll, setAppsAll] = React.useState([]);

    const [commandOpen, setCommandOpen] = React.useState(false);

    const [searchOpen, setSearchOpen] = React.useState(false);
    const [filteredLayouts, setFilteredLayouts] = useState(paneLayouts);

    const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);
    const [wallPaper, setWallPaper] = React.useState("/assets/wallpapers/几何/pexels-jplenio-1103970.jpg");
    const [themeMode, setThemeMode] = React.useState('system');

    const [addAppOpen, setAddAppOpen] = React.useState(false);
    const [appName, setAppName] = React.useState('');
    const [appPath, setAppPath] = React.useState('');
    const [appIcons, setAppIcons] = React.useState([]);
    const [defaultLayout, setDefaultLayout] = React.useState('pane');
    const [openedLayouts, setOpenedLayouts] = useState([{id: 'pane', name: 'Home'}])

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    const [rightClickMenuId, setRightClickMenuId] = useState(null);
    const [rightClickMenuLayout, setRightClickMenuLayout] = useState(null);
    const [rightClickMenuDel, setRightClickMenuDel] = useState(false);
    const [rightClickMenuApp, setRightClickMenuApp] = useState(null);

    const host = '';
    // const host = 'http://localhost:58433';

    const [dockLayouts, setDockLayouts] = React.useState([]);
    const systemApps = [
        {'i': 'btn|settings', x: 0, y: 0, w: 1, h: 1, static: true},
        {'i': 'btn|search', x: 1, y: 0, w: 1, h: 1, static: true},
    ];


    /**
     * 获取最新布局
     */
    const updateLayouts = (layoutName = 'pane') => {
        request({
            url: "/api/layouts?name=" + layoutName,
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then((data) => {
            let apps = []
            for (let i = 0; i < data.data.apps.length; i++) {
                apps[data.data.apps[i]['id']] = data.data.apps[i]
            }
            setAppsAll(apps);
            setPaneLayouts(data.data.layouts);
            setFilteredLayouts(data.data.apps);
            updateDockLayouts(data.data.apps);
        });
    };

    const updateDockLayouts = (appsPane = []) => {
        request({
            url: "/api/layouts?name=dock",
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then((data) => {
            let serverDockLayouts = data.data.layouts;
            let mergedAndDeDuplicatedLayouts = [
                ...serverDockLayouts,
                ...systemApps.filter(app => !serverDockLayouts.some(layout => layout.i === app.i))
            ];
            setDockLayouts(mergedAndDeDuplicatedLayouts);
            let serverApps = data.data.apps;
            const mergedApps = [...new Map(
                [...appsPane, ...serverApps].map(app => [app.id, app])
            ).values()];
            let apps = [];
            for (let i = 0; i < mergedApps.length; i++) {
                apps[mergedApps[i]['id']] = mergedApps[i]
            }
            setAppsAll(apps);
        });
    }

    // 当组件挂载时获取用户设置
    useState(() => {
        saveUserSettings('settings.host', host)
        const wallpaper = getUserSettings('settings.host', host) + getUserSettings('settings.wallpaper', wallPaper);
        setWallPaper(wallpaper);
        setThemeMode(getUserSettings('settings.theme', 'dark'));
        updateLayouts()
    }, [wallPaper]);

    /**
     * 打开应用
     * @param id
     * @param positionClick
     * @param openLoad
     */
    function onClicked(id, positionClick = null, setOpenLoad) {
        setMenuVisible(false);

        if (paneDraggable !== false) {
            return;
        }
        setOpenLoad(true);
        let bodySend = {"id": id, "type": "apps"}
        bodySend['position'] = positionClick != null ? positionClick : null;
        return request({
            url: "/api/apps/open",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: bodySend,
        }).then((res) => {
            if (res.msg === 'empty') {
                setCommandOpen(true);
                setRightClickMenuId(id);
            } else if (res.msg === 'newLayout') {
                setDefaultLayout(res.data);
                const isDuplicate = openedLayouts.find((layout) => layout.id === res.data);
                if (!isDuplicate) {
                    setOpenedLayouts([...openedLayouts, appsAll[res.data]]);
                }
                updateLayouts(res.data);

            }
            setOpenLoad(false);
        }).catch(error => {
            // 处理错误
            setOpenLoad(false);
            throw error; // re-throw the error to propagate it further
        });
    }

    /**
     * 保存布局
     * @param layoutIn
     * @param table
     */
    const saveLayouts = (layoutIn, table = defaultLayout) => {
        let layoutNew = []
        let layoutIds = []
        for (let i = 0; i < layoutIn.length; i++) {
            if (!layoutIds.includes(layoutIn[i]['i'])) {
                layoutIds.push(layoutIn[i]['i'])
                layoutNew.push(layoutIn[i])
            }
        }
        if (table === defaultLayout) {
            setPaneLayouts(layoutNew)
        } else if (table === 'dock') {
            setDockLayouts(layoutNew)
        }
        request({
            url: "/api/layouts/save",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: {"layouts": layoutNew, "table": table},
        }).then((data) => {
            if (table === defaultLayout) {
                setPaneLayouts(data.data.layouts);
            } else if (table === 'dock') {
                setDockLayouts(data.data.layouts);
            }
        });

    }
    /**
     * 触发右键菜单
     * @param e
     * @param layoutType
     * @param id
     * @param rightClick
     * @param doubleClick
     */
    const handleContextMenu = (e, layoutType, id, rightClick = false, doubleClick = false) => {
        setMenuVisible(false);
        e.preventDefault();
        setMenuPosition({x: e.clientX, y: e.clientY});
        setRightClickMenuDel(false);
        if (layoutType === 'search') {
            setRightClickMenuDel(true);
        }

        if (rightClick === true) {
            setMenuVisible(true);
            setRightClickMenuId(id);
            setRightClickMenuLayout(layoutType);
        }
        if (doubleClick === true) {
            setMenuVisible(true);
            setRightClickMenuId(id);
            setRightClickMenuLayout(layoutType);
        }

    };
    /**
     * 删除应用
     */
    const deleteApp = (table = defaultLayout, softDelete = true) => {
        let layoutsNew = table === 'dock' ? dockLayouts : paneLayouts;
        for (let i = 0; i < layoutsNew.length; i++) {
            if (layoutsNew[i]['i'] === rightClickMenuId) {
                layoutsNew.splice(i, 1)
                break
            }
        }
        if (softDelete === false) {
            request({
                url: "/api/apps",
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: {"id": rightClickMenuId},
            }).then((data) => {
                let apps = []
                for (let i = 0; i < data.data.length; i++) {
                    apps[data.data[i]['id']] = data.data[i]
                }
                setAppsAll(apps);
                setFilteredLayouts(data.data);
            });
        }
        saveLayouts(layoutsNew, table === "dock" ? "dock" : defaultLayout)
    }
    // 固定应用
    const pinApp = () => {
        // 固定到dock栏
        if (rightClickMenuLayout === 'pane') {
            let layoutOld = dockLayouts.slice();
            layoutOld.push({'i': rightClickMenuId, 'x': 4, 'y': 0, 'w': 1, 'h': 1})
            saveLayouts(layoutOld, "dock")
        } else {
            // 取消固定
            deleteApp("dock", true)
        }
    }
    // 实时搜索
    const handleSearchInput = (searchInput) => {
        // 根据搜索输入过滤 layouts
        let appsSearch = Object.values(appsAll)
        for (let i = 0; i < appsSearch.length; i++) {
            appsSearch[i]['i'] = appsSearch[i]['id']
        }
        const filtered = appsSearch.filter(app => {
            const appFind = appsAll[app['id']];
            return appFind['name'].includes(searchInput) || appFind['path'].includes(searchInput);
        });
        setFilteredLayouts(filtered);
    };
    const pageGo = (layoutName) => {
        setDefaultLayout(layoutName);
        updateLayouts(layoutName)
        if (layoutName === 'pane') {
            setOpenedLayouts([{id: 'pane', name: 'Home'}]);
        } else {
            let layoutsNew = [];
            for (let i = 0; i < openedLayouts.length; i++) {
                layoutsNew.push(openedLayouts[i]);
                if (openedLayouts[i]['id'] === layoutName) {
                    setOpenedLayouts(layoutsNew);
                    break;
                }
            }

        }

    }


    const addAppLayout = () => {
        setAppName('');
        setAppIcons([]);
        setAppPath('');
        setRightClickMenuId(null);
        setRightClickMenuApp(null);
        setMenuVisible(false);
        setAddAppOpen(true);
    }

    useEffect(() => {
        // 获取当前页面的URL
        const urlParams = new URLSearchParams(window.location.search);

        // 获取具体的参数值
        const addAppOpenParam = urlParams.get('addAppOpen');
        const pathParam = urlParams.get('path');

        setAddAppOpen(addAppOpenParam != null);
        setAppPath(pathParam == null ? '' : pathParam)

        // 或者你可以将这些值赋给组件的状态
        // this.setState({ addAppOpenValue: addAppOpen, pathValue: path });
        // （假设你在一个类组件中，并且有setState方法）

    }, []);

    return (
        <ThemeProvider>
            <CssVarsProvider
                defaultMode={themeMode}
                modeStorageKey={themeMode === "dark" ? "joy-mode-scheme-dark" : ""}
            >
                <SnackbarProvider>
                    {menuVisible && (
                        <RightClickMenu xPos={menuPosition.x} yPos={menuPosition.y} id={rightClickMenuId}
                                        hideMenu={() => {
                                            setMenuVisible(false);
                                        }}
                                        deleteBtn={(layoutType) => {
                                            deleteApp(layoutType, false);
                                        }}
                                        editBtn={() => {
                                            setAppName(appsAll[rightClickMenuId]['name']);
                                            setAppPath(appsAll[rightClickMenuId]['path']);
                                            setAppIcons([appsAll[rightClickMenuId]['icon']]);
                                            setRightClickMenuApp(appsAll[rightClickMenuId]);
                                            setAddAppOpen(true);
                                            setMenuVisible(false);
                                        }}
                                        pinBtn={pinApp} commandBtn={() => {
                            setCommandOpen(true);
                        }}
                        setMenuVisible={setMenuVisible} layoutType={rightClickMenuLayout}/>
                    )}

                    <div className="video-background">

                        {commandOpen && (
                            <Commands app_id={rightClickMenuId} filteredLayouts={filteredLayouts}
                                      defaultPosition={menuPosition} setCommandOpen={setCommandOpen}/>
                        )}

                        <SettingsDialog defaultLayout={defaultLayout} open={openSettingsDialog} onClose={() => {
                            setOpenSettingsDialog(false);
                            updateLayouts(defaultLayout)
                        }}>
                            <WallpaperBasicGrid sx={{height: "100%"}} onClick={(videoSource) => {
                                setWallPaper(host + videoSource);
                            }}></WallpaperBasicGrid>
                        </SettingsDialog>
                        {addAppOpen && (
                            <AddApplication open={addAppOpen} app_id={rightClickMenuId} app={rightClickMenuApp}
                                            apps={filteredLayouts} appName={appName} appPath={appPath}
                                            defaultLayout={defaultLayout}
                                            appIcons={appIcons} onClose={() => {
                                const urlParams = new URLSearchParams(window.location.search);

                                if (urlParams.get('addAppOpen') != null) {
                                    const protocol = window.location.protocol;
                                    const hostnameWithPort = window.location.host;
                                    window.location.href = protocol + '//' + hostnameWithPort;
                                }

                                setAddAppOpen(false);
                                updateLayouts(defaultLayout);
                            }}/>
                        )}

                        <Search open={searchOpen} onSearchInput={handleSearchInput} onClose={() => {
                            setMenuVisible(false);
                            setSearchOpen(false);
                        }}>
                            <Grid container columns={{xs: 3, sm: 6, md: 12, lg: 15}}
                                  sx={{width: "100%"}}>
                                {filteredLayouts.map((app, index) => (
                                    <Grid xs={1} sm={1} md={1} sx={{height: "6rem"}}>
                                        <div key={app['id']} unselectable="on" className="xBlade-icons"
                                             style={{
                                                 width: "3.5rem",
                                                 height: "100%",
                                                 padding: "0.5rem 0",
                                                 boxSizing: "border-box"
                                             }}
                                             onContextMenu={(e) => handleContextMenu(e, 'search', app['id'], true)}>
                                            <XBladeIcon id={app['id']} size={1} name={app['name']} appType={app['type']}
                                                        iconPath={app['icon'] !== '' ? host + app['icon'] : ''}
                                                        appPath={app['path']} onClickedBtn={onClicked}
                                                        doubleClickBtn={(e) => handleContextMenu(e, 'search', app['i'], false, true)}/>
                                        </div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Search>
                        <Header editing={paneDraggable}
                                setPaneDraggable = {setPaneDraggable}
                                StopPaneEditing={() => {
                                    setPaneDraggable(false);
                                    saveLayouts(paneLayouts, defaultLayout);
                                }} openAddDiag={addAppLayout}/>
                        <div className="Pane">

                            <Layouts
                                layouts={paneLayouts} paneDraggable={paneDraggable} appsAll={appsAll}
                                updateLayouts={updateLayouts}
                                layoutName={defaultLayout}
                                rowHeight={25}
                                cols={140}
                                setDefaultLayout={setDefaultLayout}
                                openedLayouts={openedLayouts}
                                setOpenedLayouts={setOpenedLayouts}
                                paneLayouts={paneLayouts}
                                setPaneLayouts={(value) => {
                                    setPaneLayouts(value);
                                }}
                                setMenuVisible={(value) => {
                                    setMenuVisible(value);
                                }}
                                setMenuPosition={(value) => {
                                    setMenuPosition(value);
                                }}
                                setRightClickMenuDel={(value) => {
                                    setRightClickMenuDel(value);
                                }}
                                setRightClickMenuId={(value) => {
                                    setRightClickMenuId(value);
                                }}
                                setRightClickMenuLayout={(value) => {
                                    setRightClickMenuLayout(value);
                                }}
                                setPaneDraggable={(value) => {
                                    setPaneDraggable(value);
                                }}
                                setCommandOpen={(value) => {
                                    setCommandOpen(value);
                                }}/>
                        </div>

                        <div className="Dock">
                            <HorizontalScrollbar>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <div className="opened-layouts">
                                        {openedLayouts.map((appOpen, idx) => {
                                            if (appOpen.id === 'pane') {
                                                return (
                                                    <div key={appOpen.id} className="xBlade-icons opened-apps">
                                                        <XBladeIcon id="btn|home" name="首页"
                                                                    iconPath={host + "/assets/icons/home.png"}
                                                                    onClickedBtn={(id, location, setOpenLoad) => {
                                                                        // pageGo('pane')
                                                                        // setOpenLoad(false)
                                                                        window.location.reload();
                                                                    }}/>
                                                    </div>

                                                );
                                            } else {
                                                return (
                                                    <div key={appOpen.id} className="xBlade-icons opened-apps">
                                                        <XBladeIcon id={appOpen.id} size={1}
                                                                    onClickedBtn={(id, location, setOpenLoad) => {
                                                                        pageGo(id);
                                                                        setOpenLoad(false);
                                                                    }}
                                                                    appType={appOpen.type}
                                                                    name={appOpen.name}
                                                                    iconPath={(appOpen['icon'] && appOpen['icon'].length > 0) ?
                                                                        host + appOpen['icon'] : ''}
                                                                    appPath={(appOpen['path'] && appOpen['path'].length > 0) ?
                                                                        host + appOpen['path'] : ''}/>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                    <div style={{backgroundColor: "#ffffff73",width:"1px", height: "5rem", margin: "auto 0 auto 0.5rem"}}></div>

                                    <GridLayout className="layout" layout={dockLayouts}
                                                cols={42} rowHeight={90} compactType={'horizontal'}
                                                width={widthBox} isDraggable={false} isResizable={false}
                                                onLayoutChange={(layoutIn) => {
                                                    setDockLayouts(layoutIn);
                                                }}>
                                        <div key="btn|settings">
                                            <XBladeIcon id="btn|settings" name="设置"
                                                        iconPath={host + "/assets/icons/settings-light.png"}
                                                        onClickedBtn={(id, location, setOpenLoad) => {
                                                            setOpenSettingsDialog(true);
                                                            setMenuVisible(false);
                                                            setOpenLoad(false);
                                                        }}/>
                                        </div>
                                        <div key="btn|search">
                                            <XBladeIcon id="btn|search" name="搜索"
                                                        iconPath={host + "/assets/icons/apps.png"}
                                                        onClickedBtn={(id, location, setOpenLoad) => {
                                                            setSearchOpen(true);
                                                            setMenuVisible(false);
                                                            setOpenLoad(false);
                                                        }}/>
                                        </div>


                                        {dockLayouts.map((app, index) => {
                                            if (!app['i'].startsWith('btn|')) {
                                                return (
                                                    <div key={app['i']} className="xBlade-icons opened-apps"
                                                         onContextMenu={(e) => handleContextMenu(e, 'dock', app['i'], true, false)}>
                                                        <XBladeIcon id={app['i']} size={app['w']}
                                                                    onClickedBtn={onClicked}
                                                                    appType={app['i'] in appsAll ? appsAll[app['i']]['type'] : ''}
                                                                    name={app['i'] in appsAll ? appsAll[app['i']]['name'] : ''}
                                                                    iconPath={(app['i'] in appsAll && appsAll[app['i']]['icon'] && appsAll[app['i']]['icon'].length > 0) ?
                                                                        host + appsAll[app['i']]['icon'] : ''}
                                                                    appPath={(app['i'] in appsAll && appsAll[app['i']]['path'] && appsAll[app['i']]['path'].length > 0) ?
                                                                        host + appsAll[app['i']]['path'] : ''}
                                                                    doubleClickBtn={(e) => handleContextMenu(e, 'dock', app['i'], false, true)}/>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </GridLayout>
                                </div>

                            </HorizontalScrollbar>
                        </div>
                        {wallPaper.endsWith(".mp4") ? (
                            <video className="wallpapers-video" autoPlay loop muted key={wallPaper}>
                                <source src={wallPaper} type="video/mp4"/>
                            </video>
                        ) : (
                            <img className="wallpapers-img" key={wallPaper} src={wallPaper} alt="图标"/>
                        )}
                    </div>
                </SnackbarProvider>
            </CssVarsProvider>
        </ThemeProvider>

    );
}

export default App;
