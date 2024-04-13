import React, {useState} from 'react';
import "./index.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Grid from "@mui/joy/Grid";
import {getUserSettings} from "../../../../utils/settings";
import request from "../../../../utils/request";
import ControlCameraRoundedIcon from "@mui/icons-material/ControlCameraRounded";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";
import Input from '@mui/joy/Input';


export default function ScreenSelector({
                                           regionDefault = null,
                                           setRegionDefault = () => {
                                           },
                                           setMonitorSelectorOpen = () => {
                                           }
                                       }) {
    const host = getUserSettings('settings.host');
    const [screenSize, setScreenSize] = useState(null);
    const [screenPreviewSize, setScreenPreviewSize] = useState(null);
    const [selection, setSelection] = useState(null);
    const [fullscreen, setFullscreen] = React.useState(true);
    const [region, setRegion] = React.useState([0, 0, 100, 100]);
    // 获取 screen-full-preview 元素
    let imageRect;

    // 创建一个函数来获取四个点坐标
    function getPointsCoordinates(screenSizeGet = null) {
        const ele = document.querySelector('.screen-full-size')
        imageRect = ele.getBoundingClientRect();
        if (regionDefault != null && screenSizeGet != null) {
            setRegion(regionDefault);
            let width_rate = imageRect.width / screenSizeGet[0];
            let height_rate = imageRect.height / screenSizeGet[1];
            setSelection({
                startX: imageRect.left + Math.round(regionDefault[0] * width_rate),
                startY: imageRect.top + Math.round(regionDefault[1] * height_rate),
                width: Math.round(regionDefault[2] * width_rate),
                height: Math.round(regionDefault[3] * height_rate),
            })
        }

        setScreenPreviewSize({
            x: imageRect.left,
            y: imageRect.top,
            width: imageRect.width,
            height: imageRect.height
        })
    }

    useState(() => {
        request({
            url: "/api/system/screen_size",
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: {},
        }).then((data) => {
            setScreenSize(data.data);
            getPointsCoordinates(data.data);
        });

    });


    function updateRegion(selectionIn = null) {
        const screenLeft = Math.round((selectionIn.startX - screenPreviewSize.x) * screenSize[0] / screenPreviewSize.width);
        const screenTop = Math.round((selectionIn.startY - screenPreviewSize.y) * screenSize[1] / screenPreviewSize.height);
        const screenWidth = Math.round(selectionIn.width * screenSize[0] / screenPreviewSize.width);
        const screenHeight = Math.round(selectionIn.height * screenSize[1] / screenPreviewSize.height);
        setRegion([screenLeft, screenTop, screenWidth, screenHeight])
    }


    const handelSelectionMouseDown = (e) => {
        const startX = e.clientX;
        const startY = e.clientY;

        const selectionBox = e.target.closest('.selection-box');

        if (!selectionBox) return;

        const selectionBoxRect = selectionBox.getBoundingClientRect();

        const offsetX = startX - selectionBoxRect.left;
        const offsetY = startY - selectionBoxRect.top;

        const handleMouseMove = (e) => {
            let left = e.clientX - offsetX;
            let top = e.clientY - offsetY;

            // Ensure the selection box stays within the bounds of the image
            if (left < screenPreviewSize.x) {
                left = screenPreviewSize.x;
            } else if (left + selection.width > screenPreviewSize.x + screenPreviewSize.width) {
                left = screenPreviewSize.x + screenPreviewSize.width - selection.width;
            }

            if (top < screenPreviewSize.y) {
                top = screenPreviewSize.y;
            } else if (top + selection.height > screenPreviewSize.y + screenPreviewSize.height) {
                top = screenPreviewSize.y + screenPreviewSize.height - selection.height;
            }

            setSelection(prevSelection => ({
                ...prevSelection,
                startX: left,
                startY: top
            }));
            updateRegion({startX: left, startY: top, width: selection.width, height: selection.height});
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };


    const handleMouseDown = (e) => {
        let startX = e.clientX;
        let startY = e.clientY;
        getPointsCoordinates();
        const handleMouseMove = (e) => {
            if (screenPreviewSize == null) return;
            let width = e.clientX - startX;
            let height = e.clientY - startY;
            // 限制选择框的大小和位置不超过图像边界
            if (startX + width > screenPreviewSize.x + screenPreviewSize.width) {
                width = screenPreviewSize.x + screenPreviewSize.width - startX;
            }
            if (startY + height > screenPreviewSize.y + screenPreviewSize.height) {
                height = screenPreviewSize.y + screenPreviewSize.height - startY;
            }
            if (width < 0) {
                width = Math.abs(width);
                startX = e.clientX;
            }
            if (height < 0) {
                height = Math.abs(height);
                startY = e.clientY;
            }
            setSelection({startX, startY, width, height});
            updateRegion({startX, startY, width, height});

        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };


    return (
        <React.Fragment>
            <div className="selector-pane" style={{
                width: fullscreen ? "100%" : "90%",
                height: fullscreen ? "100%" : "90%",
                top: fullscreen ? "50%" : "53%",
            }}>
                <div className="header-screen">
                    <div className="header-btn" onClick={() => setMonitorSelectorOpen(false)}>
                        <CloseRoundedIcon fontSize="large" sx={{color: "#fff", margin: "auto"}}/>
                    </div>

                    <div className="header-btn" onClick={() => {
                        setFullscreen((prevFullscreen) => {
                            return !prevFullscreen;
                        });
                    }}>
                        <ControlCameraRoundedIcon fontSize="large" sx={{color: "#fff", margin: "auto"}}/>
                    </div>
                </div>
                <div className="pane-icons">
                    <Grid container
                          columns={{xs: 6, sm: 12, md: 12}}>
                        <Grid
                            container
                            direction="column"
                            justifyContent="start"
                            alignItems="center"
                            spacing={2}
                            columns={{xs: 6, sm: 12, md: 14}}
                            xs={6} sm={4} md={4}>
                            {/*  预览  */}
                            <Grid xs={6} sm={12} md={14}>
                                <Typography level="h2" fontSize="xl" color='white' sx={{mb: 0.5}}>
                                    区域预览 {screenSize && (
                                    <Typography variant="solid"
                                                level="body-xs"
                                                color="primary"
                                                fontFamily="monospace"
                                    >({screenSize[0]}*{screenSize[1]})</Typography>
                                )}
                                </Typography>
                            </Grid>
                            <Grid xs={6} sm={12} md={14} className="screen-full-preview">
                                <div className="screen-image-container">
                                    <img
                                        style={{
                                            position: "absolute",
                                            left: -region[0] + Math.round(region[2] / 2),
                                            top: -region[1],
                                            width: screenSize != null ? screenSize[0] + 'px' : '1920px',
                                            height: screenSize != null ? screenSize[1] + 'px' : '1080px',
                                        }}
                                        src={host + '/api/tools/stream'} alt="preview-all"/>
                                </div>

                            </Grid>
                            <Grid xs={6} sm={12} md={14}>
                                <Input sx={{width: "90%", marginLeft: "5%", marginBottom: "1rem"}}
                                       variant="outlined" color="neutral" value={region.join(',')}/>
                            </Grid>
                            <Grid xs={6} sm={12} md={14}>
                                <Button loadingPosition="end"
                                        sx={{width: "90%", marginLeft: "5%", marginBottom: "1rem"}}
                                        onClick={() => {
                                            setRegionDefault(region);
                                            setMonitorSelectorOpen(false);
                                        }}>
                                    <AddTaskRoundedIcon/>&ensp;确认
                                </Button>
                            </Grid>
                        </Grid>


                        <Grid
                            direction="column"
                            justifyContent="start"
                            alignItems="center"
                            xs={6} sm={8} md={8}>
                            {/* 内容下显示区域*/}
                            <img className="screen-full-size" src={host + '/api/tools/stream'}
                                 onMouseDown={handleMouseDown} alt="screen-full-size"/>
                            {selection && (
                                <div className="selection-box" style={{
                                    left: selection.startX,
                                    top: selection.startY,
                                    width: selection.width,
                                    height: selection.height
                                }} onMouseDown={handelSelectionMouseDown}></div>
                            )}
                        </Grid>
                    </Grid>

                </div>
            </div>
        </React.Fragment>
    );
}
