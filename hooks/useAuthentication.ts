import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export const useAuthentication = () => {
  const {
    isAuthenticated,
    user,
    logout,
    isLoading,
    getIdTokenClaims,
    loginWithRedirect,
  } = useAuth0();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(({ __raw }) => {
        setToken(__raw);
      })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    token,
    login: loginWithRedirect,
  };
};
