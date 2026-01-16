import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

interface Article {
  id: number;
  title: string;
  content: string;
}

function Blog() {
  const [articles, setArticles] = useState<Article[]>(() => {
    const data = localStorage.getItem("articles");
    return data ? JSON.parse(data) : [];
  });

return (
    <div className="blog">
      <h1>Blog</h1>

      <div className="blog-layout">
        {/* LEFT PANEL */}
        <aside className="blog-sidebar">
          <h2>➕ Zarządzanie</h2>
          <Link className="add-link" to="/blog/dodaj">
            Dodaj nowy artykuł
          </Link>
        </aside>

        {/* RIGHT PANEL */}
        <section className="blog-content">
          <h2>📄 Artykuły</h2>

          {articles.length === 0 && (
            <p>Brak artykułów</p>
          )}

          <ul className="article-list">
            {articles.map(article => (
              <li key={article.id}>
                <Link to={`/blog/article/${article.id}`}>
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>

          <Outlet context={{ articles, setArticles }} />
        </section>
      </div>
    </div>
  );
}

export default Blog;
