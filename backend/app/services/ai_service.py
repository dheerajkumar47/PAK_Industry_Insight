import os
import google.generativeai as genai
from ..config import settings

class AiService:
    """
    Service responsible for all AI interactions in the application.
    
    Uses:
    - **Google Gemini API**: A powerful multimodal AI model by Google.
    
    Purpose:
    - Generates 'Market Pulse': A daily 3-sentence summary of the entire market.
    - Generates 'SWOT Analysis': A strategic breakdown (Strengths, Weaknesses, Opportunities, Threats) for individual companies.
    
    Configuration:
    - Requires `GEMINI_API_KEY` in environment variables.
    - confirm_model_availability(): Checks which Gemini models are accessible (Pro vs Flash) to avoid 404s.
    """
    def __init__(self):
        """
        Initializes the AI Service.
        - Loads API Key from settings.
        - Sets up the GenerativeModel.
        - Prints debug info about available models to startup logs (useful for deployment debugging).
        """
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            print("WARNING: GEMINI_API_KEY is not set. AI features will return mock data.")
            self.model = None
        else:
            try:
                # Debugging: List available models to ensure our key has access to 'gemini-flash-latest' or 'gemini-pro'
                print("DEBUG: Listing available Gemini models...")
                for m in genai.list_models():
                    if 'generateContent' in m.supported_generation_methods:
                        print(f"DEBUG: Found model: {m.name}")
            except Exception as e:
                print(f"DEBUG: Could not list models: {e}")

            # We use 'gemini-flash-latest' for speed and cost-efficiency.
            # If this model is deprecated, switch to 'gemini-1.5-flash' or 'gemini-pro'.
            self.model = genai.GenerativeModel('gemini-flash-latest')

    async def generate_market_pulse(self, market_data: dict, news_headlines: list[str]) -> str:
        """
        Generates a concise "Market Pulse" summary.
        
        Args:
            market_data (dict): Contains 'top_gainers' and 'sector_performance' from MarketService.
            news_headlines (list[str]): A list of recent news titles from the NewsService.
            
        Returns:
            str: A raw string containing exactly 3 sentences summarizing the market mood.
            
        Logic:
            1. Constructs a prompt with real data formatted as lists/bullets.
            2. Instructs the AI to act as a "Financial Analyst".
            3. Enforces a strict 3-sentence limit to fit the Dashboard UI.
        """
        if not self.model:
            return "AI Market Pulse is unavailable (API Key missing)."

        # Constructing the Prompt with inserted data variables
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
        Generates a detailed SWOT analysis for a specific company.
        
        Args:
            company_name (str): Name of the company (e.g., "Systems Limited").
            industry (str): Industry sector (e.g., "Technology").
            description (str): Brief business description for context.
            
        Returns:
            dict: A JSON object with keys: strengths, weaknesses, opportunities, threats. 
                  Each key maps to a list[str] of bullet points.
        
        Logic:
            - Uses `response_mime_type: application/json` to force Gemini to output valid JSON.
            - This prevents parsing errors in the frontend.
            - Fallback mock data is provided if the API call fails or quota is exceeded.
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
            # Request JSON output specifically
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
