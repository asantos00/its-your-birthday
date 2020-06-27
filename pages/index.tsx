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

export default function Home() {
  const [name, setName] = useState("");
  const createBirthday = useCallback(async () => {
    const birthday = await fetch('/api/birthdays', {
      method: 'post',
      body: JSON.stringify({ name }),
      headers: {
        'content-type': "application/json"
      }
    }).then(r => r.json());

    Router.push(`/birthday/${birthday.id}`);
  }, [name])

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
      </Box>
    </Main>
  );
}