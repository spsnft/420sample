import type { Metadata } from "next"
import MenuClient from "@/components/MenuClient"
import { getProducts } from "@/lib/product"

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Menu",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function MenuPage() {
  const { products, descriptions, categories } = await getProducts();

  return (
    <main>
      <MenuClient
        initialProducts={products}
        initialDescriptions={descriptions}
        categories={categories}
      />
    </main>
  );
}
