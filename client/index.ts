import { Contributor, Gift } from "@prisma/client";
import { GiftToCreate } from "../pages/birthday/[id]";

const logError = console.error;

type WithToken = { token?: string };

const fetchWithToken = (url: string, options: RequestInit & WithToken) => {
  return fetch(url, {
    ...options,
    headers: new Headers({
      ...options.headers,
      "authorization": `Bearer ${options.token}`,
      "content-type": "application/json",
    }),
  }).then((r) => r.json());
};

// To be used with useSwr
export const authenticatedFetcher = (
  url: string,
  token: WithToken["token"],
): Promise<any> => fetchWithToken(url, { token });

/**
 * Updates hasPaid flag on contributor
 *
 * @param birthdayId \
 * @param contributor
 * @param token
 */
export const updateContributorHasPaid = (
  birthdayId: string,
  hasPaid: boolean,
  token: WithToken["token"],
) => {
  return fetchWithToken(
    `/api/birthdays/${birthdayId}/paid`,
    {
      method: "PATCH",
      body: JSON.stringify({
        hasPaid,
      }),
      token,
    },
  );
};

/**
 * Adds gift to birthday
 *
 * @param birthdayId
 * @param gift
 * @param token
 */
export const addGift = (
  birthdayId: string,
  gift: GiftToCreate,
  token: WithToken["token"],
) => {
  return fetchWithToken(`/api/birthdays/${birthdayId}/gifts`, {
    method: "PATCH",
    body: JSON.stringify(gift),
    token,
  });
};

/**
 * Adds contributor to birthday
 *
 * @param birthdayId
 * @param name
 * @param token
 */
export const addContributor = (
  birthdayId: string,
  email: string,
  token: string,
) => {
  return fetchWithToken(`/api/birthdays/${birthdayId}/contributors`, {
    method: "PATCH",
    body: JSON.stringify({ email }),
    token,
  });
};

/**
 * Deletes contributor from birthday
 *
 * @param contributorId
 * @param token
 */
export const deleteContributorFromBirthday = (
  birthdayId: string,
  contributorEmail: string,
  token: WithToken["token"],
) => {
  return fetchWithToken(
    `/api/birthdays/${birthdayId}/contributors`,
    {
      method: "DELETE",
      token,
    },
  );
};

/**
 * Deletes gift from birthday
 *
 * @param giftId
 * @param token
 */
export const deleteGift = (giftId: number, token: WithToken["token"]) => {
  return fetchWithToken(`/api/gifts/${giftId}`, {
    method: "DELETE",
    token,
  });
};

export const updateGiftUpvotedBy = (
  birthdayId: string,
  giftId: number,
  isUpvoted: boolean,
  token: WithToken["token"],
) => {
  return fetchWithToken(
    `/api/birthdays/${birthdayId}/gifts/${giftId}/upvotedBy`,
    {
      method: "PATCH",
      body: JSON.stringify({ isUpvoted }),
      token,
    },
  );
};
