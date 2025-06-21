// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleDetail from './ArticleDetail';
import AdminPanel from './AdminPanel';
import Home from './components/Home';
import ArchivePage from './components/ArchivePage';

function App() {
  const backendUrl = "https://finshots-clone-project.onrender.com";

  return (
    <Router>
      <div className="App bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Finshots Clone</h1>
            <nav>
              <Link to="/admin" className="text-blue-600 hover:underline">Admin Panel</Link>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={<Home backendUrl={backendUrl} />}
            />
            <Route
              path="/archive"
              element={<ArchivePage backendUrl={backendUrl} />}
            />
            <Route
              path="/articles/:id"
              element={<ArticleDetail backendUrl={backendUrl} />}
            />
            <Route path="/admin" element={<AdminPanel backendUrl={backendUrl} />} />
            <Route path="*" element={<div className="text-center py-10"><p>Page not found</p></div>} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
