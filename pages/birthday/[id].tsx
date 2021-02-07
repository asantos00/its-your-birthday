import { useState, useRef, useEffect, useMemo } from "react";
import Head from 'next/head'
import {
  Main,
  Text,
  Box,
  FormField,
  TextInput,
  Button,
  Collapsible,
  Anchor,
} from "grommet"
import { ShareOption } from 'grommet-icons';
import useSWR from 'swr';
import { useRouter } from "next/router";
import copy from 'copy-to-clipboard';
import { Birthday, Contributor, PrismaClient } from '@prisma/client'

import GiftsList, { GiftWithUpvotes } from "../../components/GiftsList";
import ContributorsList from "../../components/ContributorsList";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import * as Client from '../../client';
import Link from 'next/link';
import { useAuthentication } from "../../hooks/useAuthentication";

export type GiftToCreate = Omit<GiftWithUpvotes, "authorId" | "id" | "birthdayId">;
const initialNewGift: GiftToCreate = {
  description: '', url: '', upvotedBy: [], authorEmail: ''
}

interface BirthdayWithContributorsAndGifts extends Birthday {
  contributors?: Contributor[],
  gifts?: GiftWithUpvotes[],
  paidBy?: Contributor[],
}

const Loading = () => (
  <Box width="100%" height="100%" align="center" justify="center">
    <Text size="large" margin="medium">Loading...</Text>
  </Box>
)

