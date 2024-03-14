import React from 'react';
import Modal from '@mui/joy/Modal';
import TabsAdd from "../AddApplication/Tabs";
import TabPanel from "@mui/joy/TabPanel";
import FadeIn from "../FadeIn";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, {tabClasses} from "@mui/joy/Tab";
import Qrcode from "./Qrcode";
import AboutUs from "./AboutUs";

export default function SettingsDialog({open, onClose, children}) {
    return (
        <FadeIn show={true}>
            <Modal open={open} onClose={onClose}>
                <Tabs
                    variant="outlined"
                    aria-label="Pricing plan"
                    className="tabs-add"
                    defaultValue={0}
                    sx={{
                        width: "80%",
                        height:"80%",
                        borderRadius: 'lg',
                        boxShadow: 'sm',
                        overflow: 'auto',
                    }}
                >
                    <TabList
                        disableUnderline
                        tabFlex={1}
                        sx={{
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

                        }}
                    >
                        <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                            访问项目
                        </Tab>
                        <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                            壁纸中心
                        </Tab>

                        <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                            关于我们
                        </Tab>

                    </TabList>
                    <React.Fragment>
                        <TabPanel value={0}>
                            <Qrcode />
                        </TabPanel>
                        <TabPanel value={1}>
                            {children}
                        </TabPanel>
                        <TabPanel value={2}>
                            <AboutUs />
                        </TabPanel>
                    </React.Fragment>
                </Tabs>


            </Modal>
        </FadeIn>
    );
}
