import { SectionLayout } from "@/components/layout/sectionLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import { type LotValues, lotSchema } from "@/lib/validations/lot.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layers3Icon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { calculateLots } from "./useLots";

type FormValues = {
  lots: LotValues[];
};

const formSchema = z.object({
  lots: lotSchema.array(),
});

export const LotsForm = () => {
  const setLots = useSimulationStore((state) => state.setLots);
  const setTotalVentesLots = useSimulationStore(
    (state) => state.setTotalVentesLots
  );
  const totalVentesLots = useSimulationStore((state) => state.totalVentesLots);
  const { register, control, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lots: [
        {
          nom: "",
          prixVente: 0,
          surface: 0,
          prixM2: 0,
          tva: "",
          ponderation: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lots",
  });

  const lots = useWatch({ control, name: "lots" });

  useEffect(() => {
    if (!lots) return;

    const updatedLots = lots.map((lot) => ({
      ...lot,
      prixVente: lot?.prixVente ?? 0,
      surface: lot?.surface ?? 0,
      prixM2: lot?.prixM2 ?? 0,
      ponderation: lot?.ponderation ?? 0,
    }));

    // Recalculer prixM2 si surface > 0
    updatedLots.forEach((lot, i) => {
      if (lot.surface > 0) {
        const newPrixM2 = +(lot.prixVente / lot.surface).toFixed(2);
        if (newPrixM2 !== lot.prixM2) {
          setValue(`lots.${i}.prixM2`, newPrixM2, { shouldDirty: true });
          lot.prixM2 = newPrixM2; // mettre à jour la copie locale aussi
        }
      }
    });

    // Filtrer les lots valides
    const validLots = updatedLots.filter(
      (lot): lot is LotValues =>
        lot &&
        typeof lot.nom === "string" &&
        typeof lot.prixVente === "number" &&
        typeof lot.surface === "number" &&
        typeof lot.prixM2 === "number" &&
        typeof lot.tva === "string" &&
        typeof lot.ponderation === "number"
    );

    // Total des ventes
    const total = calculateLots(validLots);

    // MAJ du store
    setLots(validLots);
    setTotalVentesLots(total);
  }, [lots, setLots, setTotalVentesLots, setValue]);

  return (
    <SectionLayout title="lots" icon={Layers3Icon}>
      <form id="lots-form" className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex w-full items-center gap-2">
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`lots.${index}.numero`}>N° Lot</Label>
              <Input
                type="text"
                id={`lots.${index}.numero`}
                placeholder={`Lot n° ${index + 1}`}
                disabled
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`lots.${index}.nom`}>Désignation</Label>
              <Input
                type="text"
                id={`lots.${index}.nom`}
                placeholder="Ex: Appart T2"
                {...register(`lots.${index}.nom` as const)}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`lots.${index}.prixVente`}>Prix de revente</Label>
              <Input
                type="number"
                id={`lots.${index}.prixVente`}
                placeholder="Prix de revente"
                unit="€"
                {...register(`lots.${index}.prixVente` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`lots.${index}.surface`}>Surface</Label>
              <Input
                type="number"
                id={`lots.${index}.surface`}
                placeholder="Surface"
                unit="m²"
                {...register(`lots.${index}.surface` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`lots.${index}.prixM2`}>Prix au m2</Label>
              <Input
                type="number"
                id={`lots.${index}.prixM2`}
                placeholder="Prix au m2"
                unit="€/m²"
                readOnly
                {...register(`lots.${index}.prixM2` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`lots.${index}.tva`}>TVA</Label>
              <select
                id={`lots.${index}.tva`}
                className="w-full border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                {...register(`lots.${index}.tva` as const)}
              >
                <option value="exonere">Exonéré de TVA</option>
                <option value="marge">TVA sur marge</option>
                <option value="integral">TVA intégral</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`lots.${index}.ponderation`}>Pondération</Label>
              <Input
                type="number"
                id={`lots.${index}.ponderation`}
                placeholder="Pondération"
                unit="%"
                {...register(`lots.${index}.ponderation` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* Bouton de suppression */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-5 text-red-600 hover:text-red-800"
              aria-label={`Supprimer le lot ${index + 1}`}
            >
              <Trash2Icon size={20} />
            </button>
          </div>
        ))}
      </form>
      <div className="flex items-center justify-center my-4">
        <Button
          type="button"
          onClick={() =>
            append({
              nom: "",
              prixVente: 0,
              surface: 0,
              prixM2: 0,
              tva: "",
              ponderation: 0,
            })
          }
        >
          <PlusCircleIcon size={8} className="" />
          Ajouter un lot
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col items-end text-xl font-bold uppercase">
        <p className="text-sm">Total ventes</p>
        <p>{totalVentesLots.toLocaleString("fr-FR")} €</p>
      </div>
    </SectionLayout>
  );
};
