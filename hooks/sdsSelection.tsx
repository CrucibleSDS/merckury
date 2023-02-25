import { useEffect } from "react";
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
  const [toClear, setToClear] = useState(false);

  useEffect(() => {
    const cart = localStorage?.getItem("cart");

    if (cart !== null) {
      setSdsSelections(JSON.parse(cart));
    }
  }, []);

  useEffect(() => {
    if (sdsSelections.length > 0 || (sdsSelections.length === 0 && toClear)) {
      localStorage.setItem("cart", JSON.stringify(sdsSelections));
      setToClear(false);
    }
  }, [sdsSelections]);

  const addSdsSelections = (...sdsIds: number[]) => {
    setSdsSelections((selections) => selections.concat(...sdsIds));
  };

  const removeSdsSelections = (...sdsIds: number[]) => {
    setToClear(true);
    setSdsSelections((selections) =>
      selections.filter((selection) => !sdsIds.includes(selection))
    );
  };

  const clearSdsSelections = () => {
    setToClear(true);
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
