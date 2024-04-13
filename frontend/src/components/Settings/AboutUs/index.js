import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import {ListItemContent} from "@mui/joy";

export default function AboutUs() {
    return (

        <Box>
            <ListItemContent>
                <Typography level="title-lg">关于项目：XBlade-Panel</Typography>
                <Typography level="body-sm">
                    项目地址： <Link target="_blank" href="https://github.com/bladexmm/XBlade-panel">XBlade-panel</Link>
                </Typography>
                <Typography level="body-sm">
                    壁纸来源：<Link target="_blank" href="https://www.pexels.com/zh-cn/">pexels免费素材网</Link>
                </Typography>
            </ListItemContent>

        </Box>
    );
}
