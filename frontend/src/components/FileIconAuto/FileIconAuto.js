import * as React from 'react';

import {styled} from "@mui/joy";
import {getUserSettings} from "../../utils/settings";
import {useEffect, useState} from "react";
import {defaultStyles, FileIcon} from "react-file-icon";



export default function FileIconAuto({path, img='', appType,width=20,height=20}) {
    const [icon, setIcon] = useState('');
    const host = getUserSettings('settings.host');

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
    })


    return (
        <React.Fragment>
            {(appType === 'file' || img === '') ? (
                <div className='file-icon' style={{
                    width: width,
                    height: height
                }}>
                    <FileIcon
                        extension={icon}
                        {...defaultStyles[icon]} />
                </div>
            ) : (
                <img
                    loading="lazy"
                    width={width}
                    srcSet={host + icon}
                    src={host + icon}
                    alt=""
                />
            )}
        </React.Fragment>
    )
}