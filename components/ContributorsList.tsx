import { Box, Text, CheckBox, Header, Anchor } from "grommet";
import { useMemo, Ref, RefObject, RefCallback, HtmlHTMLAttributes, MutableRefObject } from "react";
import { Contributor } from "@prisma/client";
import { CloudUpload } from "grommet-icons";

interface ContributorsListProps {
  contributors: Contributor[]
  myContributorId?: number;
  onChange: (contributor: Contributor) => void
  onThisIsMe: (contributor: Contributor) => void
  listRef?: any
}

const ContributorsList = ({
  contributors,
  myContributorId,
  onChange,
  onThisIsMe,
  listRef
}: ContributorsListProps) => {
  if (!contributors?.length) {
    return null;
  }

  const hasContributed = useMemo(() => contributors.filter(c => c.hasPaid), [contributors]);

  return (
    <>
      <Header background="dark-5" pad={{ horizontal: "large", vertical: "medium" }}>
        <Text color="dark-1">Name</Text>
        <Text color="dark-1">Contributed ({hasContributed.length}/{contributors.length})</Text>
      </Header>
      <Box ref={listRef} pad="large">
        {contributors.map(contributor => {
          return (
            <Box key={contributor.id} direction="row" margin={{ vertical: "small" }} fill="horizontal" flex="shrink">
              <Box basis="70%" flex="grow" direction="row" align="center">
                <Text
                  color={myContributorId === contributor.id ? 'brand' : ''}
                >
                  {contributor.name}
                </Text>
                {!myContributorId && (
                  <Text size="small" margin="small" onClick={() => onThisIsMe(contributor)}>
                    <Anchor>
                      This is me
                  </Anchor>
                  </Text>)
                }
              </Box>
              <Box basis="5%" margin={{ horizontal: "medium" }}>
                <CheckBox
                  checked={contributor.hasPaid}
                  onChange={(e) => {
                    onChange({ ...contributor, hasPaid: e.target.checked });
                  }} />
              </Box>
            </Box>
          )
        })}
      </Box>
    </>)
}

export default ContributorsList;
