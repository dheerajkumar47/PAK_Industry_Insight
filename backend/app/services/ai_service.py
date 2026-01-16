import os
import google.generativeai as genai
from ..config import settings
from ..database import db
from datetime import datetime
from google.api_core import exceptions

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

    def analyze_and_store_pulse(self):
        """
        Scheduled Job: Analyzes market data and updates the 'latest_pulse' document in DB.
        Sync method for Scheduler.
        """
        try:
             print("INFO: Starting AI Market Pulse Analysis...")
             # Gather Data (Re-implementing logic directly to ensure synchronous execution)
             
             # 1. Top Gainers
             stocks_cursor = db.companies.find({"price": {"$ne": None}, "change_percent": {"$ne": None}}).sort("change_percent", -1).limit(5)
             top_gainers = [f"{s.get('ticker')} ({s.get('change_percent', 0):.1f}%)" for s in stocks_cursor]
             
             # 2. Sector Perf
             pipeline = [{"$group": {"_id": "$industry", "avg": {"$avg": "$change_percent"}}}]
             sectors_cursor = db.companies.aggregate(pipeline)
             sector_map = {s["_id"]: round(s["avg"] or 0, 2) for s in sectors_cursor if s["_id"]}
             
             # 3. News
             news_cursor = db.news.find().sort("published_date", -1).limit(3)
             headlines = [n.get("title", "") for n in news_cursor]
             
             # 4. Generate AI Insight
             if not self.model:
                 print("WARN: AI Model missing, skipping pulse generation.")
                 return

             prompt = f"""
             You are a high-frequency trading analyst. Analyze this LIVE market data:
             
             **Top Movers:** {', '.join(top_gainers)}
             **Sector Heatmap:** {str(sector_map)}
             **Breaking News:** {headlines}
             
             **Task:** Write a live, urgency-driven commentary (max 3 sentences) for a trader's dashboard. 
             Highlight where the momentum is RIGHT NOW. Use financial terminology (bullish, breakout, volume, rally).
             Do not use 'Here is the summary'. Just speak the insight.
             """
             
             try:
                 response = self.model.generate_content(prompt)
                 summary = response.text.strip()

                 # 5. Store in DB
                 db.ai_insights.update_one(
                     {"_id": "latest_pulse"},
                     {"$set": {
                         "summary": summary, 
                         "timestamp": datetime.utcnow(),
                         "type": "market_pulse"
                     }},
                     upsert=True
                 )
                 print(f"SUCCESS: AI Pulse Analyzed: {summary[:50]}...")

             except exceptions.ResourceExhausted:
                 print("WARN: AI Quota Exceeded. Keeping previous market pulse.")
                 # Optional: Insert a fallback if DB is empty
                 if db.ai_insights.count_documents({"_id": "latest_pulse"}) == 0:
                      db.ai_insights.insert_one({
                          "_id": "latest_pulse",
                          "summary": "High market activity detected. Detailed AI analysis will resume shortly.",
                          "timestamp": datetime.utcnow(),
                          "type": "market_pulse"
                      })
                      
        except Exception as e:
             print(f"ERROR: AI Pulse Analysis failed: {e}")

ai_service = AiService()
