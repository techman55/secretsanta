import _adminAuth from "@/common/_adminAuth";
import connectDB from "@/common/connectDB";



export async function onRequest({request, env}) {

    const data = await request.json();

    const client = await connectDB(env);
    const db = client.db("secretsanta")
    const participant = await db.collection("participants").findOne({id: data.id})
    if (!((participant||{}).id)) {
        return new Response(JSON.stringify({
            found: false
        }), { headers: { "Content-Type": "text/json" } });
    }

    return new Response(JSON.stringify({
        found: true,
        name: participant.name,
        isRandomized: !!participant.secret,
        viewed: participant.viewed
    }), { headers: { "Content-Type": "text/json" } });
}
