import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AchatForm } from "./components/metier/Achat/AchatForm";
import { DepensesForm } from "./components/metier/Depenses/DepensesForm";
import { FinancementForm } from "./components/metier/Financement/FinancementForm";
import { LotsForm } from "./components/metier/Lots/LotsForm";
import { ResultatsForm } from "./components/metier/Resultats/ResultatsForm";
import { Button } from "./components/ui/button";

function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: "Rentability_Simulation",
  //   // Optional: onBeforeGetContent, onAfterPrint, etc.
  // });

  return (
    <main className="bg-gray-50">
      <div className="container mx-auto flex min-h-screen flex-col gap-4">
        <header className="p-10">
          <h1 className="text-5xl text-center font-bold uppercase tracking-wide">
            Rentability simulator
          </h1>
        </header>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={reactToPrintFn}>Export PDF</Button>
          <Button>Export JSON</Button>
          <Button>Import JSON</Button>
        </div>
        <div
          ref={contentRef}
          className="bg-white p-6 shadow rounded-lg print:bg-white print:shadow-none"
        >
          <h1 className="hidden p-10 text-4xl text-center font-bold uppercase tracking-wide print:block">
            Simulateur de rentabilité
          </h1>
          <AchatForm />
          <div className="page-break" />
          <LotsForm />
          <div className="page-break" />
          <DepensesForm />
          <div className="page-break" />
          <FinancementForm />
          <div className="page-break" />
          <ResultatsForm />
        </div>
        <footer className="p-10"></footer>
      </div>
    </main>
  );
}

export default App;
