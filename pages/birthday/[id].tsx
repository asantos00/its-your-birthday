import {
  Main,
  Header,
  Text,
  Box,
  FormField,
  TextInput,
  Button,
} from "grommet"
import useSWR from 'swr';
import { ShareOption, Add } from 'grommet-icons';
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import copy from 'copy-to-clipboard';
import GiftsList, { GiftsWithUpvotes } from "../../components/GiftsList";
import ContributorsList from "../../components/ContributorsList";
import { Birthday, Contributor, Gift } from '@prisma/client'

const MOCKED_OWN_COLLABORATOR_ID = 1;


const initialNewGift = { description: '', author: 'a.santos@kigroup.de', url: '' }

interface BirthdayWithContributorsAndGifts extends Birthday {
  contributors?: Contributor[],
  gifts?: GiftsWithUpvotes[]
}

const GiftPage = () => {
  const contributorsListRef = useRef<HTMLElement>(null);
  const { query } = useRouter();
  const { data: birthday, isValidating: isLoading, mutate } = useSWR<BirthdayWithContributorsAndGifts>(() => query.id ? `/api/birthdays/${query.id}` : null);
  const [copied, setCopied] = useState(false);
  const [newGift, setNewGift] = useState(initialNewGift)
  const [myName, setMyName] = useState('')

  const onChangeContributors = async (contributor: Contributor) => {
    await fetch(`/api/birthdays/${birthday?.id}/contributors/${contributor.id}/hasPaid`, {
      method: 'PATCH',
      body: JSON.stringify({ hasPaid: contributor.hasPaid }),
      headers: {
        'content-type': "application/json"
      }
    }).then(r => r.json())
      .then(contributor => {
        mutate({
          ...birthday,
          contributors: birthday.contributors.map(c => {
            return c.id === contributor.id ? contributor : c;
          })
        })
      })
  }
  const onChangeGifts = async (gift) => {
    await fetch(`/api/birthdays/${birthday?.id}/gifts`, {
      method: 'PATCH',
      body: JSON.stringify(gift),
      headers: {
        'content-type': "application/json"
      }
    })

    mutate({ ...birthday, gifts: birthday.gifts.concat(gift) })
  }

  const onAddMyName = async () => {
    fetch(`/api/birthdays/${birthday.id}/contributors`, {
      method: 'POST',
      body: JSON.stringify({ name: myName }),
      headers: {
        'content-type': "application/json"
      }
    }).then(r => r.json())
      .then(contributor => {
        setMyName('');
        mutate({
          ...birthday,
          contributors: birthday.contributors.concat(contributor)
        })
        contributorsListRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })
      })
  }

  const onUpvoteChange = async (gift: Gift, isUpvoted) => {
    fetch(`/api/birthdays/${birthday.id}/gifts/${gift.id}/upvotedBy`, {
      method: 'PATCH',
      body: JSON.stringify({ contributorId: MOCKED_OWN_COLLABORATOR_ID, isUpvoted }),
      headers: {
        'content-type': "application/json"
      }
    }).then(r => r.json())
      .then(gift => {
        mutate({
          ...birthday,
          gifts: birthday.gifts.map(g => g.id === gift.id
            ? { ...g, ...gift }
            : g
          )
        })
      })
  }

  if (!birthday) {
    return <Text size="large" margin="medium">Loading...</Text>
  }

  return (
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
        <Text weight="bold">Happy birthday to {birthday?.person}!</Text>
        <ShareOption onClick={() => {
          copy(window.location.href)
          setCopied(true);
          setTimeout(() => setCopied(false), 2000)
        }} />
      </Box>
      <Box color="white" pad={{ top: "medium", horizontal: "large", bottom: "large" }}>
        <FormField label="What is it?">
          <TextInput placeholder="Insert name of the item" onChange={e => setNewGift({ ...newGift, description: e.target.value })} value={newGift.description} />
        </FormField>
        <FormField label="I have a gift idea">
          <TextInput placeholder="Insert gift link" onChange={e => setNewGift({ ...newGift, url: e.target.value })} value={newGift.url} />
        </FormField>
        <Button margin={{ top: "small" }} onClick={() => {
          onChangeGifts(newGift);
          setNewGift(initialNewGift);
        }}>
          Add
        </Button>
      </Box>
      <GiftsList
        gifts={birthday?.gifts}
        onUpvoteChange={onUpvoteChange}
        collaboratorId={MOCKED_OWN_COLLABORATOR_ID}
      />
      <ContributorsList listRef={contributorsListRef} contributors={birthday?.contributors} onChange={onChangeContributors} />
      <Box style={{ zIndex: 0 }}>
        <Box
          direction="row"
          flex="grow"
          justify="between"
          align="end"
          background="white"
          style={{
            position: 'fixed',
            bottom: 0,
            width: '100%'
          }} pad="medium"
          elevation="reverse" >
          <Box flex="grow" margin={{ right: "medium" }}>
            <FormField label="Add your name to the list" margin={{ bottom: "0" }}>
              <TextInput placeholder="Insert name of the item" value={myName} onChange={e => setMyName(e.target.value)} />
            </FormField>
          </Box>
          <Button style={{ height: 48, width: 48, padding: 0 }} size="small" icon={<Add size="medium" />} onClick={onAddMyName} />
        </Box>
      </Box>
    </Main >
  )
}

export default GiftPage;
