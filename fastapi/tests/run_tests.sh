#!/bin/bash

# Social Feed Routes Test Runner
echo "🚀 Social Feed Routes Test Suite"
echo "================================"

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: Please run this script from the fastapi directory"
    echo "   Expected to find main.py in current directory"
    exit 1
fi

# Check Python environment
echo "🐍 Checking Python environment..."
if ! python -c "import httpx, feedparser, fastapi" 2>/dev/null; then
    echo "❌ Missing dependencies. Installing requirements..."
    pip install -r requirements.txt
fi

echo "✅ Dependencies checked"
echo

# Option 1: Standalone tests (no server required)
echo "Option 1: Standalone Service Tests (no server required)"
echo "-------------------------------------------------------"
read -p "Run standalone tests? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔍 Running standalone tests..."
    python test_social_standalone.py
    echo
fi

# Option 2: Full API tests (requires server)
echo "Option 2: Full API Endpoint Tests (requires server)"
echo "---------------------------------------------------"
read -p "Run full API tests? (requires FastAPI server on localhost:8000) (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Check if server is running
    echo "🌐 Checking if FastAPI server is running on localhost:8000..."
    if curl -s -f http://localhost:8000/api/health >/dev/null 2>&1; then
        echo "✅ Server is running"
        echo "🧪 Running full API tests..."
        python test_social.py
    else
        echo "❌ FastAPI server not running on localhost:8000"
        echo "   Please start the server with: python main.py"
        echo "   Then run: python test_social.py"
    fi
    echo
fi

# Option 3: Start server and run tests
echo "Option 3: Start Server and Run Tests"
echo "------------------------------------"
read -p "Start FastAPI server in background and run tests? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting FastAPI server..."
    python main.py &
    SERVER_PID=$!
    
    echo "⏳ Waiting for server to start..."
    sleep 5
    
    # Check if server started successfully
    if curl -s -f http://localhost:8000/api/health >/dev/null 2>&1; then
        echo "✅ Server started successfully (PID: $SERVER_PID)"
        echo "🧪 Running API tests..."
        python test_social.py
        
        echo "🛑 Stopping server..."
        kill $SERVER_PID
        echo "✅ Server stopped"
    else
        echo "❌ Failed to start server"
        kill $SERVER_PID 2>/dev/null
    fi
fi

echo
echo "📄 Test Results Files:"
echo "  - social_standalone_results.json (standalone tests)"
echo "  - social_test_results.json (API tests, if run)"
echo
echo "✅ Test suite complete!"