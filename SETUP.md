# Quick Setup Guide

## For New Projects

1. **Copy this template folder**
2. **Rename the project**
3. **Edit package.json** - Update name, description
4. **Customize script.js** - Edit the `performTask()` method
5. **Configure .env** - Add your environment variables
6. **Deploy**: `./deploy.sh`

## Common Customizations

### Change Schedule
```env
# Every 5 minutes
CRON_SCHEDULE="*/5 * * * *"

# Daily at 2 AM
CRON_SCHEDULE="0 2 * * *"

# Weekly on Sunday at 9 AM
CRON_SCHEDULE="0 9 * * 0"
```

### Add Dependencies
```bash
pnpm add cheerio nodemailer mongoose redis
```

### Change PM2 App Name
Edit `ecosystem.config.js`:
```javascript
name: 'my-awesome-script',
```

## Ready-to-Use Examples

### Web Scraper
```javascript
async performTask() {
  const response = await axios.get('https://example.com');
  const $ = cheerio.load(response.data);
  const title = $('title').text();
  return { title, scrapedAt: new Date() };
}
```

### API Monitor
```javascript
async performTask() {
  const start = Date.now();
  const response = await axios.get(process.env.API_ENDPOINT);
  const responseTime = Date.now() - start;
  
  if (response.status !== 200) {
    throw new Error(`API returned ${response.status}`);
  }
  
  return { status: 'healthy', responseTime };
}
```

### File Watcher
```javascript
async performTask() {
  const files = await fs.readdir('./watch-folder');
  for (const file of files) {
    await this.processFile(file);
    await fs.unlink(`./watch-folder/${file}`);
  }
  return { processedFiles: files.length };
}
```