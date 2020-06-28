import { Contributor, Gift } from "@prisma/client"

export const updateContributorHasPaid = (birthdayId: number, contributor: Contributor) => {
  return fetch(`/api/birthdays/${birthdayId}/contributors/${contributor.id}/hasPaid`, {
    method: 'PATCH',
    body: JSON.stringify({ hasPaid: contributor.hasPaid }),
    headers: {
      'content-type': "application/json"
    }
  }).then(r => r.json())
}

export const addGift = (birthdayId: number, gift: Gift) => {
  return fetch(`/api/birthdays/${birthdayId}/gifts`, {
    method: 'PATCH',
    body: JSON.stringify(gift),
    headers: {
      'content-type': "application/json"
    }
  }).then(r => r.json())
}

export const addContributor = (birthdayId: number, name: string) => {
  return fetch(`/api/birthdays/${birthdayId}/contributors`, {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: {
      'content-type': "application/json"
    }
  }).then(r => r.json())
}

export const updateGiftUpvotedBy = (birthdayId: number, giftId: number, isUpvoted: boolean) => {
  return fetch(`/api/birthdays/${birthdayId}/gifts/${giftId}/upvotedBy`, {
    method: 'PATCH',
    body: JSON.stringify({ isUpvoted }),
    headers: {
      'content-type': "application/json"
    }
  }).then(r => r.json())
}
