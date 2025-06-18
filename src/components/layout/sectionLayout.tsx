import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import clsx from "clsx";
import { type ElementType, type ReactNode } from "react";
import { Separator } from "../ui/separator";

interface SectionLayoutProps {
  children: ReactNode;
  title: string;
  icon?: ElementType;
  className?: string;
}

export const SectionLayout = ({
  children,
  title,
  icon: Icon,
  className,
}: SectionLayoutProps) => {
  return (
    <section
      className={clsx(
        className,
        "flex flex-col gap-4 p-4 rounded-2xl bg-white"
      )}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="bg-amber-400 rounded-full p-2">
                  <Icon size={32} color="white" className="" />
                </div>
              )}
              <h2 className="text-2xl font-bold capitalize">{title}</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Separator className="my-4" />
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
