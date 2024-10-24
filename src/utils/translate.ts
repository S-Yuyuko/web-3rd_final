import axios from 'axios';

/**
 * Translates a given text using the LibreTranslate API.
 * @param text The text to translate.
 * @param targetLanguage The target language code (e.g., 'zh' for Chinese).
 * @param sourceLanguage The source language code (e.g., 'en' for English). Defaults to 'en'.
 * @returns The translated text as a string.
 */
export async function translateText(
  text: string,
  targetLanguage: string = 'zh',
  sourceLanguage: string = 'en'
): Promise<string> {
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format: 'text',
    });

    return response.data.translatedText;
  } catch (error) {
    console.error('Translation Error:', error);
    return text; // Return the original text as a fallback in case of an error
  }
}

/**
 * Recursively translates all keys in a JSON object.
 * @param jsonObject The JSON object to translate.
 * @param targetLanguage The target language code.
 * @returns A translated JSON object.
 */
export async function translateJsonObject(
  jsonObject: { [key: string]: any },
  targetLanguage: string
): Promise<{ [key: string]: any }> {
  const translatedJson: { [key: string]: any } = {};

  for (const key in jsonObject) {
    if (typeof jsonObject[key] === 'object') {
      translatedJson[key] = await translateJsonObject(jsonObject[key], targetLanguage);
    } else {
      translatedJson[key] = await translateText(jsonObject[key], targetLanguage);
    }
  }

  return translatedJson;
}
