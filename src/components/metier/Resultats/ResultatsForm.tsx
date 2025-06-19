import { SectionLayout } from "@/components/layout/sectionLayout";
import { Card } from "@/components/ui/card";
import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import { ChartNoAxesCombinedIcon } from "lucide-react";

export const ResultatsForm = () => {
  const coutTotal = useSimulationStore((s) => s.coutTotal());
  const TVA = useSimulationStore((s) => s.TVA());
  const marge = useSimulationStore((s) => s.marge());
  const margeNetteTVA = useSimulationStore((s) => s.margeNetteTVA());
  const rentabilite = useSimulationStore((s) => s.rentabilite());
  const totalVentesLots = useSimulationStore((s) => s.totalVentesLots());

  return (
    <SectionLayout title="resultats" icon={ChartNoAxesCombinedIcon}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-8">
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
        <div className="flex flex-col gap-8 md:flex-row md:gap-8">
          <Card label="TVA" value={TVA} unit={"€"} className="bg-gray-100" />
          <Card
            label="Marge nette de TVA"
            value={margeNetteTVA}
            unit={"€"}
            className="bg-gray-100"
          />
          <Card
            label="Rentabilité"
            value={rentabilite}
            unit={"%"}
            className="bg-amber-400"
          />
        </div>
      </div>
    </SectionLayout>
  );
};
