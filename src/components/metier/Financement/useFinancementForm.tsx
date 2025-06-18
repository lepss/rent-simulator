import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import {
  type FinancementValues,
  financementSchema,
} from "@/lib/validations/financement.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { calculateFinancement } from "./useFinancement";

export const useFinancementForm = () => {
  const setFinancement = useSimulationStore((s) => s.setFinancement);
  const setTotalFinancement = useSimulationStore((s) => s.setTotalFinancement);
  const totalFinancement = useSimulationStore((s) => s.totalFinancement);
  const coutTotalAchat = useSimulationStore((s) => s.achatTotal);
  const coutTotalDepenses = useSimulationStore((s) => s.totalDepenses);

  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FinancementValues>({
    resolver: zodResolver(financementSchema),
    mode: "onChange",
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

  const values = watch();

  const apport = useWatch({ name: "apport", control });
  const tauxApport = useWatch({ name: "tauxApport", control });
  const tauxInteret = useWatch({ name: "tauxInteret", control });
  const dureeRemboursementEmprunt = useWatch({
    name: "dureeRemboursementEmprunt",
    control,
  });
  const tauxCommissionEngagement = useWatch({
    name: "tauxCommissionEngagement",
    control,
  });
  const dureeRemboursementCommissionEngagement = useWatch({
    name: "dureeRemboursementCommissionEngagement",
    control,
  });
  const tauxHypotheque = useWatch({ name: "tauxHypotheque", control });

  // Calcul du total achat + dépenses pour les calculs
  const baseMontant = coutTotalAchat + coutTotalDepenses;

  const lastEdited = useRef<"apport" | "tauxApport" | null>(null);

  // Calcul du taux en fonction de l'apport
  useEffect(() => {
    if (lastEdited.current === "apport") {
      const tauxApport = (apport / baseMontant) * 100;
      setValue("tauxApport", Number(tauxApport.toFixed(2)));
    }
  }, [apport, baseMontant, setValue]);

  // Calcul de l'apport en fonction du taux
  useEffect(() => {
    if (lastEdited.current === "tauxApport") {
      const apport = (baseMontant * tauxApport) / 100;
      setValue("apport", apport);
    }
  }, [tauxApport, baseMontant, setValue]);

  const empruntTotal = baseMontant - apport;

  //Calcul de l'interet emprunt
  useEffect(() => {
    if (empruntTotal > 0 && tauxInteret > 0 && dureeRemboursementEmprunt > 0) {
      // Calcul intérêt simplifié = emprunt * taux * (durée / 12)
      const interet =
        empruntTotal * (tauxInteret / 100) * (dureeRemboursementEmprunt / 12);
      setValue("interetEmprunt", Math.round(interet));
    } else {
      setValue("interetEmprunt", 0);
    }
  }, [empruntTotal, tauxInteret, setValue, dureeRemboursementEmprunt]);

  //Calcul de la commission d'engagement
  useEffect(() => {
    if (
      empruntTotal > 0 &&
      tauxCommissionEngagement > 0 &&
      dureeRemboursementCommissionEngagement > 0
    ) {
      const commission =
        empruntTotal *
        (tauxCommissionEngagement / 100) *
        (dureeRemboursementCommissionEngagement / 12);
      setValue("commissionEngagement", Math.round(commission));
    } else {
      setValue("commissionEngagement", 0);
    }
  }, [
    empruntTotal,
    tauxCommissionEngagement,
    setValue,
    dureeRemboursementCommissionEngagement,
  ]);

  //Calcul de l'hypothéque
  useEffect(() => {
    if (empruntTotal > 0 && tauxHypotheque > 0) {
      const hypotheque = empruntTotal * (tauxHypotheque / 100);
      setValue("hypotheque", Math.round(hypotheque));
    } else {
      setValue("hypotheque", 0);
    }
  }, [empruntTotal, tauxHypotheque, setValue]);

  //Store values + calcul du total financement
  useEffect(() => {
    setFinancement(values);
    setTotalFinancement(calculateFinancement(values));
  }, [values, setFinancement, setTotalFinancement]);

  return {
    register,
    watch,
    control,
    errors,
    totalFinancement,
    handleApportChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      lastEdited.current = "apport";
      register("apport").onChange(e);
    },
    handleTauxApportChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      lastEdited.current = "tauxApport";
      register("tauxApport").onChange(e);
    },
  };
};
