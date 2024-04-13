import DialogTitle from "@mui/joy/DialogTitle";
import * as React from "react";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import AppShortcutRoundedIcon from "@mui/icons-material/AppShortcutRounded";
import {Autocomplete, AutocompleteOption, ListItemContent, ListItemDecorator} from "@mui/joy";
import FileIconAuto from "../../FileIconAuto/FileIconAuto";
import Typography from "@mui/joy/Typography";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import request from "../../../utils/request";
import {useState} from "react";
import {IMaskInput} from 'react-imask';
import PropTypes from 'prop-types';
import MenuOpenIcon from "@mui/icons-material/MenuOpen";


const TextMaskAdapter = React.forwardRef(function TextMaskAdapter(props, ref) {
    const {onChange, ...other} = props;
    return (
        <IMaskInput
            {...other}
            mask="0000,0000,0000,0000"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({target: {name: props.name, value}})}
            overwrite
        />
    );
});

TextMaskAdapter.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default function AddMonitor({
                                       onClose,
                                       app = null,
                                       app_id = null,
                                       regionDefault = [],
                                       apps = [],
                                       appName = '',
                                       appPath = '',
                                       appIcons = [],
                                       setRegionDefault = () => {
                                       },
                                       setMonitorSelectorOpen = () => {
                                       }
                                   }) {
    const [name, setName] = React.useState(appName);
    const [appBind, setAppBind] = React.useState(null);
    const [submitBtn, setSubmitBtn] = React.useState(false);


    const inputStyle = {
        '--Input-focusedInset': 'var(--any, )',
        '--Input-focusedThickness': '0.25rem',
        '--Input-focusedHighlight': 'rgba(13,110,253,.25)',
        '&::before': {
            transition: 'box-shadow .15s ease-in-out',
        },
        '&:focus-within': {
            borderColor: '#86b7fe',
        },
    }

    const submitBtnClick = () => {
        setSubmitBtn(true)
        const bodySend = {
            "name": name,
            "icon": regionDefault !== [] ? '/api/tools/stream?region=' + encodeURIComponent(regionDefault.join(',')) : '',
            "path": regionDefault !== [] ? regionDefault.join(',') : '',
            "pid": appBind !== null ? appBind['id'] : null,
            "type": 'monitor',
        }
        if (app_id != null) {
            bodySend.id = app_id
        }
        request({
            url: "/api/apps",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: bodySend,
        }).then((data) => {
            setSubmitBtn(false)
            onClose()
        });
    }
    const onAppBindChange = (event, values) => {
        setAppBind(values);
    }

    useState(() => {
        setName(appName)
        if (app_id != null && app['pid'] != null) {
            for (let i = 0; i < apps.length; i++) {
                if (apps[i].id === app.pid) {
                    setAppBind(apps[i]);
                    break; // 找到后可提前结束循环
                }
            }

        }
        if (app_id != null) {
            let regionStr = app['icon'].replace('/api/tools/stream?region=', '')
            let decodedString = decodeURIComponent(regionStr);
            let stringArray = decodedString.split(",");
            let integerArray = stringArray.map(Number);
            setRegionDefault(integerArray);
        }

    }, [appName, appPath, appIcons, regionDefault])

    return (
        <React.Fragment>
            <DialogTitle>新增屏幕监控</DialogTitle>
            <form>
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel><ViewQuiltRoundedIcon/>&ensp;应用名</FormLabel>
                        <Input required placeholder="应用程序描述" sx={inputStyle} value={name}
                               onChange={(event) => setName(event.target.value)}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel><AppShortcutRoundedIcon/>&ensp;绑定应用</FormLabel>
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
                                        <FileIconAuto path={option.path} appType={option.type} img={option.icon}/>
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
                    </FormControl>
                    <FormControl>
                        <FormLabel><DiamondRoundedIcon/>&ensp;截取区域&ensp;</FormLabel>
                        <Button loadingPosition="end" color="neutral" variant="outlined" sx={{marginBottom: "0.5rem"}}
                                onClick={() => setMonitorSelectorOpen(true)}><MenuOpenIcon/>&ensp;编辑显示区域</Button>
                    </FormControl>
                    <Button loadingPosition="end" onClick={submitBtnClick} loading={submitBtn}>提交&ensp;
                        <SendRoundedIcon/></Button>
                </Stack>

            </form>
        </React.Fragment>
    );
}