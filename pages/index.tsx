import {
  Text,
  Main,
  Box,
  Heading,
  TextInput,
  FormField,
  Image,
  Button,
  Anchor,

} from "grommet";
import Router from "next/router";
import { useState, useCallback } from "react";
import useSWR from "swr";
import { useAuthentication } from '../hooks/useAuthentication';
import { authenticatedFetcher } from '../client';

enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
}

export default function Home() {
  const [name, setName] = useState("");
  const [requestStatus, setRequestStatus] = useState<Status>(Status.IDLE);
  const { token, login, logout, user, isAuthenticated } = useAuthentication();
  const { data: userBirthdays, error } = useSWR(
    token ? [`/api/birthdays?user=${user.email}`, token] : null,
    authenticatedFetcher
  );
  const userBirthdaysLoading = !userBirthdays && !error;
  const firstName = user?.name?.split(' ')[0];
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
      <Box>
        <Heading level="2">Welcome {firstName}</Heading>
        {isAuthenticated && userBirthdays ? (
          <Box margin={{ bottom: "large" }}>
            <Heading level="3">Gift groups you're part of</Heading>
            { userBirthdaysLoading ? <Text>Loading...</Text> : null}
            { userBirthdays.birthdays.map(birthday => {
              return (
                <Box key={birthday.id} direction="row" margin={{ vertical: "small" }} fill="horizontal" flex="shrink">
                  <Box basis="70%" flex="grow" direction="row" align="center">
                    <Text
                      color={'brand'}
                    >
                      <Anchor href={`/birthday/${birthday.id}`}><Text>{birthday.person}'s gift</Text></Anchor>
                    </Text>
                  </Box>
                </Box>
              )
            })}
          </Box>
        ) : null}
        <Box margin={{ bottom: "large" }}>
          <Heading level="3">Create a new gift group</Heading>
          {isLoading ? (
            <Text>Creating...</Text>
          ) : (
              <>
                {isAuthenticated ? (
                  <>
                    <FormField label="Birthday person">
                      <TextInput
                        placeholder="Name of the person"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormField>
                    <Button
                      onClick={createBirthday}
                      margin={{ top: "medium" }}
                      size="medium"
                      label="Hurray!"
                    />
                  </>
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
      </Box>
      {isAuthenticated ? (
        <Box justify="end" margin={{ top: 'large' }}>
          <Button
            onClick={() => logout()}
            color="accent-1"
            size="medium"
            label="Logout"
          />
        </Box>
      ) : null}
    </Main>
  );
}
