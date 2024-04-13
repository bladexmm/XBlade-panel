import "./index.css";
import {useState} from "react";
import Layouts from "../Layouts";
import * as React from "react";
import request from "../../utils/request";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ControlCameraRoundedIcon from '@mui/icons-material/ControlCameraRounded';
import SaveIcon from '@mui/icons-material/Save';
import RightClickMenu from "../RightClickMenu";
import AddApplication from "../AddApplication";
import CachedIcon from '@mui/icons-material/Cached';
import {
    useSpring,
    animated,
    config,
} from '@react-spring/web'


export default function Commands({
                                     app_id = '',
                                     defaultPosition = null,
                                     filteredLayouts = [],
                                     setCommandOpen = b => {
                                     },
                                 }) {
    const [paneDraggable, setPaneDraggable] = React.useState(false);
    const [paneLayouts, setPaneLayouts] = React.useState([]);
    const [appsAll, setAppsAll] = React.useState([]);
    const [fullscreen, setFullscreen] = React.useState(false);

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    const [rightClickMenuId, setRightClickMenuId] = useState(null);
    const [rightClickMenuApp, setRightClickMenuApp] = useState(null);

    const [addAppOpen, setAddAppOpen] = React.useState(false);
    const [appName, setAppName] = React.useState('');
    const [appPath, setAppPath] = React.useState('');
    const [appIcons, setAppIcons] = React.useState([]);
    const [appID,setAppID] = React.useState(app_id);

    const updateLayouts = () => {
        if(appID === ''){
            return
        }
        request({
            url: "/api/layouts?name=" + appID,
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then((data) => {
            let apps = []
            for (let i = 0; i < data.data.apps.length; i++) {
                apps[data.data.apps[i]['id']] = data.data.apps[i]
            }
            setAppsAll(apps)
            setPaneLayouts(data.data.layouts);
        });
    }

    /**
     * 保存布局
     * @param layoutIn
     */
    const saveLayouts = (layoutIn) => {
        let layoutNew = []
        let layoutIds = []
        for (let i = 0; i < layoutIn.length; i++) {
            if (!layoutIds.includes(layoutIn[i]['i'])) {
                layoutIds.push(layoutIn[i]['i'])
                layoutNew.push(layoutIn[i])
            }
        }
        setPaneDraggable(false);
        setPaneLayouts(layoutNew);
        request({
            url: "/api/layouts/save",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: {"layouts": layoutNew, "table": app_id},
        }).then((data) => {
            setPaneLayouts(data.data.layouts);
        });

    }

    /**
     * 修改图标大小
     * @param size
     */
    const changeSize = (size) => {
        const layoutsNew = paneLayouts
        for (let i = 0; i < layoutsNew.length; i++) {
            if (layoutsNew[i]['i'] === rightClickMenuId) {
                layoutsNew[i]['w'] = size;
                layoutsNew[i]['h'] = size;
            }
        }
        saveLayouts(layoutsNew);
    };


    /**
     * 删除应用
     */
    const deleteApp = (table = 'pane') => {
        let layoutsNew = []
        layoutsNew = paneLayouts
        for (let i = 0; i < layoutsNew.length; i++) {
            if (layoutsNew[i]['i'] === rightClickMenuId) {
                layoutsNew.splice(i, 1)
                break
            }
        }
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
        });
        saveLayouts(layoutsNew)
    }


    const [fullscreenStyle, setFullscreenStyle] = useSpring(() => ({
        config: config.stiff,
        from: {
            width: "10%",
            height: fullscreen ? "100%" : "90%",
            top: "53%",
            left: '50%',
        },
        to: {
            top: "53%", // 只保留字符串值
            left: "50%", // 只保留字符串值
            width: fullscreen ? "100%" : "90%", // 只保留字符串值
            height: fullscreen ? "100%" : "90%" // 只保留字符串值
        }
    }));
    useState(() => {
        if (app_id !== '') {
            updateLayouts()
        }
    }, [app_id])
    return (
        <React.Fragment>
            {addAppOpen && (
                <AddApplication
                    open={addAppOpen}
                    app_id={rightClickMenuId}
                    app={rightClickMenuApp}
                    apps={filteredLayouts}
                    appName={appName}
                    appPath={appPath}
                    appIcons={appIcons}
                    onClose={() => {
                        updateLayouts();
                        setAddAppOpen(false);
                    }}
                />
            )}
            {menuVisible && (
                <RightClickMenu
                    xPos={menuPosition.x}
                    yPos={menuPosition.y}
                    hideMenu={() => {
                        setMenuVisible(false);
                    }}
                    changeSize={changeSize}
                    deleteBtn={(layoutType) => {
                        deleteApp(layoutType);
                    }}
                    editBtn={() => {
                        setAppName(appsAll[rightClickMenuId]['name']);
                        setAppPath(appsAll[rightClickMenuId]['path']);
                        setAppIcons([appsAll[rightClickMenuId]['icon']]);
                        setRightClickMenuApp(appsAll[rightClickMenuId]);
                        setAddAppOpen(true);
                        setMenuVisible(false);
                    }}
                    closeBtn={() => {
                        setMenuVisible(false);
                    }}
                    layoutType='command'
                    id={rightClickMenuId}
                />
            )}
            <animated.div className="commands" style={{...fullscreenStyle,}}>
                <div className="cmd-header">

                    <div className="header-btn" onClick={() => {
                        setFullscreenStyle({
                            config: config.stiff,
                            from: {
                                width: fullscreen ? "100%" : "90%",
                                height: fullscreen ? "100%" : "90%",
                            },
                            to: {
                                width: "0%",
                                height: fullscreen ? "100%" : "90%",
                                top: "150%"
                            },
                            onRest: () => {
                                setCommandOpen(false); // 在动画完成后执行关闭操作
                            }
                        });
                    }}>
                        <CloseRoundedIcon fontSize="large" sx={{color: "#fff", margin: "auto"}}/>
                    </div>
                    <div className="header-btn" onClick={() => {
                        setFullscreen((prevFullscreen) => {
                            const newFullscreen = !prevFullscreen;
                            setFullscreenStyle({
                                width: newFullscreen ? "100%" : "90%",
                                height: newFullscreen ? "100%" : "90%",
                                top: newFullscreen ? "50%" : "53%",
                            });
                            return newFullscreen;
                        });
                    }}>
                        <ControlCameraRoundedIcon fontSize="large" sx={{color: "#fff", margin: "auto"}}/>
                    </div>
                    {paneDraggable && (
                        <div className="header-btn" onClick={() => saveLayouts(paneLayouts)}>
                            <SaveIcon fontSize="large" sx={{color: "#fff", margin: "auto"}}/>
                        </div>
                    )}
                    <div className="header-btn" onClick={() => updateLayouts()}>
                        <CachedIcon fontSize="large" sx={{color: "#fff", margin: "auto"}}/>
                    </div>
                </div>
                <div className="pane-commands">
                    <Layouts
                        layouts={paneLayouts}
                        appsAll={appsAll}
                        paneLayouts={paneLayouts}
                        setPaneLayouts={(value) => {
                            setPaneLayouts(value);
                        }}
                        setMenuPosition={(value) => {
                            setMenuPosition(value);
                        }}
                        setRightClickMenuId={(value) => {
                            setRightClickMenuId(value);
                        }}
                        setPaneDraggable={(value) => {
                            setPaneDraggable(value);
                        }}
                        setMenuVisible={setMenuVisible}
                        paneDraggable={paneDraggable}
                    />
                </div>
            </animated.div>
        </React.Fragment>
    )
}