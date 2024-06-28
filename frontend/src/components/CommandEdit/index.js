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
    const host = getUserSettings('settings.host');

    const close_pane = () => {
        setCommandEditOpen(false);
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
        <div className="commands">

            <div className="pane-content" style={{overflowY:'hidden'}}>
                <iframe id="embeddedIframe"
                        style={{width: '100%', height: '100%',border:'none'}}
                        // src={host+'/assets/litegraph/index.html'}
                        src={'./assets/litegraph/index.html'}

                        title="Embedded Webpage"/>
            </div>
        </div>

    )

}