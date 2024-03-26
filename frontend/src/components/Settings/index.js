import React from 'react';
import Modal from '@mui/joy/Modal';
import TabPanel from "@mui/joy/TabPanel";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, {tabClasses} from "@mui/joy/Tab";
import Qrcode from "./Qrcode";
import AboutUs from "./AboutUs";
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import FilterVintageRoundedIcon from '@mui/icons-material/FilterVintageRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import Plugin from "./Plugin";
import IconButton from '@mui/joy/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


export default function SettingsDialog({open, onClose, children}) {
    return (
            <Modal open={open} keepMounted onClose={onClose}>
                <React.Fragment>
                    <IconButton  variant="soft" onClick={onClose} color="primary" sx={{
                        position:"fixed",
                        top:"9%",
                        right:"9%",
                        width:"1rem",
                        height:"1rem",
                        borderRadius:"1rem",
                        zIndex:"9999"
                    }}>
                        <CloseRoundedIcon />
                    </IconButton>
                    <Tabs
                        variant="outlined"
                        aria-label="Pricing plan"
                        className="tabs-add"
                        defaultValue={0}
                        sx={{
                            width: "80%",
                            height:"80%",
                            borderRadius: '2rem',
                            boxShadow: 'sm',
                            overflow:"hidden",
                            boxSizing:"border-box"
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
                                <FilterVintageRoundedIcon />壁纸
                            </Tab>
                            <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                                <QrCodeRoundedIcon />访问
                            </Tab>
                            <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                                <GridViewRoundedIcon />组件
                            </Tab>
                            <Tab disableIndicator variant="soft" sx={{flexGrow: 1}}>
                                <ShareRoundedIcon />关于
                            </Tab>

                        </TabList>
                        <React.Fragment>

                            <TabPanel value={0} sx={{height:"100%",overflowY:"scroll"}}>
                                {children}
                            </TabPanel>
                            <TabPanel value={1}>
                                <Qrcode />
                            </TabPanel>
                            <TabPanel value={2}>
                                <Plugin />
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
