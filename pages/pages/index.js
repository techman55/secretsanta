import {useEffect, useState, createContext} from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {

    const [screen, setScreen] = useState("LOADING")
    const [id, setId] = useState(null)
    const [participantName, setParticipantName] = useState(null)
    const [secretName, setSecretName] = useState(null)
    const [isRandomized, setIsRandomized] = useState(false)
    const [viewed, setViewed] = useState(false)
    const [isRevealing, setIsRevealing] = useState(false)

    useEffect(() => {async function _() {
        const _id = (Object.fromEntries((new URL(window.location.href)).searchParams) || {}) ['id']
        console.log(_id)
        if (!_id) {
            setScreen("NONE")
        } else {
            setId(_id)
            try {
                const res = await fetch(`/aboutParticipant`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: _id }),
                });
                if (!res.ok) { throw new Error("Request failed") }
                const data = await res.json();
                console.log(data)
                if (data && data.found) {
                    setParticipantName(data.name);
                    setIsRandomized(data.isRandomized)
                    setViewed(data.viewed)
                    setScreen("HOME")
                }
            } catch (err) {
                console.error(err);
            }
        }
    };_()}, []);

    return (
        <>
            <Head>
                <title>Secret Santa Results</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link href="https://fonts.googleapis.com/css2?family=Josefin+Slab:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"/>
            </Head>
            <div className={"fixed -z-10 w-[100vw] h-[100vh] bg-striped top-0 left-0"}></div>
            <div className=" p-4 md:p-8 relative flex items-center justify-center">

                {isRevealing && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
                      <p className="text-white text-lg font-semibold">
                        Revealing your Secret Santa...
                      </p>
                    </div>
                  </div>
                )}


                {screen === "LOADING" && (
                  <Card className="w-full max-w-md bg-white/90">
                    <CardHeader>
                      <CardTitle className="text-center">Secret Santa</CardTitle>
                      <CardDescription className="text-center">

                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-sm text-muted-foreground">
                        Loading in your secret santa...
                      </p>
                    </CardContent>
                  </Card>
                )}
                {screen === "HOME" && (
                  <Card className="w-full max-w-lg bg-white/90">
                    <CardHeader>
                      <CardTitle className="text-2xl text-center">
                        Secret Santa
                      </CardTitle>
                      <CardDescription className="text-center">
                        Hi {participantName}! Ready to see who you&apos;re shopping for?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!isRandomized && (
                        <Alert>
                          <AlertDescription>
                            The game hasn&apos;t started yet. Check back once the organizer has
                            randomized everyone.
                          </AlertDescription>
                        </Alert>
                      )}
                      {viewed && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            You&apos;ve already viewed your result. If you forgot, let the game
                            organizer know.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      {!viewed && isRandomized && (
                        <Button
                          type="button"
                          onClick={async () => {
                            setIsRevealing(true);
                            try {
                              const res = await fetch(`/participantResult`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id }),
                              });
                              if (!res.ok) {
                                throw new Error("Request failed");
                              }
                              const data = await res.json();
                              console.log(data);
                              if (data && data.status) {
                                await setSecretName(data.secretName);
                                await setScreen("RESULT");
                                try {
                                  const res = await fetch(`/acknowledge`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ id }),
                                  });
                                  if (!res.ok) {
                                    throw new Error("Request failed");
                                  }
                                  const data = await res.json();
                                  console.log(data);
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            } catch (err) {
                              console.error(err);
                            } finally {
                              setIsRevealing(false);
                            }
                          }}
                          className="w-full max-w-xs"
                        >
                          Reveal Secret
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )}
                {screen === "RESULT" && (
                  <Card className="w-full max-w-lg bg-white/90">
                    <CardHeader>
                      <CardTitle className="text-2xl text-center">
                        Your Secret Santa Match
                      </CardTitle>
                      <CardDescription className="text-center">
                        {participantName}, here&apos;s who you&apos;re gifting to.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                      <p className="text-lg">Time to shop for...</p>
                      <p className="text-3xl font-semibold">{secretName}</p>
                      <p className="text-sm text-muted-foreground">
                        You won&apos;t be able to see this again, so make sure you remember
                        this name!
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <p className="text-xs text-muted-foreground">
                        You can now safely close this page.
                      </p>
                    </CardFooter>
                  </Card>
                )}
                {screen === "NONE" && (
                  <Card className="w-full max-w-md bg-white/90">
                    <CardHeader>
                      <CardTitle className="text-center">Link not found</CardTitle>
                      <CardDescription className="text-center">
                        We couldn&apos;t find a Secret Santa entry for this link.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-sm text-muted-foreground">
                        Make sure you&apos;re using the exact link shared by your organizer.
                      </p>
                    </CardContent>
                  </Card>
                )}
            </div>
        </>
    );
}
