import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as React from "react";
import {useState} from "react";
import Grid from "@mui/joy/Grid";
import request from "../../utils/request";
import SVGIcon from "../XBladeIcon/SVGIcon";
import "./index.css"
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import {ColorPicker} from 'react-color-gradient-picker';
import 'react-color-gradient-picker/dist/index.css';
import {Accordion, AccordionDetails, AccordionGroup, AccordionSummary} from "@mui/joy";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';

const color = {
    red: 255,
    green: 255,
    blue: 255,
    alpha: 1,
    style: "rgba(255, 255, 255, 1)"
};

const gradient = {
    points: [
        {left: 0, red: 43, green: 39, blue: 39, alpha: 1},
        {left: 100, red: 119, green: 117, blue: 117, alpha: 1},
    ],
    style: "linear-gradient(113deg,rgba(43, 39, 39, 1) 0%,rgba(119, 117, 117, 1) 100%)",
    degree: 0,
    type: 'linear',
};
export default function IconSelector({
                                         iconDefault = null,
                                         closeBtn = () => {
                                         },
                                         setIconDefault = () => {
                                         },
                                     }) {
    const [icons, setIcons] = React.useState([]);
    const [iconSelected, setIconSelected] = React.useState(null);
    const [iconColorAttrs, setIconColorAttrs] = useState(color);
    const [backgroundColorAttrs, setBackgroundColorAttrs] = useState(gradient);
    const [searchInput, setSearchInput] = useState('');

    const onIconColorChange = (colorAttrs) => {
        setIconColorAttrs(colorAttrs);
    };
    const onBackgroundColorChange = (gradientAttrs) => {
        setBackgroundColorAttrs(gradientAttrs);
    };


    const searchIcon = () => {
        request({
            url: "/api/icon?name=" + searchInput,
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: {},
        }).then((data) => {
            setIcons(data.data)
            if (data.data.length > 0 && iconSelected === null) {
                setIconSelected(data.data[0])
            }
        });
    }
    const searchInputChange = (value) =>{
        setSearchInput(value);
        request({
            url: "/api/icon?name=" + value,
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: {},
        }).then((data) => {
            setIcons(data.data)
            if (data.data.length > 0 && iconSelected === null) {
                setIconSelected(data.data[0])
            }
        });
    }

    const saveIcon = () => {
        setIconDefault({icon: iconSelected, color: iconColorAttrs, background: backgroundColorAttrs});
        closeBtn();
    }

    useState(() => {
        request({
            url: "/api/icon",
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: {},
        }).then((data) => {
            setIcons(data.data)
            if (data.data.length > 0 && iconSelected === null) {
                setIconSelected(data.data[0])
            }
            if(iconDefault !== null){
                setIconSelected(iconDefault.icon);
                setIconColorAttrs(iconDefault.color);
                setBackgroundColorAttrs(iconDefault.background);
            }
        });

    }, [iconDefault])
    return (

        <div className="icon-selector-pane">
            <div className="cmd-header">
                <div className="header-btn" onClick={() => closeBtn()}>
                    <CloseRoundedIcon fontSize="large" sx={{color: "#fff", margin: "auto"}}/>
                </div>
            </div>
            <div className="icon-selector-content">
                <Grid container
                      columns={{xs: 6, sm: 12, md: 12}}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="start"
                        alignItems="center"
                        className="icon-preview"
                        columns={{xs: 6, sm: 12, md: 14}}
                        xs={6} sm={4} md={4}>
                        {/*图标预览*/}
                        <Grid xs={6} sm={12} md={14}>
                            {iconSelected != null && (
                                <React.Fragment>
                                    <div className='icon-selected' style={{background: backgroundColorAttrs.style}}>
                                        <SVGIcon svgJson={iconSelected !== null ? iconSelected.path : ''}
                                                 defaultColor={iconColorAttrs.style}/>
                                    </div>
                                    <Typography sx={{marginTop: "0.2rem", textAlign: "center", margin: "auto"}}
                                                level="body-xs" noWrap={true}>
                                        {iconSelected.name}
                                    </Typography>
                                </React.Fragment>
                            )}
                        </Grid>
                        {/*背景颜色选择*/}
                        <Grid xs={6} sm={12} md={14}>
                            <AccordionGroup sx={{marginBottom: "1rem"}}>
                                <Accordion>

                                    <AccordionSummary>图标颜色</AccordionSummary>
                                    <AccordionDetails>
                                        <ColorPicker
                                            onStartChange={onIconColorChange}
                                            onChange={onIconColorChange}
                                            onEndChange={onIconColorChange}
                                            color={iconColorAttrs}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary>背景颜色</AccordionSummary>
                                    <AccordionDetails>
                                        <ColorPicker
                                            sx={{backgroundColor: "none"}}
                                            onStartChange={onBackgroundColorChange}
                                            onChange={onBackgroundColorChange}
                                            onEndChange={onBackgroundColorChange}
                                            gradient={backgroundColorAttrs}
                                            isGradient
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            </AccordionGroup>

                        </Grid>
                        {/*确认按钮*/}
                        <Grid xs={6} sm={12} md={14}>
                            <Button loadingPosition="end" onClick={saveIcon}
                                    sx={{width: "90%", marginLeft: "5%", marginBottom: "1rem"}}>
                                <AddTaskRoundedIcon/>&ensp;确认
                            </Button>
                        </Grid>

                    </Grid>
                    <Grid
                        direction="column"
                        justifyContent="start"
                        alignItems="center"
                        xs={6} sm={8} md={8}>
                        <Grid
                            container
                            className="icon-search"
                            justifyContent="center"
                            alignItems="center"
                            columns={{xs: 6, sm: 12, md: 14}}
                            spacing={2} sx={{flexGrow: 1}}>
                            <Grid xs={6} sm={12} md={14}>
                                <Input
                                    placeholder="仅支持英文搜索"
                                    onChange={(event) => searchInputChange(event.target.value)}
                                    endDecorator={
                                        <Button variant="soft" onClick={searchIcon} color="neutral"
                                                startDecorator={<SearchRoundedIcon/>}>
                                            搜索
                                        </Button>
                                    }
                                />
                            </Grid>
                            <Grid
                                className='icon-list'
                                container
                                columns={{xs: 4, sm: 12, md: 12}}
                                xs={6} sm={12} md={14}>
                                {icons.map((icon, index) => (
                                    <Grid key={icon.id} xs={1} sm={2} md={1} className="icon" onClick={() => setIconSelected(icon)}>
                                        <SVGIcon svgJson={icon.path} defaultColor="#ffffff"/>
                                    </Grid>
                                ))}
                            </Grid>


                        </Grid>
                    </Grid>

                </Grid>

            </div>
        </div>)
}