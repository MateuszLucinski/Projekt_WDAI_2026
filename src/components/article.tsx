import { useParams } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  content: string;
}

function Article() {
  const { id } = useParams<{ id: string }>();

  const articles: Article[] = JSON.parse(
    localStorage.getItem("articles") || "[]"
  );

  const article = articles.find(p => p.id === Number(id));

  if (!article) {
    return <h2>Nie znaleziono artykułu</h2>;
  }

  return (
    <div className="article">
      <h1>{article.title}</h1>
      <p><strong>ID:</strong> {article.id}</p>
      <p>{article.content}</p>
    </div>
  );
}

export default Article;
