from app.services.ai_service import ai_service
import json

def test_ai():
    print("Testing AI Service with a sample article...")
    
    title = "Pakistan's Textile Exports Surge by 15% in November"
    summary = "The textile sector witnessed a significant growth due to increased demand from European markets and favorable government policies regarding energy tariffs."
    
    print(f"\nTitle: {title}")
    print(f"Summary: {summary}\n")
    print("Analyzing...")
    
    result = ai_service.analyze_article(title, summary)
    
    if result:
        print("\n[SUCCESS] AI Response:")
        print(json.dumps(result, indent=2))
    else:
        print("\n[FAILED] No response from AI Service.")

if __name__ == "__main__":
    test_ai()
