import _adminAuth from "../common/_adminAuth.js";
import connectDB from "../common/connectDB.js";

export async function onRequest({request, env}) {

    const data = await request.json();

    const client = await connectDB(env);
    const db = client.db("secretsanta")
    await db.collection("participants").updateOne({ id: data.id }, { "$set": { viewed: true }})


    return new Response(JSON.stringify({
        status: true
    }), { headers: { "Content-Type": "application/json" } });
}
