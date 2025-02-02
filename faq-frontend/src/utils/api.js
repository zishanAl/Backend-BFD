import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/faqs"; // Backend URL

export const fetchFAQs = async (lang = "en") => {
  try {
    const response = await axios.get(`${API_BASE_URL}?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching FAQs:", error);
    return [];
  }
};

export const createFAQ = async (faqData) => {
  try {
    const response = await axios.post(API_BASE_URL, faqData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating FAQ:", error);
    throw error;
  }
};
