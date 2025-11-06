// config/secureConfig.js
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Keys for storing environment variables securely
const ENV_KEYS = {
  APPWRITE_PROJECT_ID: 'x',
  APPWRITE_DATABASE_ID: 'x', 
  APPWRITE_COLLECTION_ID: 'x',
  APPWRITE_ENDPOINT: 'https://nyc.cloud.appwrite.io/v1',
  AWS_USERNAME: 'x',
  AWS_SECRET:'x'
};

class SecureConfigService {
  constructor() {
    this.isSecureStoreAvailable = Platform.OS !== 'web';
  }

  /**
   * Initialize secure config on app startup
   * This should be called once when the app loads
   */
  async initialize() {
    try {
      // Check if SecureStore is available
      if (this.isSecureStoreAvailable) {
        const isAvailable = await SecureStore.isAvailableAsync();
        if (!isAvailable) {
          console.warn('SecureStore is not available on this device');
          this.isSecureStoreAvailable = false;
        }
      }

      // Load and cache environment variables
      await this.loadEnvironmentVariables();
    } catch (error) {
      console.error('Error initializing secure config:', error);
    }
  }

  /**
   * Load environment variables from various sources
   */
  async loadEnvironmentVariables() {
    // Priority order:
    // 1. SecureStore (for production secrets)
    // 2. Process.env (for development/build-time vars)
    // 3. Default fallbacks

    for (const [key, storeKey] of Object.entries(ENV_KEYS)) {
      let value = null;

      // Try to get from SecureStore first (production)
      if (this.isSecureStoreAvailable) {
        try {
          value = await SecureStore.getItemAsync(storeKey);
        } catch (error) {
          console.warn(`Failed to get ${key} from SecureStore:`, error);
        }
      }

      // Fallback to process.env (development/build-time)
      if (!value) {
        value = process.env[`EXPO_PUBLIC_${key}`] || process.env[key];
      }

      // Store in memory for quick access
      if (value) {
        this.cachedConfig[key] = value;
      }
    }
  }

  /**
   * Securely store a configuration value
   */
  async setSecureValue(key, value) {
    if (!this.isSecureStoreAvailable) {
      console.warn('SecureStore not available, cannot store value securely');
      return false;
    }

    try {
      await SecureStore.setItemAsync(key, value, {
        requireAuthentication: false, // Set to true if you want biometric auth
        keychainService: 'cookey-llc-config',
        accessGroup: undefined // iOS only
      });
      
      // Update cached value
      this.cachedConfig[key] = value;
      return true;
    } catch (error) {
      console.error(`Error storing ${key} securely:`, error);
      return false;
    }
  }

  /**
   * Get a configuration value
   */
  getConfig(key) {
    return this.cachedConfig[key] || null;
  }

  /**
   * Get all configuration values
   */
  getAllConfig() {
    return { ...this.cachedConfig };
  }

  /**
   * Remove a secure value
   */
  async removeSecureValue(key) {
    if (!this.isSecureStoreAvailable) {
      return false;
    }

    try {
      await SecureStore.deleteItemAsync(key);
      delete this.cachedConfig[key];
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all secure values (use with caution)
   */
  async clearAllSecureValues() {
    if (!this.isSecureStoreAvailable) {
      return false;
    }

    try {
      for (const storeKey of Object.values(ENV_KEYS)) {
        await SecureStore.deleteItemAsync(storeKey);
      }
      this.cachedConfig = {};
      return true;
    } catch (error) {
      console.error('Error clearing secure values:', error);
      return false;
    }
  }

  // Cache for quick access to avoid repeated SecureStore calls
  cachedConfig = {};
}

// Export singleton instance
export const secureConfig = new SecureConfigService();
export { ENV_KEYS };