#!/bin/bash

# 🔌 Advanced Integration API Testing
# ===================================

echo "🔌 Testing Infinure Integration API"
echo "==================================="
echo ""

# Test 1: Get all connectors with details
echo "📡 1. GET ALL CONNECTORS"
echo "curl http://localhost:3002/api/integrations/connectors"
curl -s http://localhost:3002/api/integrations/connectors | jq .
echo ""

# Test 2: Get connectors by different industries
echo "🏭 2. INDUSTRY-SPECIFIC CONNECTORS"

echo "💰 Fintech Connectors:"
curl -s "http://localhost:3002/api/integrations/connectors?industry=fintech" | jq .
echo ""

echo "🏥 Healthcare Connectors:"
curl -s "http://localhost:3002/api/integrations/connectors?industry=healthcare" | jq .
echo ""

echo "🛒 E-commerce Connectors:"
curl -s "http://localhost:3002/api/integrations/connectors?industry=ecommerce" | jq .
echo ""

echo "💻 SaaS Connectors:"
curl -s "http://localhost:3002/api/integrations/connectors?industry=saas" | jq .
echo ""

# Test 3: Try to create a data source (will fail with Airbyte down, but tests API structure)
echo "🔧 3. TEST SOURCE CREATION API"
echo "Testing source creation endpoint structure..."

# Prepare test data
cat > /tmp/test-source.json << EOF
{
  "name": "Test PostgreSQL Source",
  "type": "decd338e-5647-4c0b-adf4-da0e75f5a750",
  "credentials": {
    "host": "test-db.example.com",
    "port": 5432,
    "database": "test_db",
    "username": "test_user",
    "password": "test_password"
  },
  "syncFrequency": "daily"
}
EOF

echo "POST data to be sent:"
cat /tmp/test-source.json | jq .
echo ""

echo "Making API call..."
response=$(curl -s -X POST http://localhost:3002/api/integrations/sources \
  -H "Content-Type: application/json" \
  -d @/tmp/test-source.json 2>&1)

echo "Response:"
echo "$response"
echo ""

# Test 4: List existing sources
echo "📋 4. LIST EXISTING SOURCES"
curl -s http://localhost:3002/api/integrations/sources | jq .
echo ""

# Test 5: Test integration service structure
echo "🏗️ 5. INTEGRATION SERVICE STRUCTURE"
echo "Available endpoints:"
echo "  GET  /api/integrations/connectors       - List all available connectors"
echo "  GET  /api/integrations/connectors?industry=X - Filter by industry"
echo "  GET  /api/integrations/sources          - List organization sources"
echo "  POST /api/integrations/sources          - Create new data source"
echo "  POST /api/integrations/sources/:id/sync - Trigger manual sync"
echo ""

# Clean up
rm -f /tmp/test-source.json

echo "✅ Integration API testing complete!"
echo ""
echo "🔗 Integration Service URL: http://localhost:3002/api"
echo "📚 Available connectors: PostgreSQL, MySQL, Salesforce, HubSpot, Stripe, etc."
echo "🏭 Industry filtering: fintech, healthcare, ecommerce, saas"
echo "" 