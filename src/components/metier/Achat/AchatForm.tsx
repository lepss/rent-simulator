import { SectionLayout } from "@/components/layout/sectionLayout";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { parseValue } from "@/lib/utils";
import { ArrowLeftRightIcon, ArrowUpDownIcon, HouseIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { useAchatForm } from "./useAchatForm";

export const AchatForm = () => {
  const {
    control,
    watch,
    errors,
    handleFraisChange,
    handleTauxChange,
    achatTotal,
    register,
  } = useAchatForm();

  const values = watch();
  const prixNetVendeur = values.prixNetVendeur;
  const disabled = !prixNetVendeur || prixNetVendeur === 0;

  return (
    <SectionLayout title="achats" icon={HouseIcon}>
      <form id="achat-form" className="flex flex-col gap-5 md:gap-4">
        <div className="flex flex-col w-full items-center gap-0 md:flex-row md:gap-2">
          <Controller
            name="prixNetVendeur"
            control={control}
            render={({ field }) => (
              <Field
                label="Prix net vendeur"
                id="prix-net-vendeur"
                unit="€"
                error={errors.prixNetVendeur?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
          <Controller
            name="fraisAgence"
            control={control}
            render={({ field }) => (
              <Field
                label="Frais d'agence"
                id="frais-agence"
                unit="€"
                disabled={disabled}
                error={errors.fraisAgence?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
          <Controller
            name="aCharge"
            control={control}
            render={({ field }) => (
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="a-charge">A charge</Label>
                <select
                  id="a-charge"
                  disabled={disabled}
                  className="w-full border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  aria-invalid={!!errors.aCharge}
                  aria-describedby="a-charge-error"
                  value={field.value}
                  {...register("aCharge")}
                >
                  <option value="acquereur">Acquereur</option>
                  <option value="vendeur">Vendeur</option>
                </select>
                <p
                  id={`$a-charge-error`}
                  className={`text-sm h-4 transition-all ${
                    errors.aCharge ? "text-red-500" : "text-transparent"
                  }`}
                >
                  {errors.aCharge?.message || ""}
                </p>
              </div>
            )}
          />
        </div>

        <div className="flex flex-col w-full items-center gap-0 md:flex-row md:gap-2">
          <Controller
            name="prixFAI"
            control={control}
            render={({ field }) => (
              <Field
                label="Prix FAI (Frais d'agence inclus)"
                id="prix-fai"
                unit="€"
                readOnly
                disabled={disabled}
                error={errors.prixFAI?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
          <Controller
            name="fraisAcquisition"
            control={control}
            render={({ field }) => (
              <Field
                label="Frais d'acquisition"
                id="frais-acquisition"
                unit="€"
                disabled={disabled}
                error={errors.fraisAcquisition?.message}
                value={field.value}
                onChange={(e) => {
                  field.onChange(parseValue(e.target.value));
                  handleFraisChange(e); // conserve logique personnalisée
                }}
              />
            )}
          />
          <ArrowLeftRightIcon size={40} className="hidden md:block" />
          <ArrowUpDownIcon size={15} className="block md:hidden" />
          <Controller
            name="tauxAcquisition"
            control={control}
            render={({ field }) => (
              <Field
                label="Taux frais d'acquisition"
                id="taux-acquisition"
                unit="%"
                disabled={disabled}
                error={errors.tauxAcquisition?.message}
                value={field.value}
                onChange={(e) => {
                  field.onChange(parseValue(e.target.value));
                  handleTauxChange(e); // conserve logique personnalisée
                }}
              />
            )}
          />
        </div>

        <div className="flex w-full items-center gap-2">
          <Controller
            name="fraisAvocat"
            control={control}
            render={({ field }) => (
              <Field
                label="Frais avocat"
                id="frais-avocat"
                unit="€"
                disabled={disabled}
                error={errors.fraisAvocat?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
        </div>
      </form>

      <Separator className="mt-4" />
      <div className="flex flex-col items-end font-bold uppercase">
        <p className="text-sm">Coût total</p>
        <p className="text-2xl">
          {values && values.prixFAI ? achatTotal.toLocaleString("fr-FR") : "0"}{" "}
          €
        </p>
      </div>
    </SectionLayout>
  );
};
