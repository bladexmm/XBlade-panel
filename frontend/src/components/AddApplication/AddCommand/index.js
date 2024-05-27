import * as React from 'react';
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";
import Grid from "@mui/joy/Grid";
import {Autocomplete, AutocompleteOption, Avatar, ListItemContent, ListItemDecorator, styled} from "@mui/joy";
import {getUserSettings} from "../../../utils/settings";
import {useState} from "react";
import request from "../../../utils/request";
import Typography from "@mui/joy/Typography";
import FileIconAuto from "../../FileIconAuto/FileIconAuto";
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import AppShortcutRoundedIcon from "@mui/icons-material/AppShortcutRounded";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import SVGIcon from "../../XBladeIcon/SVGIcon";

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


export default function AddCommand({
                                       open,
                                       onClose,
                                       app = null,
                                       app_id = null,
                                       iconDefault = null,
                                       setIconDefault = () => {
                                       },
                                       apps = [],
                                       appName = '',
                                       appPath = null,
                                       defaultLayout = 'pane',
                                       appIcons = [],
                                       setIconSelectorOpen = () => {
                                       },
                                       commandDefault = null,
                                       setCommandDefault = () => {
                                       },
                                       setCommandEditOpen = () => {
                                       },
                                   }) {
    const [name, setName] = React.useState(appName);
    const [path, setPath] = React.useState(appPath);
    const [submitBtn, setSubmitBtn] = React.useState(false);
    const [icons, setIcons] = React.useState(appIcons);
    const [iconSelect, setIconSelect] = React.useState(0);
    // const [commands, setCommands] = React.useState([]);
    const host = getUserSettings('settings.host');
    const [appBind, setAppBind] = React.useState(null);
    const [thirdImg,setThirdImg] = React.useState('');

    const fetchCommands = () => {
        request({
            url: "/api/tools/commands",
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: {},
        }).then((data) => {
            // setCommands(data.data.commands)
        });
    }

    const submitBtnClick = () => {
        let icon = icons.length > 0 ? icons[iconSelect] : appIcons[0];
        let pid = appBind !== null ? appBind['id'] : null;
        let layoutName = defaultLayout === 'pane' ? null : defaultLayout;
        pid = pid !== null ? pid : layoutName;
        let appImg = iconDefault !== null ? JSON.stringify(iconDefault) : icon;
        appImg = thirdImg !== '' ? thirdImg: appImg;
        const bodySend = {
            "name": name !== '' ? name : appName,
            "icon": appImg,
            "path": commandDefault !== null ? commandDefault : path,
            "pid": pid,
            "type": 'command',
        }
        if (app_id != null) {
            bodySend.id = app_id
        }
        bodySend.path = (bodySend.path !== '' && bodySend.path !== null) ? JSON.stringify(bodySend.path) : null;
        request({
            url: "/api/apps",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: bodySend,
        }).then((data) => {
            setSubmitBtn(false)
            open = false
            onClose()
        });
    }

    const handleFileChange = (event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        // 使用fetch发送POST请求到Flask上传接口
        fetch(host + '/api/upload/script', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                // 解析JSON格式的响应数据
                return response.json();
            } else {
                throw new Error('File upload failed');
            }
        }).then(result => {
            // Ensure icons is initialized as an array
            const iconsArray = Array.isArray(icons) ? icons : [];
            if (!iconsArray.includes(result.data)) {
                setIcons([result.data, ...iconsArray]);
            }
            setIconDefault(null);
        })
    };


    const onAppBindChange = (event, values) => {
        setAppBind(values);
    }

    useState(() => {
        setName(appName)
        setIcons(appIcons)
        if (appPath !== null && appPath !== '') {
            setPath(JSON.parse(appPath));
            if (commandDefault === null) {
                setCommandDefault(JSON.parse(appPath));
            }
            if (app['pid'] != null) {
                for (let i = 0; i < apps.length; i++) {
                    if (apps[i].id === app.pid) {
                        setAppBind(apps[i]);
                        break; // 找到后可提前结束循环
                    }
                }
            }
        } else {
            setPath([]);
        }
        fetchCommands()
    }, [iconDefault])

    return (
        <React.Fragment>
            <form>
                <Stack spacing={2}>
                    <FormControl>
                        <Grid container columns={{xs: 5}} alignItems="center">
                            <Grid xs={1} alignItems='center'>
                                <Typography level="title-sm" startDecorator={<ViewQuiltRoundedIcon/>}> 名称</Typography>
                            </Grid>
                            <Grid xs={4}>
                                <Input required placeholder="指令名称" sx={{
                                    '--Input-focusedInset': 'var(--any, )',
                                    '--Input-focusedThickness': '0.25rem',
                                    '--Input-focusedHighlight': 'rgba(13,110,253,.25)',
                                    '&::before': {
                                        transition: 'box-shadow .15s ease-in-out',
                                    },
                                    '&:focus-within': {
                                        borderColor: '#86b7fe',
                                    },
                                }} value={name}
                                       onChange={(event) => setName(event.target.value)}/>

                            </Grid>
                        </Grid>
                    </FormControl>
                    <FormControl>
                        <Grid container columns={{xs: 5}} alignItems="center">
                            <Grid xs={1} alignItems='center'>
                                <Typography level="title-sm" startDecorator={<DataObjectRoundedIcon/>}> 指令</Typography>
                            </Grid>
                            <Grid xs={4}>
                                <Button loadingPosition="end" color="neutral" variant="outlined" sx={{width: "100%"}}
                                        onClick={() => setCommandEditOpen(true)}><MenuOpenIcon/>&ensp;打开编辑指令面板</Button>
                            </Grid>
                        </Grid>
                    </FormControl>
                    <FormControl>
                        <Grid container columns={{xs: 5}} alignItems="center">
                            <Grid xs={1} alignItems='center'>
                                <Typography level="title-sm" startDecorator={<AppShortcutRoundedIcon/>}> 绑定</Typography>
                            </Grid>
                            <Grid xs={4}>
                                <Autocomplete
                                    id="tags-apps"
                                    placeholder="选择要绑定的应用"
                                    options={apps}
                                    defaultValue={appBind}
                                    onChange={onAppBindChange}
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option) => (
                                        <AutocompleteOption {...props}>
                                            <ListItemDecorator>
                                                <FileIconAuto path={option.path} appType={option.type}
                                                              img={option.icon}/>
                                            </ListItemDecorator>
                                            <ListItemContent sx={{fontSize: 'sm'}}>
                                                {option.name}
                                                <Typography level="body-xs" sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '200px' // 设置最大宽度，可以根据您的需求调整
                                                }}>
                                                    {option.path}
                                                </Typography>
                                            </ListItemContent>
                                        </AutocompleteOption>
                                    )}
                                />
                            </Grid>
                        </Grid>

                    </FormControl>
                    <FormControl>
                        <Grid container columns={{xs: 5}} alignItems="center">
                            <Grid xs={1} alignItems='center'>
                                <Typography level="title-sm" startDecorator={<DiamondRoundedIcon/>}> 图标</Typography>
                            </Grid>
                            <Grid xs={4}>
                                <Input required
                                       placeholder="三方图片地址"
                                       value={thirdImg}
                                       sx={{
                                           '--Input-focusedInset': 'var(--any, )',
                                           '--Input-focusedThickness': '0.25rem',
                                           '--Input-focusedHighlight': 'rgba(13,110,253,.25)',
                                           '&::before': {
                                               transition: 'box-shadow .15s ease-in-out',
                                           },
                                           '&:focus-within': {
                                               borderColor: '#86b7fe',
                                           },
                                       }}
                                       onChange={(event) => setThirdImg(event.target.value)}/>

                            </Grid>
                            <Grid xs={1} alignItems='center'></Grid>
                            <Grid xs={2} style={{marginTop:".5rem"}}>
                                <Button style={{width: "95%"}} loadingPosition="end" color="neutral" variant="outlined"
                                        onClick={() => setIconSelectorOpen(true)}><MenuOpenIcon/>&ensp;自定义</Button>
                            </Grid>
                            <Grid xs={2} style={{marginTop:".5rem"}}>
                                <Button
                                    style={{width: "100%"}}
                                    component="label"
                                    role={undefined}
                                    tabIndex={-1}
                                    variant="outlined"
                                    color="neutral"
                                    startDecorator={
                                        <SvgIcon>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                                />
                                            </svg>
                                        </SvgIcon>
                                    }
                                >
                                    上传
                                    <VisuallyHiddenInput onChange={handleFileChange} type="file"/>
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}
                              sx={{overflowY: "scroll", height: "8rem", marginTop: "1rem"}}>
                            {iconDefault !== null ? (
                                <Grid xs={1}>
                                    <div className='icon-selected' style={{background: iconDefault.background.style}}
                                         onClick={() => {
                                         }}>
                                        <SVGIcon svgJson={iconDefault.icon.path}
                                                 defaultColor={iconDefault.color.style}/>
                                    </div>
                                </Grid>
                            ) : (<React.Fragment>
                                {(appIcons.lenght > 0 ? appIcons : icons).map((iconSource, index) => (
                                    <Grid xs={2}>
                                        <Avatar onClick={() => setIconSelect(index)}
                                                className={iconSelect === index ? "avatars select" : "avatars"}
                                                src={host + iconSource}/>
                                    </Grid>
                                ))}
                            </React.Fragment>)}
                        </Grid>

                    </FormControl>
                    <Button loadingPosition="end" onClick={submitBtnClick} loading={submitBtn}>提交&ensp;
                        <SendRoundedIcon/></Button>
                </Stack>
            </form>

        </React.Fragment>
    )
}