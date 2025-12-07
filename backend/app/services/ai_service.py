import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY not found in environment variables.")
            self.model = None
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-flash-latest')

    def analyze_article(self, title, summary):
        if not self.model:
            return None

        prompt = f"""
        Analyze the following news article and provide a JSON response with:
        1. "category": Choose ONE from [Technology, Finance, Textile, Agriculture, Energy, Politics, Global Economy, Other].
        2. "relevance_score": A number 1-10 indicating relevance to Pakistan's local industry/business (10 = highly relevant, 1 = irrelevant/global noise).
        3. "tags": A list of 3-5 keywords.

        Title: {title}
        Summary: {summary}
        
        Response format: JSON only.
        """

        try:
            response = self.model.generate_content(prompt)
            # Clean up response to ensure it's valid JSON
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception as e:
            print(f"Error analyzing article: {e}")
            return None

ai_service = AIService()
