import * as React from 'react';

import {getUserSettings} from "../../utils/settings";
import {useEffect, useState} from "react";
import {defaultStyles, FileIcon} from "react-file-icon";
import SVGIcon from "../XBladeIcon/SVGIcon";
import './index.css';


export default function FileIconAuto({path, img='', appType,width=20,height=20}) {
    const [icon, setIcon] = useState('');
    const host = getUserSettings('settings.host');
    const [iconSVG,setIconSVG] = useState(null);
    useEffect(() => {
        if (appType === 'file') {
            const isFolder = path.endsWith('/') || path.endsWith('\\');
            // 获取文件扩展名
            let extension = isFolder ? '' : path.split('.').pop();
            extension = extension === '' ? path.split('/').pop() : extension;
            extension = extension === '' ? path.split('\\').pop() : extension;
            setIcon(extension);
        } else {
            setIcon(img)
        }
        if (img.startsWith('{')){
            setIconSVG(JSON.parse(img))
        }
    })


    return (
        <React.Fragment>
            {img === '' ? (
                <div className='file-icon' style={{
                    width: width,
                    height: height
                }}>
                    <FileIcon
                        extension={icon}
                        {...defaultStyles[icon]} />
                </div>
            ): (img.startsWith('{')) ? (
                <div className='list-svg-icon'
                     style={{
                         background: iconSVG !== null ? iconSVG.background.style : '',
                     }}>
                    <SVGIcon svgJson={iconSVG !== null ? iconSVG.icon.path : ''}
                             defaultColor={iconSVG !== null ? iconSVG.color.style : ''}
                             defaultWidth={24}
                             defaultHeight={24}/>
                </div>
            ):(
                <img src={host + img}/>
            )}
        </React.Fragment>
    )
}