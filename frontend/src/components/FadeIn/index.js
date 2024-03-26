import './index.css';
import {useTransition } from "@react-spring/web";

const FadeIn = ({show, children}) => {
    const transitions = useTransition(children,{
        from: {opacity: 0,scale:0 },
        enter: { opacity: 1,scale:1 },
        leave: { opacity: 0,scale:0 },
    })
    if(show === true){
        return transitions((style, children) => (
            <div style={style}>{children}</div>
        ));
    }else {
        return '';
    }

};

export default FadeIn;
