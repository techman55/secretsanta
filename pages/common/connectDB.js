import { MongoClient } from 'mongodb'
export default async function connectDB(env) {

    const client = new MongoClient(env.CONNECTION_STRING, {
        serverSelectionTimeoutMS: 5000, // Adjust timeout as needed
    });
    await client.connect();
    return client
}
