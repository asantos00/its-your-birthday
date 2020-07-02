import { useState, useRef, useEffect } from "react";
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
import AddPerson from "../../components/AddPerson";
import * as Client from '../../client';
import Link from 'next/link';
import useContributorIdFromCookie from "../../hooks/useContributorIdFromCookie";
import { useAuthentication } from "../../hooks/useAuthentication";

export type GiftToCreate = Omit<GiftWithUpvotes, "authorId" | "id" | "birthdayId">;
const initialNewGift: GiftToCreate = {
  description: '', url: '', upvotedBy: []
}

interface BirthdayWithContributorsAndGifts extends Birthday {
  contributors?: Contributor[],
  gifts?: GiftWithUpvotes[],
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
  const [myContributorId, setMyContributorId] = useContributorIdFromCookie(query.id as string);
  const { data: birthday, error, mutate, revalidate } = useSWR<BirthdayWithContributorsAndGifts>(
    `/api/birthdays/${query.id}`,
    { initialData: initialBirthday, revalidateOnMount: true }
  );
  const { data: myContributor } = useSWR<Contributor>(
    () => myContributorId ? `/api/contributors/${myContributorId}` : null,
    { focusThrottleInterval: 5 * 60 * 1000 }
  );
  const contributorsListRef = useRef<HTMLElement>(null);

  const [copied, setCopied] = useState(false);
  const [newGift, setNewGift] = useState(initialNewGift)
  const [isAddingAnotherPerson, setIsAddingAnotherPerson] = useState(false);
  const [name, setName] = useState('')
  const [isGiftAddPanelOpen, setIsGiftAddPanelOpen] = useState(birthday?.gifts?.length === 0);
  const showAddOtherPersonButton = !isAddingAnotherPerson;
  const showAddPersonBox = isAddingAnotherPerson;

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

  const onChangeContributors = (contributor: Contributor) => {
    mutate({
      ...birthday,
      contributors: birthday.contributors?.map(c => {
        return c.id === contributor.id ? contributor : c;
      })
    }, false)

    Client.updateContributorHasPaid(birthday.id, contributor).then(revalidate)
  }
  const onChangeGifts = (gift: GiftToCreate) => {
    //@ts-ignore
    mutate({ ...birthday, gifts: birthday.gifts?.concat(gift) }, false)

    setIsGiftAddPanelOpen(false);
    Client.addGift(birthday.id, gift).then(revalidate);
  }
  const onAddName = async (isAddingOtherPerson: boolean, name: string) => {
    const contributor = await Client.addContributor(birthday.id, name, token)
    await revalidate()
    setName('');
    setIsAddingAnotherPerson(false);
    if (!isAddingOtherPerson && !myContributor) {
      setMyContributorId(contributor.id)
    }
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
            ? gift.upvotedBy.concat(myContributor || [])
            : gift.upvotedBy.filter(c => c.id !== myContributor?.id)
        }
        : g
      )
    }, false);

    Client.updateGiftUpvotedBy(birthday.id, gift.id, isUpvoted).then(revalidate)
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

    await Client.deleteGift(gift.id).then(revalidate);
  }

  const onDeleteContributor = async (contributor: Contributor) => {
    const isSure = window.confirm(`Are you sure you want to delete ${contributor.name}?`);
    if (!isSure) {
      return;
    }

    mutate({
      ...birthday,
      contributors: birthday.contributors?.filter(c => {
        return c.id !== contributor.id
      })
    }, false)


    if (contributor.id === myContributorId) {
      setMyContributorId(undefined);
    }

    await Client.deleteContributor(contributor.id).then(revalidate);
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
            {!myContributorId ? (
              <Text size="small" color="dark-3" margin={{ top: "medium" }}>
                You need to add your name to suggest a gift
              </Text>
            ) : null}
            <Button data-testid="add-gift" disabled={!myContributorId} margin={{ top: "small" }} onClick={onAddGiftClick}>Add</Button>
          </Box>
        </Collapsible>
        <GiftsList
          gifts={birthday?.gifts}
          onUpvoteChange={onUpvoteChange}
          onDelete={onDeleteGift}
          collaboratorId={myContributorId}
        />
        <ContributorsList
          myContributorId={myContributorId}
          listRef={contributorsListRef} contributors={birthday?.contributors}
          onThisIsMe={(contributor) => setMyContributorId(contributor.id)}
          onDelete={onDeleteContributor}
          onChange={onChangeContributors} />
        {!myContributorId ? (
          <Button color="accent-1" size="medium" margin={{ horizontal: 'small' }} onClick={() => onAddName(false, user?.name)}>
            Add me to the list
          </Button>
        ) : null}
        {showAddOtherPersonButton ? (
          <Button
            margin="small"
            size="medium"
            onClick={() => setIsAddingAnotherPerson(true)}>
            Add another person
          </Button>
        ) : null}
        {showAddPersonBox ? (
          <AddPerson
            name={name}
            label={'Insert the name of the person'}
            onChange={setName}
            onSubmit={() => onAddName(isAddingAnotherPerson, name)} />
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
