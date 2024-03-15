import React, {useState, useEffect} from 'react';
import "./index.css"
import {FileIcon, defaultStyles} from "react-file-icon";
import {getUserSettings} from "../../utils/settings";
import SvgIcon from '@mui/joy/SvgIcon';
import SVGIcon from "./SVGIcon";


let styles = defaultStyles;
for (let style in styles) {
    if ((style = "csv")) {
        styles[style] = {
            ...styles[style],
            color: "#1A754C",
            foldColor: "#16613F",
            glyphColor: "rgba(255,255,255,0.4)",
            labelColor: "#1A754C",
            labelUppercase: true,
        };
    }
}

const XBladeIcon = ({
                        id, name, iconPath, appType = "link", appPath = '', onClickedBtn,
                        doubleClickBtn = () => {
                        },
                        onLongPress = () => {
                        },
                        size = 1
                    }) => {

    const [clickCount, setClickCount] = useState(0);
    const [lastClickEvent, setLastClickEvent] = useState(null);
    const [singleClickTimer, setSingleClickTimer] = useState(null);

    const [isOverflow, setIsOverflow] = useState(false);
    const [timer, setTimer] = useState(null);
    const [icon, setIcon] = useState('');
    const sizeIcon = (size - 1) * 5;
    let host = getUserSettings('settings.host')

    const svgJson = {'tag': 'svg', 'attr': {'viewBox': '0 0 1024 1024', 'xmlns': 'http://www.w3.org/2000/svg'}, 'child': [{'tag': 'path', 'attr': {'d': 'M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zM648.3 426.8l-87.7 161.1h45.7c5.5 0 10 4.5 10 10v21.3c0 5.5-4.5 10-10 10h-63.4v29.7h63.4c5.5 0 10 4.5 10 10v21.3c0 5.5-4.5 10-10 10h-63.4V752c0 5.5-4.5 10-10 10h-41.3c-5.5 0-10-4.5-10-10v-51.8h-63.1c-5.5 0-10-4.5-10-10v-21.3c0-5.5 4.5-10 10-10h63.1v-29.7h-63.1c-5.5 0-10-4.5-10-10v-21.3c0-5.5 4.5-10 10-10h45.2l-88-161.1c-2.6-4.8-.9-10.9 4-13.6 1.5-.8 3.1-1.2 4.8-1.2h46c3.8 0 7.2 2.1 8.9 5.5l72.9 144.3 73.2-144.3a10 10 0 0 1 8.9-5.5h45c5.5 0 10 4.5 10 10 .1 1.7-.3 3.3-1.1 4.8z'}, 'child': []}]}
    /**
     * 处理点击按钮事件
     * @param e
     */
    const handleButtonClicked = (e) => {
        setLastClickEvent(e);
        setClickCount(prev => prev + 1);
    };

    /**
     * 处理单击
     */
    const handleClick = () => {
        // 将 id 作为参数传递给回调函数
        onClickedBtn(id);
    };

    /**
     * 处理双击
     * @param e
     */
    const handleDoubleClick = (e) => {
        clearTimeout(singleClickTimer);
        doubleClickBtn(e)
    };


    /**
     * 处理长按
     */
    const handleMouseDown = () => {
        const timeout = setTimeout(() => {
            onLongPress();
        }, 700); // 2秒钟

        setTimer(timeout);
    };


    useEffect(() => {
        if (appType === 'file') {
            const app_path = appPath.replace(host, '')
            const isFolder = app_path.endsWith('/') || app_path.endsWith('\\');
            // 获取文件扩展名
            let extension = isFolder ? '' : app_path.split('.').pop();
            extension = extension === '' ? app_path.split('/').pop() : extension;
            extension = extension === '' ? app_path.split('\\').pop() : extension;
            setIcon(extension);
        }
        if (appType === 'command') {
            let commands = JSON.parse(appPath.replace(host, ''));
            let keysString = commands.map(command => command.key).join(' ');
            setIcon(keysString);
        }

        const textContainer = document.getElementById("icon-" + id);
        if (textContainer.scrollWidth > textContainer.clientWidth) {
            setIsOverflow(true);
        } else {
            setIsOverflow(false);
        }
        /**
         * 处理双击
         */
        if (clickCount === 1) {
            const timer = setTimeout(() => {
                handleClick(); // 处理单击事件
                setClickCount(0);
            }, 300); // 设置单击事件触发的延迟时间
            setSingleClickTimer(timer)
        } else if (clickCount === 2) {
            handleDoubleClick(lastClickEvent);
            setClickCount(0);
        }
    }, [id, clickCount, icon, appPath, appType, lastClickEvent]);

    return (
        <div className="icon-container"
             onClick={handleButtonClicked}
             key={id}
             onMouseDown={handleMouseDown}
             onMouseUp={() => {
                 clearTimeout(timer);
             }}
             onTouchStart={handleMouseDown}
             onTouchEnd={() => {
                 clearTimeout(timer);
             }}
             style={{width: 4 + sizeIcon + "rem", height: 4 + sizeIcon + 2 + "rem"}}>
            {(iconPath === '') ? (
                <div className='file-icon' style={{
                    marginBottom: (size - 1) + "rem",
                    width: 3 + sizeIcon + "rem",
                    height: 4 + sizeIcon + "rem"
                }}>

                    <FileIcon
                        className="icon"
                        extension={icon}
                        {...defaultStyles[icon]} />

                </div>
            ) : (
                <img src={iconPath} alt={name} className="icon"
                     style={{
                         width: 4 + sizeIcon + "rem",
                         height: 4 + sizeIcon + "rem",
                         marginBottom: ((size - 1.5) < 0 ? 0 : size - 1.5) + "rem"
                     }}/>

                // <SVGIcon svgJson={svgJson} defaultColor="#fff"/>
            )
            }


            <div id={"icon-" + id}
                 className={`name ${isOverflow ? 'overflow' : ''}`}>{name}</div>
        </div>
    )
        ;
};

export default XBladeIcon;
