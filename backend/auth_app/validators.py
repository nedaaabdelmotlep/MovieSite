import re
from django.core.exceptions import ValidationError

class CustomPasswordValidator:
    def validate(self, password, user=None):
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long.")
        if not re.search(r"[@#$]", password):
            raise ValidationError("Password must contain at least one special character (@, #, $).")

    def get_help_text(self):
        return "Password must be at least 8 characters and contain @, #, or $."
