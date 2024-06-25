import {useEffect} from "react";
import * as React from "react";
import request from "../../../utils/request";
import {getUserSettings} from "../../../utils/settings";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import "./index.css";
import Chart from "react-apexcharts";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

export default function CustomGrid({id}) {
    const [gridStyle, setGridStyle] = React.useState({});
    const [nodes, setNodes] = React.useState([]);
    const host = getUserSettings('settings.host')


    function isFullUrl(str) {
        // 创建正则表达式，匹配以'http://'、'https://'或'//'开头的字符串
        const pattern = /^(https?:\/\/|\/\/)/;

        // 使用test方法测试字符串是否符合正则表达式的规则
        return pattern.test(str);
    }

    function GridClick(nid, tid, method) {
        let StartNode = {
            nid: nid,
            method: method
        };
        for (let i = 0; i < nodes.length; i++) {
            if(nodes[i].type === "grid_input"){
                let inputNode = document.getElementsByClassName(nodes[i].id);
                inputNode = inputNode[0].getElementsByTagName('input')[0];
                nodes[i].value = inputNode.value;
            }

            if(nodes[i].type === "grid_selector"){
                let inputNode = document.getElementsByClassName(nodes[i].id);
                inputNode = inputNode[0].getElementsByTagName('input')[0];
                nodes[i].value = inputNode.value;
            }

        }
        request({
            url: "/api/apps/open?id=" + id + "&nodes=" + encodeURIComponent(JSON.stringify(nodes)) + "&startNode=" + JSON.stringify(StartNode),
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then((data) => {
            if(data.data != null && Object.keys(data.data).includes("style")){
                setGridStyle(data.data.style)
                setNodes(data.data.nodes)
            }
        });
    }

    const handleKeyDown = (event, nidParam, idParam, methodParam) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            GridClick(nidParam, idParam, methodParam);
        }
    };

    useEffect(() => {
        request({
            url: "/api/apps/open?id=" + id,
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: {},
        }).then((data) => {
            if (data.data != null) {
                setGridStyle(data.data.style);
                setNodes(data.data.nodes != null ? data.data.nodes : []);
            }
        });
    }, [id])


    return (
        <div className="grid-component-node" style={gridStyle}>
            {nodes.map((node, i) => {
                if (node.type === 'grid_image') {
                    node.image = isFullUrl(node.image) ? node.image : host + node.image;
                    return <img key={node.id} onClick={() => GridClick(node.nid, node.id, 'onClick')}
                                className={node.id}
                                src={node.image} style={node.style} alt={node.id}/>

                } else if (node.type === 'grid_string') {
                    return <Typography key={node.id} className={node.id} {...node.properties} sx={node.style}
                                       onClick={() => GridClick(node.nid, node.id, 'onClick')}> {node.text}</Typography>

                } else if (node.type === 'grid_input') {
                    return <Input {...node.properties}
                                  onKeyDown={(event) => handleKeyDown(event, node.nid, node.id, 'Enter')} key={node.id}
                                  className={node.id} placeholder={node.placeholder} style={node.style}/>

                } else if (node.type === 'grid_line_chart') {
                    return <Chart style={node.style} className={node.id} key={node.id}
                                  options={node.options}
                                  series={node.series}
                                  type="line"
                    />

                } else if (node.type === 'grid_button') {
                    return <Button key={node.id} sx={node.style} {...node.properties} className={node.id}
                                   onClick={() => GridClick(node.nid, node.id, 'onClick')}>{node.placeholder}</Button>
                }else if (node.type === 'grid_selector') {
                    return <Select key={node.id} sx={node.style} {...node.properties} className={node.id}>
                        {Object.entries(node.options).map(([key, value]) => (
                            <Option value={key}>{value}</Option>
                        ))}
                    </Select>
                }
            })}
        </div>
    )
}