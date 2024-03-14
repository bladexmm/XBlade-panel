import * as React from 'react';
import Modal from '@mui/joy/Modal';
import "./index.css";
import {useState} from "react";
import FadeIn from "../FadeIn";
import TabsAdd from "./Tabs";
import TabPanel from "@mui/joy/TabPanel";
import AddApps from "./AddApps";
import AddCommand from "./AddCommand";

export default function AddApplication({
                                           open,
                                           onClose,
                                           app,
                                           app_id = null,
                                           apps = [],
                                           appName = '',
                                           appPath = '',
                                           appIcons = []
                                       }) {
    const [checked, setChecked] = React.useState(false);
    const [disableTabs, setDisableTabs] = React.useState([false,false]);
    const [defaultTab, setDefaultTab] = React.useState(0);
    useState(() => {
        setChecked(true)
        if (app_id !== null){
            setDefaultTab(app['type'] === 'command' ? 1 : 0);
            setDisableTabs(app['type'] === 'command' ? [true,false] : [false,true])
        }
    }, [open, appName, appPath, appIcons])


    return (
        <FadeIn show={checked}>
            <Modal open={open} onClose={onClose}>
                <React.Fragment>

                    <TabsAdd value={defaultTab} disableTabs={disableTabs}>
                        <React.Fragment>
                            <TabPanel value={0}>
                                <AddApps open={open} app_id={app_id} apps={apps} onClose={onClose} appName={appName} appPath={appPath}
                                         appIcons={appIcons}/>
                            </TabPanel>
                            <TabPanel value={1}>
                                <AddCommand open={open} app={app} app_id={app_id} apps={apps} onClose={onClose} appName={appName}
                                            appPath={appPath} appIcons={appIcons}/>
                            </TabPanel>
                        </React.Fragment>
                    </TabsAdd>
                </React.Fragment>
            </Modal>
        </FadeIn>
    );
}