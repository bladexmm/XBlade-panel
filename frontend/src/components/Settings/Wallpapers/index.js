import * as React from 'react';
import "./index.css"
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import {getUserSettings, saveUserSettings} from "../../../utils/settings";
import {useState} from "react";
import request from "../../../utils/request";
import TabList from "@mui/joy/TabList";
import Tab, {tabClasses} from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";


export default function WallpaperBasicGrid({
                                               onClick = () => {
                                               }
                                           }) {
    const host = getUserSettings('settings.host')
    const [wallpapers, setWallpapers] = React.useState([]);
    const handleItemClick = (videoSource) => {
        // 在这里执行点击事件处理程序
        saveUserSettings('settings.wallpaper', videoSource);
        onClick(videoSource);
    };

    useState(() => {
        request({
            url: "/api/wallpaper/list",
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: {},
        }).then((data) => {
            setWallpapers(data.data);
        });
    }, [])
    return (
        <Box sx={{flexGrow: 1}}>
            <Tabs aria-label="tabs" defaultValue={0} sx={{bgcolor: 'transparent', margin: "auto"}}>
                <TabList
                    disableUnderline
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        borderRadius: 'xl',
                        bgcolor: 'background.level1',
                        [`& .${tabClasses.root}[aria-selected="true"]`]: {
                            boxShadow: 'sm',
                            bgcolor: 'background.surface',
                        },
                    }}
                >

                    {wallpapers.map((wallpaper, index) => (
                        <Tab disableIndicator>{wallpaper.name}</Tab>
                    ))}
                </TabList>
                <Box style={{width: "35rem", height: "35rem"}}>

                    {wallpapers.map((wallpaper, index) => (
                        <TabPanel value={index}>
                            <Grid container className="container" spacing={2}>

                                {wallpaper['videos'].map((video, index) => (
                                    <Grid item xs={6} className="wallpaper-items" onClick={() => handleItemClick(video)}
                                          key={index}>
                                        <video className="wallpaper-video" loop muted>
                                            <source src={host + video} type="video/mp4"/>
                                        </video>
                                    </Grid>
                                ))}
                            </Grid>
                        </TabPanel>
                    ))}
                </Box>
            </Tabs>


        </Box>
    );
}