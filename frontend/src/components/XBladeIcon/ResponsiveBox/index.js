import React, { useRef, useEffect } from 'react';

export default function ResponsiveBox({ children }) {
    const ref = useRef(null);

    useEffect(() => {
        function handleResize() {
            if (ref.current) {
                const containerWidth = ref.current.offsetWidth;
                ref.current.style.height = `${containerWidth + 1}rem`;
            }
        }

        const resizeObserver = new ResizeObserver(handleResize);
        if (ref.current) {
            resizeObserver.observe(ref.current);
        }

        // 清理函数：当组件卸载时，取消观察
        return () => {
            resizeObserver.unobserve(ref.current);
        };
    }, []);

    return (
        <div ref={ref} style={{width: "100%"}}>
            {children}
        </div>
    );
}