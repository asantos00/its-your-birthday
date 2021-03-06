import { Box, Header, Anchor, Text } from "grommet";
import { Like, CloudUpload, Clear, Trash } from "grommet-icons";
import { Gift, Contributor } from "@prisma/client";

export interface GiftWithUpvotes extends Gift {
  upvotedBy: Contributor[],
  suggestor?: Contributor
}

const GiftsList = ({ gifts, onDelete, userEmail, onUpvoteChange }: {
  gifts?: GiftWithUpvotes[],
  userEmail?: string,
  onUpvoteChange: (gift: GiftWithUpvotes, isUpvoted: boolean) => void
  onDelete: (gift: GiftWithUpvotes) => void
}) => {
  if (!gifts?.length) {
    return null;
  }

  const collaboratorUpvotedGift = (upvotedBy: Contributor[]) => {
    return upvotedBy?.some(c => c.email === userEmail)
  }

  return (
    <Box>
      <Header background="dark-5" pad={{ horizontal: "large", vertical: "medium" }}>
        <Text color="dark-1">Gifts suggested</Text>
        <Text color="dark-1">Votes</Text>
      </Header>
      <Box pad="large">
        {gifts.map((gift) => {
          const canUpvote = userEmail && gift.id;
          const isLoading = !gift.id;
          const isOwner = gift.suggestor?.email === userEmail;
          return (
            <Box key={gift.id || "creating"} direction="row" margin={{ vertical: "small" }} fill="horizontal" flex="shrink">
              <Box basis="50%" flex="grow">
                <Anchor target="_blank" href={gift.url}><Text>{gift.description}</Text></Anchor>
              </Box>
              {isOwner ? (
                <Box basis="5%" margin={{ horizontal: "medium" }} justify="center">
                  <Trash data-testid={`delete-${gift.description}`} color="dark-4" onClick={() => onDelete(gift)} />
                </Box>
              ) : null}
              <Text data-testid={`count-${gift.description}`}>({gift.upvotedBy?.length})</Text>
              <Box basis="5%" margin={{ horizontal: "medium" }} justify="center">
                {canUpvote ? (
                  <Like
                    data-testid={`upvote-${gift.description}`}
                    onClick={() => onUpvoteChange(gift, !collaboratorUpvotedGift(gift.upvotedBy))}
                    color={collaboratorUpvotedGift(gift.upvotedBy) ? 'brand' : 'dark-4'} />
                ) : isLoading ? (
                  <CloudUpload color="dark-4" style={{ cursor: 'not-allowed' }} />
                ) : (
                      <Clear color="dark-4" style={{ cursor: 'not-allowed' }} />
                    )}
              </Box>
            </Box>
          )
        })}
        {!userEmail && (<Text color="dark-4" margin={{ top: "medium" }} size="xsmall">
          You need to add your name to the contributors list to upvote
        </Text>)}
      </Box>
    </Box>
  )
}

export default GiftsList;
