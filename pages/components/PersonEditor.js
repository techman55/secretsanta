import {useState, useContext, useEffect} from "react";
import hashString from "@/common/hashString";
import { GlobalContext } from "@/pages/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import RandomizeButton from "@/components/Randomize";
import {AssignBoxNumbersButton} from "@/components/AssignBoxes.js";


export default function PersonEditor() {
    const { password, setScreen, participants, setParticipants } = useContext(GlobalContext);
    const [nameField, setNameField] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    async function refresh() {
        setIsLoading(true);

        try {
            const res = await fetch(`/api/getParticipants?password=${password}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  }),
            });
            if (!res.ok) { throw new Error("Request failed") }
            const data = await res.json();
            console.log(data)
            if (data && !data.auth) { setScreen("LOGIN") }
            if (data && data.auth) {
                setParticipants(data.participants || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {refresh()}, []);

    if (isLoading && !participants) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
                    <p className="text-white text-lg font-semibold">
                        Getting everything ready...
                    </p>
                </div>
            </div>
        );
    }

    return (
      <div className="w-full flex justify-center flex-col">
          {(isLoading && participants) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
                      <p className="text-white text-lg font-semibold">
                          Refreshing...
                      </p>
                  </div>
              </div>
          )}
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  Manage your Secret Santa participants and share their unique links.
                </CardDescription>
              </div>
              <Button
                type="button"
                size="sm"
                disabled={isLoading}
                onClick={refresh}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-56 rounded-md border p-3">
              {participants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No participants yet. Add someone below to get started.
                </p>
              ) : (
                <div className="space-y-2">
                  {participants.map((participant) => {
                    const assigned = !!participant.secret;
                    const viewed = !!participant.viewed;
                    const boxNo = !!participant.box;
                    const link =
                      participant.id === "pending"
                        ? "Pending"
                        : `${(new URL(window.location.href)).protocol}//${(new URL(window.location.href)).host}/?id=${participant.id}`;

                    return (
                      <div
                        key={participant.id}
                        className="flex flex-col gap-1 rounded-md border px-3 py-2 text-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{participant.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={assigned ? "default" : "outline"}>
                              {assigned ? "Assigned" : "Not Assigned"}
                            </Badge>
                            <Badge variant={viewed ? "default" : "outline"}>
                              {viewed ? "Viewed" : "Not Viewed"}
                            </Badge>
                              <Badge variant={boxNo ? "default" : "outline"}>
                                  {boxNo ? "Box Assigned" : "No Box No."}
                              </Badge>
                            <button onClick={async () => {
                                const res = await fetch(`/api/deleteParticipant?password=${password}`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ id: participant.id }),
                                });
                                if (!res.ok) { throw new Error("Request failed") }
                                const data = await res.json();
                                console.log(data)
                                if (data && !data.auth) { setScreen("LOGIN") }
                                if (data && data.auth) {
                                    setParticipants(data.participants || []);
                                }
                            }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash2-icon lucide-trash-2 text-red-800"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-muted-foreground"></span>
                          {participant.id === "pending" ? (
                            <span className="italic text-muted-foreground">
                              Pending...
                            </span>
                          ) : (
                              <button
                                  type="button"
                                  onClick={async () => {
                                      try {
                                          await navigator.clipboard.writeText(link);
                                      } catch (err) {
                                          console.error("Failed to copy link", err);
                                      }
                                  }}
                                  className="inline-flex items-center gap-1 max-w-[220px] truncate text-blue-600 hover:underline"
                              >
                                  <span className="truncate">{link}</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                              </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <div className="space-y-2">
              <Label htmlFor="new-person">Add new participant</Label>
              <div className="flex gap-2">
                <Input
                  id="new-person"
                  type="text"
                  value={nameField}
                  onChange={(e) => setNameField(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter name here"
                />
                <Button
                  type="button"
                  onClick={async () => {
                    if (nameField && nameField !== "") {
                      const nameToAdd = nameField;
                      setNameField("");
                      setParticipants((prev) =>
                        prev.concat([
                          {
                            name: nameToAdd,
                            id: "pending",
                          },
                        ])
                      );
                      try {
                        const res = await fetch(
                          `/api/addParticipant?password=${password}`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name: nameToAdd }),
                          }
                        );
                        if (!res.ok) {
                          throw new Error("Request failed");
                        }
                        const data = await res.json();
                        if (data && !data.auth) {
                          setScreen("LOGIN");
                        }
                        if (data && data.auth) {
                          setParticipants(data.participants || []);
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    } else {
                      alert("Enter name");
                    }
                  }}
                  disabled={isLoading}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Participants will receive a unique link they can use to view their
            assigned person.
          </CardFooter>

            <RandomizeButton/>
            <AssignBoxNumbersButton/>
        </Card>




          <Card className="mt-12 w-full max-w-2xl">
              <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                      <div>
                          <CardTitle>Game Day Tools</CardTitle>
                          <CardDescription>
                              Run your Secret Santa.
                          </CardDescription>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => { setScreen("BOX") }}>Start Box Selection</Button>
              </CardContent></Card>
      </div>
    );
}
