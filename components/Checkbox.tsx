import React, { ComponentPropsWithRef, forwardRef } from "react";

import clsxm from "@/utils/clsxm";

type CheckboxProps = ComponentPropsWithRef<"input">;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...rest }, ref) => (
    <label
      className={clsxm(
        "group-option relative mr-2 -mt-1.5 block h-4 w-4 cursor-pointer select-none",
        className
      )}
    >
      <input
        className="peer absolute h-0 w-0 cursor-pointer opacity-0"
        ref={ref}
        type="checkbox"
        tabIndex={-1}
        {...rest}
      />
      <span
        className={clsxm(
          "group-option-hover:bg-pink-200 absolute left-0 top-0 h-6 w-6 rounded",
          "border-2 border-merck-teal bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200 ease-linear"
        )}
      />
      <span className="absolute top-[6px] left-1 hidden transition-colors duration-300 ease-linear peer-checked:block">
        <div className="-mt-0.5 ml-1 rotate-45 h-[13px] w-[7px] border-b-[3px] border-r-[3px] border-b-merck-teal border-r-merck-teal dark:border-b-white dark:border-r-white" />
      </span>
    </label>
  )
);

export default Checkbox;
