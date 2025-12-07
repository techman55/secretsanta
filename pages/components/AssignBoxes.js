import { useContext, useState } from "react";
import { GlobalContext } from "../pages/admin";
import { Button } from "@/components/ui/button";

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
          className={`w-full max-w-md font-semibold`}
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
