import _adminAuth from "@/common/_adminAuth";
import connectDB from "@/common/connectDB";



export async function onRequest({request, env}) {

    const data = await request.json();

    const client = await connectDB(env);
    const db = client.db("secretsanta")
    await db.collection("participants").updateOne({ id: data.id }, { "$set": { viewed: true }})


    return new Response(JSON.stringify({
        status: true
    }), { headers: { "Content-Type": "text/json" } });
}
