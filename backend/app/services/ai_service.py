import os
import google.generativeai as genai
from ..config import settings

class AiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            print("WARNING: GEMINI_API_KEY is not set. AI features will return mock data.")
            self.model = None
        else:
            try:
                print("DEBUG: Listing available Gemini models...")
                for m in genai.list_models():
                    if 'generateContent' in m.supported_generation_methods:
                        print(f"DEBUG: Found model: {m.name}")
            except Exception as e:
                print(f"DEBUG: Could not list models: {e}")

            self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def generate_market_pulse(self, market_data: dict, news_headlines: list[str]) -> str:
        """
        Generates a short, punchy 3-sentence summary of the market status.
        """
        if not self.model:
            return "AI Market Pulse is unavailable (API Key missing)."

        prompt = f"""
        You are a financial analyst for the Pakistan Stock Exchange (PSX).
        Write a concise, energetic 3-sentence "Market Pulse" summary based on this data:
        
        **Market Data:**
        - Top Gainers: {', '.join([s.get('ticker', 'Unknown') for s in market_data.get('top_gainers', [])[:3]])}
        - Sector Performance: {str(market_data.get('sector_performance', {}))}
        
        **Recent News:**
        {chr(10).join(['- ' + h for h in news_headlines[:5]])}
        
        **Tone:** Professional, insightful, direct.
        **Output:** strictly 3 sentences. No formatting, no intro.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error generating market pulse: {e}")
            return "Market is active. Check specific sectors for detailed trends."

    async def generate_company_swot(self, company_name: str, industry: str, description: str) -> dict:
        """
        Generates a SWOT analysis for a company.
        Returns a dict with keys: strengths, weaknesses, opportunities, threats (lists of strings).
        """
        if not self.model:
             return {
                "strengths": ["Strong market presence (Mock)", "Established brand"],
                "weaknesses": ["Regulatory challenges (Mock)"],
                "opportunities": ["Digital expansion (Mock)"],
                "threats": ["Economic volatility (Mock)"]
            }

        prompt = f"""
        Perform a SWOT analysis for this Pakistani company:
        **Company:** {company_name}
        **Industry:** {industry}
        **Context:** {description}
        
        Return the result as valid JSON with exactly these keys: "strengths", "weaknesses", "opportunities", "threats". 
        Each key must contain a list of 2-3 short, bullet-point strings.
        Do not use Markdown formatting in the JSON output. Just pure JSON.
        """
        
        try:
            response = self.model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            import json
            return json.loads(response.text)
        except Exception as e:
            print(f"Error generating SWOT: {e}")
            return {
                "strengths": ["Data unavailable for AI analysis"],
                "weaknesses": [],
                "opportunities": [],
                "threats": []
            }

ai_service = AiService()
