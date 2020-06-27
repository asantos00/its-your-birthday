import { Box, Header, Anchor, Text } from "grommet";
import { Like, Dislike } from "grommet-icons";
import { Gift, Contributor } from "@prisma/client";

export interface GiftsWithUpvotes extends Gift {
  upvotedBy: Contributor[]
}

const GiftsList = ({ gifts, collaboratorId, onUpvoteChange }: {
  gifts: GiftsWithUpvotes[],
  collaboratorId: number,
  onUpvoteChange: (gift: Gift, isUpvoted: boolean) => void
}) => {
  if (!gifts?.length) {
    return null;
  }

  const collaboratorUpvotedGift = (upvotedBy) => {
    return upvotedBy.some(c => c.id === collaboratorId)
  }

  return (
    <Box>
      <Header background="dark-5" pad={{ horizontal: "large", vertical: "medium" }}>
        <Text color="dark-1">Gifts suggested</Text>
        <Text color="dark-1">Votes</Text>
      </Header>
      <Box pad="large">
        {gifts.map((gift) => (
          <Box key={gift.description} direction="row" margin={{ vertical: "small" }} fill="horizontal" flex="shrink">
            <Box basis="70%" flex="grow">
              <Anchor target="_blank" href={gift.url}><Text>{gift.description}</Text></Anchor>
            </Box>
            <Box basis="20%" justify="end" direction="row" margin={{ horizontal: "medium" }}>
              <Text margin={{ right: "small" }}>({gift.upvotedBy.length})</Text>
              <Like onClick={() => onUpvoteChange(gift, !collaboratorUpvotedGift(gift.upvotedBy))} color={collaboratorUpvotedGift(gift.upvotedBy) ? 'brand' : 'dark-5'} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default GiftsList;
