import * as React from 'react';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TerminalIcon from '@mui/icons-material/Terminal';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import AppsIcon from '@mui/icons-material/Apps';
import './index.css';

export default function TabsAdd({value=0,disableTabs=[false,false],children}) {
    return (
        <Tabs
            variant="outlined"
            aria-label="Pricing plan"
            className="tabs-add"
            sx={{
                width: 343,
                borderRadius: 'lg',
                boxShadow: 'sm',
                overflow: 'auto',
            }}
            defaultValue={value}
        >
            <TabList
                disableUnderline
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
                <Tab disableIndicator value={0}  disabled={disableTabs[0]} variant="soft" sx={{ flexGrow: 1 }}>
                    <ListItemDecorator>
                        <AppsIcon />
                    </ListItemDecorator>
                    新增应用/网址
                </Tab>
                <Tab disableIndicator value={1} disabled={disableTabs[1]} variant="soft" sx={{ flexGrow: 1 }}>
                    <ListItemDecorator>
                        <TerminalIcon />
                    </ListItemDecorator>
                    新增指令
                </Tab>

            </TabList>
            {children}
        </Tabs>
    );
}