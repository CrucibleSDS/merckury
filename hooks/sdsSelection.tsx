import { ReactNode, createContext, useContext, useState } from "react";

type SdsSelectionsContextType = {
  sdsSelections: number[];
  addSdsSelections: (...sdsIds: number[]) => void;
  removeSdsSelections: (...sdsIds: number[]) => void;
  clearSdsSelections: () => void;
};

type SdsSelectionsProviderProps = {
  sdsSelections?: number[];
  children: ReactNode;
};

const SdsSelectionsContext = createContext<SdsSelectionsContextType>(undefined!);

export const SdsSelectionsProvider = (props: SdsSelectionsProviderProps) => {
  const [sdsSelections, setSdsSelections] = useState<number[]>(props.sdsSelections ?? []);

  const addSdsSelections = (...sdsIds: number[]) => {
    setSdsSelections((selections) => selections.concat(...sdsIds));
  };

  const removeSdsSelections = (...sdsIds: number[]) => {
    setSdsSelections((selections) =>
      selections.filter((selection) => !sdsIds.includes(selection))
    );
  };

  const clearSdsSelections = () => {
    setSdsSelections([]);
  };

  return (
    <SdsSelectionsContext.Provider
      value={{ sdsSelections, addSdsSelections, removeSdsSelections, clearSdsSelections }}
    >
      {props.children}
    </SdsSelectionsContext.Provider>
  );
};

export const useSdsSelections = () => useContext(SdsSelectionsContext);
