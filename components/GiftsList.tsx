import { Box, Header, Anchor, Text } from "grommet";
import { Like, Dislike } from "grommet-icons";
import { Gift, FindManyGiftArgs, GiftSelect } from "@prisma/client";

const GiftsList = ({ gifts, myLikes, myDislikes, onLike, onDislike }: {
  gifts: Gift[],
  myLikes: any,
  myDislikes: any,
  onLike: (like) => void
  onDislike: (like) => void
}) => {
  if (!gifts?.length) {
    return null;
  }

  return (
    <Box>
      <Header background="dark-5" pad={{ horizontal: "large", vertical: "medium" }}>
        <Text color="dark-1">Gifts suggested</Text>
        <Text color="dark-1">Votes</Text>
      </Header>
      <Box pad="large">
        {gifts.map(gift => (
          <Box key={gift.description} direction="row" margin={{ vertical: "small" }} fill="horizontal" flex="shrink">
            <Box basis="70%" flex="grow">
              <Anchor target="_blank" href={gift.url}><Text>{gift.description}</Text></Anchor>
            </Box>
            <Box basis="5%" margin={{ horizontal: "medium" }}>
              <Like onClick={() => onLike(gift)} color={myLikes.includes(gift.url) ? "brand" : "dark-5"} />
            </Box>
            <Box basis="5%" margin={{ horizontal: "medium" }}>
              <Dislike onClick={() => onDislike(gift)} color={myDislikes.includes(gift.url) ? "brand" : "dark-5"} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default GiftsList;
