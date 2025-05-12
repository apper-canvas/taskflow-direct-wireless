import { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmProvider } from './context/ConfirmContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import getIcon from './utils/iconUtils';

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ConfirmProvider>
      <Router>
        <div className="flex flex-col min-h-screen transition-all duration-200">
          <header className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="text-primary dark:text-primary-light">
                  {React.createElement(getIcon('Kanban'), { size: 24 })}
                </div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  TaskFlow
                </h1>
              </div> 
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode 
                  ? React.createElement(getIcon('Sun'), { size: 20 }) 
                  : React.createElement(getIcon('Moon'), { size: 20 })}
              </button>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-6 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <footer className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm border-t border-surface-200 dark:border-surface-700 py-4 mt-8">
            <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400 text-sm">
              TaskFlow &copy; {new Date().getFullYear()} - Visual Task Management System
            </div>
          </footer>
        </div>
        
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          toastClassName="rounded-xl shadow-soft"
        />
      </Router>
    </ConfirmProvider>
  );
}

export default App;