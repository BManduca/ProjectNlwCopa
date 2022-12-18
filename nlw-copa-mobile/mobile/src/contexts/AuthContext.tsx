import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from "expo-web-browser";
import { api } from '../services/api';

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
export function AuthContextProvider({ children }) {

    const [ user, setUser ] = useState<UserProps>({} as UserProps);
    const [ isUserLoading, setIsUserLoading ] = useState(false);

    const [ request, response, promptAsync ] = Google.useAuthRequest({
        clientId: '977466811857-itqcon8cu2ajcj552u54r6d8c0qejcs2.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    });

    async function signIn() {
        try {
            setIsUserLoading(true);
            await promptAsync();
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    }

    async function signInWithGoogle(access_token: string) {
        // console.log("TOKEN DE AUTENTICAÇÃO ===>", access_token);
        try {
            setIsUserLoading(true);

            const tokenResponse = await api.post('/users', { access_token });
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

            //solicitando os dados do user
            const userInfoResponse = await api.get('/me');
            setUser(userInfoResponse.data.user);
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    }

    useEffect(() => {
        if (response?.type === 'success' && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken);
        }
    }, [response])

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user
        }}>
            {children}
        </AuthContext.Provider>
    )

}