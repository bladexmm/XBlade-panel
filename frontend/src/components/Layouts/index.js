import HorizontalScrollbar from "../HorizontalScrollbar";
import GridLayout from "react-grid-layout";
import XBladeIcon from "../XBladeIcon";
import * as React from "react";
import request from "../../utils/request";
import {getUserSettings} from "../../utils/settings";
import {useEffect} from "react";

export default function Layouts({
                                    layouts, appsAll, layoutName = "pane",
                                    paneLayouts = [],
                                    updateLayouts = () =>{},
                                    setDefaultLayout = () => {},
                                    openedLayouts=[],
                                    setOpenedLayouts=()=>{},
                                    setPaneLayouts = () => {},
                                    setMenuVisible = () => {},
                                    setMenuPosition = () => {},
                                    setRightClickMenuDel = () => {},
                                    setRightClickMenuId = () => {},
                                    setRightClickMenuLayout = () => {},
                                    paneDraggable = false,
                                    setPaneDraggable = () => {},
                                    setCommandOpen = b => {},
                                    cols = 50,
                                    rowHeight = 90
                                }) {
    const widthBox = 3600;
    const host = getUserSettings('settings.host');

    function onClicked(id, positionClick,setOpenLoad) {
        setMenuVisible(false);
        if (paneDraggable !== false) {
            return ;
        }
        setOpenLoad(true);
        let bodySend = {"id": id, "type": "apps"}
        bodySend['position'] = positionClick != null ? positionClick : null;
        request({
            url: "/api/apps/open",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: bodySend,
        }).then((res) => {
            if (res.msg === 'empty') {
                setCommandOpen(true);
                setRightClickMenuId(id);
            } else if (res.msg === 'newLayout') {
                setDefaultLayout(res.data)
                const isDuplicate = openedLayouts.find((layout) => layout.id === res.data);
                if (!isDuplicate) {
                    setOpenedLayouts([...openedLayouts, appsAll[res.data]]);
                }
                updateLayouts(res.data);
            }
            setOpenLoad(false);
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

    useEffect(() => {
        setPaneLayouts(layouts)
    }, [layouts, appsAll]);
    return (

        <HorizontalScrollbar>

            <GridLayout
                className="layout"
                layout={paneLayouts}
                cols={cols}
                rowHeight={rowHeight}
                compactType={'horizontal'}
                width={widthBox}
                isDraggable={paneDraggable}
                isResizable={paneDraggable}
                allowOverlap={false}
                onLayoutChange={(layoutIn) => {
                    setPaneLayouts(layoutIn)
                }}
                onLongPress={() => {
                    setPaneDraggable(true)
                }}
            >
                {paneLayouts.map((app, index) => (
                    <div key={app['i']}
                         className={paneDraggable === true ? 'xBlade-icons GridItem' : 'xBlade-icons'}
                         unselectable="on"
                         onContextMenu={(e) => {
                             handleContextMenu(e, 'pane', app['i'], true)
                         }}>
                        <XBladeIcon
                            id={app['i']}
                            size={cols === 50 ? app['w'] : app['w'] * app['h'] }
                            name={app['i'] in appsAll ? appsAll[app['i']]['name'] : ''}
                            appType={app['i'] in appsAll ? appsAll[app['i']]['type'] : ''}
                            iconPath={app['i'] in appsAll ? (appsAll[app['i']]['icon'] !== '' ? host + appsAll[app['i']]['icon'] : '') : ''}
                            appPath={(app['i'] in appsAll && appsAll[app['i']]['path'] && appsAll[app['i']]['path'].length > 0) ?
                                host + appsAll[app['i']]['path'] : ''}
                            onClickedBtn={onClicked}
                            setMenuPosition={(e) => setMenuPosition(({x: e.clientX, y: e.clientY}))}

                            onLongPress={() => {
                                setMenuVisible(false);
                                setPaneDraggable(true);
                            }}
                            doubleClickBtn={(e) => handleContextMenu(e, layoutName, app['i'], false, true)}
                        />
                    </div>
                ))}
            </GridLayout>
        </HorizontalScrollbar>
    )
}
