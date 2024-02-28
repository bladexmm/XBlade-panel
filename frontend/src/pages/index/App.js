import './App.css';
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import HorizontalScrollbar from '../../components/HorizontalScrollbar';
import XBladeIcon from "../../components/XBladeIcon";

import * as React from 'react';
import {useState} from "react";

import SettingsDialog from "../../components/Settings";
import {getUserSettings, saveUserSettings} from "../../utils/settings";
import AddApplication from "../../components/AddApplication";
import request from "../../utils/request";
import Header from "../../components/Header";
import RightClickMenu from "../../components/RightClickMenu";
import Search from "../../components/Search";
import Grid from '@mui/joy/Grid';
import TabPanel from "@mui/joy/TabPanel";
import WallpaperBasicGrid from "../../components/Settings/Wallpapers";
import {CssVarsProvider} from '@mui/joy/styles';
import {ThemeProvider} from "@mui/joy";
import AboutUs from "../../components/Settings/AboutUs";

function App() {
    const widthBox = 3600;
    const [paneDraggable, setPaneDraggable] = React.useState(false);
    const [overLap, setOverLap] = React.useState(false);
    const [layouts, setLayouts] = React.useState([]);
    const [appsAll, setAppsAll] = React.useState([]);

    const [searchOpen, setSearchOpen] = React.useState(false);
    const [filteredLayouts, setFilteredLayouts] = useState(layouts);

    const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);
    const [wallPaper, setWallPaper] = React.useState("/assets/video/wave.mp4");
    const [themeMode, setThemeMode] = React.useState('system');

    const [addAppOpen, setAddAppOpen] = React.useState(false);
    const [appName, setAppName] = React.useState('');
    const [appPath, setAppPath] = React.useState('');
    const [appIcons, setAppIcons] = React.useState([]);


    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    const [rightClickMenuId, setRightClickMenuId] = useState(null);
    const [rightClickMenuLayout, setRightClickMenuLayout] = useState(null);
    const [rightClickMenuDel, setRightClickMenuDel] = useState(false);


    const host = '';

    const [dockLayouts, setDockLayouts] = React.useState([]);
    const [systemApps, setSystemApps] = React.useState([
        {'i': 'btn|search', x: 1, y: 0, w: 1, h: 1, static: true},
        {'i': 'btn|settings', x: 0, y: 0, w: 1, h: 1, static: true},
    ]);


    /**
     * 获取最新布局
     */
    const updateLayouts = () => {
        request({
            url: "/api/apps/list",
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then((data) => {
            setAppsAll(data.data.apps)
            let paneAppsAll = []
            const appList = data.data.layouts
            let appIDs = [];
            for (let i = 0; i < appList.length; i++) {
                if (!appIDs.includes(appList[i]['i'])) {
                    paneAppsAll.push(appList[i]);
                    appIDs.push(appList[i]['i'])
                }
            }
            setLayouts(paneAppsAll);
            let appsSearch = Object.values(data.data.apps)
            for (let i = 0; i < appsSearch.length; i++) {
                appsSearch[i]['i'] = appsSearch[i]['id']
            }

            setFilteredLayouts(appsSearch);
            updateDockLayouts()
        });
    };

    // 当组件挂载时获取用户设置
    useState(() => {
        const wallpaper = getUserSettings('settings.host', host) + getUserSettings('settings.wallpaper', wallPaper);
        setWallPaper(wallpaper);
        setThemeMode(getUserSettings('settings.theme', 'dark'))
        updateLayouts()
    }, [appsAll, wallPaper]);
    const updateDockLayouts = () => {
        request({
            url: "/api/dock/list",
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then((data) => {
            const dockAppsAll = []
            const appList = data.data
            let appIDs = [systemApps['i']];
            dockAppsAll.push(systemApps[0])
            for (let i = 0; i < appList.length; i++) {
                if (!appIDs.includes(appList[i]['i'])) {
                    dockAppsAll.push(appList[i]);
                    appIDs.push(appList[i]['i'])
                }
            }
            setDockLayouts(dockAppsAll);
        });
    }


    /**
     * 打开应用
     * @param id
     */
    function onClicked(id) {
        setMenuVisible(false);
        if (paneDraggable === false) {
            request({
                url: "/api/apps/open",
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: {"id": id},
            }).then((data) => {
            });
        }

    }

    /**
     * 保存布局
     * @param layoutIn
     * @param table
     */
    const saveLayouts = (layoutIn, table = 'pane') => {
        let layoutNew = []
        let layoutIds = []
        for (let i = 0; i < layoutIn.length; i++) {
            if (!layoutIds.includes(layoutIn[i]['i'])) {
                layoutIds.push(layoutIn[i]['i'])
                layoutNew.push(layoutIn[i])
            }
        }
        if (table === 'pane') {
            setLayouts(layoutNew)
        } else if (table === 'dock') {
            setDockLayouts(layoutNew)
        }
        request({
            url: "/api/apps/save",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: {"layouts": layoutNew, "table": table},
        }).then((data) => {
            if (table === 'pane') {
                setLayouts(data.data.layouts);
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
     * 修改图标大小
     * @param size
     */
    const changeSize = (size) => {
        const layoutsNew = layouts
        for (let i = 0; i < layoutsNew.length; i++) {
            if (layoutsNew[i]['i'] === rightClickMenuId) {
                layoutsNew[i]['w'] = size;
                layoutsNew[i]['h'] = size;
            }
        }
        saveLayouts(layoutsNew, 'pane');
    };


    /**
     * 删除应用
     */
    const deleteApp = (table = 'pane') => {
        let layoutsNew = []
        if (table === 'pane' || table === 'search') {
            layoutsNew = layouts
        } else if (table === 'dock') {
            layoutsNew = dockLayouts
        }
        for (let i = 0; i < layoutsNew.length; i++) {
            if (layoutsNew[i]['i'] === rightClickMenuId) {
                layoutsNew.splice(i, 1)
                break
            }
        }
        if (table === "search" && rightClickMenuDel === true) {
            request({
                url: "/api/apps/del",
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: {"id": rightClickMenuId},
            }).then((data) => {
                setAppsAll(data.data);
                let appsSearch = Object.values(data.data)
                for (let i = 0; i < appsSearch.length; i++) {
                    appsSearch[i]['i'] = appsSearch[i]['id']
                }
                setFilteredLayouts(appsSearch)
            });
        }
        saveLayouts(layoutsNew, table === "dock" ? "dock" : "pane")
    }

    // 固定应用
    const pinApp = () => {
        let layoutOld = []
        let table = ''
        if (rightClickMenuLayout === 'pane') {
            layoutOld = dockLayouts.slice();
            table = 'dock'
        } else if (rightClickMenuLayout === 'dock') {
            layoutOld = layouts.slice();
            table = 'pane'
        } else if (rightClickMenuLayout === 'search') {
            layoutOld = layouts.slice();
            table = 'pane';
        }

        layoutOld.push({'i': rightClickMenuId, 'x': 4, 'y': 0, 'w': 1, 'h': 1})
        saveLayouts(layoutOld, table)
        if (table !== "search") {
            table = table === 'pane' ? 'dock' : 'pane';
            deleteApp(table)
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
            // 获取应用名称的拼音
            const appFind = appsAll[app['id']];
            // 匹配应用名称或路径是否包含搜索输入
            return appFind['name'].includes(searchInput) || appFind['path'].includes(searchInput);
        });
        setFilteredLayouts(filtered);
    };

    return (
        <ThemeProvider>
            <CssVarsProvider
                defaultMode={themeMode}
                modeStorageKey={themeMode === "dark" ? "joy-mode-scheme-dark" : ""}
            >

                {menuVisible && (
                    <RightClickMenu
                        xPos={menuPosition.x}
                        yPos={menuPosition.y}
                        hideMenu={() => {
                            setMenuVisible(false);
                        }}
                        changeSize={changeSize}
                        deleteBtn={deleteApp}
                        editBtn={() => {
                            setAppName(appsAll[rightClickMenuId]['name'])
                            setAppPath(appsAll[rightClickMenuId]['path'])
                            setAppIcons([appsAll[rightClickMenuId]['icon']])
                            setAddAppOpen(true);
                            setMenuVisible(false);
                        }}
                        pinBtn={pinApp}
                        closeBtn={() => {
                            setMenuVisible(false);
                        }}
                        layoutType={rightClickMenuLayout}
                        id={rightClickMenuId}
                    />
                )}
                <div className="video-background">

                    <SettingsDialog open={openSettingsDialog} onClose={() => {
                        setOpenSettingsDialog(false); // 关闭弹窗
                    }}>
                        <TabPanel value={0} style={{width: "35rem", height: "35rem"}}>
                            <WallpaperBasicGrid onClick={(videoSource) => {
                                setWallPaper(host + videoSource);
                            }}></WallpaperBasicGrid>
                        </TabPanel>
                        <TabPanel value={1} style={{width: "35rem", height: "35rem"}}><AboutUs /></TabPanel>

                    </SettingsDialog>
                    {addAppOpen && (
                        <AddApplication
                            open={addAppOpen}
                            appName={appName}
                            appPath={appPath}
                            appIcons={appIcons}
                            onClose={() => {
                                setAddAppOpen(false);
                                updateLayouts();
                            }}
                        />
                    )}

                    <Search
                        open={searchOpen}
                        onClose={() => {
                            setMenuVisible(false);
                            setSearchOpen(false);
                        }}
                        onSearchInput={handleSearchInput}
                    >
                        <Grid container sx={{overflowX: "hidden", width: "100%"}}>
                            {filteredLayouts.map((app, index) => (
                                <Grid xs={1} sx={{height: "6rem"}}>

                                    <div key={app['i']}
                                         unselectable="on"
                                         className="xBlade-icons"
                                         onContextMenu={(e) => handleContextMenu(e, 'search', app['i'], true)}
                                    >
                                        <XBladeIcon
                                            id={app['i']}
                                            size={app['w']}
                                            name={app['i'] in appsAll ? appsAll[app['i']]['name'] : ''}
                                            appType={app['i'] in appsAll ? appsAll[app['i']]['type'] : 'link'}
                                            path={(app['i'] in appsAll && appsAll[app['i']]['icon'] && appsAll[app['i']]['icon'].length > 0) ?
                                                host + appsAll[app['i']]['icon'] : ''}
                                            appPath={(app['i'] in appsAll && appsAll[app['i']]['path'] && appsAll[app['i']]['path'].length > 0) ?
                                                host + appsAll[app['i']]['path'] : ''}
                                            onClickedBtn={onClicked}
                                            doubleClickBtn={(e) => handleContextMenu(e, 'search', app['i'], false, true)}
                                        />
                                    </div>
                                </Grid>

                            ))}

                        </Grid>

                    </Search>

                    <Header
                        editing={paneDraggable}
                        StopPaneEditing={() => {
                            setPaneDraggable(false);
                            saveLayouts(layouts, 'pane');
                        }}
                        themeMode={themeMode}
                        themeModeChange={(theme) => {
                            setThemeMode(theme);
                            saveUserSettings('settings.theme', theme)
                            window.location.reload();
                        }}
                        openAddDiag={() => {
                            setAppName('');
                            setAppIcons([]);
                            setAppPath('');
                            setMenuVisible(false)
                            setAddAppOpen(true);
                        }}/>


                    <div className="Pane">

                        <HorizontalScrollbar>

                            <GridLayout
                                className="layout"
                                layout={layouts}
                                cols={36}
                                rowHeight={90}
                                compactType={'horizontal'}
                                width={widthBox}
                                isDraggable={paneDraggable}
                                isResizable={false}
                                allowOverlap={overLap}
                                onLayoutChange={(layoutIn) => {
                                    setLayouts(layoutIn)
                                }}
                                onLongPress={() => {
                                    setPaneDraggable(true)
                                }}
                            >
                                {layouts.map((app, index) => (
                                    <div key={app['i']}
                                         className={paneDraggable === true ? 'xBlade-icons GridItem' : 'xBlade-icons'}
                                         unselectable="on"
                                         onContextMenu={(e) => handleContextMenu(e, 'pane', app['i'], true)}
                                    >
                                        <XBladeIcon
                                            id={app['i']}
                                            size={app['w']}
                                            name={app['i'] in appsAll ? appsAll[app['i']]['name'] : ''}
                                            appType={app['i'] in appsAll ? appsAll[app['i']]['type'] : 'link'}
                                            path={(app['i'] in appsAll && appsAll[app['i']]['icon'] && appsAll[app['i']]['icon'].length > 0) ?
                                                host + appsAll[app['i']]['icon'] : ''}
                                            appPath={(app['i'] in appsAll && appsAll[app['i']]['path'] && appsAll[app['i']]['path'].length > 0) ?
                                                host + appsAll[app['i']]['path'] : ''}
                                            onClickedBtn={onClicked}
                                            onLongPress={() => {
                                                setMenuVisible(false);
                                                setPaneDraggable(true);
                                            }}
                                            doubleClickBtn={(e) => handleContextMenu(e, 'pane', app['i'], false, true)}
                                        />
                                    </div>
                                ))}

                            </GridLayout>
                        </HorizontalScrollbar>
                    </div>

                    <div className="Dock">
                        <HorizontalScrollbar>
                            <GridLayout
                                className="layout"
                                layout={dockLayouts}
                                cols={42}
                                rowHeight={90}
                                compactType={'horizontal'}
                                width={widthBox}
                                isDraggable={false}
                                isResizable={false}
                                onLayoutChange={(layoutIn) => {
                                    setDockLayouts(layoutIn)
                                }}
                            >
                                <div key="btn|settings">
                                    <XBladeIcon
                                        id="btn|settings"
                                        name="设置"
                                        path={host + "/assets/icons/settings-light.png"}
                                        onClickedBtn={() => {
                                            setOpenSettingsDialog(true);
                                            setMenuVisible(false);
                                        }}
                                    />
                                </div>
                                <div key="btn|search">
                                    <XBladeIcon
                                        id="btn|search"
                                        name="搜索"
                                        path={host + "/assets/icons/apps.png"}
                                        onClickedBtn={() => {
                                            setSearchOpen(true);
                                            setMenuVisible(false);
                                        }}/>
                                </div>
                                {dockLayouts.map((app, index) => {
                                    if (!app['i'].startsWith('btn|')) {
                                        return (
                                            <div key={app['i']}
                                                 className="xBlade-icons"
                                                 onContextMenu={(e) => handleContextMenu(e, 'dock', app['i'], true, false)}
                                            >
                                                <XBladeIcon
                                                    id={app['i']}
                                                    size={app['w']}
                                                    appType={app['i'] in appsAll ? appsAll[app['i']]['type'] : ''}
                                                    name={app['i'] in appsAll ? appsAll[app['i']]['name'] : ''}
                                                    path={(app['i'] in appsAll && appsAll[app['i']]['icon'] && appsAll[app['i']]['icon'].length > 0) ?
                                                        host + appsAll[app['i']]['icon'] : ''}
                                                    appPath={(app['i'] in appsAll && appsAll[app['i']]['path'] && appsAll[app['i']]['path'].length > 0) ?
                                                        host + appsAll[app['i']]['path'] : ''}
                                                    onClickedBtn={onClicked}
                                                    doubleClickBtn={(e) => handleContextMenu(e, 'dock', app['i'], false, true)}

                                                />
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </GridLayout>
                        </HorizontalScrollbar>
                    </div>

                    <video autoPlay loop muted key={wallPaper}>
                        <source src={wallPaper} type="video/mp4"/>
                    </video>

                </div>

            </CssVarsProvider>
        </ThemeProvider>

    );
}

export default App;
