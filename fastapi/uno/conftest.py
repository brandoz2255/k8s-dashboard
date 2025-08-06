"""
Pytest configuration for FastAPI tests
"""
import sys
import os
from pathlib import Path

# Add the parent directory (fastapi/) to Python path
parent_dir = Path(__file__).parent.parent
if str(parent_dir) not in sys.path:
    sys.path.insert(0, str(parent_dir))

# Also add the fastapi directory itself
fastapi_dir = parent_dir
if str(fastapi_dir) not in sys.path:
    sys.path.insert(0, str(fastapi_dir))

print(f"Python path configured with: {parent_dir}")