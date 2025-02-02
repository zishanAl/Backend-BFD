import FAQ from "../models/faqModel.js";
import redisClient from "../config/redis.js";
import { translateText } from "../utils/translate.js";

/**
 * Fetch all FAQs with optional multilingual support
 */
export const getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const cacheKey = `faqs:${lang}`;

    console.log(`🔍 Checking Redis for key: ${cacheKey}`);

    // Check if cached data exists
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("✅ Serving from Redis cache...");
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log("⚡ Fetching FAQs from MongoDB...");
    const faqs = await FAQ.find();

    // Translate FAQs if needed
    const translatedFAQs = faqs.map((faq) => ({
      id: faq._id,
      question: faq.language_translations?.[lang] || faq.question,
      answer: faq.language_translations?.[`${lang}_answer`] || faq.answer,
    }));

    // Store in Redis for 1 hour
    console.log(`📝 Storing data in Redis for key: ${cacheKey}`);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(translatedFAQs));

    res.status(200).json(translatedFAQs);
  } catch (error) {
    console.error("❌ Error in getFAQs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new FAQ with auto-translation
 */
export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const languages = ["hi", "bn"]; // Supported languages
    const language_translations = {};

    // Translate into different languages
    for (const lang of languages) {
      language_translations[lang] = await translateText(question, lang);
      language_translations[`${lang}_answer`] = await translateText(answer, lang);
    }

    const newFAQ = new FAQ({ question, answer, language_translations });
    await newFAQ.save();

    console.log("🆕 New FAQ created, clearing Redis cache...");
    await clearCache();

    res.status(201).json(newFAQ);
  } catch (error) {
    console.error("❌ Error in createFAQ:", error);
    res.status(500).json({ error: "Failed to create FAQ" });
  }
};

/**
 * Update an existing FAQ
 */
export const updateFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    // Update translations if question/answer changes
    if (question || answer) {
      const languages = ["hi", "bn"];
      const language_translations = { ...faq.language_translations };

      for (const lang of languages) {
        if (question) language_translations[lang] = await translateText(question, lang);
        if (answer) language_translations[`${lang}_answer`] = await translateText(answer, lang);
      }

      req.body.language_translations = language_translations;
    }

    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });

    console.log("✏️ FAQ updated, clearing cache...");
    await clearCache();

    res.status(200).json(updatedFAQ);
  } catch (error) {
    console.error("❌ Error in updateFAQ:", error);
    res.status(500).json({ error: "Failed to update FAQ" });
  }
};

/**
 * Delete an FAQ
 */
export const deleteFAQ = async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
    if (!deletedFAQ) return res.status(404).json({ message: "FAQ not found" });

    console.log("🗑️ FAQ deleted, clearing cache...");
    await clearCache();

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteFAQ:", error);
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
};

/**
 * Helper function to clear Redis cache after create/update/delete
 */
const clearCache = async () => {
  try {
    await redisClient.del("faqs:en");
    await redisClient.del("faqs:hi");
    await redisClient.del("faqs:bn");
    console.log("🧹 Cache cleared!");
  } catch (error) {
    console.error("❌ Error clearing cache:", error);
  }
};
