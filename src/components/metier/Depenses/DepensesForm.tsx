import { SectionLayout } from "@/components/layout/sectionLayout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { parseValue } from "@/lib/utils";
import { ChartPieIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Controller } from "react-hook-form";
import { useDepensesForm } from "./useDepensesForm";

export const DepensesForm = () => {
  const {
    control,
    errors,
    register,
    fields,
    append,
    remove,
    totalDepenses,
    lots,
  } = useDepensesForm();

  return (
    <SectionLayout title="Dépenses" icon={ChartPieIcon}>
      <form id="depenses-form" className="flex flex-col gap-10 md:gap-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col w-full items-center gap-0 md:gap-2 md:flex-row"
          >
            <Controller
              name={`depenses.${index}.nom`}
              control={control}
              render={({ field }) => (
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor={`depenses.${index}.nom`}>Nom</Label>
                  <Input
                    type="text"
                    id={`depenses.${index}.nom`}
                    aria-invalid={!!errors.depenses?.[index]?.nom}
                    aria-describedby={`depenses.${index}.nom-error`}
                    value={field.value}
                    placeholder="Ex : Peinture"
                    {...register(`depenses.${index}.nom` as const)}
                  />
                  <p
                    id={`depenses.${index}.nom-error`}
                    className={`text-sm h-4 transition-all ${
                      errors.depenses?.[index]?.nom
                        ? "text-red-500"
                        : "text-transparent"
                    }`}
                  >
                    {errors.depenses?.[index]?.nom?.message || ""}
                  </p>
                </div>
              )}
            />
            <Controller
              name={`depenses.${index}.prixHT`}
              control={control}
              render={({ field }) => (
                <Field
                  label="Prix HT"
                  id={`depense-prixHT-${index}`}
                  unit="€"
                  readOnly
                  error={errors?.depenses?.[index]?.prixHT?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(parseValue(e.target.value))}
                />
              )}
            />
            <Controller
              name={`depenses.${index}.tauxTVA`}
              control={control}
              render={({ field }) => (
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor="tauxTVA">Taux TVA</Label>
                  <select
                    id={`depense-tauxTVA-${index}`}
                    className="w-full border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    aria-invalid={!!errors.depenses?.[index]?.tauxTVA}
                    aria-describedby={`depense-tauxTVA-${index}-error`}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value={0}>0 %</option>
                    <option value={5}>5 %</option>
                    <option value={10}>10 %</option>
                    <option value={20}>20 %</option>
                  </select>
                  <p
                    id={`depense-tauxTVA-${index}-error`}
                    className={`text-sm h-4 transition-all ${
                      errors.depenses?.[index]?.tauxTVA
                        ? "text-red-500"
                        : "text-transparent"
                    }`}
                  >
                    {errors.depenses?.[index]?.tauxTVA?.message || ""}
                  </p>
                </div>
              )}
            />
            <Controller
              name={`depenses.${index}.TVA`}
              control={control}
              render={({ field }) => (
                <Field
                  label="TVA"
                  id={`depense-TVA-${index}`}
                  unit="€"
                  readOnly
                  error={errors?.depenses?.[index]?.TVA?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(parseValue(e.target.value))}
                />
              )}
            />
            <Controller
              name={`depenses.${index}.prixTTC`}
              control={control}
              render={({ field }) => (
                <Field
                  label="Prix TTC"
                  id={`depense-prixTTC-${index}`}
                  unit="€"
                  error={errors?.depenses?.[index]?.prixTTC?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(parseValue(e.target.value))}
                />
              )}
            />
            <Controller
              name={`depenses.${index}.quantite`}
              control={control}
              render={({ field }) => (
                <Field
                  label="Quantité"
                  id={`depense-quantite-${index}`}
                  error={errors?.depenses?.[index]?.quantite?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(parseValue(e.target.value))}
                />
              )}
            />
            <Controller
              name={`depenses.${index}.lotsIndex`}
              control={control}
              render={({ field }) => (
                <div className="flex flex-row gap-5 md:flex-col md:gap-1">
                  {lots.map((lot) => {
                    const isSelected = field.value?.includes(lot.id);
                    const toggleLot = () => {
                      const updated = isSelected
                        ? field.value.filter((id: number) => id !== lot.id)
                        : [...(field.value || []), lot.id];
                      field.onChange(updated);
                    };

                    return (
                      <div
                        key={lot.id}
                        onClick={toggleLot}
                        className="flex items-center gap-1 cursor-pointer select-none group"
                      >
                        <span className="text-xs w-10 truncate">
                          Lot n°{lot.id + 1}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full border-2 transition-colors 
              ${
                isSelected
                  ? "bg-amber-400 border-amber-400"
                  : "bg-white border-amber-400"
              }`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            />

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800 mt-4 ml-0 cursor-pointer md:ml-4 md:mt-0"
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
              id: fields.length - 1,
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
          <p>Ajouter une dépense</p>
        </Button>
      </div>

      <Separator className="mt-4 mb-2" />
      <div className="flex flex-col items-end font-bold uppercase">
        <p className="text-sm">Total dépenses</p>
        <p className="text-2xl">{totalDepenses.toLocaleString("fr-FR")} €</p>
      </div>
    </SectionLayout>
  );
};
