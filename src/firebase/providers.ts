import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseAuth } from './firebaseConfig.ts'
import {AuthStateContext} from "../context/authContext.tsx";


// signInWithEmailAndPassword
export const signInWithEmail = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(FirebaseAuth, email, password)

        const { uid } = result.user

        return uid

    } catch (e) {
        alert((e as Error).message)
    }
}

type StateDispatch = React.Dispatch<React.SetStateAction<Pick<AuthStateContext, "status" | "userId">>>

export const onAuthStateHasChanged = (setSession: StateDispatch) => {
    onAuthStateChanged(FirebaseAuth, user => {

        if (!user) return setSession({ status: 'no-authenticated', userId: null })

        setSession({ status: 'authenticated', userId: user?.uid })
    })
}

export const logoutFirebase = async () => await FirebaseAuth.signOut()
