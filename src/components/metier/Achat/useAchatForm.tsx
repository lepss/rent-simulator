import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import { achatSchema, type AchatValues } from "@/lib/validations/achat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

export const useAchatForm = () => {
  const setAchat = useSimulationStore((s) => s.setAchat);
  const achatTotal = useSimulationStore((s) => s.achatTotal());

  const {
    register,
    watch,
    setValue,
    control,
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
      tauxAcquisition: 3,
      fraisAvocat: 0,
    },
  });

  const watchedValues = useWatch<AchatValues>({ control });
  const {
    prixNetVendeur = 0,
    fraisAgence = 0,
    aCharge = "acquereur",
    prixFAI = 0,
    tauxAcquisition = 3,
    fraisAcquisition = 0,
    fraisAvocat = 0,
  } = watchedValues ?? {};

  const lastEdited = useRef<"frais" | "taux" | null>(null);

  // Calcul du prix FAI
  useEffect(() => {
    let newPrixFAI = prixNetVendeur;
    if (aCharge === "acquereur") newPrixFAI += fraisAgence;
    if (newPrixFAI !== prixFAI) setValue("prixFAI", newPrixFAI);
  }, [prixNetVendeur, fraisAgence, aCharge, prixFAI, setValue]);

  // Calcul du frais en fonction du taux si Prix FAI est renseigné
  useEffect(() => {
    if (lastEdited.current === "taux" && prixFAI) {
      const newFrais = Math.round(prixFAI * (Number(tauxAcquisition) / 100));
      if (newFrais !== fraisAcquisition) setValue("fraisAcquisition", newFrais);
    }
  }, [fraisAcquisition, tauxAcquisition, prixFAI, setValue]);

  // Calcul du taux en fonction du frais si Prix FAI est renseigné
  useEffect(() => {
    if (lastEdited.current === "frais" && prixFAI) {
      const newTaux = (Number(fraisAcquisition) / prixFAI) * 100;
      if (newTaux !== tauxAcquisition)
        setValue("tauxAcquisition", Math.round(newTaux * 100) / 100);
    }
  }, [tauxAcquisition, fraisAcquisition, prixFAI, setValue]);

  // Recalcule automatique fraisAcquisition à partir du taux par défaut quand prixFAI change
  useEffect(() => {
    if (lastEdited.current === null && prixFAI) {
      const newFrais = Math.round(prixFAI * (Number(tauxAcquisition) / 100));
      if (newFrais !== fraisAcquisition) {
        setValue("fraisAcquisition", newFrais);
      }
    }
  }, [prixFAI, tauxAcquisition, fraisAcquisition, setValue]);

  const handleFraisChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      lastEdited.current = "frais";
      register("fraisAcquisition").onChange(e);
    },
    [register]
  );

  const handleTauxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      lastEdited.current = "taux";
      register("tauxAcquisition").onChange(e);
    },
    [register]
  );

  // Store values
  useEffect(() => {
    setAchat({
      prixNetVendeur,
      fraisAgence,
      aCharge,
      prixFAI,
      tauxAcquisition,
      fraisAcquisition,
      fraisAvocat,
    });
  }, [
    prixNetVendeur,
    fraisAgence,
    aCharge,
    prixFAI,
    tauxAcquisition,
    fraisAcquisition,
    fraisAvocat,
    setAchat,
  ]);

  return useMemo(
    () => ({
      register,
      control,
      errors,
      watch,
      achatTotal,
      handleFraisChange,
      handleTauxChange,
    }),
    [
      watch,
      register,
      control,
      errors,
      achatTotal,
      handleFraisChange,
      handleTauxChange,
    ]
  );
};
