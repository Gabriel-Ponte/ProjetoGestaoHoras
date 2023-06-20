const { MongoClient } = require('mongodb');
const { exec } = require('child_process');
require('dotenv').config();

async function performBackup() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  const backupDirectory = './data.json';

  try {
    await client.connect();

    // Execute the mongodump command using the MongoDB package
    exec(`mongodump --uri=${uri} --out=${backupDirectory}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error executing mongodump: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`mongodump encountered an error: ${stderr}`);
        return;
      }
      console.log('mongodump backup completed successfully.');
    });
  } catch (error) {
    console.log('Error performing backup:', error);
  } finally {
    await client.close();
  }
}


performBackup();
