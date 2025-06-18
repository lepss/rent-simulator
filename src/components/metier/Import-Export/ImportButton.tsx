import { useSimulationStore } from "@/hooks/useGlobalSimulation";
import type { AchatValues } from "@/lib/validations/achat.schema";
import type { DepenseValues } from "@/lib/validations/depense.schema";
import type { FinancementValues } from "@/lib/validations/financement.schema";
import type { LotValues } from "@/lib/validations/lot.schema";

type ImportButtonProps = {
  setAchatFormValues: (data: AchatValues) => void;
  setLotsFormValues: (data: LotValues[]) => void;
  setDepensesFormValues: (data: DepenseValues[]) => void;
  setFinancementFormValues: (data: FinancementValues) => void;
};

export const ImportButton = ({
  setAchatFormValues,
  setLotsFormValues,
  setDepensesFormValues,
  setFinancementFormValues,
}: ImportButtonProps) => {
  const setAll = useSimulationStore((state) => state.setAll);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        // Store update
        setAll({
          achat: data.achat,
          achatTotal: data.achatTotal,
          lots: data.lots,
          totalVentesLots: data.totalVentesLots,
          depenses: data.depenses,
          totalDepenses: data.totalDepenses,
          financement: data.financement,
          totalFinancement: data.totalFinancement,
        });

        // Form updates (pour interface réactive)
        if (setAchatFormValues && data.achat) setAchatFormValues(data.achat);
        if (setLotsFormValues && data.lots) setLotsFormValues(data.lots);
        if (setDepensesFormValues && data.depenses)
          setDepensesFormValues(data.depenses);
        if (setFinancementFormValues && data.financement)
          setFinancementFormValues(data.financement);

        alert("Importation réussie !");
      } catch (error) {
        alert("Erreur lors de l'importation du fichier.");
        console.error("Erreur parsing JSON :", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <label className="cursor-pointer inline-block p-2 bg-green-500 text-white rounded">
      Importer
      <input
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: "none" }}
      />
    </label>
  );
};
