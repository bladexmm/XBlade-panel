import './index.css'; // 引入自定义的 CSS 文件

const FadeIn = ({show,timeout="0.2s", children}) => {

    return (
        <div className={`fade-in ${show ? 'fade-in-show' : ''}`} style={{
            transitionDuration:timeout
        }}>
            {children}
        </div>
    );
};

export default FadeIn;
