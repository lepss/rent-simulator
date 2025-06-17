import { SectionLayout } from "@/components/layout/sectionLayout";
import { Button } from "@/components/ui/button";
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
import { type LotValues, lotSchema } from "@/lib/validations/lot.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { calculateLots } from "./useLots";

export const LotsForm = () => {
  const [lotNumber, setLotNumber] = useState(1);
  const setLots = useSimulationStore((state) => state.setLots);
  const { register, watch, control } = useForm<LotValues>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      nom: "",
      prixVente: 0,
      surface: 0,
      prixM2: 0,
      tva: "",
      ponderation: 0,
    },
  });

  const values = watch();
  const result = calculateLots(values);

  useEffect(() => {
    setLots(result);
  }, [values]);

  const AddLot = () => {
    let count = lotNumber;
    setLotNumber(count++);
  };

  const RemoveLot = () => {
    let count = lotNumber;
    setLotNumber(count--);
  };

  return (
    <SectionLayout title="lots">
      <form>
        <div className="flex w-full items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="designation">Désignation</Label>
            <Input
              type="text"
              id="designation"
              placeholder="Désignation"
              {...register("nom")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="prix-revente">Prix de revente</Label>
            <Input
              type="number"
              id="prix-revente"
              placeholder="Prix de revente"
              {...register("prixVente")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="surface">Surface</Label>
            <Input
              type="number"
              id="surface"
              placeholder="Surface"
              {...register("surface")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="prix-m2">Prix au m2</Label>
            <Input
              type="number"
              id="prix-m2"
              placeholder="Prix au m2"
              {...register("prixM2")}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="tva">TVA</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="TVA" />
              </SelectTrigger>
              <SelectContent id="tva" {...register("tva")}>
                <SelectItem value="exonere">Exonéré de TVA</SelectItem>
                <SelectItem value="marge">TVA sur marge</SelectItem>
                <SelectItem value="integral">TVA intégral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="ponderation">Pondération</Label>
            <Input
              type="number"
              id="ponderation"
              placeholder="Pondération"
              {...register("ponderation")}
            />
          </div>
        </div>
      </form>
      <div className="flex items-center justify-center my-4">
        <Button>
          <PlusCircleIcon size={8} />
          <p>Ajouter un lot</p>
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col items-end text-xl font-bold uppercase">
        <p>Total ventes</p>
        <p>240 000 €</p>
      </div>
    </SectionLayout>
  );
};
