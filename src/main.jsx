import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import './i18n.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600" /></div>}>
            <ThemeProvider>
                <CurrencyProvider>
                    <App />
                </CurrencyProvider>
            </ThemeProvider>
        </Suspense>
    </React.StrictMode>,
)
