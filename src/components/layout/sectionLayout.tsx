import clsx from "clsx";
import { type ReactNode } from "react";
import { Separator } from "../ui/separator";

interface SectionLayoutProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export const SectionLayout = ({
  children,
  title,
  className,
}: SectionLayoutProps) => {
  return (
    <section
      className={clsx(
        className,
        "flex flex-col gap-4 p-4 rounded-2xl bg-white"
      )}
    >
      <div className="flex items-center gap-2">
        {/* <icon className="size-10" /> */}
        <h2 className="text-2xl font-bold capitalize">{title}</h2>
      </div>
      <Separator className="my-4" />
      {children}
    </section>
  );
};
