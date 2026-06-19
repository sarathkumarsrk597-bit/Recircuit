import { ListingsClient } from "./ListingsClient";

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";

  return <ListingsClient initialSearch={q} initialCategory={category} />;
}
