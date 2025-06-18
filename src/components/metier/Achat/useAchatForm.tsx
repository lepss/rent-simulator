import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import { achatSchema, type AchatValues } from "@/lib/validations/achat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { calculateAchat } from "./useAchat";

export const useAchatForm = () => {
  const setAchat = useSimulationStore((s) => s.setAchat);
  const setAchatTotal = useSimulationStore((s) => s.setAchatTotal);
  const achatTotal = useSimulationStore((s) => s.achatTotal);

  const {
    register,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<AchatValues>({
    resolver: zodResolver(achatSchema),
    mode: "onChange",
    defaultValues: {
      prixNetVendeur: 0,
      fraisAgence: 0,
      prixFAI: 0,
      aCharge: "acquereur",
      fraisAcquisition: 0,
      tauxAcquisition: 0,
      fraisAvocat: 0,
    },
  });

  const values = watch();

  const prixNetVendeur = useWatch({ name: "prixNetVendeur", control });
  const fraisAgence = useWatch({ name: "fraisAgence", control });
  const aCharge = useWatch({ name: "aCharge", control });
  const prixFAI = useWatch({ name: "prixFAI", control });
  const taux = useWatch({ name: "tauxAcquisition", control });
  const frais = useWatch({ name: "fraisAcquisition", control });

  const lastEdited = useRef<"frais" | "taux" | null>(null);

  // Calcul du prix FAI
  useEffect(() => {
    let newPrixFAI = prixNetVendeur;
    if (aCharge === "acquereur") newPrixFAI += fraisAgence;
    if (newPrixFAI !== prixFAI) setValue("prixFAI", newPrixFAI);
    console.log("prixFAI", newPrixFAI);
  }, [prixNetVendeur, fraisAgence, aCharge, prixFAI, setValue]);

  // Calcul du frais en fonction du taux si Prix FAI est renseigné
  useEffect(() => {
    if (lastEdited.current === "taux" && prixFAI) {
      const newFrais = Math.round(prixFAI * (Number(taux) / 100));
      setValue("fraisAcquisition", newFrais);
    }
    console.log("taux", taux);
  }, [taux, prixFAI, setValue]);

  // Calcul du taux en fonction du frais si Prix FAI est renseigné
  useEffect(() => {
    if (lastEdited.current === "frais" && prixFAI) {
      const newTaux = (Number(frais) / prixFAI) * 100;
      setValue("tauxAcquisition", Math.round(newTaux * 100) / 100);
    }
    console.log("frais", frais);
  }, [frais, prixFAI, setValue]);

  // Store values + calcul du prix total achat
  useEffect(() => {
    setAchat(values);
    setAchatTotal(calculateAchat(values));
    console.log("values", values);
  }, [values, setAchat, setAchatTotal]);

  // Nouvelle fonction pour importer / synchroniser finement
  const setFormValues = (newValues: AchatValues) => {
    console.log("setFormValues");

    // Reset form with new values
    reset(newValues);
    // Mettre à jour store (peut être redondant si effet useEffect ci-dessus fonctionne bien)
    setAchat(newValues);
    setAchatTotal(calculateAchat(newValues));
  };

  return {
    register,
    watch,
    control,
    errors,
    reset,
    handleFraisChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      lastEdited.current = "frais";
      register("fraisAcquisition").onChange(e);
    },
    handleTauxChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      lastEdited.current = "taux";
      register("tauxAcquisition").onChange(e);
    },
    achatTotal,
    setFormValues,
  };
};
