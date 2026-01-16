import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/home';
import Blog from './components/blog';
import Add from './components/add';
import Article from './components/article';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/blog">Blog</Link> 
      </nav>

      {/* Routes */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} >
            <Route path="article/:id" element={< Article/>} />
            <Route path="dodaj" element={<Add />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App
