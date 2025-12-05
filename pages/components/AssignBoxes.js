import { useContext, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import { Button } from "./Button";

export function RandomizeButton() {
  const { password, setScreen, participants, setParticipants } =
    useContext(GlobalContext);
  const [isRandomizing, setIsRandomizing] = useState(false);

  const not_enough_participants = !participants || participants.length < 2;
  const waiting_for_server =
    isRandomizing || (participants && participants.some((p) => p.id === "pending"));

  async function handleRandomize() {
    if (not_enough_participants || waiting_for_server) return;
    setIsRandomizing(true);
    try {
      const res = await fetch(`/api/randomize?password=${password}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      if (data && !data.auth) {
        setScreen("LOGIN");
        return;
      }

      if (data && data.auth && data.participants) {
        setParticipants(data.participants);
      }
    } catch (err) {
      console.error("Failed to randomize participants", err);
    } finally {
      setIsRandomizing(false);
    }
  }

  return (
    <>
      {isRandomizing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <p className="text-white text-lg font-semibold">Randomizing...</p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center mt-4">
        <Button
          type="button"
          variant="destructive"
          size="lg"
          className={`w-full max-w-md font-semibold h-[4em] border-[6px]`}
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
          onClick={handleRandomize}
        >
          {not_enough_participants && "Need at least 2 participants to randomize"}
          {waiting_for_server && "Randomizing..."}
          {!not_enough_participants && !waiting_for_server && "Randomize"}
        </Button>
      </div>
    </>
  );
}

export function AssignBoxNumbersButton() {
  const { password, setScreen, participants, setParticipants } = useContext(GlobalContext);
  const [isAssigning, setIsAssigning] = useState(false);

  const hasRandomized = !!participants && participants.some((p) => p.secret && p.secret !== false);
  const not_enough_participants = !participants || participants.length < 2;
  const waiting_for_server =
    isAssigning || (participants && participants.some((p) => p.id === "pending"));

  async function handleAssignBoxes() {
    if (not_enough_participants || !hasRandomized || waiting_for_server) return;
    setIsAssigning(true);
    try {
      const res = await fetch(`/api/assignBoxNumbers?password=${password}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      if (data && !data.auth) {
        setScreen("LOGIN");
        return;
      }

      if (data && data.auth && data.participants) {
        setParticipants(data.participants);
      }
    } catch (err) {
      console.error("Failed to assign box numbers", err);
    } finally {
      setIsAssigning(false);
    }
  }

  return (
    <>
      {isAssigning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <p className="text-white text-lg font-semibold">
              Assigning box numbers...
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center mt-4">
        <Button
          type="button"
          variant="destructive"
          size="lg"
          className={`w-full max-w-md font-semibold h-[4em] border-[6px]`}
          style={
            !waiting_for_server && !not_enough_participants && hasRandomized
              ? {
                  borderImage:
                    "repeating-linear-gradient(45deg, red 0 10px, white 10px 20px) 1",
                  borderStyle: "solid",
                  borderWidth: "6px",
                }
              : {}
          }
          disabled={not_enough_participants || !hasRandomized || waiting_for_server}
          onClick={handleAssignBoxes}
        >
          {not_enough_participants &&
            "Need at least 2 participants to assign boxes"}
          {!not_enough_participants && !hasRandomized &&
            "Randomize participants before assigning boxes"}
          {waiting_for_server &&
            "Assigning box numbers..."}
          {!waiting_for_server &&
            !not_enough_participants &&
            hasRandomized &&
            "Assign Box Numbers"}
        </Button>
      </div>
    </>
  );
}
