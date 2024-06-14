import React, {useState, useEffect} from 'react';
import "./index.css"
import Grid from '@mui/joy/Grid';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import {ListItemContent, Tooltip} from "@mui/joy";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Header = ({
                    editing = false,
                    StopPaneEditing,
                    openAddDiag,
                    setPaneDraggable
                }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [fullscreen, setFullscreen] = useState(false);

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

                    <Tooltip title="新增应用" size="sm">

                        <IconButton onClick={openAddDiag} className='right-btn' id="add-app-btn" variant="soft">
                            <PlaylistAddIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="全屏" size="sm">
                        <IconButton variant="soft" onClick={handleFullScreen} className='right-btn'>
                            {
                                fullscreen === true ?
                                <FullscreenExitIcon /> :
                                <FullscreenIcon/>
                            }
                        </IconButton>
                    </Tooltip>





                    {editing ? (
                        <Tooltip title="保存布局" size="sm">
                            <IconButton variant="soft" onClick={StopPaneEditing} className='right-btn'>
                                <LockOpenOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="修改布局" size="sm">
                            <IconButton variant="soft" onClick={()=>setPaneDraggable(true)} className='right-btn'>
                                <LockOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}


export default Header;