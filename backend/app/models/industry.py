class IndustryModel:
    def __init__(self, name, description=None, tags=None):
        self.name = name
        self.description = description
        self.tags = tags or []
