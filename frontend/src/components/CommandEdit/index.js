import {config,useSpring} from "@react-spring/web";
import * as React from "react";
import './index.css';


import 'reactflow/dist/style.css';
import {useEffect} from "react";
import {getUserSettings} from "../../utils/settings";

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
            onRest: () => {setCommandEditOpen(false);}
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
            window.addEventListener("message", window.receiveMessageFromIndex, false);
        };
    }, []);
    return (
        <div className="commands" style={{...fullscreenStyle}}>

            <div className="pane-content" style={{overflowY:'hidden'}}>
                <iframe id="embeddedIframe"
                        style={{width: '100%', height: '100%',border:'none'}}
                        src={host+'/assets/litegraph/index.html'}
                        title="Embedded Webpage"/>
            </div>
        </div>

    )

}