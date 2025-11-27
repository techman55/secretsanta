import _adminAuth from "../common/_adminAuth.js";
import connectDB from "../common/connectDB.js";

export async function onRequest({request, params, env}) {
    if (!_adminAuth(request, env)) {
        return new Response(JSON.stringify({
            auth: false
        }), { headers: { "Content-Type": "application/json" } });
    }
    const client = await connectDB(env);
    const db = client.db("secretsanta")
    const participants = await db.collection("participants").find({}).toArray()

    return new Response(JSON.stringify({
        auth: true,
        participants
    }), { headers: { "Content-Type": "application/json" } });
}
