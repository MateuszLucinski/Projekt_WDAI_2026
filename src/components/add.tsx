import { useEffect, useState } from "react";

interface Article {
  id: number;
  title: string;
  content: string;
}

function Add() {
  const [article, setArticle] = useState<Article[]>(() => {
    const data = localStorage.getItem("articles");
    return data ? JSON.parse(data) : [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPost: Article = {
      id: Date.now(),
      title,
      content,
    };

    setArticle(prev => [...prev, newPost]);

    setTitle("");
    setContent("");
  };


  useEffect(() => {
    localStorage.setItem("articles", JSON.stringify(article));
  }, [article]);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Tytuł
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>

      <br />

      <label>
        Zawartość
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </label>

      <br />

      <button type="submit">Dodaj</button>
    </form>
  );
}

export default Add;
