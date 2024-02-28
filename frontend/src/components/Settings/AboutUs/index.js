import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

export default function AboutUs() {
    return (

        <Box>
            <Typography level="title-lg">关于项目：XBlade-Panel</Typography>
            <br/>
            <Typography level="body-sm">
                项目地址： <Link target="_blank" href="https://github.com/bladexmm/XBlade-panel">XBlade-panel</Link>
                <br/>
                壁纸来源：<Link target="_blank" href="https://www.pexels.com/zh-cn/">pexels免费素材网</Link>
            </Typography>
            <br/>
            <Typography level="title-lg">自定义壁纸</Typography>
            <br/>
            <Typography level="body-sm">
                项目所有壁纸均是自动扫描的本地路径：项目路径\react_app\assets\video
                <br/>
                上传视频至壁纸路径中的文件夹中就会自动识别。
            </Typography>
        </Box>
    );
}
