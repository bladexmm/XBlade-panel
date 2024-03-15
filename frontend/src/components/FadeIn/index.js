import './index.css';
import {useSpring,useTransition , animated} from "@react-spring/web";
import {useEffect} from "react"; // 引入自定义的 CSS 文件

const FadeIn = ({show, children}) => {
    const transitions = useTransition(children,{
        from: {opacity: 0,scale:0 },
        enter: { opacity: 1,scale:1 },
        leave: { opacity: 0,scale:0 },
    })

    return transitions((style, children) => (
        <div style={style}>{children}</div>
    ));
};

export default FadeIn;
