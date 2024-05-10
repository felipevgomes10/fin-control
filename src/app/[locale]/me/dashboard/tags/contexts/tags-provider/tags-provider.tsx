"use client";

import { createContext, useContext, useOptimistic } from "react";

export type FormattedTag = {
  id: string;
  label: string;
  createdAt: string;
  pending?: boolean;
};

type TagsContextType = {
  optimisticTags: FormattedTag[];
  setOptimisticTags: (action: OptimisticTagsReducerParams) => void;
};

type TagsContextProps = {
  children: React.ReactNode;
  initialData: FormattedTag[];
};

type OptimisticTagsReducerParams =
  | {
      action: "add";
      payload: FormattedTag;
    }
  | {
      action: "update";
      payload: FormattedTag;
    }
  | {
      action: "delete";
      payload: { id: string };
    };

const TagsContext = createContext<TagsContextType>({
  optimisticTags: [],
  setOptimisticTags: () => {},
});

function optimisticTagsReducer(
  state: FormattedTag[],
  { action, payload }: OptimisticTagsReducerParams
) {
  switch (action) {
    case "add":
      return [...state, payload];
    case "update":
      return state.map((tag) => {
        return tag.id === payload.id ? payload : tag;
      });
    case "delete":
      return state.filter((tag) => tag.id !== payload.id);
    default:
      return state;
  }
}

export function TagsProvider({ children, initialData }: TagsContextProps) {
  const [optimisticTags, setOptimisticTags] = useOptimistic<
    FormattedTag[],
    OptimisticTagsReducerParams
  >(initialData || [], optimisticTagsReducer);

  return (
    <TagsContext.Provider
      value={{
        optimisticTags,
        setOptimisticTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
}

export function useTagsContext() {
  const context = useContext(TagsContext);
  return context;
}
