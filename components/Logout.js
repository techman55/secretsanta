import { Button } from "@/components/ui/button";
import {GlobalContext} from "@/pages/admin";
import {useContext} from "react";
export default function LogoutButton() {
    const { screen, setScreen, password, setPassword } = useContext(GlobalContext);
  function handleLogout() {
      // clear the stored hashed password cookie
      if (typeof document != "undefined") {
          document.cookie = "adminPasswordHash=; path=/; max-age=0; SameSite=Lax";
          // clear password state and return to login screen
          setPassword("");
          setScreen("LOGIN");
      }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-3 text-xs"
        onClick={handleLogout}
      >
        Log out
      </Button>
    </div>
  );
}
