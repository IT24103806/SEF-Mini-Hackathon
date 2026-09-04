import app from './src/app.js';
import { config } from './src/config/index.js';
import { initDb } from './src/config/initDb.js';

const PORT = config.port;

const startServer = async () => {
  try {
    // Initialize Neon DB schema & seeds
    if (config.databaseUrl) {
      await initDb();
    } else {
      console.warn('⚠️ No DATABASE_URL provided. Running without database connection.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 CleanLK Backend Server running on http://localhost:${PORT}`);
      console.log(`📋 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
