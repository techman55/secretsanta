import { useContext, useState } from "react";
import { GlobalContext } from "@/pages/admin";
import { Button } from "@/components/ui/button";

export default function RandomizeButton() {
  const { password, setScreen, participants, setParticipants } = useContext(GlobalContext);
  const [isRandomizing, setIsRandomizing] = useState(false);

  const not_enough_participants =
    !participants ||
    participants.length < 2
  const waiting_for_server =
    isRandomizing || participants.some((p) => p.id === "pending");

  async function handleRandomize() {
    const startedAt = Date.now();
    setIsRandomizing(true);

    if (
      !participants ||
      participants.length < 2 ||
      participants.some((p) => p.id === "pending")
    ) {
      setIsRandomizing(false);
      return;
    }

    try {
      const res = await fetch(`/randomize?password=${password}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      if (data && !data.auth) {
        // Session not valid anymore, bounce back to login
        setScreen("LOGIN");
        return;
      }

      if (data && data.auth && data.participants) {
        // Update participants with whatever the backend returns
        setParticipants(data.participants);
      }
    } catch (err) {
      console.error("Failed to randomize participants", err);
    } finally {
      const elapsed = Date.now() - startedAt;
      const remaining = 2000 - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
      setIsRandomizing(false);
    }
  }

  return (
    <>
      {isRandomizing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <p className="text-white text-lg font-semibold">
              Randomizing your Secret Santa...
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center mt-6">
        <Button
          type="button"
          variant="destructive"
          size="lg"
          className={`w-full max-w-md font-semibold h-[4em]`}
          style={
            !waiting_for_server && !not_enough_participants
              ? {
                  borderImage:
                    "repeating-linear-gradient(45deg, red 0 10px, white 10px 20px) 1",
                  borderStyle: "solid",
                  borderWidth: "6px",
                }
              : {}
          }
          disabled={not_enough_participants || waiting_for_server}
          onClick={
            not_enough_participants || waiting_for_server
              ? undefined
              : handleRandomize
          }
        >
          {not_enough_participants && "Need at least 2 participants to randomize"}
          {waiting_for_server && "Wait for operation to complete"}
          {!waiting_for_server &&
            !not_enough_participants &&
            "Randomize Secret Santa"}
        </Button>
      </div>
    </>
  );
}
