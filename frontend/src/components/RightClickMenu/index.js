import React, {useRef, useEffect, useState} from 'react';
import './index.css';
import {
    useSpring,animated, config,
} from '@react-spring/web'


const RightClickMenu = ({
                            xPos, yPos, hideMenu, layoutType, changeSize,
                            deleteBtn = layoutType => {
                            },
                            editBtn = () => {
                            },
                            pinBtn = () => {
                            },
                            setMenuVisible = () => {
                            },
                            commandBtn = () => {
                            }
                        }) => {
    const menuRef = useRef(null);
    const [menuDimensions, setMenuDimensions] = useState({width: 0, height: 0});

    useEffect(() => {
        // 获取菜单的宽度和高度
        if (menuRef.current) {
            const {width, height} = menuRef.current.getBoundingClientRect();
            setMenuDimensions({width, height});
        }
    }, []);


    // 调整菜单的位置计算，确保在视口内显示
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const adjustedXPos = xPos + menuDimensions.width > windowWidth ? windowWidth - menuDimensions.width : xPos;
    const adjustedYPos = yPos + menuDimensions.height > windowHeight ? windowHeight - menuDimensions.height : yPos;
    const [openMenuAnime, setOpenMenuAnime] = useSpring(() => ({
        config: {tension: 500, friction: 20},
        from: {
            top: adjustedYPos - 20,
            left: adjustedXPos - 40,
        },
        to: {
            top: adjustedYPos - 20,
            left: adjustedXPos - 20,
        }
    }));
    return (
        <animated.div
            ref={menuRef}
            className="right-click-menu"
            style={{...openMenuAnime}}
            onClick={hideMenu}
        >

            <ul>

                {layoutType === 'pane' && (
                    <React.Fragment>
                        <li onClick={() => commandBtn()}>打开命令面板</li>
                        <hr className="divider"/>
                        <li onClick={() => pinBtn()}>固定到任务栏</li>
                        <li onClick={() => editBtn()}>编辑</li>
                        <li onClick={() => deleteBtn(layoutType)}>移除</li>
                        <hr className="divider"/>
                        <li onClick={() => changeSize(1)}>小</li>
                        <li onClick={() => changeSize(2)}>中</li>
                        <li onClick={() => changeSize(3)}>大</li>
                    </React.Fragment>

                )}

                {layoutType === 'search' && (
                    <React.Fragment>
                        <li onClick={() => pinBtn()}>添加</li>
                        <li onClick={() => editBtn()}>编辑</li>
                        <li onClick={() => deleteBtn(layoutType)}>删除</li>
                    </React.Fragment>

                )}

                {layoutType === 'command' && (
                    <React.Fragment>
                        <li onClick={() => editBtn()}>编辑</li>
                        <li onClick={() => deleteBtn(layoutType)}>删除</li>
                        <hr className="divider"/>
                        <li onClick={() => changeSize(1)}>小</li>
                        <li onClick={() => changeSize(2)}>中</li>
                        <li onClick={() => changeSize(3)}>大</li>
                    </React.Fragment>

                )}

                {layoutType === 'dock' && (
                    <li onClick={() => pinBtn()}>取消固定</li>

                )}

                <hr className="divider"/>
                <li onClick={() => {
                    setOpenMenuAnime({
                        config: config.stiff,
                        opacity: 0,
                        from: {opacity: 1},
                        onRest: () => {
                            setMenuVisible(false);
                        }
                    });

                }}>关闭
                </li>

            </ul>
        </animated.div>


    )
        ;
};

export default RightClickMenu;
