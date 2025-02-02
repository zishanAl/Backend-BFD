import { useEffect, useState } from "react";
import { fetchFAQs } from "../utils/api";
import FAQCard from "../components/FAQCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [faqs, setFaqs] = useState([]);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    fetchFAQs(language).then(setFaqs);
  }, [language]);

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Frequently Asked Questions</h1>
        
        {/* Language Selector Dropdown */}
        <select onChange={(e) => setLanguage(e.target.value)} value={language}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
        </select>

        {faqs.length > 0 ? (
          faqs.map((faq) => <FAQCard key={faq.id} faq={faq} />)
        ) : (
          <p>Loading FAQs...</p>
        )}
      </div>
      <Footer />
    </>
  );
}
