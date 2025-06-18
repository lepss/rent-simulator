import * as React from "react";

import { cn } from "@/lib/utils";
interface InputProps extends React.ComponentProps<"input"> {
  unit?: string;
}
function Input({ className, type, unit, readOnly, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        readOnly={readOnly}
        className={cn(
          // Base styles
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm print:bg-white print:border-none print:shadow-none print:text-xl",

          // Focus ring
          !readOnly &&
            "shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",

          // Validation styles
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

          // Unit padding
          unit ? "pr-10" : "",

          // Readonly style override
          readOnly &&
            "bg-muted shadow-none ring-0 focus:ring-0 focus:outline-none",

          // Custom className prop
          className
        )}
        {...props}
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          {unit}
        </span>
      )}
    </div>
  );
}

export { Input };
