import re
import string
from typing import Optional

def clean_text(text: Optional[str]) -> str:
    """
    Step 2: Build Text Cleaning
    - Lowercase
    - Remove symbols/emojis
    - Remove extra spaces
    """
    if not text:
        return ""
    
    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove symbols (keep alphanumeric and basic punctuation for sentence structure if needed, 
    # but the prompt says 'remove symbols'. We'll keep spaces.)
    # This regex removes anything that isn't a letter, number, or space.
    text = re.sub(r'[^a-z0-9\s]', '', text)
    
    # 3. Remove extra spaces
    text = " ".join(text.split())
    
    return text

def tokenize(text: str) -> list[str]:
    return text.split(" ")
