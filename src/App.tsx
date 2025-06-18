import { AchatForm } from "./components/metier/Achat/AchatForm";
import { DepensesForm } from "./components/metier/Depenses/DepensesForm";
import { FinancementForm } from "./components/metier/Financement/FinancementForm";
import { LotsForm } from "./components/metier/Lots/LotsForm";
import { ResultatsForm } from "./components/metier/Resultats/ResultatsForm";

function App() {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto flex min-h-screen flex-col gap-4">
        <header className="p-10">
          <h1 className="text-5xl text-center font-bold uppercase tracking-wide">
            Rentability simulator
          </h1>
        </header>
        <AchatForm />
        <LotsForm />
        <DepensesForm />
        <FinancementForm />
        <ResultatsForm />
        <footer className="p-10"></footer>
      </div>
    </main>
  );
}

export default App;
