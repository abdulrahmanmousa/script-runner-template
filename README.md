# VPS Script Template

A flexible template for deploying and running scripts on VPS with PM2. Perfect for automation tasks, monitoring, data processing, or any scheduled operations.

## Features

- 🔄 **Automated scheduling** with cron expressions
- 🚀 **PM2 process management** for reliability
- ⚙️ **Environment-based configuration**
- 📊 **Status tracking and logging**
- 🔧 **Easy deployment and management**
- 🛡️ **Graceful shutdown handling**
- 📈 **Built-in error handling and recovery**

## Quick Start

### 1. Deploy to VPS
```bash
./deploy.sh
```

### 2. Configure Your Script
```bash
# Edit environment variables
nano .env

# Customize your main task
nano script.js  # Edit the performTask() method
```

### 3. Restart and Monitor
```bash
pm2 restart vps-script
./status.sh
```

## Configuration

### Environment Variables (`.env`)
```env
SCRIPT_NAME="My VPS Script"
SCRIPT_ENABLED=true
CRON_SCHEDULE="0 */1 * * *"  # Every hour
TIMEZONE="UTC"

# Add your custom variables here
API_KEY=your-api-key
DATABASE_URL=your-database-url
```

### Cron Schedule Examples
```bash
# Every hour
CRON_SCHEDULE="0 */1 * * *"

# Every day at 9 AM
CRON_SCHEDULE="0 9 * * *"

# Every 30 minutes
CRON_SCHEDULE="*/30 * * * *"

# Every Monday at 10 AM
CRON_SCHEDULE="0 10 * * 1"

# Every 5 minutes
CRON_SCHEDULE="*/5 * * * *"
```

## Customization

### Main Task Implementation
Edit the `performTask()` method in `script.js`:

```javascript
async performTask() {
  await this.log('🔄 Performing main task...');
  
  try {
    // Your custom logic here:
    // - API calls
    // - Database operations
    // - File processing
    // - Web scraping
    // - System monitoring
    // - Data analysis
    
    const result = await yourCustomFunction();
    
    await this.log('✅ Task completed successfully');
    return { success: true, data: result };
    
  } catch (error) {
    await this.log(`❌ Task failed: ${error.message}`);
    throw error;
  }
}
```

## Management Commands

### Check Status
```bash
./status.sh
pm2 status vps-script
```

### View Logs
```bash
pm2 logs vps-script
tail -f script.log
```

### Manual Run
```bash
node script.js run
```

### Control Script
```bash
pm2 restart vps-script
pm2 stop vps-script
pm2 start vps-script
```

## Use Cases

### 🌐 Web Monitoring
- Website uptime checking
- Content change detection
- API endpoint monitoring
- SSL certificate expiry alerts

### 📊 Data Processing
- Database cleanup tasks
- Report generation
- Data synchronization
- Backup operations

### 🔗 API Integration
- Third-party API polling
- Webhook processing
- Data aggregation
- System notifications

### 📈 System Maintenance
- Log rotation
- Cache clearing
- Health checks
- Resource monitoring

## File Structure

```
├── script.js           # Main script (customize performTask method)
├── ecosystem.config.js # PM2 configuration
├── package.json        # Dependencies and scripts
├── .env.example        # Environment template
├── deploy.sh          # Deployment script
├── status.sh          # Status checker
├── test.js            # Configuration tester
├── logs/              # PM2 logs directory
├── script.log         # Application logs
└── status.json        # Runtime status
```

## Deployment Features

- ✅ **Auto-installs** pnpm and PM2
- ✅ **Creates** .env from template
- ✅ **Configures** PM2 startup script
- ✅ **Sets up** log directories
- ✅ **Handles** graceful restarts

## Production Ready

- 🛡️ **Process monitoring** with PM2
- 🔄 **Auto-restart** on crashes
- 📊 **Memory limits** and monitoring
- 🕐 **Scheduled restarts** (daily at 3 AM)
- 📝 **Comprehensive logging**
- 🚀 **Survives server reboots**

## Getting Started Examples

### Example 1: API Monitor
```javascript
async performTask() {
  const response = await axios.get(process.env.API_URL);
  if (response.status !== 200) {
    throw new Error(`API returned ${response.status}`);
  }
  return { status: 'healthy', responseTime: response.headers['x-response-time'] };
}
```

### Example 2: Database Cleanup
```javascript
async performTask() {
  const deletedCount = await db.deleteOldRecords();
  await this.log(`Cleaned up ${deletedCount} old records`);
  return { deletedRecords: deletedCount };
}
```

### Example 3: File Processing
```javascript
async performTask() {
  const files = await fs.readdir('./inbox');
  for (const file of files) {
    await this.processFile(file);
  }
  return { processedFiles: files.length };
}
```

---

**Ready to deploy?** Just run `./deploy.sh` and start customizing! 🚀