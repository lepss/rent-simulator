import { AchatForm } from "./components/metier/Achat/AchatForm";
import { useAchatForm } from "./components/metier/Achat/useAchatForm";
import { DepensesForm } from "./components/metier/Depenses/DepensesForm";
import { useDepensesForm } from "./components/metier/Depenses/useDepensesForm";
import { FinancementForm } from "./components/metier/Financement/FinancementForm";
import { useFinancementForm } from "./components/metier/Financement/useFinancementForm";
import { ExportButton } from "./components/metier/Import-Export/ExportButton";
import { ImportButton } from "./components/metier/Import-Export/ImportButton";
import { LotsForm } from "./components/metier/Lots/LotsForm";
import { useLotsForm } from "./components/metier/Lots/useLotsForm";
import { ResultatsForm } from "./components/metier/Resultats/ResultatsForm";

function App() {
  const achatForm = useAchatForm();
  const lotsForm = useLotsForm();
  const depensesForm = useDepensesForm();
  const financementForm = useFinancementForm();

  return (
    <main className="bg-gray-50">
      <div className="container mx-auto flex min-h-screen flex-col gap-4">
        <header className="p-10">
          <h1 className="text-5xl text-center font-bold uppercase tracking-wide">
            Rentability simulator
          </h1>
        </header>
        <AchatForm achatForm={achatForm} />
        <LotsForm lotsForm={lotsForm} />
        <DepensesForm depensesForm={depensesForm} />
        <FinancementForm financementForm={financementForm} />
        <ResultatsForm />
        <ExportButton />
        <ImportButton
          setAchatFormValues={achatForm.setFormValues}
          setLotsFormValues={lotsForm.setFormValues}
          setDepensesFormValues={depensesForm.setFormValues}
          setFinancementFormValues={financementForm.setFormValues}
        />
        <footer className="p-10"></footer>
      </div>
    </main>
  );
}

export default App;
