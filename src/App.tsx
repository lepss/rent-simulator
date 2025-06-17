import { AchatForm } from "./components/metier/Achat/AchatForm";
import { FinancementForm } from "./components/metier/Financement/FinancementForm";
import { LotsForm } from "./components/metier/Lots/LotsForm";

function App() {
  return (
    <main className="bg-gray-50">
      <div className="container mx-auto flex min-h-screen flex-col gap-4">
        <header className="p-10">
          <h1 className="text-3xl text-center font-bold uppercase">
            Rent simulator
          </h1>
        </header>
        <AchatForm />
        <LotsForm />
        <FinancementForm />
      </div>
    </main>
  );
}

export default App;
