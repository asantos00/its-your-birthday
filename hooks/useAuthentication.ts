import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const { isAuthenticated, user, isLoading, getIdTokenClaims, loginWithRedirect } = useAuth0();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(({ __raw }) => {
        setToken(__raw)
      })
        .catch(console.error)
    }

  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    user,
    token,
    login: loginWithRedirect
  };
}
