import { SectionLayout } from "@/components/layout/sectionLayout";
import { Card } from "@/components/ui/card";
import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import { ChartNoAxesCombinedIcon } from "lucide-react";

export const ResultatsForm = () => {
  const achatTotal = useSimulationStore((s) => s.achatTotal);
  const totalDepenses = useSimulationStore((s) => s.totalDepenses);
  const totalFinancement = useSimulationStore((s) => s.totalFinancement);
  const totalVentesLots = useSimulationStore((s) => s.totalVentesLots);

  const coutTotal =
    (achatTotal ?? 0) + (totalDepenses ?? 0) + (totalFinancement ?? 0);

  const marge = totalVentesLots - coutTotal;

  return (
    <SectionLayout title="resultats" icon={ChartNoAxesCombinedIcon}>
      <div className="flex flex-col gap-8">
        <div className="flex gap-8">
          <Card
            label="Chiffres d'affaire"
            value={totalVentesLots}
            unit="€"
            className="bg-gray-100"
          />
          <Card
            label="Coût total"
            value={coutTotal}
            unit={"€"}
            className="bg-gray-100"
          />
          <Card
            label="Marge"
            value={marge}
            unit={"€"}
            className="bg-gray-100"
          />
        </div>
        <div className="flex gap-4">
          <Card label="TVA" value={"-"} unit={"€"} className="bg-gray-100" />
          <Card
            label="Marge nette de TVA"
            value={"-"}
            unit={"€"}
            className="bg-gray-100"
          />
          <Card
            label="Rentabilité"
            value={"-"}
            unit={"%"}
            className="bg-amber-400"
          />
        </div>
      </div>
    </SectionLayout>
  );
};
