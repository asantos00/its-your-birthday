import { Contributor, Gift } from "@prisma/client"
import { GiftToCreate } from '../pages/birthday/[id]'

const logError = console.error;

export const updateContributorHasPaid = (birthdayId: string, contributor: Contributor) => {
  return fetch(`/api/birthdays/${birthdayId}/contributors/${contributor.id}/hasPaid`, {
    method: 'PATCH',
    body: JSON.stringify({ hasPaid: contributor.hasPaid }),
    headers: {
      'content-type': "application/json"
    }
  }).then(r => r.json())
}

export const addGift = (birthdayId: string, gift: GiftToCreate) => {
  return fetch(`/api/birthdays/${birthdayId}/gifts`, {
    method: 'PATCH',
    body: JSON.stringify(gift),
    headers: {
      'content-type': "application/json"
    }
  }).then(r => r.json())
}

export const addContributor = (birthdayId: string, name: string, token: string) => {
  return fetch(`/api/birthdays/${birthdayId}/contributors`, {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: {
      'content-type': "application/json",
      'authorization': `Bearer ${token}`
    }
  }).then(r => r.json())
}

export const deleteContributor = (contributorId: number) => {
  return fetch(`/api/contributors/${contributorId}`, {
    method: 'DELETE',
    headers: {
      'content-type': "application/json"
    }
  }).then(r => r.json())
}

export const deleteGift = (giftId: number) => {
  return fetch(`/api/gifts/${giftId}`, {
    method: 'DELETE',
    headers: {
      'content-type': "application/json"
    }
  }).then(r => r.json())
}

export const updateGiftUpvotedBy = (birthdayId: string, giftId: number, isUpvoted: boolean) => {
  return fetch(`/api/birthdays/${birthdayId}/gifts/${giftId}/upvotedBy`, {
    method: 'PATCH',
    body: JSON.stringify({ isUpvoted }),
    headers: {
      'content-type': "application/json"
    }
  }).then(r => r.json())
}
