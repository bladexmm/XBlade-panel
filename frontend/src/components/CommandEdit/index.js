import {config,animated, useSpring} from "@react-spring/web";
import * as React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ControlCameraRoundedIcon from "@mui/icons-material/ControlCameraRounded";
import './index.css';


import 'reactflow/dist/style.css';
import {useEffect} from "react";
import {getUserSettings} from "../../utils/settings";

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];


export default function CommandEdit({
                                        commandDefault,
                                        setCommandDefault,
                                        setCommandEditOpen
                                    }){
    const [fullscreen, setFullscreen] = React.useState(true);
    const [fullscreenStyle, setFullscreenStyle] = useSpring(() => ({
        config: config.stiff,
        from: {
            width: "10%",
            height: "10%",
            top: '50%',
            left: '50%',
        },
        to: {
            top: "50%", // 只保留字符串值
            left: "50%", // 只保留字符串值
            width: fullscreen ? "100%" : "90%", // 只保留字符串值
            height: fullscreen ? "100%" : "90%" // 只保留字符串值
        }
    }));
    const host = getUserSettings('settings.host');

    const close_pane = () => {
        setFullscreenStyle({
            config: config.stiff,
            from: {
                width: fullscreen ? "100%" : "90%",
                height: fullscreen ? "100%" : "90%",
            },
            to: {
                width: "0%",
                height: "0%",
                top: '110%',
            },
            onRest: () => {
                setCommandEditOpen(false); // 在动画完成后执行关闭操作
            }
        });
    }
    const iframe_call_func = (res) => {
        if(res.method === 'close'){
            close_pane();
        }else if(res.method === 'save'){
            setCommandDefault(res.data);
            close_pane();
        }
    }

    useEffect(() => {
        const iframe = document.getElementById('embeddedIframe');
        iframe.onload = () => {
            iframe.contentWindow.postMessage(JSON.stringify(commandDefault), '*'); //window.postMessage
            window.receiveMessageFromIndex = function ( event ) {
                if(event!==undefined){
                    if(event.data.method){
                        iframe_call_func(event.data)
                    }
                }
            }
            //监听message事件
            window.addEventListener("message", window.receiveMessageFromIndex, false);
        };
    }, []);
    return (
        <div className="commands" style={{...fullscreenStyle,}}>
            {/*<div className="cmd-header">*/}

            {/*    <div className="header-btn" onClick={close_pane}>*/}
            {/*        <CloseRoundedIcon fontSize="large" sx={{color: "#fff", margin: "auto"}}/>*/}
            {/*    </div>*/}
            {/*    <div className="header-btn" onClick={() => {*/}
            {/*        setFullscreen((prevFullscreen) => {*/}
            {/*            const newFullscreen = !prevFullscreen;*/}
            {/*            setFullscreenStyle({*/}
            {/*                width: newFullscreen ? "100%" : "90%",*/}
            {/*                height: newFullscreen ? "100%" : "90%",*/}
            {/*                top: newFullscreen ? "50%" : "53%",*/}
            {/*            });*/}
            {/*            return newFullscreen;*/}
            {/*        });*/}
            {/*    }}>*/}
            {/*        <ControlCameraRoundedIcon fontSize="large" sx={{color: "#fff", margin: "auto"}}/>*/}
            {/*    </div>*/}

            {/*</div>*/}

            <div className="pane-content" style={{overflowY:'hidden'}}>
                <iframe id="embeddedIframe"
                        style={{width: '100%', height: '100%',border:'none'}}
                        src={host+'/assets/litegraph/index.html'}
                        title="Embedded Webpage"/>
            </div>
        </div>

    )

}