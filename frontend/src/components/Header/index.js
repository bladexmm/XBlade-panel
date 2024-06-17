import React, {useState, useEffect, useRef} from 'react';
import "./index.css"
import Grid from '@mui/joy/Grid';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import {ListItemContent, styled, Tooltip} from "@mui/joy";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import {useSnackbar} from "../SnackbarUtil/SnackbarUtil";
import {getUserSettings} from "../../utils/settings";
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import BlurOnRoundedIcon from '@mui/icons-material/BlurOnRounded';
import BlurOffRoundedIcon from '@mui/icons-material/BlurOffRounded';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';

const ImportAppsVisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
`;

const Header = ({
                    editing = false,
                    defaultLayout,
                    StopPaneEditing,
                    openAddDiag,
                    setPaneDraggable
                }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [fullscreen, setFullscreen] = useState(false);
    const {showMessage} = useSnackbar();
    const host = getUserSettings('settings.host');
    const inputRef = useRef(null);
    const handleImportClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    const handleFullScreen = () => {
        if (document.fullscreenEnabled) {
            if (!document.fullscreenElement) {
                setFullscreen(true)
                document.documentElement.requestFullscreen();
            } else {
                setFullscreen(false)
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }
    };


    const importApps = (event) =>{
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append('layout', defaultLayout);
        // 使用fetch发送POST请求到Flask上传接口
        fetch(host + '/api/tools/import', {
            method: 'PUT',
            body: formData
        }).then(response => {
            if (response.ok) {
                // 解析JSON格式的响应数据
                return response.json();
            } else {
                throw new Error('File upload failed');
            }
        }).then(res => {
            showMessage(res.msg, res.code);
            window.location.reload();
        })
    }


    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="header">
            <Grid container sx={{flexGrow: 1, height: "100%"}}>
                <Grid xs={1} className='items-left'>
                    <ListItemContent>
                        <Typography className='time' color="white" level="body-xs" variant="soft">
                            {currentTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit',second:'2-digit', hour12: true})}
                        </Typography>
                    </ListItemContent>

                </Grid>
                <Grid xs={7}></Grid>

                <Grid xs={4} className='items-right'>
                    <Tooltip title="导入应用" size="sm">

                        <React.Fragment>
                            <IconButton className='right-btn' id="add-app-btn" onClick={handleImportClick} variant="soft">
                                <PublishRoundedIcon />
                            </IconButton>
                            <ImportAppsVisuallyHiddenInput ref={inputRef} onChange={importApps} type="file"/>
                        </React.Fragment>

                    </Tooltip>

                    <Tooltip title="新增应用" size="sm">

                        <IconButton onClick={openAddDiag} className='right-btn' id="add-app-btn" variant="soft">
                            <PlaylistAddRoundedIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="全屏" size="sm">
                        <IconButton variant="soft" onClick={handleFullScreen} className='right-btn'>
                            {
                                fullscreen === true ?
                                <FullscreenExitRoundedIcon /> :
                                <FullscreenRoundedIcon/>
                            }
                        </IconButton>
                    </Tooltip>





                    {editing ? (
                        <Tooltip title="保存布局" size="sm">
                            <IconButton variant="soft" onClick={StopPaneEditing} className='right-btn'>
                                <BlurOffRoundedIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="修改布局" size="sm">
                            <IconButton variant="soft" onClick={()=>setPaneDraggable(true)} className='right-btn'>
                                <BlurOnRoundedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}


export default Header;