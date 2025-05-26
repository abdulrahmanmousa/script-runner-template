import dotenv from 'dotenv';
import cron from 'node-cron';
import axios from 'axios';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

class VPSScript {
  constructor() {
    this.name = process.env.SCRIPT_NAME || 'VPS Script';
    this.logFile = 'script.log';
    this.statusFile = 'status.json';
    this.cronJob = null;
    
    // Load configuration from environment variables
    this.config = {
      cronSchedule: process.env.CRON_SCHEDULE || '0 */1 * * *', // Every hour by default
      timezone: process.env.TIMEZONE || 'UTC',
      enabled: process.env.SCRIPT_ENABLED !== 'false',
      // Add your custom config here
    };
  }

  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    console.log(`[${timestamp}] ${message}`);
    
    try {
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  async loadStatus() {
    try {
      const data = await fs.readFile(this.statusFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {
        lastRun: null,
        runsCount: 0,
        lastError: null,
        // Add your custom status fields here
      };
    }
  }

  async saveStatus(status) {
    try {
      await fs.writeFile(this.statusFile, JSON.stringify(status, null, 2));
    } catch (error) {
      console.error('Failed to save status:', error);
    }
  }

  // Main task - CUSTOMIZE THIS METHOD
  async performTask() {
    await this.log('🔄 Performing main task...');
    
    try {
      // TODO: Replace this with your actual task logic
      // Examples:
      // - API calls
      // - File processing
      // - Data scraping
      // - Database operations
      // - System checks
      
      // Example task (remove this and add your logic)
      const response = await axios.get('https://httpbin.org/json');
      await this.log(`✅ Task completed successfully. Response: ${response.status}`);
      
      return { success: true, data: response.data };
      
    } catch (error) {
      await this.log(`❌ Task failed: ${error.message}`);
      throw error;
    }
  }

  async runTask() {
    const status = await this.loadStatus();
    
    try {
      await this.log('🚀 Starting task execution...');
      
      const result = await this.performTask();
      
      const newStatus = {
        lastRun: new Date().toISOString(),
        runsCount: status.runsCount + 1,
        lastError: null,
        lastResult: result,
      };
      
      await this.saveStatus(newStatus);
      await this.log(`✅ Task completed. Total runs: ${newStatus.runsCount}`);
      
    } catch (error) {
      const errorStatus = {
        ...status,
        lastRun: new Date().toISOString(),
        runsCount: status.runsCount + 1,
        lastError: error.message,
      };
      
      await this.saveStatus(errorStatus);
      await this.log(`❌ Task execution failed: ${error.message}`);
    }
  }

  async getStatus() {
    const status = await this.loadStatus();
    return {
      ...status,
      isRunning: !!this.cronJob,
      name: this.name,
      config: this.config,
    };
  }

  start() {
    if (!this.config.enabled) {
      this.log('⚠️ Script is disabled. Set SCRIPT_ENABLED=true in .env to enable.');
      return;
    }

    // Run immediately on start
    this.runTask();
    
    // Schedule recurring task
    this.cronJob = cron.schedule(
      this.config.cronSchedule,
      async () => {
        await this.runTask();
      },
      {
        scheduled: true,
        timezone: this.config.timezone,
      }
    );
    
    this.log(`🚀 ${this.name} started`);
    this.log(`📅 Schedule: ${this.config.cronSchedule} (${this.config.timezone})`);
    this.log(`⚙️ Configuration loaded from environment variables`);
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      this.log(`🛑 ${this.name} stopped`);
    }
  }

  // Manual run method
  async manualRun() {
    await this.log('🔄 Manual run initiated');
    await this.runTask();
  }
}

// CLI interface
const script = new VPSScript();

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'run':
    // Single run
    await script.manualRun();
    process.exit(0);
    break;
    
  case 'status':
    // Show current status
    const status = await script.getStatus();
    console.log('\n📊 Current Status:');
    console.log(JSON.stringify(status, null, 2));
    process.exit(0);
    break;
    
  case 'start':
  default:
    // Start continuous operation
    script.start();
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      script.log('\n🛑 Received SIGINT, shutting down gracefully...');
      script.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      script.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      script.stop();
      process.exit(0);
    });
    
    break;
}