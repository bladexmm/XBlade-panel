import Grid from "@mui/joy/Grid";
import {useEffect} from "react";
import request from "../../../utils/request";
import * as React from "react";
import Input from "@mui/joy/Input";
import {defaultStyles, FileIcon} from "react-file-icon";
import './index.css'
import {ListItemContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import {useSnackbar} from "../../SnackbarUtil/SnackbarUtil";

export default function Plugin({defaultLayout}) {
    const {showMessage} = useSnackbar();
    const [installedApps, setInstalledApps] = React.useState([]);
    const [filteredApps, setFilterApps] = React.useState([]);
    const fetch_installed_apps = () => {
        request({
            url: "/api/system/apps",
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then((data) => {
            setInstalledApps(data.data)
            setFilterApps(data.data)
        });
    }

    const addApps = (app) => {
        request({
            url: "/api/apps/fetch",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: {"path": app['path']},
        }).then((data) => {
            const bodySend = {
                name: app['name'],
                icon: data.data.images[0],
                pid: defaultLayout === 'pane' ? null : defaultLayout,
                path: app['path'],
                type: 'default',
            }
            request({
                url: "/api/apps",
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: bodySend,
            }).then((res) => {
                showMessage(res.msg, res.code);
            });
        });
    }

    useEffect(() => {
        fetch_installed_apps()
    }, []);
    return (
        <Grid container direction="row" spacing={2}
              columns={{xs: 1}}>
            <Grid xs={1}>
                <Input
                    placeholder="搜索" color="neutral" variant="soft"
                    sx={{
                        '--Input-radius': '0px',
                        borderRadius: "1rem",
                        width: "100%",
                        margin: "auto",
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
                    onChange={(event) => {
                        const inputText = event.target.value.toLowerCase();
                        const filterByText = (key) => app => app[key].toLowerCase().includes(inputText);
                        const filtered = installedApps.filter(
                            filterByText('name') ||
                            filterByText('pinyin') ||
                            filterByText('short_path') ||
                            filterByText('path')
                        );
                        setFilterApps(filtered);
                    }}
                />
            </Grid>
            <Grid xs={1} container direction="row" columns={{xs: 1, sm: 2, md: 3, lg: 5}} spacing={2}>
                {filteredApps.map((app, i) => (
                    <Grid xs={1} sm={1} md={1} lg={1}
                          container direction="row" justifyContent="center" alignItems="center"
                          columns={{xs: 5}}>
                        <Grid xs={1}>
                            {app.icon !== '' ? (
                                <img src={app.icon} alt={app.name}/>
                            ) : (
                                <div style={{width: '32px', height: '32px'}}>
                                    <FileIcon
                                        className="icon"
                                        sx={{width: '32px', height: '32px'}}
                                        extension={app.ext.replace('.', '')}
                                        {...defaultStyles[app.path.split('.')[-1]]} />
                                </div>

                            )}
                        </Grid>
                        <Grid xs={3}>
                            <ListItemContent>
                                <Typography level="title-sm" sx={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}>{app.name}</Typography>
                                <Typography level="body-xs" sx={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}>{app.short_path}</Typography>
                            </ListItemContent>
                        </Grid>

                        <Grid xs={1}>
                            <Button size="sm" sx={{padding: '0 8px'}} onClick={()=>addApps(app)} color="neutral" variant="soft"><PlaylistAddIcon/></Button>
                        </Grid>

                    </Grid>

                ))}

            </Grid>

        </Grid>
    );
}