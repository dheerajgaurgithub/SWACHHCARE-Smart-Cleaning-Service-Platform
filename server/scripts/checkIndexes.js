import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/customer.js';
import Worker from '../models/worker.js';

dotenv.config({ path: '../.env' });

const checkIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.collections();
    
    for (const collection of collections) {
      console.log(`\nChecking indexes for collection: ${collection.collectionName}`);
      
      // Get all indexes for the collection
      const indexes = await collection.indexes();
      
      if (indexes.length <= 1) {
        console.log('  No indexes found or only _id index exists');
        continue;
      }
      
      // Check for duplicate indexes
      const indexMap = new Map();
      
      for (const index of indexes) {
        // Skip _id index
        if (index.key._id) continue;
        
        const key = JSON.stringify(index.key);
        
        if (indexMap.has(key)) {
          console.log(`  Duplicate index found for key: ${key}`);
          console.log(`    Existing index: ${JSON.stringify(indexMap.get(key).key)}`);
          console.log(`    Duplicate index: ${JSON.stringify(index.key)}`);
        } else {
          indexMap.set(key, index);
        }
      }
      
      if (indexMap.size === 0) {
        console.log('  No custom indexes found');
      } else {
        console.log(`  Found ${indexMap.size} unique indexes`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking indexes:', error);
    process.exit(1);
  }
};

checkIndexes();
