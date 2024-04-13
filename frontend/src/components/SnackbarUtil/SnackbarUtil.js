import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Button from '@mui/joy/Button';

// 创建上下文
const SnackbarContext = createContext();

// 创建Snackbar Provider组件
const SnackbarProvider = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('success');

    const handleClose = () => {
        setSnackbarOpen(false);
    };

    const showMessage = (msg, code) => {
        setSnackbarMessage(msg);
        setSnackbarOpen(true);
        setSnackbarColor(code === 1 ? 'success' : 'danger');
    };

    return (
        <SnackbarContext.Provider value={{ showMessage }}>
            {children}
            <Snackbar
                variant="soft"
                color={snackbarColor}
                open={snackbarOpen}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                endDecorator={
                    <Button
                        onClick={handleClose}
                        size="sm"
                        variant="soft"
                        color={snackbarColor}
                    >
                        关闭
                    </Button>
                }
            >
                {snackbarMessage}
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

// 创建一个Hook以方便在任何地方使用Snackbar功能
const useSnackbar = () => useContext(SnackbarContext);

export { SnackbarProvider, useSnackbar };