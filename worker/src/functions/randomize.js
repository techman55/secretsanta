import _adminAuth from "../common/_adminAuth.js";
import connectDB from "../common/connectDB.js";

export async function onRequest({ request, params, env }) {
  if (!_adminAuth(request, env)) {
    return new Response(
      JSON.stringify({
        auth: false,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const client = await connectDB(env);
  const db = client.db("secretsanta");
  const participantsCollection = db.collection("participants");

  const participants = await participantsCollection.find({}).toArray();

  if (!participants || participants.length < 2) {
    return new Response(
      JSON.stringify({
        auth: true,
        participants,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const n = participants.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  let assignment;
  const maxAttempts = 100;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const perm = shuffle([...indices]);
    const valid = perm.every((toIdx, fromIdx) => toIdx !== fromIdx);

    if (valid) {
      assignment = perm;
      break;
    }

    attempts++;
  }

  if (!assignment) {
    assignment = indices.map((_, i) => (i + 1) % n);
  }

  const bulkOps = participants.map((participant, idx) => {
    const recipient = participants[assignment[idx]];

    return {
      updateOne: {
        filter: { _id: participant._id },
        update: {
          $set: {
            secret: recipient.id,
            viewed: false,
          },
        },
      },
    };
  });

  if (bulkOps.length > 0) {
    await participantsCollection.bulkWrite(bulkOps);
  }

  const updatedParticipants = await participantsCollection.find({}).toArray();

  return new Response(
    JSON.stringify({
      auth: true,
      participants: updatedParticipants,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
