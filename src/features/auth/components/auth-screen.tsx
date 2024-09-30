"use client"

import { useState } from "react"

import { SignInflow } from "../types"
import SignInCard from "./sign-in-card"
import SignUpCard from "./sign-up-card"

export default function AuthScreen() {
    const [state, setState] = useState<SignInflow>("signIn")
    return (
        <div className="h-full flex items-center justify-center bg-[#5C3B58]">
            <div className="md:h-auto md:w-[420px]">
                {state === "signIn" ? <SignInCard setState={setState}/> : <SignUpCard setState={setState}/>}
            </div>
        </div>
    )
}