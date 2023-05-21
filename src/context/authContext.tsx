import React, {createContext, useEffect, useState} from "react";
import {logoutFirebase, onAuthStateHasChanged, signInWithEmail} from "../firebase/providers.ts";

export interface AuthStateContext {
    userId: string | null
    status: 'checking' | 'authenticated' | 'no-authenticated'
    handleLoginWithEmail: (email: string, password: string) => Promise<void>
    handleLogOut: () => Promise<void>
}
const initialState: Pick<AuthStateContext, 'status' | 'userId'> = {
    userId: null,
    status: 'checking'
}
export const AuthContext = createContext({} as AuthStateContext)


export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [session, setSession] = useState(initialState)

    useEffect(() => {
        onAuthStateHasChanged(setSession)
    }, [])


    const handleLogOut = async () => {
        logoutFirebase()
        setSession({ userId: null, status: 'no-authenticated' })
    }

    const validateAuth = (userId: string | undefined) => {
        if (userId) return setSession({ userId, status: 'authenticated' })
        handleLogOut()
    }

    const checking = () => setSession(prev => ({ ...prev, status: 'checking' }))


    const handleLoginWithEmail = async (email: string, password: string) => {
        checking()
        const userId = await signInWithEmail(email, password)
        validateAuth(userId)
    }

    return (
        <AuthContext.Provider
            value={{
                ...session,
                handleLoginWithEmail,
                handleLogOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

