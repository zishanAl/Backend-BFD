import { useState } from "react";
import { createFAQ } from "../utils/api";

export default function Admin() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createFAQ({ question, answer });
    alert("FAQ Created Successfully!");
    setQuestion("");
    setAnswer("");
  };

  return (
    <div className="container">
      <h1>Create New FAQ</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <textarea
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
