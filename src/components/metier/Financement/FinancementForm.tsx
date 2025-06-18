import { SectionLayout } from "@/components/layout/sectionLayout";
import { Field } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { parseValue } from "@/lib/utils";
import {
  ArrowLeftRightIcon,
  ArrowUpDownIcon,
  LandmarkIcon,
} from "lucide-react";
import { Controller } from "react-hook-form";
import { useFinancementForm } from "./useFinancementForm";

export const FinancementForm = () => {
  const {
    control,
    watch,
    errors,
    totalFinancement,
    handleApportChange,
    handleTauxApportChange,
  } = useFinancementForm();

  const values = watch();
  const apport = values.apport;
  const disabled = !apport || apport === 0;

  return (
    <SectionLayout title="financement" icon={LandmarkIcon}>
      <form id="financement-form" className="flex flex-col gap-5 md:gap-4">
        <div className="flex flex-col w-full items-center gap-0 md:gap-2 md:flex-row">
          <Controller
            name="apport"
            control={control}
            render={({ field }) => (
              <Field
                label="Apport"
                id="apport"
                unit="€"
                error={errors.apport?.message}
                value={field.value}
                onChange={(e) => {
                  field.onChange(parseValue(e.target.value));
                  handleApportChange(e);
                }}
              />
            )}
          />
          <ArrowLeftRightIcon size={30} className="hidden md:block" />
          <ArrowUpDownIcon size={15} className="block md:hidden" />
          <Controller
            name="tauxApport"
            control={control}
            render={({ field }) => (
              <Field
                label="Taux d'apport"
                id="taux-apport"
                unit="%"
                error={errors.tauxApport?.message}
                value={field.value}
                onChange={(e) => {
                  field.onChange(parseValue(e.target.value));
                  handleTauxApportChange(e);
                }}
              />
            )}
          />
        </div>

        <div className="flex flex-col w-full items-center gap-0 md:flex-row md:gap-2">
          <Controller
            name="interetEmprunt"
            control={control}
            render={({ field }) => (
              <Field
                label="Intérêts d'emprunt"
                id="interet-emprunt"
                unit="€"
                disabled={disabled}
                readOnly
                error={errors.interetEmprunt?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
          <Controller
            name="tauxInteret"
            control={control}
            render={({ field }) => (
              <Field
                label="Taux Intérêts d'emprunt"
                id="taux-interet-emprunt"
                unit="%"
                disabled={disabled}
                error={errors.tauxInteret?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
          <Controller
            name="dureeRemboursementEmprunt"
            control={control}
            render={({ field }) => (
              <Field
                label="Durée remboursement emprunt"
                id="duree-remboursement-emprunt"
                unit="mois"
                disabled={disabled}
                error={errors.dureeRemboursementEmprunt?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
        </div>

        <div className="flex flex-col w-full items-center gap-0 md:gap-2 md:flex-row">
          <Controller
            name="commissionEngagement"
            control={control}
            render={({ field }) => (
              <Field
                label="Commission d'engagement"
                id="commission-engagement"
                unit="€"
                disabled={disabled}
                readOnly
                error={errors.commissionEngagement?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
          <Controller
            name="tauxCommissionEngagement"
            control={control}
            render={({ field }) => (
              <Field
                label="Taux commission d'engagement"
                id="taux-commission-engagement"
                unit="%"
                disabled={disabled}
                error={errors.tauxCommissionEngagement?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
          <Controller
            name="dureeRemboursementCommissionEngagement"
            control={control}
            render={({ field }) => (
              <Field
                label="Durée remboursement commission"
                id="duree-remboursement-commission-engagement"
                unit="mois"
                disabled={disabled}
                error={errors.dureeRemboursementCommissionEngagement?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
        </div>

        <div className="flex flex-col w-full items-center gap-0 md:gap-2 md:flex-row">
          <Controller
            name="hypotheque"
            control={control}
            render={({ field }) => (
              <Field
                label="Hypothèque"
                id="hypotheque"
                unit="€"
                disabled={disabled}
                readOnly
                error={errors.hypotheque?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
          <Controller
            name="tauxHypotheque"
            control={control}
            render={({ field }) => (
              <Field
                label="Taux Hypothèque"
                id="taux-hypotheque"
                unit="%"
                disabled={disabled}
                error={errors.tauxHypotheque?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
        </div>

        <div className="flex w-full items-center gap-2">
          <Controller
            name="fraisDossier"
            control={control}
            render={({ field }) => (
              <Field
                label="Frais de dossier"
                id="frais-dossier"
                unit="€"
                disabled={disabled}
                error={errors.fraisDossier?.message}
                value={field.value}
                onChange={(e) => field.onChange(parseValue(e.target.value))}
              />
            )}
          />
        </div>
      </form>

      <Separator className="mt-4 mb-2" />

      <div className="flex flex-col items-end font-bold uppercase">
        <p className="text-sm">Coût total</p>
        <p className="text-2xl">
          {values && values.apport
            ? totalFinancement.toLocaleString("fr-FR")
            : "0"}{" "}
          €
        </p>
      </div>
    </SectionLayout>
  );
};
