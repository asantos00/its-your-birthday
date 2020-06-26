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
import { useState } from "react";
import { useRouter } from "next/router";
import copy from 'copy-to-clipboard';
import GiftsList from "../../components/GiftsList";
import ContributorsList from "../../components/ContributorsList";
import { PrismaClient } from '@prisma/client'

const initialGifts = [
  // { author: 'a.santos@kigroup.de', title: 'cenas', votes: 5, link: 'https://www.amazon.es/Havaianas-Chanclas-Unisex-Adulto-Brazilian/dp/B07F14Q8GW/ref=sr_1_2_sspa?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=havaianas&qid=1590576032&rnid=1571263031&s=shoes&sr=1-2-spons&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFGQjM1M0U3N1o3VTUmZW5jcnlwdGVkSWQ9QTA5OTAyMzMyTFNJVUFJQlBNT1kyJmVuY3J5cHRlZEFkSWQ9QTA5MTY5NzQxOUJLMzk2QTlHMzI0JndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ&th=1&psc=1' },
  // { author: 'a.santos@kigroup.de', title: 'segunda cena', votes: 5, link: 'https://www.amazon.es/Havaianas-Chanclas-Unisex-Adulto-Brazilian/dp/B07F14Q8GW/ref=sr_1_2_sspa?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=havaianas&qid=1590576032&rnid=1571263031&s=shoes&sr=1-2-spons&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFGQjM1M0U3N1o3VTUmZW5jcnlwdGVkSWQ9QTA5OTAyMzMyTFNJVUFJQlBNT1kyJmVuY3J5cHRlZEFkSWQ9QTA5MTY5NzQxOUJLMzk2QTlHMzI0JndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ&th=1&psc=1casca' }
]

const myLikes = [
  'https://www.amazon.es/Havaianas-Chanclas-Unisex-Adulto-Brazilian/dp/B07F14Q8GW/ref=sr_1_2_sspa?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=havaianas&qid=1590576032&rnid=1571263031&s=shoes&sr=1-2-spons&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFGQjM1M0U3N1o3VTUmZW5jcnlwdGVkSWQ9QTA5OTAyMzMyTFNJVUFJQlBNT1kyJmVuY3J5cHRlZEFkSWQ9QTA5MTY5NzQxOUJLMzk2QTlHMzI0JndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ&th=1&psc=1'
]

const myDislikes = [
]

const initialContributors = [
  {
    name: 'Alexandre Santos',
    hasContributed: true,
  },
  {
    name: 'Felipe Schmitt',
    hasContributed: false,
  },
  {
    name: 'Gonçalito',
    hasContributed: false,
  }
]

const initialNewGift = { title: '', author: 'a.santos@kigroup.de', link: '' }


const GiftPage = () => {
  const router = useRouter();
  const { data, error } = useSWR(`/api/birthdays/${router.query.id}`);
  const [copied, setCopied] = useState(false);
  const [contributors, setContributors] = useState(initialContributors);
  const [gifts, setGifts] = useState(initialGifts);
  const [newGift, setNewGift] = useState(initialNewGift)
  const [likes, setLikes] = useState(myLikes);
  const [dislikes, setDislikes] = useState(myDislikes);

  console.log(data);

  return (
    <Main pad={{ bottom: "100px" }} overflow="scroll">
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
        <Text weight="bold">Happy birthday to {router.query.id}!</Text>
        <ShareOption onClick={() => {
          copy(window.location.href)
          setCopied(true);
          setTimeout(() => setCopied(false), 2000)
        }} />
      </Box>
      <Box color="white" pad={{ top: "medium", horizontal: "large", bottom: "large" }}>
        <FormField label="What is it?">
          <TextInput placeholder="Insert name of the item" onChange={e => setNewGift({ ...newGift, title: e.target.value })} value={newGift.title} />
        </FormField>
        <FormField label="I have a gift idea">
          <TextInput placeholder="Insert gift link" onChange={e => setNewGift({ ...newGift, link: e.target.value })} value={newGift.link} />
        </FormField>
        <Button margin={{ top: "small" }} onClick={() => {
          setGifts(gifts.concat(newGift));
          setNewGift(initialNewGift);
        }}>
          Add
        </Button>
      </Box>
      <GiftsList
        gifts={gifts}
        onLike={(gift) => setLikes(likes.concat(gift.link))}
        onDislike={(gift) => setDislikes(dislikes.concat(gift.link))}
        myDislikes={dislikes}
        myLikes={likes} />
      <ContributorsList contributors={contributors} onChange={(newContributors) => setContributors(newContributors)} />
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
              <TextInput placeholder="Insert name of the item" />
            </FormField>
          </Box>
          <Button style={{ height: 48, width: 48, padding: 0 }} size="small" icon={<Add size="medium" />} />
        </Box>
      </Box>
    </Main >
  )
}

export default GiftPage;
