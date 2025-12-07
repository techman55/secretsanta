import { useContext, useMemo, useState } from "react";
import { GlobalContext } from "@/pages/admin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BoxSelect() {
  const { participants } = useContext(GlobalContext);

  const boxedParticipants = useMemo(() => {
    if (!participants || participants.length === 0) return [];
    return [...participants]
      .filter((p) => p.box != null && p.box !== "" && p.box !== false)
      .sort((a, b) => {
        const aNum = Number(a.box);
        const bNum = Number(b.box);
        if (Number.isNaN(aNum) || Number.isNaN(bNum)) return 0;
        return aNum - bNum;
      });
  }, [participants]);

  const [index, setIndex] = useState(0);

  if (!boxedParticipants || boxedParticipants.length === 0) {
    return (
      <div className="w-full flex justify-center mt-8">
        <Card className="w-full max-w-xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-emerald-50 border border-emerald-500/50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              🎄 Box Pickup
            </CardTitle>
            <CardDescription className="text-center text-emerald-100/80">
              No box numbers assigned yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-emerald-100/80">
              Once you&apos;ve randomized participants and assigned box numbers,
              you&apos;ll be able to use this screen to tell each person which
              box to pick up.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const current = boxedParticipants[Math.min(index, boxedParticipants.length - 1)];

  function handleNext() {
    setIndex((prev) =>
      prev + 1 >= boxedParticipants.length ? boxedParticipants.length - 1 : prev + 1
    );
  }

  function handlePrev() {
    setIndex((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
  }

  return (
      <div className="w-full flex justify-center place-items-center flex-col">
      <Card className="w-full max-w-xl bg-gradient-to-br from-red-700 via-red-800 to-emerald-900 text-red-50 border border-red-500/60 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl md:text-3xl">
            🎁 Box Pickup Station
          </CardTitle>
          <CardDescription className="text-center text-red-100/80">
            Call participants up one at a time and show them which gift box to grab.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-red-100/70">
              For
            </p>
            <p className="text-3xl md:text-4xl font-semibold drop-shadow-sm">
              {current.name}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-red-100/80">
              Please pick up <span className="font-semibold">Box</span>:
            </p>
            <div className="relative">
              <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-emerald-400/80 blur-md opacity-70" />
              <div className="absolute -bottom-4 -right-4 h-8 w-8 rounded-full bg-red-400/80 blur-md opacity-60" />
              <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-2xl border-[6px] border-white/90 bg-gradient-to-br from-red-500 to-red-600 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
                  {current.box}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="mt-2 border-red-200/70 bg-white/10 text-xs uppercase tracking-wide">
              Box #{current.box}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-red-100/70 pt-2">
            <span>
              Person {boxedParticipants.indexOf(current) + 1} of {boxedParticipants.length}
            </span>
            <span>Total boxes: {boxedParticipants.length}</span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={boxedParticipants.indexOf(current) === 0}
            onClick={handlePrev}
            className="w-1/2 border-red-200/70 bg-white/5 text-red-50 hover:bg-white/10 hover:text-white"
          >
            ⬅ Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={boxedParticipants.indexOf(current) === boxedParticipants.length - 1}
            onClick={handleNext}
            className="w-1/2 border-red-200/70 bg-white/5 text-red-50 hover:bg-white/10 hover:text-white"
          >
            Next ➡
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
