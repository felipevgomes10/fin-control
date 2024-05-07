"use client";

import { DataTable } from "@/app/[locale]/me/components/table/table";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";
import type { UserSettings } from "@prisma/client";
import { useTagsContext } from "../../contexts/tags-provider/tags-provider";
import { tagsColumns } from "../../table-config/tags-columns";
import { TagDialog } from "../tag-dialog/tag-dialog";

export function TagsTable({
  userSettings,
}: {
  userSettings: UserSettings | null;
}) {
  const dictionary = useDictionary();
  const { optimisticTags } = useTagsContext();

  return (
    <section>
      <DataTable
        columns={tagsColumns}
        data={optimisticTags}
        intl={{
          locale: userSettings?.locale,
          currency: userSettings?.currency,
        }}
        filters={{
          accessorKey: "label",
          placeholder: dictionary.tags.filter,
        }}
        actions={
          <div className="flex justify-end w-full mr-4">
            <TagDialog />
          </div>
        }
      />
    </section>
  );
}
