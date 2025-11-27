import _adminAuth from "@/common/_adminAuth";
import connectDB from "@/common/connectDB";
const {nanoid} = require("nanoid");



export async function onRequest({request, params, env}) {
    if (!_adminAuth(request,env)) {
        return new Response(JSON.stringify({
            auth: false
        }), { headers: { "Content-Type": "text/json" } });
    }

    const data = await request.json();

    const client = await connectDB(env);
    const db = client.db("secretsanta")

    const participants = db.collection("participants")
    participants.insertOne({
        id: nanoid(),
        name: data.name,
        viewed: false,
        secret: false
    })

    return new Response(JSON.stringify({
        auth: true,
        participants: await participants.find({}).toArray()
    }), { headers: { "Content-Type": "text/json" } });
}
