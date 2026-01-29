import pytesseract
from PIL import Image
from app.llm import LLM

class ScreeningTool():
    
    def __init__(self, session):
        self.session = session

    def scan_image(self, image_path: str = "") -> str:
        """
        Perform OCR (Optical Character Recognition) on the given image using Tesseract.

        Args:
            image_path (str): Path to the image file.

        Returns:
            str: Extracted text from the image.
        """

        if image_path == "":
            image_path = f"images/{self.session}.jpg"

        try:
            # Open the image file
            image = Image.open(image_path)

            # Perform OCR using Tesseract
            extracted_text = pytesseract.image_to_string(image)

            return extracted_text
        except Exception as e:
            return f"An error occurred during OCR: {str(e)}"
        
    def analyze_image(self, session: str) -> tuple[int, str]:
        system_prompt = """
You are an expert reconciler.
You will be provided with text extracted from an image using pytesseract OCR.
Your task is to verify the authenticity of the claims made by the user in their conversation with you based on the extracted text.
Please return a score between 0 and 10 indicating the authenticity of the claims, where 0 means completely false and 100 means completely true.
Note that the extracted text may contain OCR errors, so use your judgment to interpret the text accurately.

Your response should be in the following JSON format:
```json
{{
"score": <authenticity_score_between_0_and_10>
}}
```

Important Notes:
- You only need to verify Aadhar Number, Name, and Date of Birth claims
- Ensure the output is valid JSON format as shown above.
- Do not include any explanations or additional text.
- Focus solely on providing the authenticity score based on the extracted text.
- Do not add any fields other than those specified.
- You should use context section to see claimed user details which has neceassary history.
"""

        llm = LLM(model_name="gpt-4o", session=session)

        ocr_text = self.scan_image()
        user_prompt = f"""
Here is the extracted text from the image:
{ocr_text}
"""
        response = llm.chat(
            system_prompt=system_prompt,
            user_prompt=user_prompt
        )

        # Extract the score from the response
        try:
            response_json = llm.json_extractor(response)
            score = int(response_json.get("score", 0))
            if score >= 6:
                return score, "The document appears to be authentic.\nYou are now onboarded on Magic Bus!!!"
            elif score >= 3:
                return score, "The document is partially authentic. We will engage a Magic Bus member with you."
            else:
                return score, "The document appears to be inauthentic."
        except Exception as e:
            print(f"Error parsing LLM response: {str(e)}")
            return 0, "An error occurred while analyzing the document. Please try again later."



# Example usage:
# screening_tool = ScreeningTool(session="Simarpreet Singh")
# text = screening_tool.scan_image()
# print(text)