import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import QRCode from "qrcode.react";
import Link from "@mui/joy/Link";

export default function Qrcode() {
    const currentURL = window.location.href;
    return (
        <Box style={{textAlign:"center",paddingTop:"20%"}}>
            <Typography level="title-lg">通过二维码访问</Typography>
            <br/>
            <QRCode value={currentURL}/>
        </Box>
    );
}
