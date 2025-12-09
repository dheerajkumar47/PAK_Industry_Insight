"""
Merge enrichment data with existing companies
Updates companies_expanded.json with CEO, Revenue, Employees, Founded, Website
"""

import json

# Enrichment data provided by user
ENRICHMENT_DATA = {
    "HBL.KA": {
        "founded": "1941",
        "revenue": "PKR 342.13 Billion (FY24)",
        "employees": "6,061",
        "website": "https://www.hbl.com",
        "ceo": "Muhammad Aurangzeb"
    },
    "MEBL.KA": {
        "founded": "1997",
        "revenue": "PKR 315.91 Billion (FY24)",
        "employees": "18,653",
        "website": "https://www.meezanbank.com",
        "ceo": "Irfan Siddiqui"
    },
    "UBL.KA": {
        "founded": "1959",
        "revenue": "PKR 146.00 Billion (FY23)",
        "employees": "13,000+",
        "website": "https://www.ubldigital.com",
        "ceo": "Shazad G. Dada"
    },
    "MCB.KA": {
        "founded": "1947",
        "revenue": "PKR 186.52 Billion (FY24)",
        "employees": "14,000+",
        "website": "https://www.mcb.com.pk",
        "ceo": "Shoaib Mumtaz"
    },
    "ABL.KA": {
        "founded": "1942",
        "revenue": "PKR 404.74 Billion (FY24)",
        "employees": "12,058",
        "website": "https://www.abl.com",
        "ceo": "Tahir Hassan"
    },
    "BAHL.KA": {
        "founded": "1991",
        "revenue": "PKR 374.80 Billion (FY23)",
        "employees": "17,000+",
        "website": "https://www.bankalhabib.com",
        "ceo": "Rayomond Kotwal"
    },
    "BAFL.KA": {
        "founded": "1997",
        "revenue": "PKR 171.23 Billion (FY24)",
        "employees": "14,000+",
        "website": "https://www.bankalfalah.com",
        "ceo": "Nauman K. Dar"
    },
    "FABL.KA": {
        "founded": "1994",
        "revenue": "PKR 100.20 Billion (FY24)",
        "employees": "8,000+",
        "website": "https://www.faysalbank.com",
        "ceo": "Yousaf Hussain"
    },
    "AKBL.KA": {
        "founded": "1991",
        "revenue": "PKR 72.40 Billion (FY23)",
        "employees": "7,900",
        "website": "https://askaribank.com",
        "ceo": "Abid Sattar"
    },
    "SNBL.KA": {
        "founded": "1991",
        "revenue": "PKR 62.60 Billion (FY22)",
        "employees": "4,000+",
        "website": "https://www.soneribank.com",
        "ceo": "Aftab Ahmed"
    },
    "PSO.KA": {
        "founded": "1976",
        "revenue": "PKR 3572.00 Billion (FY24)",
        "employees": "2,206",
        "website": "https://psopk.com",
        "ceo": "Syed Muhammad Taha"
    },
    "OGDC.KA": {
        "founded": "1961",
        "revenue": "PKR 463.70 Billion (FY24)",
        "employees": "10,303",
        "website": "https://www.ogdcl.com",
        "ceo": "Ahmed Hayat Lak"
    },
    "PPL.KA": {
        "founded": "1950",
        "revenue": "PKR 278.00 Billion (FY23)",
        "employees": "2,800+",
        "website": "https://www.ppl.com.pk",
        "ceo": "Imran Ahmad"
    },
    "MARI.KA": {
        "founded": "1984",
        "revenue": "PKR 177.10 Billion (FY25)",
        "employees": "1,653",
        "website": "https://marienergies.com.pk",
        "ceo": "Faheem Haider"
    },
    "APL.KA": {
        "founded": "1998",
        "revenue": "PKR 474.10 Billion (FY24)",
        "employees": "469",
        "website": "https://www.apl.com.pk",
        "ceo": "Shuaib A. Malik"
    },
    "SNGP.KA": {
        "founded": "1963",
        "revenue": "PKR 1408.00 Billion (FY23)",
        "employees": "8,800+",
        "website": "https://www.sngpl.com.pk",
        "ceo": "Amjad Latif"
    },
    "SSGC.KA": {
        "founded": "1954",
        "revenue": "PKR 387.70 Billion (FY23)",
        "employees": "6,500+",
        "website": "https://www.ssgc.com.pk",
        "ceo": "Imran Maniar"
    },
    "SHEL.KA": {
        "founded": "1947",
        "revenue": "PKR 416.00 Billion (FY22)",
        "employees": "400+",
        "website": "https://www.shell.com.pk",
        "ceo": "Waqar Siddique"
    },
    "POL.KA": {
        "founded": "1950",
        "revenue": "PKR 60.95 Billion (FY23)",
        "employees": "687",
        "website": "https://pakoil.com.pk",
        "ceo": "Syed Wamiq Bokhari"
    },
    "HUBC.KA": {
        "founded": "1991",
        "revenue": "PKR 114.00 Billion (FY23)",
        "employees": "700+",
        "website": "https://www.hubpower.com",
        "ceo": "Kamran Kamal"
    },
    "KEL.KA": {
        "founded": "1913",
        "revenue": "PKR 500.00 Billion (FY23)",
        "employees": "10,000+",
        "website": "https://www.ke.com.pk",
        "ceo": "Moonis Alvi"
    },
    "KAPCO.KA": {
        "founded": "1996",
        "revenue": "PKR 25.43 Billion (FY24)",
        "employees": "600+",
        "website": "https://www.kapco.com.pk",
        "ceo": "Arif Saeed"
    },
    "LUCK.KA": {
        "founded": "1993",
        "revenue": "PKR 449.63 Billion (FY25)",
        "employees": "7,092",
        "website": "https://www.lucky-cement.com",
        "ceo": "Muhammad Ali Tabba"
    },
    "FCCL.KA": {
        "founded": "1992",
        "revenue": "PKR 87.00 Billion (FY24)",
        "employees": "2,200",
        "website": "https://fccl.com.pk",
        "ceo": "Lt Gen (R) Shafqaat Ahmed"
    },
    "MLCF.KA": {
        "founded": "1956",
        "revenue": "PKR 68.65 Billion (FY24)",
        "employees": "1,799",
        "website": "https://www.mapleleaf.com.pk",
        "ceo": "Sayyed Javed Iqbal"
    },
    "DGKC.KA": {
        "founded": "1978",
        "revenue": "PKR 66.04 Billion (FY24)",
        "employees": "2,500+",
        "website": "https://www.dgcement.com",
        "ceo": "Farid Fazal Din"
    },
    "ACPL.KA": {
        "founded": "1981",
        "revenue": "PKR 54.00 Billion (FY24)",
        "employees": "900+",
        "website": "https://www.attockcement.com",
        "ceo": "Babar Bashir Nawaz"
    },
    "CHCC.KA": {
        "founded": "1981",
        "revenue": "PKR 40.00 Billion (FY23)",
        "employees": "1,000+",
        "website": "https://gfg.com.pk/cherat-cement",
        "ceo": "Azam Faruque"
    },
    "KOHC.KA": {
        "founded": "1980",
        "revenue": "PKR 35.00 Billion (FY23)",
        "employees": "800+",
        "website": "https://www.kohatcement.com",
        "ceo": "Arif Faruque"
    },
    "PIOC.KA": {
        "founded": "1986",
        "revenue": "PKR 34.00 Billion (FY24)",
        "employees": "1,200",
        "website": "https://www.pioneercement.com",
        "ceo": "Tariq Sayeed Saigol"
    },
    "EFERT.KA": {
        "founded": "2009",
        "revenue": "PKR 219.57 Billion (FY23)",
        "employees": "2,000+",
        "website": "https://www.engrofertilizers.com",
        "ceo": "Khalid Siraj Subhani"
    },
    "FFC.KA": {
        "founded": "1978",
        "revenue": "PKR 193.06 Billion (FY23)",
        "employees": "3,000+",
        "website": "https://ffc.com.pk",
        "ceo": "Lt Gen (R) Muhammad Amir"
    },
    "FFBL.KA": {
        "founded": "1993",
        "revenue": "PKR 180.00 Billion (FY23)",
        "employees": "1,500+",
        "website": "https://www.ffbl.com",
        "ceo": "Lt Gen (R) Shafqaat Ahmed"
    },
    "FATIMA.KA": {
        "founded": "2003",
        "revenue": "PKR 150.00 Billion (FY23)",
        "employees": "2,500+",
        "website": "https://fatima-group.com",
        "ceo": "Fawad Ahmed Mukhtar"
    },
    "INDU.KA": {
        "founded": "1989",
        "revenue": "PKR 84.88 Billion (FY25)",
        "employees": "2,943",
        "website": "https://www.toyota-indus.com",
        "ceo": "Ali Asghar Jamali"
    },
    "MTL.KA": {
        "founded": "1964",
        "revenue": "PKR 65.78 Billion (FY23)",
        "employees": "336",
        "website": "https://www.millat.com.pk",
        "ceo": "Sikandar Mustafa Khan"
    },
    "HCAR.KA": {
        "founded": "1992",
        "revenue": "PKR 60.00 Billion (FY23)",
        "employees": "1,500+",
        "website": "https://www.honda.com.pk",
        "ceo": "Hironobu Yoshimura"
    },
    "GHNI.KA": {
        "founded": "1963",
        "revenue": "PKR 20.00 Billion (FY23)",
        "employees": "500+",
        "website": "https://www.gil.com.pk",
        "ceo": "Vaqar A. Sheikh"
    },
    "NML.KA": {
        "founded": "1951",
        "revenue": "PKR 212.51 Billion (FY24)",
        "employees": "27,776",
        "website": "https://nishatmillsltd.com",
        "ceo": "Shahid Abdullah"
    },
    "GADT.KA": {
        "founded": "1988",
        "revenue": "PKR 55.00 Billion (FY23)",
        "employees": "5,000+",
        "website": "https://gadoon.com",
        "ceo": "Tariq Yunus"
    },
    "KTML.KA": {
        "founded": "1958",
        "revenue": "PKR 50.00 Billion (FY23)",
        "employees": "5,000+",
        "website": "https://www.kmlg.com",
        "ceo": "Taufiq Ahmed"
    },
    "NESTLE.KA": {
        "founded": "1988",
        "revenue": "PKR 200.60 Billion (FY23)",
        "employees": "3,624",
        "website": "https://www.nestle.pk",
        "ceo": "Jason Avanceña"
    },
    "NATF.KA": {
        "founded": "1970",
        "revenue": "PKR 102.43 Billion (FY23)",
        "employees": "1,000+",
        "website": "https://nfoods.com",
        "ceo": "Abrar Hasan"
    },
    "UNITY.KA": {
        "founded": "1991",
        "revenue": "PKR 100.87 Billion (FY23)",
        "employees": "577",
        "website": "https://www.unityfoods.pk",
        "ceo": "Farrukh Amin"
    },
    "GLAXO.KA": {
        "founded": "2002",
        "revenue": "PKR 45.00 Billion (FY23)",
        "employees": "2,000+",
        "website": "https://www.gsk.com/pk",
        "ceo": "Sohail Akhtar"
    },
    "SEARL.KA": {
        "founded": "1965",
        "revenue": "PKR 27.00 Billion (FY24)",
        "employees": "2,000+",
        "website": "https://searlecompany.com",
        "ceo": "Adnan Ahmad"
    },
    "HINOON.KA": {
        "founded": "1984",
        "revenue": "PKR 20.00 Billion (FY23)",
        "employees": "1,500+",
        "website": "https://highnoon-labs.com",
        "ceo": "Asad Saeed"
    },
    "SYS.KA": {
        "founded": "1977",
        "revenue": "PKR 67.47 Billion (FY24)",
        "employees": "6,000+",
        "website": "https://www.systemsltd.com",
        "ceo": "Asif Peer"
    },
    "TRG.KA": {
        "founded": "2003",
        "revenue": "N/A (Holding Company)",
        "employees": "6 (Holding)",
        "website": "https://trg.com.pk",
        "ceo": "Zia Chishti"
    },
    "AVN.KA": {
        "founded": "2003",
        "revenue": "PKR 10.00 Billion (FY23)",
        "employees": "800+",
        "website": "https://www.avanceon.ae",
        "ceo": "Saud Javed"
    },
    "ENGRO.KA": {
        "founded": "1965",
        "revenue": "PKR 47.48 Billion (FY23)",
        "employees": "3,500+",
        "website": "https://www.engro.com",
        "ceo": "Ghias Khan"
    },
    "ISL.KA": {
        "founded": "2007",
        "revenue": "PKR 90.43 Billion (FY23)",
        "employees": "2,000+",
        "website": "https://www.isl.com.pk",
        "ceo": "Raza Mansha"
    },
    "ASL.KA": {
        "founded": "1992",
        "revenue": "PKR 35.00 Billion (FY23)",
        "employees": "1,000+",
        "website": "https://www.amrelisteels.com",
        "ceo": "Arif Ehsan"
    },
    "ASTL.KA": {
        "founded": "1981",
        "revenue": "PKR 50.00 Billion (FY23)",
        "employees": "1,500+",
        "website": "https://www.aghasteel.com",
        "ceo": "Agha Sher Shah"
    }
}

