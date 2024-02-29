import React, {useRef, useEffect, useState} from 'react';
import './index.css';
import FadeIn from "../FadeIn";

const RightClickMenu = ({
                            xPos, yPos, hideMenu, layoutType, changeSize,
                            deleteBtn = layoutType => {
                            },
                            editBtn = () => {
                            },
                            pinBtn = () => {
                            },
                            closeBtn = () => {
                            }
                        }) => {
    const menuRef = useRef(null);
    const [menuDimensions, setMenuDimensions] = useState({width: 0, height: 0});
    const [checked, setChecked] = React.useState(false);

    useEffect(() => {
        // 获取菜单的宽度和高度
        if (menuRef.current) {
            const {width, height} = menuRef.current.getBoundingClientRect();
            setMenuDimensions({width, height});
        }
        setChecked(true)
    }, []);


    // 调整菜单的位置计算，确保在视口内显示
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const adjustedXPos = xPos + menuDimensions.width > windowWidth ? windowWidth - menuDimensions.width : xPos;
    const adjustedYPos = yPos + menuDimensions.height > windowHeight ? windowHeight - menuDimensions.height : yPos;

    return (
        <FadeIn show={checked}>
                <div
                    ref={menuRef}
                    className="right-click-menu"
                    style={{top: adjustedYPos, left: adjustedXPos}}
                    onClick={hideMenu}
                >

                    <ul>

                        {layoutType === 'pane' && (
                            <React.Fragment>
                                <li onClick={() => pinBtn()}>固定到任务栏</li>
                                <li onClick={() => editBtn()}>编辑</li>
                                <li onClick={() => deleteBtn(layoutType)}>删除</li>
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

                        {layoutType === 'dock' && (
                            <li onClick={() => pinBtn()}>取消固定</li>

                        )}

                        <hr className="divider"/>
                        <li onClick={() => closeBtn()}>关闭</li>

                    </ul>
                </div>
        </FadeIn>


    )
        ;
};

export default RightClickMenu;
