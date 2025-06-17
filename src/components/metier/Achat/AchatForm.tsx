import { SectionLayout } from "@/components/layout/sectionLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import { achatSchema, type AchatValues } from "@/lib/validations/achat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { HouseIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { calculateAchat } from "./useAchat";

export const AchatForm = () => {
  const setAchat = useSimulationStore((state) => state.setAchat);
  const setAchatTotal = useSimulationStore((state) => state.setAchatTotal);
  const achatTotal = useSimulationStore((state) => state.achatTotal);
  const { register, watch, control, setValue } = useForm<AchatValues>({
    resolver: zodResolver(achatSchema),
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

  useEffect(() => {
    let newPrixFAI = prixNetVendeur ?? 0;

    if (aCharge === "acquereur") {
      newPrixFAI = (prixNetVendeur ?? 0) + (fraisAgence ?? 0);
    }

    // Mets à jour prixFAI seulement si différent pour éviter boucle infinie
    if (newPrixFAI !== prixFAI) {
      setValue("prixFAI", newPrixFAI);
    }
  }, [prixNetVendeur, fraisAgence, aCharge]);

  // 🧠 Synchronisation taux <-> frais d'acquisition
  const lastEdited = useRef<"frais" | "taux" | null>(null);

  const prixFAI = useWatch({ name: "prixFAI", control });
  const taux = useWatch({ name: "tauxAcquisition", control });
  const frais = useWatch({ name: "fraisAcquisition", control });

  // Quand utilisateur modifie le taux → on met à jour les frais
  useEffect(() => {
    if (lastEdited.current === "taux" && prixFAI) {
      const newFrais = Math.round(prixFAI * (Number(taux) / 100));
      setValue("fraisAcquisition", newFrais);
    }
  }, [taux]);

  // Quand utilisateur modifie les frais → on met à jour le taux
  useEffect(() => {
    if (lastEdited.current === "frais" && prixFAI) {
      const newTaux = (Number(frais) / prixFAI) * 100;
      setValue("tauxAcquisition", Math.round(newTaux * 100) / 100);
    }
  }, [frais]);

  // Quand le prix FAI change → on ne met à jour que le taux
  useEffect(() => {
    if (prixFAI && lastEdited.current !== null && frais !== undefined) {
      const newTaux = (Number(frais) / prixFAI) * 100;
      setValue("tauxAcquisition", Math.round(newTaux * 100) / 100);
    }
  }, [prixFAI]);

  // Gestion des événements utilisateur
  const handleFraisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastEdited.current = "frais";
    register("fraisAcquisition").onChange(e);
  };

  const handleTauxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastEdited.current = "taux";
    register("tauxAcquisition").onChange(e);
  };

  // Update Zustand on every change
  useEffect(() => {
    setAchat(values);
    setAchatTotal(calculateAchat(values));
  }, [values]);

  return (
    <SectionLayout title="achats" icon={HouseIcon}>
      <form id="achat-form" className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="prix-net-vendeur">Prix net vendeur</Label>
            <Input
              type="number"
              id="prix-net-vendeur"
              placeholder="Prix net vendeur"
              unit="€"
              {...register("prixNetVendeur", { valueAsNumber: true })}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="frais-agence">Frais d'agence</Label>
            <Input
              type="number"
              id="frais-agence"
              placeholder="Frais d'agence"
              unit="€"
              {...register("fraisAgence", { valueAsNumber: true })}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="a-charge">A charge</Label>
            <select
              id="a-charge"
              className="w-full border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              {...register("aCharge")}
            >
              <option value="acquereur">Acquereur</option>
              <option value="vendeur">Vendeur</option>
            </select>
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="prix-fai">Prix FAI (Frais d'agence inclus)</Label>
            <Input
              type="number"
              id="prix-fai"
              placeholder="Prix FAI"
              unit="€"
              {...register("prixFAI", { valueAsNumber: true })}
              readOnly
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="frais-acquisition">Frais d'acquisition</Label>
            <Input
              type="number"
              id="frais-acquisition"
              placeholder="Frais d'acquisition"
              unit="€"
              {...register("fraisAcquisition", { valueAsNumber: true })}
              onChange={handleFraisChange}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="taux-acquisition">Taux frais d'acquisition</Label>
            <Input
              type="number"
              id="taux-acquisition"
              placeholder="Taux frais d'acquisition"
              unit="%"
              {...register("tauxAcquisition", { valueAsNumber: true })}
              onChange={handleTauxChange}
            />
          </div>
        </div>
        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="frais-avocat">Frais avocat</Label>
            <Input
              type="number"
              id="frais-avocat"
              placeholder="Frais avocat"
              unit="€"
              {...register("fraisAvocat", { valueAsNumber: true })}
            />
          </div>
        </div>
      </form>
      <Separator className="my-4" />
      <div className="flex flex-col items-end text-xl font-bold uppercase">
        <p className="text-sm">Coût total</p>
        <p>{achatTotal.toLocaleString("fr-FR")} €</p>
      </div>
    </SectionLayout>
  );
};
