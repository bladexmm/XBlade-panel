import React, {useState, useEffect} from 'react';
import "./index.css"
import {FileIcon, defaultStyles} from "react-file-icon";

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
                        id, name, path, appType = "link", appPath = '', onClickedBtn,
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
            // 触发长按处理函数
            onLongPress();
        }, 700); // 2秒钟

        setTimer(timeout);
    };


    useEffect(() => {
        if (appType === 'file') {

            const isFolder = appPath.endsWith('/') || appPath.endsWith('\\');
            // 获取文件扩展名
            let extension = isFolder ? '' : appPath.split('.').pop();
            extension = extension === '' ? appPath.split('/').pop() : extension;
            extension = extension === '' ? appPath.split('\\').pop() : extension;
            setIcon(extension);
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
    }, [id, clickCount, path, appPath, appType, lastClickEvent]);

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
            {(appType === 'file' && path === '') ? (
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
                <img src={path} alt={name} className="icon"
                     style={{width: 4 + sizeIcon + "rem", height: 4 + sizeIcon + "rem", marginBottom: ((size - 1.5) < 0 ? 0 : size -1.5) + "rem"}}/>
            )}


            <div id={"icon-" + id}
                 className={`name ${isOverflow ? 'overflow' : ''}`}>{name}</div>
        </div>
    );
};

export default XBladeIcon;