def merge_enrichment():
    """Merge enrichment data with companies.json"""
    
    import os
    
    # Get the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    companies_file = os.path.join(project_root, "companies.json")
    output_file = os.path.join(project_root, "companies_enriched.json")
    
    # Load existing companies
    with open(companies_file, "r", encoding="utf-8") as f:
        companies = json.load(f)
    
    print(f"Loaded {len(companies)} companies from {companies_file}")
    print("Merging enrichment data...\n")
    
    enriched_count = 0
    
    for company in companies:
        ticker = company["psx_symbol"]
        
        if ticker in ENRICHMENT_DATA:
            enrichment = ENRICHMENT_DATA[ticker]
            
            # Update fields
            company["founded"] = enrichment.get("founded", company.get("founded", ""))
            company["revenue"] = enrichment.get("revenue", company.get("revenue", ""))
            company["employees"] = enrichment.get("employees", company.get("employees", ""))
            company["website"] = enrichment.get("website", company.get("website", ""))
            company["ceo"] = enrichment.get("ceo", "")
            
            enriched_count += 1
            print(f"✓ Enriched {company['name']} ({ticker})")
    
    # Save updated companies
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(companies, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*60}")
    print(f"✓ Enriched {enriched_count} out of {len(companies)} companies")
    print(f"✓ Saved to {output_file}")
    print(f"{'='*60}")

if __name__ == "__main__":
    merge_enrichment()
