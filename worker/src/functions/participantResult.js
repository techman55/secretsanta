import _adminAuth from "../common/_adminAuth.js";
import connectDB from "../common/connectDB.js";

export async function onRequest({request, env}) {

    const data = await request.json();

    const client = await connectDB(env);
    const db = client.db("secretsanta")
    const participant = await db.collection("participants").findOne({id: data.id})
    if (!((participant||{}).id) || !participant.secret || participant.viewed) {
        return new Response(JSON.stringify({
            status: false
        }), { headers: { "Content-Type": "application/json" } });
    }
    const secret = await db.collection("participants").findOne({id: participant.secret})

    return new Response(JSON.stringify({
        status: true,
        secretName: secret.name
    }), { headers: { "Content-Type": "application/json" } });
}
