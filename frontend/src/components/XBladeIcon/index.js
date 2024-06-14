import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import "./index.css";
import { FileIcon, defaultStyles } from "react-file-icon";
import { getUserSettings } from "../../utils/settings";
import SVGIcon from "./SVGIcon";
import CustomGrid from "./CustomGrid";

let styles = defaultStyles;
for (let style in styles) {
    if (style === "csv") {
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
                        id, name, iconPath, appType = "link", appPath = '', onClickedBtn = () => {},
                        doubleClickBtn = () => {}, onLongPress = () => {}, setMenuPosition = () => {},
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
    let host = getUserSettings('settings.host');
    const [openLoad, setOpenLoad] = React.useState(false);
    const containerRef = useRef(null);
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

    const updateContainerDimensions = () => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setContainerDimensions({ width, height });
        }
    };

    useLayoutEffect(() => {
        updateContainerDimensions();
    }, [size]);

    const handleButtonClicked = (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        setClickPosition([clickX, clickY]);
        setLastClickEvent(e);
        setClickCount(prev => prev + 1);
        setMenuPosition(e);
    };

    const handleClick = () => {
        const clickX = clickPosition[0];
        const clickY = clickPosition[1];
        if (appType === 'monitor') {
            const imgContainer = document.querySelector('#icon-img-' + id);
            const imgContainerRect = imgContainer.getBoundingClientRect();
            const relativeX = clickX - imgContainerRect.left;
            const relativeY = clickY - imgContainerRect.top;
            const imgWidth = imgContainer.offsetWidth;
            const imgHeight = imgContainer.offsetHeight;
            const relativeToImageX = (relativeX / imgWidth) * 100;
            const relativeToImageY = (relativeY / imgHeight) * 100;
            onClickedBtn(id, { x: relativeToImageX.toFixed(3), y: relativeToImageY.toFixed(3) }, setOpenLoad);
        } else {
            onClickedBtn(id, null, setOpenLoad);
        }
    };

    const handleDoubleClick = (e) => {
        clearTimeout(singleClickTimer);
        doubleClickBtn(e);
    };

    const handleMouseDown = () => {
        const timeout = setTimeout(() => {
            onLongPress();
        }, 700);
        setTimer(timeout);
    };

    useEffect(() => {
        if (appType === 'file') {
            const app_path = appPath.replace(host, '');
            const isFolder = app_path.endsWith('/') || app_path.endsWith('\\');
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
            setIconSVG(JSON.parse(iconPath.replace(host, '')));
        }

        const textContainer = document.getElementById("icon-" + id);
        if (textContainer.scrollWidth > textContainer.clientWidth) {
            setIsOverflow(true);
        } else {
            setIsOverflow(false);
        }
        if (clickCount === 1) {
            const timer = setTimeout(() => {
                handleClick();
                setClickCount(0);
            }, 300);
            setSingleClickTimer(timer);
        } else if (clickCount === 2) {
            handleDoubleClick(lastClickEvent);
            setClickCount(0);
        }
    }, [id, clickCount, iconPath, icon, size, appPath, appType, lastClickEvent, host]);

    return (
        <div className="icon-container" key={id} ref={containerRef}>
            {appType === 'component' ? (
                <CustomGrid id={id}/>
            ) : iconPath === '' ? (
                <div className={openLoad ? "file-icon flip" : 'file-icon'}
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
                         marginBottom: (size - 1) + "rem",
                         width: 3 + sizeIcon + "rem",
                         height: 4 + sizeIcon + "rem"
                     }}>

                    <FileIcon
                        className="icon"
                        extension={icon}
                        {...defaultStyles[icon]} />

                </div>
            ) : (iconPath.replace(host, '').startsWith('{')) ? (
                <div className={openLoad ? "svg-icon flip" : 'svg-icon'}
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
                             defaultWidth={containerDimensions.width - 40 < 40 ? 40 : containerDimensions.width - 40}
                             defaultHeight={containerDimensions.width - 40 < 40 ? 40 : containerDimensions.height - 40}/>
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
                    <img id={"icon-img-" + id} className={openLoad ? (appType === 'monitor' ? "" : 'flip') : ''}
                         src={iconPath.replace(host, '').startsWith("/") ? iconPath : iconPath.replace(host, '')}
                         alt={name}/>
                </div>
            )}
            <div id={"icon-" + id} className={`icon-name ${isOverflow ? 'overflow' : ''}`}>{appType !== 'component' ? name : ''}</div>
        </div>
    );
};

export default XBladeIcon;
