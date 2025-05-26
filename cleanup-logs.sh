#!/bin/bash

echo "🧹 Cleaning up old logs..."

# Clean application logs older than 30 days
find . -name "script.log*" -type f -mtime +30 -delete 2>/dev/null || true

# Clean PM2 logs older than 7 days
find logs/ -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true

# Rotate current script.log if it's larger than 10MB
if [ -f "script.log" ] && [ $(stat -f%z script.log 2>/dev/null || stat -c%s script.log 2>/dev/null || echo 0) -gt 10485760 ]; then
    mv script.log "script.log.$(date +%Y%m%d_%H%M%S)"
    echo "📝 Rotated large script.log file"
fi

echo "✅ Log cleanup completed"