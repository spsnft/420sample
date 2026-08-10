// The age check is recorded in a cookie rather than localStorage so the server
// knows about it before it renders. With localStorage the server cannot know,
// so every visit was rendered as unverified and the gate only appeared after
// hydration — meaning the catalogue was on screen, briefly but really, before
// anyone had confirmed their age.
export const AGE_COOKIE = "age_verified_20";

// Thirty days rather than forever: an unattended tablet in a shop should ask
// again eventually, and a claim made a year ago is not one worth trusting.
export const AGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function ageCookieValue(): string {
  return `${AGE_COOKIE}=1; path=/; max-age=${AGE_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}
