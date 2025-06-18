import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import {
  depenseSchema,
  type DepenseValues,
} from "@/lib/validations/depense.schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
export const useDepensesForm = () => {
  const setDepenses = useSimulationStore((s) => s.setDepenses);
  const setTotalDepenses = useSimulationStore((s) => s.setTotalDepenses);
  const totalDepenses = useSimulationStore((s) => s.totalDepenses);
  const lots = useSimulationStore((s) => s.lots);

  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      depenses: [
        {
          id: 0,
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

    const updated = depenses.map((d, i) => ({
      ...d,
      id: i,
      prixTTC: d?.prixTTC ?? 0,
      tauxTVA: d?.tauxTVA ?? 0,
      quantite: d?.quantite ?? 1,
    }));

    updated.forEach((depense, i) => {
      const { prixTTC = 0, tauxTVA = 0 } = depense;

      // Calcul du prix HT
      const prixHT =
        tauxTVA > 0
          ? Number((prixTTC / (1 + tauxTVA / 100)).toFixed(2))
          : prixTTC;

      // Calcul de la TVA
      const tva = Number((prixTTC - prixHT).toFixed(2));

      // Mise à jour si changement détecté
      if (prixHT !== depense.prixHT) {
        setValue(`depenses.${i}.prixHT`, prixHT);
        depense.prixHT = prixHT;
      }

      if (tva !== depense.TVA) {
        setValue(`depenses.${i}.TVA`, tva);
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

    setDepenses(validDepenses);
    setTotalDepenses(calculateDepenses(validDepenses));
  }, [depenses, setDepenses, setTotalDepenses, setValue]);

  useEffect(() => {
    if (!depenses || !Array.isArray(lots)) return;

    const validLotIds = new Set(lots.map((lot) => lot.id));

    const cleanedDepenses = depenses.map((depense) => ({
      ...depense,
      lotsIndex: (depense.lotsIndex || []).filter((id) => validLotIds.has(id)),
    }));

    const hasChanged = cleanedDepenses.some((depense, i) => {
      const original = depenses[i]?.lotsIndex || [];
      const cleaned = depense.lotsIndex;

      return (
        original.length !== cleaned.length ||
        !original.every((id, index) => id === cleaned[index])
      );
    });

    if (hasChanged) {
      setDepenses(cleanedDepenses);
      setTotalDepenses(calculateDepenses(cleanedDepenses));
    }
  }, [lots, depenses, setDepenses, setTotalDepenses]);

  return {
    register,
    watch,
    control,
    setValue,
    errors,
    fields,
    append,
    remove,
    totalDepenses,
    lots,
  };
};
