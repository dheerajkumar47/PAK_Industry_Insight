from datetime import datetime

class CompanyModel:
    def __init__(self, name, industry, founded_year=None, location=None, employees_count=None, growth_tags=None):
        self.name = name
        self.industry = industry
        self.founded_year = founded_year
        self.location = location
        self.employees_count = employees_count
        self.growth_tags = growth_tags or []
        self.created_at = datetime.utcnow()
