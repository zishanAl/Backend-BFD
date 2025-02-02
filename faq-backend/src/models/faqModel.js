import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    language_translations: {
      type: Map,
      of: String, // Stores translated versions as key-value pairs
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;
