import { siteConfig } from "@/config/site"

export interface PlaceRating {
  rating: number;
  reviewCount: number;
  url: string;
}

const DAY_IN_SECONDS = 60 * 60 * 24;

// Server-only: reads GOOGLE_PLACES_API_KEY. Falls back to the configured
// demo values when the key is missing or the request fails, so the badge
// never blocks the build or shifts layout on load.
export async function getPlaceRating(): Promise<PlaceRating> {
  const fallback: PlaceRating = {
    rating: siteConfig.place.fallbackRating,
    reviewCount: siteConfig.place.fallbackReviewCount,
    url: siteConfig.place.reviewsUrl,
  };

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return fallback;

  try {
    const params = new URLSearchParams({
      place_id: siteConfig.place.id,
      fields: "rating,user_ratings_total,url",
      key: apiKey,
    });

    const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params}`, {
      next: { revalidate: DAY_IN_SECONDS },
    });
    const data = await res.json();

    if (data.status !== "OK" || typeof data.result?.rating !== "number") {
      return fallback;
    }

    return {
      rating: data.result.rating,
      reviewCount: data.result.user_ratings_total ?? fallback.reviewCount,
      url: data.result.url || fallback.url,
    };
  } catch {
    return fallback;
  }
}
