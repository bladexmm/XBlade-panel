import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/index/App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWork/serviceWorkerRegistration';
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
serviceWorkerRegistration.register();
reportWebVitals();
