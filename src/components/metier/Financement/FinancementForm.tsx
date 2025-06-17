import { SectionLayout } from "@/components/layout/sectionLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import {
  financementSchema,
  type FinancementValues,
} from "@/lib/validations/financement.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LandmarkIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { calculateFinancement } from "./useFinancement";

export const FinancementForm = () => {
  // Récupération du store
  const setFinancement = useSimulationStore((state) => state.setFinancement);
  const setTotalFinancement = useSimulationStore(
    (state) => state.setTotalFinancement
  );
  const totalFinancement = useSimulationStore(
    (state) => state.totalFinancement
  );
  const coutTotalAchat = useSimulationStore((state) => state.achatTotal);
  const coutTotalDepenses = useSimulationStore((state) => state.totalDepenses);

  const { register, watch, control, setValue } = useForm<FinancementValues>({
    resolver: zodResolver(financementSchema),
    defaultValues: {
      apport: 0,
      tauxApport: 0,
      interetEmprunt: 0,
      tauxInteret: 0,
      dureeRemboursementEmprunt: 0,
      commissionEngagement: 0,
      tauxCommissionEngagement: 0,
      dureeRemboursementCommissionEngagement: 0,
      hypotheque: 0,
      tauxHypotheque: 0,
      fraisDossier: 0,
    },
  });

  // Watch des champs
  const values = watch();

  // Champs individuels avec useWatch
  const apport = useWatch({ name: "apport", control }) ?? 0;
  const tauxInteret = useWatch({ name: "tauxInteret", control }) ?? 0;
  const dureeRemboursementEmprunt =
    useWatch({ name: "dureeRemboursementEmprunt", control }) ?? 0;
  const tauxCommissionEngagement =
    useWatch({ name: "tauxCommissionEngagement", control }) ?? 0;
  const dureeRemboursementCommissionEngagement =
    useWatch({ name: "dureeRemboursementCommissionEngagement", control }) ?? 0;
  const tauxHypotheque = useWatch({ name: "tauxHypotheque", control }) ?? 0;
  const fraisDossier = useWatch({ name: "fraisDossier", control }) ?? 0;

  // Calcul du total achat + dépenses pour les calculs
  const baseMontant = coutTotalAchat + coutTotalDepenses;

  // Calcul automatique du tauxApport (en %)
  useEffect(() => {
    if (baseMontant > 0) {
      const nouveauTauxApport = (apport / baseMontant) * 100;
      setValue("tauxApport", Math.round(nouveauTauxApport * 100) / 100);
    } else {
      setValue("tauxApport", 0);
    }
  }, [apport, baseMontant]);

  // Calcul de l'emprunt total = baseMontant - apport
  const empruntTotal = baseMontant - apport;

  // Calcul de l'intérêt d'emprunt (exemple simple)
  // On suppose tauxInteret est en % annuel, durée en mois
  useEffect(() => {
    if (empruntTotal > 0 && tauxInteret > 0 && dureeRemboursementEmprunt > 0) {
      // Calcul intérêt total simplifié = emprunt * taux * (durée / 12)
      const interet =
        empruntTotal * (tauxInteret / 100) * (dureeRemboursementEmprunt / 12);
      setValue("interetEmprunt", Math.round(interet));
    } else {
      setValue("interetEmprunt", 0);
    }
  }, [empruntTotal, tauxInteret, dureeRemboursementEmprunt]);

  // Calcul commission d'engagement = empruntTotal * tauxCommissionEngagement / 100
  useEffect(() => {
    if (empruntTotal > 0 && tauxCommissionEngagement > 0) {
      const commission = empruntTotal * (tauxCommissionEngagement / 100);
      setValue("commissionEngagement", Math.round(commission));
    } else {
      setValue("commissionEngagement", 0);
    }
  }, [empruntTotal, tauxCommissionEngagement]);

  // Calcul hypothèque = empruntTotal * tauxHypotheque / 100
  useEffect(() => {
    if (empruntTotal > 0 && tauxHypotheque > 0) {
      const hypo = empruntTotal * (tauxHypotheque / 100);
      setValue("hypotheque", Math.round(hypo));
    } else {
      setValue("hypotheque", 0);
    }
  }, [empruntTotal, tauxHypotheque]);

  // Mise à jour du store avec les valeurs complètes à chaque changement
  useEffect(() => {
    setFinancement(values);
    setTotalFinancement(calculateFinancement(values));
  }, [values]);

  return (
    <SectionLayout title="financement" icon={LandmarkIcon}>
      <form id="financement-form" className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="apport">Apport (€)</Label>
            <Input
              type="number"
              id="apport"
              placeholder="Apport"
              unit="€"
              {...register("apport", { valueAsNumber: true })}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="taux-apport">Taux d'apport (%)</Label>
            <Input
              type="number"
              id="taux-apport"
              placeholder="Taux d'apport"
              unit="%"
              {...register("tauxApport")}
              readOnly
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="interet-emprunt">Intérêts d'emprunt (€)</Label>
            <Input
              type="number"
              id="interet-emprunt"
              placeholder="Intérêts d'emprunt"
              unit="€"
              {...register("interetEmprunt")}
              readOnly
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="taux-interet-emprunt">
              Taux Intérêts d'emprunt (%)
            </Label>
            <Input
              type="number"
              id="taux-interet-emprunt"
              placeholder="Taux d'intérêts d'emprunt"
              unit="%"
              {...register("tauxInteret", { valueAsNumber: true })}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="duree-remboursement-emprunt">
              Durée remboursement emprunt
            </Label>
            <Input
              type="number"
              id="duree-remboursement-emprunt"
              placeholder="Durée remboursement emprunt"
              unit="mois"
              {...register("dureeRemboursementEmprunt", {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="commission-engagement">
              Commission d'engagement
            </Label>
            <Input
              type="number"
              id="commission-engagement"
              placeholder="Commission d'engagement"
              unit="€"
              {...register("commissionEngagement")}
              readOnly
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="taux-commission-engagement">
              Taux commission d'engagement
            </Label>
            <Input
              type="number"
              id="taux-commission-engagement"
              placeholder="Taux commission d'engagement"
              unit="%"
              {...register("tauxCommissionEngagement", { valueAsNumber: true })}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="duree-remboursement-commission-engagement">
              Durée remboursement commission
            </Label>
            <Input
              type="number"
              id="duree-remboursement-commission-engagement"
              placeholder="Durée remboursement commission"
              unit="mois"
              {...register("dureeRemboursementCommissionEngagement", {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="hypotheque">Hypothèque</Label>
            <Input
              type="number"
              id="hypotheque"
              placeholder="Hypothèque"
              unit="€"
              {...register("hypotheque")}
              readOnly
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="taux-hypotheque">Taux Hypothèque</Label>
            <Input
              type="number"
              id="taux-hypotheque"
              placeholder="Taux hypothèque"
              unit="%"
              {...register("tauxHypotheque", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="frais-dossier">Frais de dossier</Label>
            <Input
              type="number"
              id="frais-dossier"
              placeholder="Frais de dossier"
              unit="€"
              {...register("fraisDossier", { valueAsNumber: true })}
            />
          </div>
        </div>
      </form>

      <Separator className="my-4" />

      <div className="flex flex-col items-end text-xl font-bold uppercase">
        <p className="text-sm">Coût total</p>
        <p>{totalFinancement.toLocaleString("fr-FR")} €</p>
      </div>
    </SectionLayout>
  );
};
