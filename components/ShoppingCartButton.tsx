import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useSdsSelections } from "@/hooks/sdsSelection";

const ShoppingCartButton = () => {
  const { sdsSelections } = useSdsSelections();

  return (
    <div className="fixed bottom-0 right-0 mx-8 my-6 text-2xl">
      <div className="relative">
        {sdsSelections.length > 0 ? (
          <div className="absolute top-0 left-0 bg-white p-2 rounded-full text-sm font-bold border border-merck-teal w-8 h-8 -mt-2 -ml-2">
            <div className="-mt-1 text-center">{sdsSelections.length}</div>
          </div>
        ) : null}
        <ShoppingCartIcon className="w-16 h-16 p-4 text-white bg-merck-teal rounded-full" />
      </div>
    </div>
  );
};

export default ShoppingCartButton;
