import * as React from 'react';
import Modal from '@mui/joy/Modal';
import "./index.css";
import {useState} from "react";
import TabsAdd from "./Tabs";
import TabPanel from "@mui/joy/TabPanel";
import AddApps from "./AddApps";
import AddCommand from "./AddCommand";
import IconSelector from "../IconSelector";
import CommandEdit from "../CommandEdit";
import AddMonitor from "./AddMonitor";
import ScreenSelector from "./AddMonitor/ScreenSelector";
import {getUserSettings} from "../../utils/settings";


export default function AddApplication({
                                           open,
                                           onClose,
                                           app,
                                           app_id = null,
                                           apps = [],
                                           appName = '',
                                           appPath = '',
                                           appIcons = [],
                                       }) {
    const [checked, setChecked] = React.useState(false);
    const [disableTabs, setDisableTabs] = React.useState([false, false]);
    const [defaultTab, setDefaultTab] = React.useState(0);

    const [iconSelectorOpen, setIconSelectorOpen] = React.useState(false);
    const [iconDefault, setIconDefault] = React.useState(null);

    const [commandEditOpen, setCommandEditOpen] = useState(false);
    const [commandDefault, setCommandDefault] = useState(null);
    const [monitorSelectOpen,setMonitorSelectorOpen] = useState(false);
    const [regionDefault,setRegionDefault] = useState(null);
    const tabsName = {
        'link': {
            'id': 0,
            'active': [false, true, true]
        },
        'file': {
            'id': 0,
            'active':[false, true, true]
        },
        'command': {
            'id': 1,
            'active': [true, false, true]
        },
        'monitor': {
            'id': 2,
            'active': [true, true, false]
        },
    }


    useState(() => {
        setChecked(true)
        if (app_id !== null) {
            setDefaultTab(tabsName[app['type']]['id']);
            setDisableTabs(tabsName[app['type']]['active'])
            if (commandDefault === null && app['type'] === 'command') {
                setCommandDefault(JSON.parse(appPath));
            }
        }
        if (appIcons[0] !== null && appIcons[0] !== undefined && appIcons[0].startsWith("{")) {
            setIconDefault(JSON.parse(appIcons[0]))
        }
    }, [open, appName, appPath, appIcons])


    return (
        <Modal open={open} onClose={onClose}>
            <React.Fragment>
                <TabsAdd value={defaultTab} disableTabs={disableTabs}>
                    <React.Fragment>
                        <TabPanel value={0}>
                            <AddApps open={open}
                                     iconDefault={iconDefault}
                                     setIconDefault={setIconDefault}
                                     app_id={app_id}
                                     apps={apps}
                                     app={app}
                                     onClose={onClose}
                                     appName={appName}
                                     appPath={appPath}
                                     appIcons={appIcons}
                                     setIconSelectorOpen={setIconSelectorOpen}/>
                        </TabPanel>
                        <TabPanel value={1}>
                            <AddCommand
                                open={open}
                                app={app}
                                app_id={app_id}
                                apps={apps}
                                onClose={onClose}
                                appName={appName}
                                appPath={appPath}
                                appIcons={appIcons}
                                setIconSelectorOpen={setIconSelectorOpen}
                                iconDefault={iconDefault}
                                commandDefault={commandDefault}
                                setCommandEditOpen={setCommandEditOpen}
                                setIconDefault={setIconDefault}/>
                        </TabPanel>
                        <TabPanel value={2}>
                            <AddMonitor
                                app_id={app_id}
                                apps={apps}
                                app={app}
                                onClose={onClose}
                                appName={appName}
                                appPath={appPath}
                                regionDefault={regionDefault}
                                setRegionDefault={setRegionDefault}
                                setMonitorSelectorOpen={setMonitorSelectorOpen}
                            />
                        </TabPanel>
                    </React.Fragment>
                </TabsAdd>

                <Modal open={iconSelectorOpen} onClose={() => setIconSelectorOpen(false)}>
                    <IconSelector iconDefault={iconDefault} setIconDefault={setIconDefault}
                                  closeBtn={() => setIconSelectorOpen(false)}/>
                </Modal>
                <Modal open={commandEditOpen} onClose={() => setCommandEditOpen(false)}>
                    <CommandEdit
                        commandDefault={commandDefault}
                        setCommandDefault={setCommandDefault}
                        setCommandEditOpen={setCommandEditOpen}/>
                </Modal>

                <Modal open={monitorSelectOpen} onClose={() => setMonitorSelectorOpen(false)}>
                    <ScreenSelector
                        regionDefault={regionDefault}
                        setRegionDefault={setRegionDefault}
                        setMonitorSelectorOpen={setMonitorSelectorOpen}
                    />
                </Modal>
            </React.Fragment>
        </Modal>
    );
}