const GiftPage = ({
  initialBirthday
}: {
  initialBirthday: any
}) => {
  const { user, token } = useAuthentication();
  const { query } = useRouter();
  const { data: birthday, error, mutate, revalidate } = useSWR<BirthdayWithContributorsAndGifts>(
    token ? [`/api/birthdays/${query.id}`, token] : null,
    { initialData: initialBirthday, revalidateOnMount: true, fetcher: Client.authenticatedFetcher }
  );
  const contributorsListRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [newGift, setNewGift] = useState(initialNewGift)
  const [isGiftAddPanelOpen, setIsGiftAddPanelOpen] = useState(birthday?.gifts?.length === 0);
  const userOnList = useMemo(() => birthday?.contributors?.some(contributor => {
    return contributor.email === user?.email
  }), [birthday, user]);

  if (error) {
    return (
      <Box width="100%" height="100%" align="center" justify="center">
        <Text size="large" margin="medium">
          {error?.message?.toString()}
        </Text>
        <Anchor href={window.location.href}>
          Refresh
        </Anchor>
        <Link href="/">
          <Anchor>
            Back to home
          </Anchor>
        </Link>
      </Box>
    )
  }

  if (!birthday) {
    return <Loading />
  }

  const onChangeContributors = ({ hasPaid }: { hasPaid: boolean }) => {
    Client.updateContributorHasPaid(birthday.id, hasPaid, token).then(revalidate)

    if (!hasPaid) {
      mutate({
        ...birthday,
        paidBy: birthday.paidBy?.filter(userPaid => {
          return userPaid.email !== user.email
        })
      }, false)

      return;
    }

    mutate({
      ...birthday,
      paidBy: birthday.paidBy?.concat({ email: user.email, name: user.name, createdAt: new Date() })
    }, false)
  }
  const onChangeGifts = (gift: GiftToCreate) => {
    //@ts-ignore
    mutate({ ...birthday, gifts: birthday.gifts?.concat(gift) }, false)

    setIsGiftAddPanelOpen(false);
    Client.addGift(birthday.id, gift, token).then(revalidate);
  }
  const onAddName = async (email: string) => {
    await Client.addContributor(birthday.id, email, token);
    await revalidate()
    contributorsListRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    })
  }
  const onUpvoteChange = (gift: GiftWithUpvotes, isUpvoted: boolean) => {
    mutate({
      ...birthday,
      gifts: birthday.gifts?.map(g => g.id === gift.id
        ? {
          ...g, upvotedBy: isUpvoted
            ? gift.upvotedBy.concat({ email: user.email, name: user.email, createdAt: new Date() } || [])
            : gift.upvotedBy.filter(userUpvoted => userUpvoted.email !== user.email)
        }
        : g
      )
    }, false);

    Client.updateGiftUpvotedBy(birthday.id, gift.id, isUpvoted, token).then(revalidate)
  }

  const onDeleteGift = async (gift: GiftWithUpvotes) => {
    const isSure = window.confirm(`Are you sure you want to delete ${gift.description}?`);
    if (!isSure) {
      return;
    }

    mutate({
      ...birthday,
      gifts: birthday.gifts?.filter(g => {
        return g.id !== gift.id
      })
    }, false)

    await Client.deleteGift(gift.id, token).then(revalidate);
  }

  const onDeleteContributor = async (contributor: Contributor) => {
    const isSure = window.confirm(`Are you sure you want to delete ${contributor.name}?`);
    if (!isSure) {
      return;
    }

    mutate({
      ...birthday,
      contributors: birthday.contributors?.filter(c => {
        return c.email !== contributor.email
      })
    }, false)

    await Client.deleteContributorFromBirthday(birthday.id, contributor.email, token).then(revalidate);
  }

  const onShareClick = () => {
    copy(window.location.href)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
  }
  const onAddGiftClick = () => {
    onChangeGifts(newGift);
    setNewGift(initialNewGift);
  }

  return (
    <AuthenticatedRoute>
      <Head>
        <title>{birthday.person} birthday's gift - It's your birthday</title>
        <meta name="title" content={`${birthday.person} birthday's gift - It's your birthday`} />
        <meta name="description" content="Help choosing ${birthday.person}'s birthday gift at its-your-birthday.com" />
      </Head>
      <Main pad={{ bottom: "100px" }}>
        <Box
          animation={"slideDown"}
          pad="small"
          background="accent-1"
          style={{ width: '100%', position: 'absolute', top: 0, display: copied ? "block" : "none" }}
        >
          <Text color="white">Link copied to clipboard!</Text>
        </Box>
        <Box
          color="white" style={{ position: 'relative' }}
          margin={{ top: "medium" }}
          pad={{ vertical: "medium", horizontal: "large" }}
          direction="row"
          justify="between"
        >
          <Text weight="bold">It's {birthday?.person}'s birthday !</Text>
          <ShareOption onClick={onShareClick} />
        </Box>
        <Box color="white" pad={{ top: "medium", horizontal: "large", bottom: "large" }}>
          <Button onClick={() => setIsGiftAddPanelOpen(!isGiftAddPanelOpen)}>I have a gift idea</Button>
        </Box>
        <Collapsible open={isGiftAddPanelOpen}>
          <Box color="white" pad={{ top: "medium", horizontal: "large", bottom: "large" }}>
            <FormField label="I have a gift idea">
              <TextInput
                placeholder="Name of the item"
                onChange={e => setNewGift({ ...newGift, description: e.target.value })}
                value={newGift.description} />
            </FormField>
            <FormField label="URL">
              <TextInput
                placeholder="Link to the item"
                onChange={e => setNewGift({ ...newGift, url: e.target.value })} value={newGift.url} />
            </FormField>
            <Button data-testid="add-gift" margin={{ top: "small" }} onClick={onAddGiftClick}>Add</Button>
          </Box>
        </Collapsible>
        <GiftsList
          gifts={birthday?.gifts}
          onUpvoteChange={onUpvoteChange}
          onDelete={onDeleteGift}
          userEmail={user?.email}
        />
        <ContributorsList
          userEmail={user?.email}
          paidBy={birthday.paidBy}
          listRef={contributorsListRef} contributors={birthday?.contributors}
          onDelete={onDeleteContributor}
          onChange={onChangeContributors} />
        {!userOnList ? (
          <Button color="accent-1" size="medium" margin={{ horizontal: 'small' }} onClick={() => onAddName(user?.email)}>
            Add me to the list
          </Button>
        ) : null}
      </Main >
    </AuthenticatedRoute>
  )
}

// Sends next the possible paths for build time build
export async function getStaticPaths() {
  const prisma = new PrismaClient();
  const birthdays = await prisma.birthday.findMany()
  await prisma.disconnect();
  return {
    paths: birthdays.map(b => ({
      params: {
        id: b.id
      }
    })),
    fallback: true
  };
}

// Allows next to pre build pages on build time
export async function getStaticProps({ params }: any) {
  const prisma = new PrismaClient();
  const birthday = await prisma.birthday.findOne({
    where: { id: params.id }
  });
  await prisma.disconnect();
  return {
    props: {
      initialBirthday: JSON.parse(JSON.stringify(birthday))
    }
  }
}

export default GiftPage;
