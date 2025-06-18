import { exportAchatData, importAchatData } from "@/lib/exportImport";
import { Button } from "./ui/button";

export const ImportExportPanel = () => {
  const handleAchatImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await importAchatData(file);
    if (data) {
      console.log("update");
      // useSimulationStore.getState().setAchat(data);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button asChild>
        <label htmlFor="import-achat" className="cursor-pointer">
          Importer un achat
        </label>
      </Button>
      <input
        type="file"
        accept="application/json"
        id="import-achat"
        onChange={handleAchatImport}
        className="hidden"
      />
      <Button onClick={exportAchatData}>Exporter l'achat</Button>
    </div>
  );
};
