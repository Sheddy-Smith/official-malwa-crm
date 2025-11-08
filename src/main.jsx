import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './hooks/ThemeProvider.jsx'
import { initDB } from './lib/db'
import { seedDefaultUser } from './lib/auth'
import './utils/dbDebug'

initDB().then(() => {
  console.log('IndexedDB initialized successfully');
  return seedDefaultUser();
}).then(() => {
  console.log('Super Admin initialization complete');
  console.log('To debug database, use: window.debugDB()');
  console.log('To clear all data, use: window.clearDB()');
}).catch(error => {
  console.error('Error initializing database:', error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
