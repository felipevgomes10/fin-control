"use client";

import { joinTags } from "@/app/[locale]/me/components/table/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  id?: string;
  name: string;
  options: ComboboxOption[];
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
} & (
  | {
      value?: undefined;
      onChange?: (value: ComboboxOption[]) => void;
    }
  | {
      value: ComboboxOption[];
      onChange: (values: ComboboxOption[]) => void;
    }
);

export function Combobox({
  id,
  name,
  value: controlledValue,
  onChange,
  options,
  selectPlaceholder = "Select an item...",
  searchPlaceholder = "Search...",
  notFoundPlaceholder = "No item found.",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<ComboboxOption[]>(
    []
  );

  const filterItems = (
    option: ComboboxOption,
    currentValue: ComboboxOption[]
  ) => {
    const index = currentValue.findIndex((item) => item.value === option.value);
    if (index === -1) return [...currentValue, option];
    return currentValue.filter((item) => item.value !== option.value);
  };

  const onControlledChange = (option: ComboboxOption) => {
    const newValue = filterItems(option, controlledValue || []);
    onChange?.(newValue);
  };

  const onUncontrolledChange = (option: ComboboxOption) => {
    setUncontrolledValue((state) => filterItems(option, state));
  };

  const value = controlledValue || uncontrolledValue || [];
  const setValue = controlledValue ? onControlledChange : onUncontrolledChange;

  const mountPreview = (selectedOptions: ComboboxOption[]) => {
    const selectedValues = selectedOptions.map((option) => option.label);
    const hasMoreThanThree = selectedValues.length > 3;
    const additionalValuesText = hasMoreThanThree
      ? ` +${selectedValues.length - 3}`
      : "";

    return joinTags(selectedValues.slice(0, 3)) + additionalValuesText;
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            type="button"
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length ? mountPreview(value) : selectPlaceholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto sm:w-[375px] p-0">
          <Command
            filter={(_, search) => {
              const foundItem = options.find((option) => {
                return option.label
                  .toLowerCase()
                  .startsWith(search.toLowerCase());
              });
              if (!!foundItem) return 1;
              return 0;
            }}
          >
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{notFoundPlaceholder}</CommandEmpty>
              <ScrollArea className="h-52">
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => setValue(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.find((i) => i.value === option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        type="hidden"
        name={name}
        value={joinTags((value || []).map((item) => item.value))}
      />
    </>
  );
}
