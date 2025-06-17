import { SectionLayout } from "@/components/layout/sectionLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import { achatSchema, type AchatValues } from "@/lib/validations/achat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { calculateAchat } from "./useAchat";

export const AchatForm = () => {
  const setAchat = useSimulationStore((state) => state.setAchat);
  // const achat = useSimulationStore((state) => state.achat);
  const { register, watch, control } = useForm<AchatValues>({
    resolver: zodResolver(achatSchema),
    defaultValues: {
      prixNetVendeur: 0,
      fraisAgence: 0,
      prixFAI: 0,
      aCharge: true,
      fraisAcquisition: 0,
      tauxAcquisition: 0,
    },
  });

  const values = watch();
  const result = calculateAchat(values);

  // Update Zustand on every change
  useEffect(() => {
    setAchat(values);
  }, [values]);

  return (
    <SectionLayout title="achats">
      <form id="achat-form" className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="prix-net-vendeur">Prix net vendeur (€)</Label>
            <Input
              type="number"
              id="prix-net-vendeur"
              placeholder="Prix net vendeur"
              {...register("prixNetVendeur")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="frais-agence">Frais d'agence (€)</Label>
            <Input
              type="number"
              id="frais-agence"
              placeholder="Frais d'agence"
              {...register("fraisAgence")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="a-charge">A charge de</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="A charge" />
              </SelectTrigger>
              <SelectContent id="a-charge" {...register("aCharge")}>
                <SelectItem value="acquereur">A charge acquereur</SelectItem>
                <SelectItem value="vendeur">A charge vendeur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="prix-fai">
              Prix FAI (Frais d'agence inclus) (€)
            </Label>
            <Input
              type="number"
              id="prix-fai"
              placeholder="Prix FAI"
              {...register("prixFAI")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="frais-acquisition">Frais d'acquisition (€)</Label>
            <Input
              type="number"
              id="frais-acquisition"
              placeholder="Frais d'acquisition"
              {...register("fraisAcquisition")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="taux-acquisition">%</Label>
            <Input
              type="number"
              id="taux-acquisition"
              placeholder="%"
              {...register("tauxAcquisition")}
            />
          </div>
        </div>
      </form>
      <Separator className="my-4" />
      <div className="flex flex-col items-end text-xl font-bold uppercase">
        <p>Coût total</p>
        <p>240 000 €</p>
      </div>
    </SectionLayout>
  );
};
