import { Box, Text, CheckBox, Header } from "grommet";
import { useMemo } from "react";

const ContributorsList = ({ contributors, onChange }) => {
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
      <Box pad="large">
        {contributors.map(contributor => (
          <Box key={contributor.name} direction="row" margin={{ vertical: "small" }} fill="horizontal" flex="shrink">
            <Box basis="70%" flex="grow">
              <Text>{contributor.name}</Text>
            </Box>
            <Box basis="5%" margin={{ horizontal: "medium" }}>
              <CheckBox
                checked={contributor.hasContributed}
                onChange={() => {
                  const newContributors = contributors.reduce((acc, contri) => {
                    return acc.concat(
                      contri.name === contributor.name
                        ? { ...contri, hasContributed: !contri.hasContributed }
                        : contri
                    );
                  }, [])
                  onChange(newContributors);
                }} />
            </Box>
          </Box>
        ))}
      </Box>
    </>)
}

export default ContributorsList;
