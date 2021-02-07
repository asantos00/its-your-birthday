import React from 'react';
import { Box, Text, CheckBox, Header, Anchor } from "grommet";
import { useMemo } from "react";
import { Contributor } from "@prisma/client";
import { Trash } from "grommet-icons";
interface ContributorsListProps {
  contributors?: Contributor[]
  paidBy?: Contributor[]
  userEmail?: string;
  onChange: ({ hasPaid }: { hasPaid: boolean }) => void
  onDelete: (contributor: Contributor) => void
  listRef?: any
}

const ContributorsList = ({
  contributors,
  paidBy,
  userEmail,
  onChange,
  onDelete,
  listRef
}: ContributorsListProps) => {
  const paidEmails = useMemo(() => paidBy?.map(p => p.email), [paidBy]);
  return (
    <>
      <Header background="dark-5" pad={{ horizontal: "large", vertical: "medium" }}>
        <Text color="dark-1">Name</Text>
        <Text color="dark-1">Contributed ({contributors?.length}/{paidBy?.length})</Text>
      </Header>
      <Box ref={listRef} pad="large">
        {contributors?.map(contributor => {
          return (
            <Box key={contributor.email} direction="row" margin={{ vertical: "small" }} fill="horizontal" flex="shrink">
              <Box basis="70%" flex="grow" direction="row" align="center">
                <Text
                  color={userEmail === contributor.email ? 'brand' : ''}
                >
                  {contributor.name}
                </Text>
              </Box>
              {contributor.email === userEmail ? (
                <Box basis="5%" margin={{ horizontal: "medium" }} justify="center">
                  <Trash data-testid={`delete-${contributor.name}`} color="dark-4" onClick={() => onDelete(contributor)} />
                </Box>
              ) : null}
              <Box basis="5%" margin={{ horizontal: "medium" }} justify="center">
                <CheckBox
                  data-testid={`checkbox-${contributor.name}`}
                  checked={paidEmails?.includes(contributor.email)}
                  disabled={contributor.email !== userEmail}
                  onChange={(e) => {
                    onChange({ hasPaid: e.target.checked });
                  }} />
              </Box>
            </Box>
          )
        })}
      </Box>
    </>)
}

export default ContributorsList;
