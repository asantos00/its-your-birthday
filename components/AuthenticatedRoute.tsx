import React from 'react';
import { useAuthentication } from '../hooks/useAuthentication';
import { Main, Box, Text } from 'grommet';

const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthentication();

  if (isLoading) {
    return (
      <Main>
        <Box width="100%" height="100%" align="center" justify="center">
          <Text size="large" margin="medium">Loading...</Text>
        </Box>
      </Main>
    )
  }

  if (!isAuthenticated) {
    return (
      <Main>
        <Box width="100%" height="100%" align="center" justify="center">
          <Text size="large" margin="medium">You need to be authenticated to access this resource</Text>
        </Box>
      </Main>
    )
  }

  return children
}

export default AuthenticatedRoute;
