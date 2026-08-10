import type { Metadata } from "next"
import { cookies } from "next/headers"
import MenuClient from "@/components/MenuClient"
import { getProducts } from "@/lib/product"
import { AGE_COOKIE } from "@/lib/age-gate"

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Menu",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: { kiosk?: string };
}) {
  const { products, descriptions, categories, failed } = await getProducts();

  // Reading the cookie makes this page render per request. The catalogue fetch
  // is still cached for a minute, so the sheet is not hit any harder — what
  // changes is that the age gate is decided before a byte of menu is sent.
  const ageVerified = cookies().get(AGE_COOKIE)?.value === "1";

  // Kiosk mode is an explicit URL, not a guess from screen size: the shop opens
  // /menu?kiosk=1 on its own tablet once, and a guest's phone never carries it.
  const kiosk = searchParams?.kiosk === "1";

  return (
    <main>
      <MenuClient
        initialProducts={products}
        initialDescriptions={descriptions}
        categories={categories}
        failed={failed}
        kiosk={kiosk}
        ageVerified={ageVerified}
      />
    </main>
  );
}
