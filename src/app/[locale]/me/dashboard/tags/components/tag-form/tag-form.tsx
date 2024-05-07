"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDictionary } from "@/i18n/contexts/dictionary-provider/dictionary-provider";

export function TagForm({
  action,
  submitText,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  submitText: string;
  defaultValues?: {
    label?: string;
  };
}) {
  const dictionary = useDictionary();
  const { label = "" } = defaultValues || {};

  return (
    <form className="flex flex-col gap-4" action={action}>
      <div className="flex flex-col gap-4">
        <Label htmlFor="label">{dictionary.tags.labelInput}</Label>
        <Input
          name="label"
          id="label"
          required
          defaultValue={label}
          placeholder={dictionary.tags.labelInput}
        />
      </div>
      <Button type="submit" className="w-full sm:w-[150px] self-end">
        {submitText}
      </Button>
    </form>
  );
}
