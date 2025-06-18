import { formatNumber, unformatNumber } from "@/lib/utils";
import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  disabled?: boolean;
  unit?: string;
  error?: string;
  value: number | string;
  className?: string;
}

export const Field = ({
  label,
  id,
  disabled,
  unit,
  error,
  value,
  onChange,
  className,
  ...rest
}: FieldProps) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const formatted = formatNumber(value);
      setDisplayValue(formatted);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = unformatNumber(e.target.value);
    setDisplayValue(formatNumber(raw));
    onChange?.({
      ...e,
      target: {
        ...e.target,
        value: raw,
      },
    });
  };

  return (
    <div className={clsx(className, "w-full flex flex-col gap-1")}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        unit={unit}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={`${id}-error`}
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        {...rest}
      />
      <p
        id={`${id}-error`}
        className={`text-sm h-4 transition-all ${
          error ? "text-red-500" : "text-transparent"
        }`}
      >
        {error || ""}
      </p>
    </div>
  );
};
