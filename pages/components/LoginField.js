import {useState, useContext, useEffect} from "react";
import hashString from "@/common/hashString";
import { GlobalContext } from "@/pages/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// screen = "LOGIN" || "ADMIN" (on successful auth)
// /api/_adminAuth { password: hashedPassword (run through hashString! }
export default function LoginField() {
    const { screen, setScreen, password, setPassword } = useContext(GlobalContext);
    const [passwordField, setPasswordField] = useState(password ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function authenticate(hashedPassword) {
        if (!hashedPassword) return;

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/checkAdminLogin?password=${hashedPassword}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            if (!res.ok) {
                throw new Error("Request failed");
            }

            const data = await res.json();

            if (data && data.auth) {
                setPassword(hashedPassword);
                // store hashed password in a cookie for future auto-login
                document.cookie = `adminPasswordHash=${encodeURIComponent(
                  hashedPassword
                )}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
                setScreen("ADMIN");
            } else {
                setError("Incorrect password. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Network error");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!passwordField) return;

        const hashedPassword = hashString(passwordField);
        await authenticate(hashedPassword);
    }

    useEffect(() => {
        // auto-login using stored hashed password cookie, if present
        if (typeof document === "undefined") return;

        const match = document.cookie.match(/(?:^|; )adminPasswordHash=([^;]+)/);
        if (match) {
            const savedHash = decodeURIComponent(match[1]);
            authenticate(savedHash);
        }
    }, []);

    return (
      <form onSubmit={handleSubmit} className="w-full flex justify-center mt-10">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className={"font-bold"}>Secret Santa - Control Panel</CardTitle>
            <CardDescription>
              by Jack
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={passwordField}
                onChange={(e) => setPasswordField(e.target.value)}
                disabled={isLoading}
                placeholder="Enter Password Here"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={!passwordField || isLoading}
            >
              {isLoading ? "Checking..." : "Log in"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    );
}
