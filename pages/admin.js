import {useEffect, useState, createContext} from "react";
import LoginField from "@/components/LoginField";
import PersonEditor from "@/components/PersonEditor";
import LogoutButton from "@/components/Logout";
import Head from "next/head";

export const GlobalContext = createContext(null);

export default function Home() {

  const [screen, setScreen] = useState("LOGIN")
  const [password, setPassword] = useState(null)
    const [participants, setParticipants] = useState(null);

  useEffect(() => {

  }, []);

  return (
    <GlobalContext.Provider value={{ screen, setScreen, password, setPassword, participants, setParticipants }}>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
            <link href="https://fonts.googleapis.com/css2?family=Josefin+Slab:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"/>
        </Head>
        <div className={"fixed -z-10 w-[100vw] h-[100vh] bg-striped top-0 left-0"}></div>
      <div className={" min-h-[100vh] min-w-[100vw] p-8 relative"}>

          {screen !== "LOGIN" && <LogoutButton/>}
        {screen === "LOGIN" && (
          <div>
            <LoginField/>
          </div>
        )}
        {screen === "ADMIN" && <div>
            <PersonEditor/>
        </div>}
      </div>
    </GlobalContext.Provider>
  );
}
