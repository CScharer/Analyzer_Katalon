#!/usr/bin/env python3
"""
Diagnostic script to test the setup.
Run this to check if everything is configured correctly.
"""

import sys
from pathlib import Path

print("=" * 60)
print("Katalon Analyzer Setup Diagnostic")
print("=" * 60)

# Check Python version
print(f"\n1. Python Version: {sys.version}")

# Check if we can import required modules
print("\n2. Checking Python dependencies...")
try:
    import fastapi
    print(f"   ✓ FastAPI {fastapi.__version__} installed")
except ImportError:
    print("   ✗ FastAPI not installed. Run: pip install fastapi uvicorn")

try:
    import uvicorn
    print(f"   ✓ Uvicorn installed")
except ImportError:
    print("   ✗ Uvicorn not installed. Run: pip install uvicorn")

# Check if Analyzer_Katalon can be imported
print("\n3. Checking Analyzer_Katalon module...")
# Use the same import logic as api_server.py
onboarding_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(onboarding_dir))
try:
    from Analyzer_Katalon.api import KatalonAnalyzerAPI
    print("   ✓ Analyzer_Katalon module found and importable")
except ImportError as e:
    print(f"   ✗ Cannot import Analyzer_Katalon: {e}")
    print(f"   Current directory: {Path(__file__).parent}")
    print(f"   Onboarding directory: {onboarding_dir}")
    print(f"   Checking if Analyzer_Katalon exists...")
    analyzer_dir = onboarding_dir / "Analyzer_Katalon"
    if analyzer_dir.exists():
        print(f"   ✓ Analyzer_Katalon directory exists")
        if (analyzer_dir / "__init__.py").exists():
            print(f"   ✓ __init__.py exists")
        else:
            print(f"   ✗ __init__.py missing")
        if (analyzer_dir / "api.py").exists():
            print(f"   ✓ api.py exists")
        else:
            print(f"   ✗ api.py missing")
    else:
        print(f"   ✗ Analyzer_Katalon directory not found at {analyzer_dir}")

# Check if api_server.py exists
print("\n4. Checking API server file...")
api_server = Path(__file__).parent / "api_server.py"
if api_server.exists():
    print("   ✓ api_server.py exists")
else:
    print("   ✗ api_server.py not found")

# Check Node.js setup (basic check)
print("\n5. Checking Node.js setup...")
import subprocess
try:
    result = subprocess.run(["node", "--version"], capture_output=True, text=True)
    if result.returncode == 0:
        print(f"   ✓ Node.js {result.stdout.strip()} installed")
    else:
        print("   ✗ Node.js not found")
except FileNotFoundError:
    print("   ✗ Node.js not found in PATH")

try:
    result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
    if result.returncode == 0:
        print(f"   ✓ npm {result.stdout.strip()} installed")
    else:
        print("   ✗ npm not found")
except FileNotFoundError:
    print("   ✗ npm not found in PATH")

# Check if node_modules exists
print("\n6. Checking Next.js dependencies...")
node_modules = Path(__file__).parent / "node_modules"
if node_modules.exists():
    print("   ✓ node_modules directory exists")
    # Check for key packages
    key_packages = ["next", "react", "bootstrap", "react-bootstrap"]
    for pkg in key_packages:
        pkg_path = node_modules / pkg
        if pkg_path.exists():
            print(f"   ✓ {pkg} installed")
        else:
            print(f"   ✗ {pkg} not found in node_modules")
else:
    print("   ✗ node_modules not found. Run: npm install")

# Check ports
print("\n7. Checking if ports are available...")
import socket

def check_port(port, name):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    if result == 0:
        print(f"   ⚠ Port {port} ({name}) is already in use")
    else:
        print(f"   ✓ Port {port} ({name}) is available")

check_port(8000, "Python API")
check_port(3000, "Next.js")

print("\n" + "=" * 60)
print("Diagnostic complete!")
print("=" * 60)
print("\nIf you see any ✗ marks, fix those issues first.")
print("Then try running:")
print("  1. python3 api_server.py  (in one terminal)")
print("  2. npm run dev             (in another terminal)")

