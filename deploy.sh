#!/bin/bash

echo "🚀 Deploying VPS Script..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if pnpm is installed, if not install it
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Check if PM2 is installed, if not install it
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    pnpm install -g pm2
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file to configure your script"
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Stop existing PM2 process if running
echo "🛑 Stopping existing script..."
pm2 stop vps-script 2>/dev/null || true
pm2 delete vps-script 2>/dev/null || true

# Start the script with PM2
echo "🚀 Starting script with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 startup script
echo "⚙️  Setting up PM2 startup script..."
pm2 startup

echo ""
echo "✅ Deployment completed!"
echo ""
echo "⚙️  Configuration:"
echo "  1. Edit .env file with your settings"
echo "  2. Customize script.js performTask() method"
echo "  3. Restart with: pm2 restart vps-script"
echo ""
echo "🔧 Useful commands:"
echo "  pm2 status           - Check script status"
echo "  pm2 logs vps-script  - View logs"
echo "  pm2 restart vps-script - Restart script"
echo "  pm2 stop vps-script  - Stop script"
echo "  node script.js run   - Manual run"
echo "  node script.js status - Check current status"
echo ""
echo "📊 To view current status run: node script.js status"