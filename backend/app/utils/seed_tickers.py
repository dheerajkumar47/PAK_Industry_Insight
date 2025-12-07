from ..services.data_engine import DataEngine
from ..database import db

def seed_initial_tickers():
    """
    Seeds the top 15 Pakistani companies into the database 
    by triggering an initial fetch for each.
    """
    initial_tickers = [
        "SYS.KA",   # Systems Limited
        "ENGRO.KA", # Engro Corporation
        "LUCK.KA",  # Lucky Cement
        "HBL.KA",   # Habib Bank Limited
        "OGDC.KA",  # Oil & Gas Development Company
        "HUBC.KA",  # Hub Power Company
        "MCB.KA",   # MCB Bank
        "UBL.KA",   # United Bank Limited
        "TRG.KA",   # TRG Pakistan
        "FFC.KA",   # Fauji Fertilizer Company
        "PSO.KA",   # Pakistan State Oil
        "INDU.KA",  # Indus Motor Company
        "MEBL.KA",  # Meezan Bank
        "MARI.KA",  # Mari Petroleum
        "MTL.KA"    # Millat Tractors
    ]

    print("--- STARTING SEED PROCESS ---")
    print("INFO: Clearing existing company data...")
    db.companies.delete_many({}) # WIPE ALL DATA
    
    for ticker in initial_tickers:
        DataEngine.update_company(ticker)
    print("--- SEED PROCESS COMPLETE ---")
