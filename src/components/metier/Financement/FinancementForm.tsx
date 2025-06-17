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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { calculateFinancement } from "./useFinancement";

export const FinancementForm = () => {
  const setFinancement = useSimulationStore((state) => state.setFinancement);
  const { register, watch, control } = useForm<FinancementValues>({
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

  const values = watch();
  const result = calculateFinancement(values);

  useEffect(() => {
    setFinancement(result);
  }, [values]);

  return (
    <SectionLayout title="financement">
      <form id="financement-form" className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="apport">Apport (€)</Label>
            <Input
              type="number"
              id="apport"
              placeholder="Apport"
              {...register("apport")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="taux-apport">Taux d'apport (%)</Label>
            <Input
              type="number"
              id="taux-apport"
              placeholder="Taux d'apport"
              {...register("tauxApport")}
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
              {...register("interetEmprunt")}
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
              {...register("tauxInteret")}
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
              {...register("dureeRemboursementEmprunt")}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="commission-engagement">
              Commission d'engagement (€)
            </Label>
            <Input
              type="number"
              id="commission-engagement"
              placeholder="Commission d'engagement"
              {...register("commissionEngagement")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="taux-commission-engagement">
              Taux commission d'engagement (%)
            </Label>
            <Input
              type="number"
              id="taux-commission-engagement"
              placeholder="Taux commission d'engagement "
              {...register("tauxCommissionEngagement")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="duree-remboursement-engagement">
              Durée remboursement commission
            </Label>
            <Input
              type="number"
              id="duree-remboursement-commission"
              placeholder="Durée remboursement commission"
              {...register("dureeRemboursementCommissionEngagement")}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="hypotheque">Hypothèque (€)</Label>
            <Input
              type="number"
              id="hypotheque"
              placeholder="Hypotéque"
              {...register("hypotheque")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="taux-hypotheque">Taux Hypothèque</Label>
            <Input
              type="number"
              id="taux-hypotheque"
              placeholder="Taux hypothèque"
              {...register("tauxHypotheque")}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="frais-dossier">Frais de dossier (€)</Label>
            <Input
              type="number"
              id="frais-dossier"
              placeholder="Frais de dossier"
              {...register("fraisDossier")}
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
