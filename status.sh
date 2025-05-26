#!/bin/bash

echo "📊 VPS Script Status"
echo "===================="

# Check PM2 status
echo "🔄 PM2 Process Status:"
pm2 status vps-script

echo ""
echo "⚙️ Configuration:"
echo "-----------------"
if [ -f ".env" ]; then
    source .env
    echo "SCRIPT_NAME: ${SCRIPT_NAME:-not set}"
    echo "SCRIPT_ENABLED: ${SCRIPT_ENABLED:-not set}"
    echo "CRON_SCHEDULE: ${CRON_SCHEDULE:-not set}"
    echo "TIMEZONE: ${TIMEZONE:-not set}"
else
    echo "❌ .env file not found"
fi

echo ""
echo "📋 Application Status:"
node script.js status

echo ""
echo "📄 Recent Logs (last 20 lines):"
echo "--------------------------------"
tail -n 20 script.log 2>/dev/null || echo "No script.log found"

echo ""
echo "🔧 Useful Commands:"
echo "  ./deploy.sh          - Deploy/redeploy script"
echo "  pm2 logs vps-script  - View live logs"
echo "  pm2 restart vps-script - Restart script"
echo "  node script.js run   - Manual run"