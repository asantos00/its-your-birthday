import { Box, Text, CheckBox, Header } from "grommet";
import { useMemo } from "react";

const ContributorsList = ({ contributors, myContributorId, onChange, listRef }) => {
  if (!contributors?.length) {
    return null;
  }

  const hasContributed = useMemo(() => contributors.filter(c => c.hasContributed), [contributors]);

  return (
    <>
      <Header background="dark-5" pad={{ horizontal: "large", vertical: "medium" }}>
        <Text color="dark-1">Name</Text>
        <Text color="dark-1">Contributed ({hasContributed.length}/{contributors.length})</Text>
      </Header>
      <Box ref={listRef} pad="large">
        {contributors.map(contributor => (
          <Box key={contributor.id} direction="row" margin={{ vertical: "small" }} fill="horizontal" flex="shrink">
            <Box basis="70%" flex="grow">
              <Text
                color={myContributorId === contributor.id ? 'brand' : ''}
              >
                {contributor.name}
              </Text>
            </Box>
            <Box basis="5%" margin={{ horizontal: "medium" }}>
              <CheckBox
                checked={contributor.hasContributed}
                onChange={(e) => {
                  onChange({ ...contributor, hasPaid: e.target.checked });
                }} />
            </Box>
          </Box>
        ))}
      </Box>
    </>)
}

export default ContributorsList;
