import { useMemo, useState } from "react";
import Cookies from "universal-cookie";

const useContributorIdFromCookie = (birthdayId: string): [number | undefined, (contributorId?: number) => void] => {
  let cookieSource = {};
  if (process.browser) {
    cookieSource = document.cookie;
  }
  const cookiesValue = useMemo(() => new Cookies(cookieSource), [birthdayId]);

  const fromCookie = cookiesValue.get(`birthday-${birthdayId}`);

  const [myContributorId, setMyContributorId] = useState<number | undefined>(
    fromCookie ? parseInt(fromCookie.contributorId, 10) : undefined
  );

  const setStateAndCookie = (contributorId?: number) => {
    setMyContributorId(contributorId);
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const saveToCookie = JSON.stringify({ contributorId });
    cookiesValue.set(`birthday-${birthdayId}`, saveToCookie, {
      expires: date,
      path: '/'
    })
  }

  return [myContributorId, setStateAndCookie];
}

export default useContributorIdFromCookie;
