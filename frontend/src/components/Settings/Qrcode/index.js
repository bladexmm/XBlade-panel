import * as React from 'react';
import Typography from '@mui/joy/Typography';
import QRCode from "qrcode.react";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button";
import './index.css';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import RestoreIcon from '@mui/icons-material/Restore';
import request from "../../../utils/request";
import {getUserSettings, saveUserSettings} from "../../../utils/settings";
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    ButtonGroup,
    Divider,
    ListItemContent,
    styled
} from "@mui/joy";
import {useSnackbar} from '../../SnackbarUtil/SnackbarUtil';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import {useColorScheme} from '@mui/joy/styles';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import FolderIcon from '@mui/icons-material/Folder';
import Input from "@mui/joy/Input";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const VisuallyHiddenInput = styled('input')`
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
export default function Qrcode({defaultLayout}) {
    const currentURL = window.location.href;
    const host = getUserSettings('settings.host');
    const {showMessage} = useSnackbar();
    const {mode, setMode} = useColorScheme();

    const backupUrl = () => {
        request({
            url: "/api/tools/backup",
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then((res) => {
            showMessage(res.msg, res.code);
            window.open(host + res.data, '_blank');
        })
    }

    const clearBackup = () => {
        request({
            url: "/api/tools/backup",
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        }).then((res) => {
            showMessage(res.msg, res.code);
        })
    }

    const restore = (event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        // 使用fetch发送POST请求到Flask上传接口
        fetch(host + '/api/tools/backup', {
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
        })
    }

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
        })
    }

    const browserWallpapers = ()=>{
        request({
            url: "/api/tools/wallpaper",
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }).then((res) => {
            showMessage(res.msg, res.code);
        })
    }

    const copyLink = () => {
        showMessage("复制成功", 1);
    };


    const systemMenu = (type)=>{
        request({
            url: "/api/system/menu",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:{type:type},
        }).then((res) => {
            showMessage(res.msg, res.code);
        })
    }

    const startup = (type)=>{
        request({
            url: "/api/system/startup",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:{type:type},
        }).then((res) => {
            showMessage(res.msg, res.code);
        })
    }

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2} columns={{xs: 6, sm: 8, md: 12}}>
            <Grid xs={6} sm={8} md={12} container direction="row" justifyContent="center" alignItems="center" spacing={2} columns={{xs: 6, sm: 8, md: 12}}>
                <Grid xs={6} sm={8} md={3}>
                    <ListItemContent>
                        <Typography level="title-lg">
                            数据备份
                        </Typography>
                        <Typography level="body-xs" fontFamily="monospace" sx={{opacity: '70%'}}>
                            备份所有应用数据，以便跨设备还原
                        </Typography>
                    </ListItemContent>
                </Grid>
                <Grid xs={0} sm={0} md={5}></Grid>
                <Grid xs={6} sm={8} md={3}>
                    <ButtonGroup>
                        <Button variant="soft" onClick={backupUrl} className="system-recover-btn" color="neutral" startDecorator={<SaveRoundedIcon sx={{fontSize: "1rem"}}/>}>
                            备份
                        </Button>
                        <Button component="label" role={undefined} tabIndex={-1} variant="soft" color="neutral" className="system-recover-btn" startDecorator={<RestoreIcon sx={{fontSize: "1rem"}}/>}>
                            恢复
                            <VisuallyHiddenInput onChange={restore} type="file"/>
                        </Button>
                        <Button variant="soft" onClick={clearBackup} className="system-recover-btn" color="neutral" startDecorator={<AutoDeleteIcon sx={{fontSize: "1rem"}}/>}>
                            清空
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>

            <Grid xs={6} sm={8} md={12} container direction="row" justifyContent="center" alignItems="center" spacing={2} columns={{xs: 6, sm: 8, md: 12}}>
                <Grid xs={6} sm={8} md={3}>
                    <ListItemContent>
                        <Typography level="title-lg">
                            主题模式
                        </Typography>
                        <Typography level="body-xs" fontFamily="monospace" sx={{opacity: '70%'}}>
                            更改界面显示颜色
                        </Typography>
                    </ListItemContent>
                </Grid>
                <Grid xs={0} sm={0} md={5}></Grid>

                <Grid xs={6} sm={8} md={3}>
                    <ButtonGroup>
                        <Button variant="soft" onClick={() => {setMode("light"); saveUserSettings('settings.theme', 'light');}} className="system-recover-btn" color="neutral" startDecorator={<LightModeIcon sx={{fontSize: "1rem"}}/>}>
                            浅色
                        </Button>
                        <Button variant="soft" onClick={() => {setMode("system"); saveUserSettings('settings.theme', 'system');}} className="system-recover-btn" color="neutral" startDecorator={<Brightness4Icon sx={{fontSize: "1rem"}}/>}>
                            系统
                        </Button>
                        <Button variant="soft" onClick={() => {setMode("dark"); saveUserSettings('settings.theme', 'dark');}} className="system-recover-btn" color="neutral" startDecorator={<DarkModeIcon sx={{fontSize: "1rem"}}/>}>
                            深色
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>


            <Grid xs={6} sm={8} md={12} container direction="row" justifyContent="center" alignItems="center" spacing={2} columns={{xs: 6, sm: 8, md: 12}}>
                <Grid xs={6} sm={8} md={3}>
                    <ListItemContent>
                        <Typography level="title-lg">
                            右键菜单
                        </Typography>
                        <Typography level="body-xs" fontFamily="monospace" sx={{opacity: '70%'}}>
                            新增快速添加应用按钮
                        </Typography>
                    </ListItemContent>
                </Grid>
                <Grid xs={0} sm={0} md={5}></Grid>

                <Grid xs={6} sm={8} md={3}>
                    <ButtonGroup>
                        <Button variant="soft" onClick={() => {systemMenu("add");}} className="system-recover-btn" color="neutral" startDecorator={<PlaylistAddIcon sx={{fontSize: "1rem"}}/>}>
                            添加
                        </Button>
                        <Button variant="soft" onClick={() => {systemMenu("remove");}} className="system-recover-btn" color="neutral" startDecorator={<PlaylistRemoveIcon sx={{fontSize: "1rem"}}/>}>
                            移除
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>


            <Grid xs={6} sm={8} md={12} container direction="row" justifyContent="center" alignItems="center" spacing={2} columns={{xs: 6, sm: 8, md: 12}}>
                <Grid xs={6} sm={8} md={3}>
                    <ListItemContent>
                        <Typography level="title-lg">
                            开机启动
                        </Typography>
                        <Typography level="body-xs" fontFamily="monospace" sx={{opacity: '70%'}}>
                            将应用添加到开机启动项
                        </Typography>
                    </ListItemContent>
                </Grid>
                <Grid xs={0} sm={0} md={5}></Grid>

                <Grid xs={6} sm={8} md={3}>
                    <ButtonGroup>
                        <Button variant="soft" onClick={() => {startup("add"); }} className="system-recover-btn" color="neutral" startDecorator={<PlaylistAddIcon sx={{fontSize: "1rem"}}/>}>
                            添加
                        </Button>
                        <Button variant="soft" onClick={() => {startup("remove");}} className="system-recover-btn" color="neutral" startDecorator={<PlaylistRemoveIcon sx={{fontSize: "1rem"}}/>}>
                            移除
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>



            <Grid xs={6} sm={8} md={12} container direction="rows" justifyContent="center" alignItems="center"
                  spacing={2} columns={{xs: 6, sm: 8, md: 12}}>
                <Grid xs={6} sm={8} md={3}>
                    <ListItemContent>
                        <Typography level="title-lg">
                            导入应用
                        </Typography>
                        <Typography level="body-xs" fontFamily="monospace" sx={{opacity: '70%'}}>
                            跨设备导入指定应用
                        </Typography>
                    </ListItemContent>
                </Grid>
                <Grid xs={0} sm={0} md={5}></Grid>
                <Grid xs={6} sm={8} md={3}>
                    <Button variant="soft" className="system-recover-btn" color="neutral"
                            component="label" role={undefined} tabIndex={-1}
                            startDecorator={<CloudUploadRoundedIcon sx={{fontSize: "1rem"}}/>}>
                        上传文件
                        <ImportAppsVisuallyHiddenInput onChange={importApps} type="file"/>
                    </Button>
                </Grid>
            </Grid>


            <Grid xs={6} sm={8} md={12} container direction="rows" justifyContent="center" alignItems="center"
                  spacing={2} columns={{xs: 6, sm: 8, md: 12}}>
                <Grid xs={6} sm={8} md={3}>
                    <ListItemContent>
                        <Typography level="title-lg">
                            个性化背景
                        </Typography>
                        <Typography level="body-xs" fontFamily="monospace" sx={{opacity: '70%'}}>
                            浏览、添加、删除本地壁纸
                        </Typography>
                    </ListItemContent>
                </Grid>
                <Grid xs={0} sm={0} md={5}></Grid>
                <Grid xs={6} sm={8} md={3}>
                    <Button variant="soft" className="system-recover-btn" color="neutral"
                            startDecorator={<FolderIcon sx={{fontSize: "1rem"}}/>} onClick={browserWallpapers}>
                        浏览壁纸
                    </Button>
                </Grid>
            </Grid>


            <Grid xs={6} sm={8} md={12}>
                <Divider />
            </Grid>

            <Grid xs={6} sm={8} md={11}>
                <AccordionGroup size="md" variant="plain">
                    <Accordion sx={{paddingInline:0}}>
                        <AccordionSummary>
                            <ListItemContent>
                                <Typography level="title-lg">二维码访问</Typography>
                                <Typography level="body-xs" fontFamily="monospace" sx={{opacity: '70%'}}>
                                    同局域网内，跨设备访问
                                </Typography>
                            </ListItemContent>

                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container direction="rows"
                                  sx={{paddingTop:"1rem"}}
                                  spacing={2} columns={{xs: 6, sm: 8, md: 10}}>

                                <QRCode value={currentURL} style={{marginRight:'1rem'}}/>
                                <ListItemContent>
                                    <Typography level="title-md">面板地址：</Typography>
                                    <Typography level="body-xs" fontFamily="monospace" sx={{opacity: '70%'}}>
                                        可用摄像头扫描二维码，也可直接分享下面链接
                                    </Typography>
                                    <CopyToClipboard text={currentURL} onCopy={copyLink}>
                                        <Input
                                            startDecorator={<InsertLinkIcon />}
                                            style={{minWidth:"17rem",maxWidth:"25rem"}}
                                            value={currentURL}
                                            endDecorator={<Button onClick={copyLink}>复制</Button>}
                                        />
                                    </CopyToClipboard>


                                </ListItemContent>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            </Grid>

        </Grid>
    );
}
