import { SectionLayout } from "@/components/layout/sectionLayout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { parseValue } from "@/lib/utils";
import { Layers3Icon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Controller } from "react-hook-form";
import { useLotsForm } from "./useLotsForm";

export const LotsForm = () => {
  const { control, errors, register, fields, append, remove, totalVentesLots } =
    useLotsForm();

  return (
    <SectionLayout title="lots" icon={Layers3Icon}>
      <form id="lots-form" className="flex flex-col gap-10 md:gap-4 print:md-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col w-full items-center gap-0 md:flex-row md:gap-2 print:gap-2"
          >
            <div className="hidden print:block">
              <h2 className="text-2xl font-bold">Lot n° {index + 1}</h2>
            </div>
            <div className="w-full flex flex-col gap-2 print:hidden">
              <Label htmlFor={`lots.${index}.numero`}>N° Lot</Label>
              <Input
                type="text"
                id={`lots.${index}.numero`}
                value={`Lot n° ${index + 1}`}
                disabled
              />
              <p className="text-sm h-4">{""}</p>
            </div>
            <Controller
              name={`lots.${index}.nom`}
              control={control}
              render={({ field }) => (
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor={`lots.${index}.nom`}>Désignation</Label>
                  <Input
                    type="text"
                    id={`lots.${index}.nom`}
                    aria-invalid={!!errors.lots?.[index]?.nom}
                    aria-describedby={`lots.${index}.nom-error`}
                    value={field.value}
                    {...register(`lots.${index}.nom` as const)}
                    placeholder="Ex: Appart T2"
                  />
                  <p
                    id={`lots.${index}.nom-error`}
                    className={`text-sm h-4 transition-all ${
                      errors.lots?.[index]?.nom
                        ? "text-red-500"
                        : "text-transparent"
                    }`}
                  >
                    {errors.lots?.[index]?.nom?.message || ""}
                  </p>
                </div>
              )}
            />
            <Controller
              name={`lots.${index}.prixVente`}
              control={control}
              render={({ field }) => (
                <Field
                  label="Prix de revente"
                  id={`lots.${index}.prixVente`}
                  unit="€"
                  className=""
                  error={errors.lots?.[index]?.prixVente?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(parseValue(e.target.value))}
                />
              )}
            />
            <Controller
              name={`lots.${index}.surface`}
              control={control}
              render={({ field }) => (
                <Field
                  label="Surface"
                  id={`lots.${index}.surface`}
                  unit="m²"
                  error={errors.lots?.[index]?.surface?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(parseValue(e.target.value))}
                />
              )}
            />
            <Controller
              name={`lots.${index}.prixM2`}
              control={control}
              render={({ field }) => (
                <Field
                  label="Prix au m²"
                  id={`lots.${index}.prixM2`}
                  unit="€/m²"
                  readOnly
                  error={errors.lots?.[index]?.prixM2?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(parseValue(e.target.value))}
                />
              )}
            />
            <Controller
              name={`lots.${index}.tva`}
              control={control}
              render={({ field }) => (
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor={`lots.${index}.tva`}>TVA</Label>
                  <select
                    id={`lots.${index}.tva`}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 print:bg-white print:border-none print:shadow-none print:appearance-none print:text-xl"
                    aria-invalid={!!errors.lots?.[index]?.tva}
                    aria-describedby={`lots.${index}.tva-error`}
                  >
                    <option value="exonere">Exonéré de TVA</option>
                    <option value="marge">TVA sur marge</option>
                    <option value="integral">TVA intégral</option>
                  </select>
                  <p
                    id={`lots.${index}.tva-error`}
                    className={`text-sm h-4 transition-all ${
                      errors.lots?.[index]?.tva
                        ? "text-red-500"
                        : "text-transparent"
                    }`}
                  >
                    {errors.lots?.[index]?.tva?.message || ""}
                  </p>
                </div>
              )}
            />
            <Controller
              name={`lots.${index}.ponderation`}
              control={control}
              render={({ field }) => (
                <Field
                  label="Pondération"
                  id={`lots.${index}.ponderation`}
                  unit="%"
                  error={errors.lots?.[index]?.ponderation?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(parseValue(e.target.value))}
                />
              )}
            />

            {/* Bouton de suppression */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 cursor-pointer print:hidden hover:text-red-800"
              aria-label={`Supprimer le lot ${index + 1}`}
            >
              <Trash2Icon size={20} />
            </button>
            {index !== fields.length - 1 && <div className="page-break" />}
          </div>
        ))}
      </form>
      <div className="flex items-center justify-center my-4">
        <Button
          type="button"
          className="print:hidden"
          onClick={() =>
            append({
              id: fields.length - 1,
              nom: "",
              prixVente: 0,
              surface: 0,
              prixM2: 0,
              tva: "exonere",
              ponderation: 0,
            })
          }
        >
          <PlusCircleIcon size={8} className="" />
          Ajouter un lot
        </Button>
      </div>
      <div className="print-footer">
        <Separator className="mt-4 mb-2" />
        <div className="flex flex-col items-end font-bold uppercase">
          <p className="text-sm">Total ventes</p>
          <p className="text-2xl">
            {totalVentesLots.toLocaleString("fr-FR")} €
          </p>
        </div>
      </div>
    </SectionLayout>
  );
};
