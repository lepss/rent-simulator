import { AchatForm } from "./components/metier/Achat/AchatForm";
import { DepensesForm } from "./components/metier/Depenses/DepensesForm";
import { FinancementForm } from "./components/metier/Financement/FinancementForm";
import { LotsForm } from "./components/metier/Lots/LotsForm";

function App() {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto flex min-h-screen flex-col gap-4">
        <header className="p-10">
          <h1 className="text-3xl text-center font-bold uppercase">
            Rentability simulator
          </h1>
        </header>
        <AchatForm />
        <LotsForm />
        <DepensesForm />
        <FinancementForm />
      </div>
    </main>
  );
}

export default App;
