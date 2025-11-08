import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './hooks/ThemeProvider.jsx'
import { initDB } from './lib/db'
import { seedDefaultUser } from './lib/auth'

initDB().then(() => {
  console.log('IndexedDB initialized successfully');
  return seedDefaultUser();
}).then(() => {
  console.log('Default user seeded');
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
