"use client"

import LoginDialog from "@/components/Authentification/LoginDialog";
import LogSignDialog from "@/components/Authentification/LogSignDialog";
import SignupDialog from "@/components/Authentification/SignUpDialog";
import useStore from "@/context/store";
import { useState } from "react";

const Auth = () => {
    const { openLogSign, setOpenLogSign } = useStore();
    const [openLogin, setOpenLogin] = useState(false);
    const [openSignup, setOpenSignup] = useState(false);
    return (
        <div className="w-screen overflow-hidden">
            {!!openLogSign && <LogSignDialog
                open={openLogSign}
                onOpenChange={setOpenLogSign}
                setOpenLogin={setOpenLogin}
                setOpenSignup={setOpenSignup}
            />}
            {/* Je vais mettre aussi les dialogues de login et signUp */}
            {!!openLogin && (
                <LoginDialog
                    open={openLogin}
                    onOpenChange={setOpenLogin}
                    setOpenLogSign={setOpenLogSign}
                    setOpenSignup={setOpenSignup}
                />
            )}
            {!!openSignup && (
                <SignupDialog
                    open={openSignup}
                    onOpenChange={setOpenSignup}
                    setOpenLogSign={setOpenLogSign}
                    setOpenLogin={setOpenLogin}
                />
            )}
        </div>
    );
};

export default Auth;