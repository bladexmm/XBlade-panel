import React, {useState, useEffect} from 'react';
import "./index.css"
import Grid from '@mui/joy/Grid';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import {ListItemContent, Tooltip} from "@mui/joy";
import SaveIcon from '@mui/icons-material/Save';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const Header = ({
                    editing = false,
                    StopPaneEditing,
                    openAddDiag,
                }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [fullscreen, setFullscreen] = useState(false);

    const handleFullScreen = () => {
        // 如果浏览器支持全屏功能
        if (document.fullscreenEnabled) {
            // 如果当前不是全屏状态，则请求进入全屏
            if (!document.fullscreenElement) {
                setFullscreen(true)
                document.documentElement.requestFullscreen();
            } else { // 否则退出全屏
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
                        {/*<Typography className='time' color="white" level="body-xs" variant="soft">*/}
                        {/*    {currentTime.toLocaleTimeString([],*/}
                        {/*        {year: 'numeric',month: '2-digit',day: '2-digit'}*/}
                        {/*    ).slice(0, 10)}*/}
                        {/*</Typography>*/}
                    </ListItemContent>

                </Grid>
                <Grid xs={7}>
                </Grid>

                <Grid xs={4} className='items-right'>
                    <Tooltip title="新增应用" size="sm">
                        <IconButton size="sm" variant="soft" onClick={openAddDiag} color="primary" className='right-btn'>
                            <PlaylistAddIcon fontSize="small"
                                 sx={{color: "#fff", margin: "auto"}}
                            />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="全屏" size="sm">
                        <IconButton size="sm" variant="soft" onClick={handleFullScreen} color="primary" className='right-btn'>
                            {
                                fullscreen === true ?
                                <FullscreenExitIcon fontSize="small" sx={{color: "#fff", margin: "auto"}}/> :
                                <FullscreenIcon fontSize="small" sx={{color: "#fff", margin: "auto"}}/>
                            }
                        </IconButton>
                    </Tooltip>



                    {editing && (
                        <Tooltip title="保存布局" size="sm">
                            <IconButton size="sm" variant="soft" onClick={StopPaneEditing} color="primary" className='right-btn'>
                                <SaveIcon fontSize="small" sx={{color: "#fff", margin: "auto"}}/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}

export default Header;