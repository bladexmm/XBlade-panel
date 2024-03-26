import React from 'react';

// 定义一个辅助函数，用于从JSON数据构建React SVG元素
function buildSVGElement(jsonData, defaultColor, defaultWidth , defaultHeight) {
    if (!jsonData || jsonData.tag !== 'svg') {
        return <div></div>;
    }
    try {

        // 合并默认属性与传入JSON数据中的属性
        jsonData.attr.fill = defaultColor;
        if (defaultWidth !== null){
            jsonData.attr.width = jsonData.attr.width || defaultWidth;
        }
        if(defaultHeight !== null){
            jsonData.attr.height = jsonData.attr.height || defaultHeight;
        }
        const createReactElementFromJson = (json) => {
            if (!json.child) {
                return React.createElement(json.tag, json.attr);
            }

            const children = json.child.map(child => createReactElementFromJson(child));
            return React.createElement(json.tag, json.attr, ...children);
        };

        return createReactElementFromJson(jsonData);
    } catch (error) {
        return <div></div>;
    }

}

// 封装成React组件
export default function SVGIcon({ svgJson, defaultColor = 'white', defaultWidth = null, defaultHeight = null }) {
    return buildSVGElement(svgJson, defaultColor, defaultWidth, defaultHeight);
}