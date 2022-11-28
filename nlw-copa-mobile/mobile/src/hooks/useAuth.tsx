import { useContext } from 'react';

import { AuthContext, AuthContextDataProps } from '../contexts/AuthContext';


/*
    padrão dos hooks => use seguido do NomeDoHook
*/
export function useAuth(): AuthContextDataProps {
    //criando o context utilizando o useContext do react, passando nosso context como param
    const context = useContext(AuthContext);

    return context;
}