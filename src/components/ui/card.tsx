import clsx from "clsx";

interface CardProps {
  label: string;
  className?: string;
  unit: string;
  value: number | string;
}

export const Card = ({ label, className, value, unit }: CardProps) => {
  return (
    <div
      className={clsx(
        className,
        " flex flex-col gap-8 rounded-3xl p-4 justify-between w-full"
      )}
    >
      <span className="text-xl font-medium">{label}</span>
      <span className="text-3xl font-bold text-right">
        {value.toLocaleString("fr-FR")} {unit}
      </span>
    </div>
  );
};
