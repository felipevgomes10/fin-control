import { getTags } from "@/actions/tags/get-tags";
import { getUserSettings } from "@/actions/user/get-user-settings";
import { getDictionary } from "@/i18n/get-dictionaries/get-dictionaries";
import { Suspense } from "react";
import { Loading } from "../../components/loading/loading";
import { TagsTable } from "./components/tags-table/tags-table";
import { TagsProvider } from "./contexts/tags-provider/tags-provider";

async function Content() {
  const [tags, userSettings] = await Promise.all([
    getTags(),
    getUserSettings(),
  ]);

  const data = tags?.map(({ id, label, createdAt }) => ({
    id,
    label,
    createdAt: createdAt.toUTCString(),
  }));

  return (
    <TagsProvider initialData={data}>
      <TagsTable userSettings={userSettings} />
    </TagsProvider>
  );
}

export default async function Tags({ params }: { params: { locale: string } }) {
  const dictionary = await getDictionary(params.locale);

  return (
    <section>
      <Suspense
        fallback={
          <Loading.TableSkeleton
            columns={[
              {
                accessorKey: "id",
                header: "id",
              },
              {
                accessorKey: "label",
                header: dictionary.table.label,
              },
              {
                accessorKey: "createdAt",
                header: dictionary.table.createdAt,
              },
            ]}
            rowsNumber={10}
          />
        }
      >
        <Content />
      </Suspense>
    </section>
  );
}
