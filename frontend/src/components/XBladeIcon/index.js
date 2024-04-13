import React, {useState, useEffect} from 'react';
import "./index.css"
import {FileIcon, defaultStyles} from "react-file-icon";
import {getUserSettings} from "../../utils/settings";
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
                        setMenuPosition = () => {
                        },
                        size = 1
                    }) => {

    const [clickCount, setClickCount] = useState(0);
    const [lastClickEvent, setLastClickEvent] = useState(null);
    const [singleClickTimer, setSingleClickTimer] = useState(null);
    const [iconSVG, setIconSVG] = useState(null);
    const [clickPosition, setClickPosition] = useState([0, 0]);

    const [isOverflow, setIsOverflow] = useState(false);
    const [timer, setTimer] = useState(null);
    const [icon, setIcon] = useState('');
    const sizeIcon = (size - 1) * 5;
    let host = getUserSettings('settings.host')

    /**
     * 处理点击按钮事件
     * @param e
     */
    const handleButtonClicked = (e) => {
        const clickX = e.clientX; // 获取点击事件的横坐标
        const clickY = e.clientY; // 获取点击事件的纵坐标
        setClickPosition([clickX, clickY]); // 记录点击的位置
        setLastClickEvent(e);
        setClickCount(prev => prev + 1);
        setMenuPosition(e);
    };

    /**
     * 处理单击
     */

    const handleClick = () => {
        const clickX = clickPosition[0]; // 获取点击事件记录的横坐标
        const clickY = clickPosition[1]; // 获取点击事件记录的纵坐标
        if (appType === 'monitor') {
            // 获取图片容器的位置和尺寸
            const imgContainer = document.querySelector('#icon-img-' + id);
            const imgContainerRect = imgContainer.getBoundingClientRect();
            // 计算点击位置相对于容器的位置
            const relativeX = clickX - imgContainerRect.left;
            const relativeY = clickY - imgContainerRect.top;

            // 获取背景图片的尺寸
            const imgWidth = imgContainer.offsetWidth;
            const imgHeight = imgContainer.offsetHeight;

            const relativeToImageX = (relativeX / imgWidth) * 100;
            const relativeToImageY = (relativeY / imgHeight) * 100;
            onClickedBtn(id, {x: relativeToImageX.toFixed(3), y: relativeToImageY.toFixed(3)});

        }
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

        if (appType === 'command' && iconPath.replace(host, '') === '') {
            let commands = JSON.parse(appPath.replace(host, ''));
            let keysString = commands.map(command => command.key).join(' ');
            setIcon(keysString);
        }

        if (iconPath.replace(host, '') !== '' && iconPath.replace(host, '').startsWith('{')) {
            setIconSVG(JSON.parse(iconPath.replace(host, '')))
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
    }, [id, clickCount, iconPath, icon, size, appPath, appType, lastClickEvent]);

    return (
        <div className="icon-container" key={id}>
            {iconPath === '' ? (
                <div className='file-icon'
                     id={"icon-img-" + id}
                     onClick={handleButtonClicked}
                     onMouseDown={handleMouseDown}
                     onMouseUp={() => {clearTimeout(timer);}}
                     onTouchStart={handleMouseDown}
                     onTouchEnd={() => {clearTimeout(timer);}}
                     style={{
                         marginBottom: (size - 1) + "rem",
                         width: 3 + sizeIcon + "rem",
                         height: 4 + sizeIcon + "rem"
                     }}>

                    <FileIcon
                        className="icon"
                        extension={icon}
                        {...defaultStyles[icon]} />

                </div>
            ) : (iconPath.replace(host, '').startsWith('{') && iconSVG !== null) ? (
                <div className='svg-icon'
                     id={"icon-img-" + id}
                     onClick={handleButtonClicked}
                     onMouseDown={handleMouseDown}
                     onMouseUp={() => {
                         clearTimeout(timer);
                     }}
                     onTouchStart={handleMouseDown}
                     onTouchEnd={() => {
                         clearTimeout(timer);
                     }}
                     style={{

                         background: iconSVG !== null ? iconSVG.background.style : '',
                     }}>
                    <SVGIcon svgJson={iconSVG !== null ? iconSVG.icon.path : ''}
                             defaultColor={iconSVG !== null ? iconSVG.color.style : ''}
                             defaultWidth={size * 33}
                             defaultHeight={size * 33}/>
                </div>
            ) : (
                <div
                    onClick={handleButtonClicked}
                    onMouseDown={handleMouseDown}
                    onMouseUp={() => {
                        clearTimeout(timer);
                    }}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={() => {
                        clearTimeout(timer);
                    }}
                    id={"icon-div-" + id}
                    className={appType === 'monitor' ? "icon-monitor" : 'icon'}>
                    <img id={"icon-img-" + id} src={iconPath} alt={name}/>
                </div>

            )}


            <div id={"icon-" + id} className={`icon-name ${isOverflow ? 'overflow' : ''}`}>{name}</div>
        </div>
    )
        ;
};

export default XBladeIcon;
