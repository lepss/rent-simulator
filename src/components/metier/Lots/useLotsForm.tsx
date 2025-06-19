import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import { lotSchema, type LotValues } from "@/lib/validations/lot.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { z } from "zod";

type FormValues = {
  lots: LotValues[];
};

const formSchema = z.object({
  lots: lotSchema.array(),
});
export const useLotsForm = () => {
  const setLots = useSimulationStore((e) => e.setLots);
  const totalVentesLots = useSimulationStore((e) => e.totalVentesLots());
  const achat = useSimulationStore.getState().achat;

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
      lots: [
        {
          id: 0,
          nom: "",
          prixVente: 0,
          surface: 0,
          prixM2: 0,
          regimeTVA: "exonere",
          ponderation: 0,
          tva: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lots" });

  const lots = useWatch({ control, name: "lots" });
  const [debouncedLots] = useDebounce(lots, 500); // ✅ debounce 500ms

  useEffect(() => {
    if (!debouncedLots) return;

    const updatedLots = lots.map((lot, i) => ({
      ...lot,
      id: i,
      prixVente: lot?.prixVente ?? 0,
      surface: lot?.surface ?? 0,
      prixM2: lot?.prixM2 ?? 0,
      ponderation: lot?.ponderation ?? 0,
    }));

    // Recalculer prixM2 si surface > 0
    updatedLots.forEach((lot, i) => {
      if (lot.surface > 0) {
        const newPrixM2 = +(lot.prixVente / lot.surface).toFixed(2);
        if (newPrixM2 !== lot.prixM2) {
          setValue(`lots.${i}.prixM2`, newPrixM2, { shouldDirty: true });
          lot.prixM2 = newPrixM2; // mettre à jour la copie locale aussi
        }
      }
    });

    // Filtrer les lots valides
    const validLots = updatedLots.filter(
      (lot): lot is LotValues =>
        lot &&
        typeof lot.nom === "string" &&
        typeof lot.prixVente === "number" &&
        typeof lot.surface === "number" &&
        typeof lot.prixM2 === "number" &&
        typeof lot.regimeTVA === "string" &&
        typeof lot.ponderation === "number"
    );

    //Calcul de la TVA pour chaque lot en fonction du regime de TVA et du prix net de vendeur de achat -> TAUX tva = 20%
    const TauxTVA = 20;
    validLots.forEach((lot) => {
      if (lot.regimeTVA === "exonere") {
        lot.tva = 0;
      } else if (lot.regimeTVA === "integral") {
        const prixTTC = lot.prixVente;
        const prixHT = prixTTC / (1 + TauxTVA / 100);
        lot.tva = prixTTC - prixHT;
      } else if (lot.regimeTVA === "marge") {
        if (achat?.prixNetVendeur) {
          const marge =
            lot.prixVente - (achat?.prixNetVendeur * lot.ponderation) / 100;
          const prixTTC = marge;
          const prixHT = prixTTC / (1 + TauxTVA / 100);
          lot.tva = prixTTC - prixHT;
        }
      }
    });

    // MAJ du store
    setLots(validLots);
  }, [setLots, setValue, achat?.prixNetVendeur, debouncedLots]);

  return {
    register,
    watch,
    control,
    setValue,
    fields,
    append,
    remove,
    errors,
    totalVentesLots,
  };
};
