import React from 'react';
import { Header as GrommetHeader, Text, Avatar, Box } from 'grommet';
import Link from 'next/link';
import { useAuthentication } from '../hooks/useAuthentication';

const Header = () => {
  const { user } = useAuthentication();
  return (
    <GrommetHeader background="brand" pad="large" elevation="small" justify="between">
      <Link href="/">
        <a style={{ textDecoration: 'none' }}>
          <Text color="white" weight="bold">it's your birthday</Text>
        </a>
      </Link>
      <Box>
        <Avatar src={user?.picture} />
      </Box>
    </GrommetHeader>

  )
}

export default Header;
