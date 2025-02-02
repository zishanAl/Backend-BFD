import translate from "google-translate-api-x";

export const translateText = async (text, targetLanguage) => {
  try {
    const res = await translate(text, { to: targetLanguage });
    return res.text;
  } catch (error) {
    console.error(`❌ Translation Error: ${error.message}`);
    return text; // Return original text if translation fails
  }
};
