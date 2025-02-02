export default function FAQCard({ faq }) {
    return (
      <div className="container">
        <h2>{faq.question}</h2>
        <p>{faq.answer}</p>
      </div>
    );
  }