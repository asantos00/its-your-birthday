import {
  Text,
  Main,
  Box,
  Heading,
  TextInput,
  FormField,
  Image,
  Button,
} from "grommet";
import Router from "next/router";
import { useState, useCallback } from "react";
import { useAuthentication } from '../hooks/useAuthentication';

enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
}

export default function Home() {
  const [name, setName] = useState("");
  const [requestStatus, setRequestStatus] = useState<Status>(Status.IDLE);
  const { token, login, isAuthenticated } = useAuthentication();
  const createBirthday = useCallback(async () => {
    setRequestStatus(Status.LOADING)
    const birthday = await fetch('/api/birthdays', {
      method: 'post',
      body: JSON.stringify({ name }),
      headers: {
        'content-type': "application/json",
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => {
        if (r.status !== 201) {
          return Promise.reject(r.json());
        }

        return r;
      })
      .then(r => r.json());

    Router.push(`/birthday/${birthday.id}`);
  }, [name, token])

  const isLoading = requestStatus === Status.LOADING;

  return (
    <Main pad="large" height="100vh !important">
      <Box pad="large">
        <Image src="/assets/gift.png" height="72px" margin="0 auto" />
      </Box>
      <Box margin={{ bottom: "large" }}>
        <Heading level="2">Welcome</Heading>
        <Text color="dark-3">Let's start by creating birthday gift poll</Text>
      </Box>
      <Box>
        {isLoading ? (
          <Text>Creating...</Text>
        ) : (
            <>
              <FormField label="Birthday person">
                <TextInput
                  placeholder="Name of the person"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormField>
              {isAuthenticated ? (
                <Button
                  onClick={createBirthday}
                  margin={{ top: "medium" }}
                  size="medium"
                  label="Hurray!"
                />
              ) : (
                  <Button
                    onClick={() => login()}
                    margin={{ top: "medium" }}
                    color="accent-1"
                    size="medium"
                    label="Login"
                  />
                )}
            </>
          )}
      </Box>
    </Main>
  );
}
