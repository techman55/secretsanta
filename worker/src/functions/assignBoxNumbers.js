import _adminAuth from "../common/_adminAuth";
import connectDB from "../common/connectDB";

export async function onRequest({ request, env }) {
    // 1. Auth check
    if (!_adminAuth(request, env)) {
        return new Response(
            JSON.stringify({ auth: false }),
            { headers: { "Content-Type": "application/json" } }
        );
    }

    // 2. Connect to Mongo
    const client = await connectDB(env);
    const db = client.db("secretsanta");
    const participantsCollection = db.collection("participants");

    // 3. Load only participants that have been randomized
    //    i.e. "secret" is not false
    const randomizedParticipants = await participantsCollection
        .find({ secret: { $ne: false } })
        .toArray();

    if (!randomizedParticipants || randomizedParticipants.length === 0) {
        // Nothing to assign
        return new Response(
            JSON.stringify({
                auth: true,
                participants: [],
                message: "No randomized participants found.",
            }),
            { headers: { "Content-Type": "application/json" } }
        );
    }

    // 4. Assign box numbers as strings: "1", "2", "3", ...
    // Order is not important; this just uses the array order.
    const bulkOps = randomizedParticipants.map((participant, index) => {
        const boxNumber = String(index + 1); // stringified integer

        return {
            updateOne: {
                filter: { _id: participant._id },
                update: {
                    $set: {
                        box: boxNumber,
                    },
                },
            },
        };
    });

    if (bulkOps.length > 0) {
        await participantsCollection.bulkWrite(bulkOps);
    }

    // 5. Return all participants (or just the randomized ones, your choice)
    const updatedParticipants = await participantsCollection.find({}).toArray();

    return new Response(
        JSON.stringify({
            auth: true,
            participants: updatedParticipants,
        }),
        { headers: { "Content-Type": "application/json" } }
    );
}
