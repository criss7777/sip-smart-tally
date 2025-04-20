
import { DrinkLogger } from "@/components/DrinkLogger";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sip Smart Tally</h1>
        <DrinkLogger />
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
