import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// 🔴 BURAYA KENDİ GOOGLE CLIENT ID'Nİ YAZMALISIN
// Almak için: https://console.cloud.google.com/ -> APIs & Services -> Credentials
const GOOGLE_CLIENT_ID = "636958642580-ceks0tjhckvsdbknoi4j27rn8901i93s.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        {/* 👇 Uygulamayı Sarmala */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)