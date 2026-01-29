from deep_translator import GoogleTranslator

class Translate():
    def __init__(self):
        pass

    def translate_text(self, text: str, target_language: str = 'en') -> str:
        """
        Translates the given text to the target language using Google Translate.

        Args:
            text (str): The text to be translated.
            target_language (str): The target language code (e.g., 'en' for English, 'es' for Spanish).

        Returns:
            str: Translated text.
        """
        try:
            translated_text = GoogleTranslator(source='auto',target=target_language).translate(text)
            return translated_text
        except Exception as e:
            return f"An error occurred during translation: {str(e)}"
        

if __name__ == "__main__":
    sample_text = "Hola, ¿cómo estás?"
    translated = translate_text(sample_text, target_language='en')
    print(f"Original: {sample_text}")
    print(f"Translated: {translated}")

    langs = GoogleTranslator().get_supported_languages(as_dict=True)
    print("Supported Languages:")
    print(langs)
    with open("supported_languages.json", "w") as f:
        import json
        json.dump(langs, f, indent=4)