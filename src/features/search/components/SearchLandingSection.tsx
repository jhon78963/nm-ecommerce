import { SearchLanding } from "@/features/search/components/SearchLanding";
import { getSearchModalData } from "@/features/search/services/search.service";

async function getSearchLandingData() {
  try {
    return await getSearchModalData({ perPage: 4 });
  } catch {
    return { products: [], collections: [], genders: [], query: "" };
  }
}

export async function SearchLandingSection() {
  const data = await getSearchLandingData();
  return <SearchLanding data={data} />;
}
