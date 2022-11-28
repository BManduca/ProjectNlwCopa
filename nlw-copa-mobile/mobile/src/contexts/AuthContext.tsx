import { createContext, ReactNode, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps);

/*
    função para prover o context

    AuthContext => objetivo de armazenar o context
    
    AuthContextProvider => permite compartilha o context com toda a app
*/
export function AuthContextProvider({ children }: AuthProviderProps) {

    // console.log(AuthSession.makeRedirectUri({ useProxy: true }));

    const [ isUserLoading, setIsUserLoading ] = useState(false);

    const [ request, response, promptAsync ] = Google.useAuthRequest({
        clientId: '977466811857-d1b942519itburmduqqjj2430njv79if.apps.googleusercontent.com',
        redirectUri: 'AuthSession.makeRedirectUri({ useProxy: true })',
        scopes: [ 'profile', 'email' ]
    });

    async function signIn() {
        try {
            setIsUserLoading(true);
            await promptAsync();
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user: {
                name: 'Manduca',
                avatarUrl: 'https://github.com/BManduca.png',
            }
        }}>
            { children }
        </AuthContext.Provider>
    )

}