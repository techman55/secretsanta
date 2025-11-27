const { MongoClient, ServerApiVersion } = require('mongodb');
export default async function connectDB(env) {
    const client = new MongoClient(env.CONNECTION_STRING, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    await client.connect();
    return client
}
