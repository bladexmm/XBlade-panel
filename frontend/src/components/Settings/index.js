import React from 'react';
import Modal from '@mui/joy/Modal';
import TabPanel from "@mui/joy/TabPanel";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, {tabClasses} from "@mui/joy/Tab";
import Qrcode from "./Qrcode";
import AboutUs from "./AboutUs";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import Plugin from "./Plugin";
import DnsIcon from '@mui/icons-material/Dns';
import CameraRoundedIcon from '@mui/icons-material/CameraRounded';
import BubbleChartRoundedIcon from '@mui/icons-material/BubbleChartRounded';

export default function SettingsDialog({open, onClose,defaultLayout='pane', children}) {
    return (
            <Modal open={open} onClose={onClose}>
                <React.Fragment>
                    <Tabs variant="outlined" aria-label="Pricing plan" className="tabs-add" defaultValue={0}
                        sx={{
                            width: "80%",
                            height:"80%",
                            borderRadius: '2rem',
                            boxShadow: 'sm',
                            overflow:"hidden",
                            boxSizing:"border-box"
                        }}>

                        <TabList disableUnderline tabFlex={1} sx={{
                                [`& .${tabClasses.root}`]: {
                                    fontSize: 'sm',
                                    fontWeight: 'lg',
                                    [`&[aria-selected="true"]`]: {
                                        color: 'primary.500',
                                        bgcolor: 'background.surface',
                                    },
                                    [`&.${tabClasses.focusVisible}`]: {
                                        outlineOffset: '-4px',
                                    },
                                },
                            }}>
                            <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                                <CameraRoundedIcon />壁纸
                            </Tab>
                            <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                                <DnsIcon />系统
                            </Tab>
                            <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                                <GridViewRoundedIcon />应用
                            </Tab>
                            <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                                <BubbleChartRoundedIcon />关于
                            </Tab>

                        </TabList>
                        <React.Fragment>

                            <TabPanel value={0} sx={{height:"100%",overflowY:"scroll"}}>
                                {children}
                            </TabPanel>
                            <TabPanel value={1} sx={{height:"100%",overflowY:"scroll"}}>
                                <Qrcode />
                            </TabPanel>
                            <TabPanel value={2} sx={{height:"100%",overflowY:"scroll",overflowX:"hidden"}}>
                                <Plugin defaultLayout={defaultLayout}/>
                            </TabPanel>
                            <TabPanel value={3}>
                                <AboutUs />
                            </TabPanel>
                        </React.Fragment>
                    </Tabs>
                </React.Fragment>
            </Modal>
    );
}
