import React, {createContext, useEffect, useState} from "react"
import {
    logoutFirebase,
    onAuthStateHasChanged,
    signInWithGoogle
} from "~/firebase/services"

export interface AuthStateContext {
    userId: string | null
    status: 'checking' | 'authenticated' | 'no-authenticated'
    handleLoginWithGoogle: () => Promise<void>
    handleLogOut: () => Promise<void>
}

const initialState: Pick<AuthStateContext, 'status' | 'userId'> = {
    status: 'checking',
    userId: 'null'
}

export const AuthContext = createContext({} as AuthStateContext)

interface IElement {
    children: React.ReactNode
}

export const AuthProvider = ({children}: IElement) => {
    const [session, setSession] = useState(initialState)
    useEffect(() => {
        onAuthStateHasChanged(setSession)
    }, [])
    const handleLogOut = async () => {
        logoutFirebase()
        setSession({userId: null, status: 'no-authenticated'})
    }
    const validateAuth = (userId: string | undefined) => {
        if (userId) return setSession({userId, status: 'authenticated'})
        handleLogOut()
    }
    const checking = () => setSession(prev => ({...prev, status: 'checking'}))

    const handleLoginWithGoogle = async () => {
        checking()
        const userId = await signInWithGoogle()
        validateAuth(userId)
    }

    return (
        <AuthContext.Provider
            value={{
                ...session,
                handleLoginWithGoogle,
                handleLogOut
            }}
        >{children}</AuthContext.Provider>
    )
}