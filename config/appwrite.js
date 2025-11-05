// config/appwrite.js
import { Client, Account, Databases, Storage, ID } from 'react-native-appwrite';

// Environment variables
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const APPWRITE_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;

// Debug logging
//console.log('=== APPWRITE CONFIG DEBUG ===');
//console.log('Endpoint:', APPWRITE_ENDPOINT);
//console.log('Project ID:', APPWRITE_PROJECT_ID);
//console.log('Database ID:', APPWRITE_DATABASE_ID);
//console.log('Collection ID:', APPWRITE_COLLECTION_ID);

// Validate required environment variables
if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_DATABASE_ID || !APPWRITE_COLLECTION_ID) {
  console.error('❌ Missing required environment variables');
  console.error('Required: EXPO_PUBLIC_APPWRITE_ENDPOINT, EXPO_PUBLIC_APPWRITE_PROJECT_ID, EXPO_PUBLIC_APPWRITE_DATABASE_ID, EXPO_PUBLIC_APPWRITE_COLLECTION_ID');
}

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform('com.cookey.cookeyllc');

// Export configuration constants
export const DATABASE_ID = APPWRITE_DATABASE_ID;
export const CONTACT_COLLECTION_ID = APPWRITE_COLLECTION_ID;

export const testConnection = async () => {
  try {
    console.log('Testing connection with:', { DATABASE_ID, CONTACT_COLLECTION_ID });
    const result = await databases.listDocuments(DATABASE_ID, CONTACT_COLLECTION_ID);
    console.log('✅ Appwrite connection successful:', result);
    return true;
  } catch (error) {
    console.error('❌ Appwrite connection failed:', error);
    return false;
  }
};

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };
export default client;