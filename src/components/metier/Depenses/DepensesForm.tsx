import { SectionLayout } from "@/components/layout/sectionLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import {
  depenseSchema,
  type DepenseValues,
} from "@/lib/validations/depense.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartPieIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { calculateDepenses } from "./useDepenses";

type FormValues = {
  depenses: DepenseValues[];
};

const formSchema = z.object({
  depenses: depenseSchema.array(),
});

export const DepensesForm = () => {
  const setDepenses = useSimulationStore((state) => state.setDepenses);
  const setTotalDepenses = useSimulationStore(
    (state) => state.setTotalDepenses
  );
  const totalDepenses = useSimulationStore((state) => state.totalDepenses);

  const { register, control, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      depenses: [
        {
          nom: "",
          prixHT: 0,
          tauxTVA: 0,
          TVA: 0,
          prixTTC: 0,
          quantite: 1,
          lotsIndex: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "depenses",
  });

  const depenses = useWatch({ control, name: "depenses" });

  useEffect(() => {
    if (!depenses) return;

    const updated = depenses.map((d) => ({
      ...d,
      prixTTC: d?.prixTTC ?? 0,
      tauxTVA: d?.tauxTVA ?? 0,
      quantite: d?.quantite ?? 1,
    }));

    updated.forEach((depense, i) => {
      // Calcul prixHT et TVA à partir du TTC et tauxTVA
      const prixHT =
        depense.tauxTVA > 0
          ? +(depense.prixTTC / (1 + depense.tauxTVA / 100)).toFixed(2)
          : depense.prixTTC;

      const tva = +(depense.prixTTC - prixHT).toFixed(2);

      if (prixHT !== depense.prixHT) {
        setValue(`depenses.${i}.prixHT`, prixHT, { shouldDirty: true });
        depense.prixHT = prixHT;
      }

      if (tva !== depense.TVA) {
        setValue(`depenses.${i}.TVA`, tva, { shouldDirty: true });
        depense.TVA = tva;
      }
    });

    const validDepenses = updated.filter(
      (d): d is DepenseValues =>
        d &&
        typeof d.nom === "string" &&
        typeof d.prixHT === "number" &&
        typeof d.tauxTVA === "number" &&
        typeof d.TVA === "number" &&
        typeof d.prixTTC === "number" &&
        typeof d.quantite === "number"
    );

    const total = calculateDepenses(validDepenses);

    setDepenses(validDepenses);
    setTotalDepenses(total);
  }, [depenses, setDepenses, setTotalDepenses, setValue]);

  return (
    <SectionLayout title="Dépenses" icon={ChartPieIcon}>
      <form id="depenses-form" className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex w-full items-center gap-2">
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`depenses.${index}.nom`}>Nom</Label>
              <Input
                type="text"
                id={`depenses.${index}.nom`}
                placeholder="Ex : Peinture"
                {...register(`depenses.${index}.nom` as const)}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`depenses.${index}.prixHT`}>Prix HT</Label>
              <Input
                type="number"
                id={`depenses.${index}.prixHT`}
                unit="€"
                readOnly
                {...register(`depenses.${index}.prixHT` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`depenses.${index}.tauxTVA`}>Taux TVA</Label>
              <Input
                type="number"
                id={`depenses.${index}.tauxTVA`}
                unit="%"
                {...register(`depenses.${index}.tauxTVA` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`depenses.${index}.TVA`}>TVA</Label>
              <Input
                type="number"
                id={`depenses.${index}.TVA`}
                unit="€"
                readOnly
                {...register(`depenses.${index}.TVA` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`depenses.${index}.prixTTC`}>Prix TTC</Label>
              <Input
                type="number"
                id={`depenses.${index}.prixTTC`}
                unit="€"
                {...register(`depenses.${index}.prixTTC` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor={`depenses.${index}.quantite`}>Quantité</Label>
              <Input
                type="number"
                id={`depenses.${index}.quantite`}
                {...register(`depenses.${index}.quantite` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-5 text-red-600 hover:text-red-800"
              aria-label={`Supprimer la dépense ${index + 1}`}
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
              prixHT: 0,
              tauxTVA: 0,
              TVA: 0,
              prixTTC: 0,
              quantite: 1,
              lotsIndex: [],
            })
          }
        >
          <PlusCircleIcon size={8} />
          Ajouter une dépense
        </Button>
      </div>

      <Separator className="my-4" />
      <div className="flex flex-col items-end text-xl font-bold uppercase">
        <p className="text-sm">Total dépenses</p>
        <p>{totalDepenses.toLocaleString("fr-FR")} €</p>
      </div>
    </SectionLayout>
  );
};
