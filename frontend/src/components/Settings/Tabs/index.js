import * as React from 'react';
import Tabs from '@mui/joy/Tabs';
import Box from '@mui/joy/Box';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import "./index.css";
import {ModalClose} from "@mui/joy";
export default function TabsSettings({children}) {
    return (

        <Tabs aria-label="tabs" defaultValue={0} sx={{ bgcolor: 'transparent' }}>
            <TabList
                disableUnderline
                sx={{
                    p: 0.5,
                    gap: 0.5,
                    borderRadius: 'xl',
                    bgcolor: 'background.level1',
                    [`& .${tabClasses.root}[aria-selected="true"]`]: {
                        boxShadow: 'lg',
                        bgcolor: 'background.surface',
                    },
                }}
            >
                <Tab disableIndicator className="dialog-title">壁纸中心</Tab>
                <Tab disableIndicator className="dialog-title">关于我们</Tab>
                <ModalClose/>


            </TabList>
            <Box>
                {children}
            </Box>
        </Tabs>
    );
}
