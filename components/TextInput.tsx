import React, { ComponentPropsWithRef, forwardRef } from "react";

import clsxm from "@/utils/clsxm";

export type TextInputProps = ComponentPropsWithRef<"input">;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ className, ...rest }, ref) => (
  <input
    className={clsxm(
      "border-2 border-merck-teal px-1 text-sm leading-8 caret-merck-teal",
      "placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-merck-teal",
      className
    )}
    ref={ref}
    type="text"
    {...rest}
  />
));

export default TextInput;
