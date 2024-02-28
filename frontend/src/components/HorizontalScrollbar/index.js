import React, { useRef, useState, useEffect } from 'react';
import './index.css'; // 你可以定义自己的样式文件

const HorizontalScrollbar = ({ children }) => {
    const containerRef = useRef(null);
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        let timeoutId;

        const handleWheel = (event) => {
            event.preventDefault();
            container.scrollTo({
                left: container.scrollLeft + event.deltaY,
                behavior: 'smooth',
            });
            setScrolling(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setScrolling(false);
            }, 300); // 设置延迟时间
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className={`horizontal-scrollbar ${scrolling ? 'scrolling' : ''}`} ref={containerRef}>
            <div className="horizontal-scrollbar-content">
                {children}
            </div>
        </div>
    );
};

export default HorizontalScrollbar;
