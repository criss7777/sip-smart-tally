import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Beer, Wine, Clock, GlassWater, Trash2, MaleSign, FemaleSign, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { BeerTable } from "./BeerTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Beer as BeerType } from "@/types/beer";
import { GenderDialog } from "./GenderDialog";

interface Drink {
  type: 'beer' | 'wine' | 'spirits';
  amount: number;
  timestamp: Date;
  id: string;
  beerName?: string;
  alcoholPercentage?: string;
  beerType?: string;
}

const beerData: BeerType[] = [
  {
    name: "Birra Tirana",
    alcoholPercentage: "4.1%",
    type: "Lager",
    safeAmountMale: "1 deri në 2 shishe (500 ml)",
    safeAmountFemale: "1 shishe (330–500 ml)",
  },
  {
    name: "Birra Korça",
    alcoholPercentage: "4.5%",
    type: "Pilsner",
    safeAmountMale: "1 deri në 2 shishe (500 ml)",
    safeAmountFemale: "1 shishe (330–500 ml)",
  },
  {
    name: "Birra Peja",
    alcoholPercentage: "4.2%",
    type: "Lager",
    safeAmountMale: "1 deri në 2 shishe (500 ml)",
    safeAmountFemale: "1 shishe",
  },
  {
    name: "Birra Stela",
    alcoholPercentage: "4.6%",
    type: "Lager",
    safeAmountMale: "1 deri në 2 shishe",
    safeAmountFemale: "1 shishe",
  },
  {
    name: "Birra Elbar",
    alcoholPercentage: "4.2%",
    type: "Lager",
    safeAmountMale: "1 deri në 2 shishe",
    safeAmountFemale: "1 shishe",
  },
  {
    name: "Amstel / Heineken",
    alcoholPercentage: "5.0%",
    type: "Lager/Pilsner",
    safeAmountMale: "1 shishe e vetme",
    safeAmountFemale: "max. 330 ml",
  },
  {
    name: "Erdinger / Paulaner",
    alcoholPercentage: "5.3–5.5%",
    type: "Weissbier",
    safeAmountMale: "max. 1 shishe",
    safeAmountFemale: "max. 330 ml",
  },
  {
    name: "Guinness",
    alcoholPercentage: "4.2–5.6%",
    type: "Stout",
    safeAmountMale: "max. 1 shishe",
    safeAmountFemale: "max. 330 ml",
  },
  {
    name: "IPA Artizanale",
    alcoholPercentage: "5.5–7.0%",
    type: "IPA",
    safeAmountMale: "max. 1 shishe",
    safeAmountFemale: "max. 330 ml",
  },
];

const beerGuidelines = [
  {
    type: "Light Lager",
    range: "3.5–4.5%",
    limit: { male: 600, female: 400 },
  },
  {
    type: "Regular Lager",
    range: "5.0%",
    limit: { male: 500, female: 330 },
  },
  {
    type: "Strong Lager",
    range: "6–7%",
    limit: { male: 400, female: 300 },
  },
  {
    type: "IPA/Craft",
    range: "6–8%",
    limit: { male: 330, female: 250 },
  },
  {
    type: "Stout/Dark Beer",
    range: "5–7%",
    limit: { male: 400, female: 300 },
  },
  {
    type: "Wheat Beer",
    range: "5.3%",
    limit: { male: 400, female: 300 },
  },
  {
    type: "Alcohol-free",
    range: "<0.5%",
    limit: { male: -1, female: -1 },
  }
];

function findBeerGuideline(alcoholPercentage: string, beerType: string) {
  const percentNum = parseFloat(alcoholPercentage.replace(/[^\d.]/g, ''));
  if (beerType?.toLowerCase().includes("ipa")) return beerGuidelines.find(g => g.type === "IPA/Craft");
  if (beerType?.toLowerCase().includes("wheat")) return beerGuidelines.find(g => g.type === "Wheat Beer");
  if (beerType?.toLowerCase().includes("stout")) return beerGuidelines.find(g => g.type === "Stout/Dark Beer");
  if (percentNum <= 4.5) return beerGuidelines[0];
  if (percentNum === 5) return beerGuidelines[1];
  if (percentNum > 5 && percentNum <= 5.4) return beerType?.toLowerCase().includes("wheat") ? beerGuidelines[5] : beerGuidelines[1];
  if (percentNum >= 6 && percentNum <= 7) return beerGuidelines[2];
  if (percentNum > 7) return beerGuidelines[3];
  if (/alkoh.*free|<0.\d+/.test(alcoholPercentage.toLowerCase())) return beerGuidelines[6];
  return undefined;
}

export const DrinkLogger = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedBeer, setSelectedBeer] = useState<string>("");
  const { toast } = useToast();
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [genderDialogOpen, setGenderDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gender');
    if (saved === 'male' || saved === 'female') {
      setGender(saved);
    } else {
      setGenderDialogOpen(true);
    }
  }, []);

  const handleSelectGender = (g: "male" | "female") => {
    setGender(g);
    localStorage.setItem('gender', g);
    setGenderDialogOpen(false);
  };

  if (!gender) {
    return <GenderDialog open={genderDialogOpen} onSelect={handleSelectGender} />;
  }

  const totalAmount = drinks.reduce((sum, drink) => sum + drink.amount, 0);
  const recommendedLimit = 600;
  const percentOfLimit = Math.min(100, (totalAmount / recommendedLimit) * 100);

  const logDrink = (type: Drink['type'], beerName?: string) => {
    const selectedBeerData = type === 'beer' ? beerData.find(b => b.name === beerName) : null;

    const newDrink: Drink = {
      type,
      amount: type === 'beer' ? 330 : type === 'wine' ? 150 : 45,
      timestamp: new Date(),
      id: Date.now().toString(),
      beerName,
      alcoholPercentage: selectedBeerData?.alcoholPercentage,
      beerType: selectedBeerData?.type
    };

    const warning = type === 'beer' ? checkBeerLimit([...drinks, newDrink], newDrink) : null;

    setDrinks([...drinks, newDrink]);

    toast({
      title: `${beerName || type.charAt(0).toUpperCase() + type.slice(1)} added`,
      description: `${newDrink.amount}ml logged successfully`,
    });

    if (warning) {
      toast({
        title: `Warning: Too much ${warning.type}`,
        description: `You crossed the daily safe limit (${
          gender === "male" ? "Men" : "Women"
        }: ${warning.limit}ml, you're at ${warning.actual}ml). Please drink responsibly!`,
        variant: "destructive",
        icon: <AlertTriangle className="mr-2 text-red-500" />,
      });
    }

    setSelectedBeer("");
  };

  const removeDrink = (id: string) => {
    setDrinks(drinks.filter(drink => drink.id !== id));
    toast({
      title: "Drink removed",
      description: "Drink has been removed from your log"
    });
  };

  const getTypeIcon = (type: Drink['type']) => {
    switch(type) {
      case 'beer': return <Beer className="w-4 h-4" />;
      case 'wine': return <Wine className="w-4 h-4" />;
      case 'spirits': return <GlassWater className="w-4 h-4" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const handleBeerSelect = (value: string) => {
    setSelectedBeer(value);
    logDrink('beer', value);
  };

  const checkBeerLimit = (drinks: Drink[], latest?: Drink) => {
    const genderKey = gender;
    const beerDrinks = drinks.filter(d => d.type === "beer" && d.alcoholPercentage && d.beerType);
    let overLimitInfo: { type?: string; limit?: number; actual?: number } | null = null;

    beerDrinks.forEach(curr => {
      const guideline = findBeerGuideline(curr.alcoholPercentage!, curr.beerType!);
      if (!guideline || guideline.limit[genderKey] === -1) return;
      const sumAmount = beerDrinks
        .filter(d =>
          findBeerGuideline(d.alcoholPercentage!, d.beerType!)?.type === guideline.type
        )
        .reduce((acc, d) => acc + d.amount, 0);

      if (sumAmount > guideline.limit[genderKey]) {
        overLimitInfo = {
          type: guideline.type,
          limit: guideline.limit[genderKey],
          actual: sumAmount,
        };
      }
    });

    if (latest && latest.type === "beer" && latest.alcoholPercentage && latest.beerType) {
      const guideline = findBeerGuideline(latest.alcoholPercentage, latest.beerType);
      if (guideline && guideline.limit[genderKey] !== -1) {
        const thisAmount = beerDrinks
          .filter(
            d => findBeerGuideline(d.alcoholPercentage!, d.beerType!)?.type === guideline.type
          )
          .reduce((a, d) => a + d.amount, latest.amount);
        if (thisAmount > guideline.limit[genderKey]) {
          overLimitInfo = {
            type: guideline.type,
            limit: guideline.limit[genderKey],
            actual: thisAmount,
          };
        }
      }
    }

    return overLimitInfo;
  };

  return (
    <div className="space-y-8">
      <GenderDialog open={genderDialogOpen} onSelect={handleSelectGender} />

      <div className="p-4 max-w-md mx-auto">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">Drink Tracker</CardTitle>
            <div className="flex gap-3 justify-center mt-2">
              <span className="text-sm flex items-center gap-1">
                {gender === "male" && <MaleSign className="w-4 h-4 text-blue-400" />} 
                {gender === "female" && <FemaleSign className="w-4 h-4 text-pink-400" />} 
                {gender === "male" ? "Male" : "Female"}
              </span>
              <Button size="sm" variant="outline" className="text-xs py-1 px-2" onClick={() => setGenderDialogOpen(true)}>
                Switch Gender
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Daily consumption</h3>
                  <span className="text-sm font-medium">{totalAmount}ml / {recommendedLimit}ml</span>
                </div>
                <Progress 
                  value={percentOfLimit} 
                  className={`h-2 ${percentOfLimit > 80 ? "bg-red-500" : "bg-blue-500"}`}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                  <Select value={selectedBeer} onValueChange={handleBeerSelect}>
                    <SelectTrigger className="w-full h-full min-h-[96px] flex flex-col items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                      <Beer className="w-6 h-6" />
                      <SelectValue placeholder="Select Beer" />
                    </SelectTrigger>
                    <SelectContent>
                      {beerData.map((beer) => (
                        <SelectItem key={beer.name} value={beer.name}>
                          {beer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={() => logDrink('wine')}
                  className="flex flex-col items-center justify-center gap-2 py-6 bg-rose-600 hover:bg-rose-700"
                >
                  <Wine className="w-6 h-6" />
                  <span className="text-xs font-medium">Wine</span>
                </Button>
                
                <Button
                  onClick={() => logDrink('spirits')}
                  className="flex flex-col items-center justify-center gap-2 py-6 bg-blue-600 hover:bg-blue-700"
                >
                  <GlassWater className="w-6 h-6" />
                  <span className="text-xs font-medium">Spirits</span>
                </Button>
              </div>
              
              {drinks.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold">Today's Log</h3>
                    
                    <div className="space-y-2 mt-3 max-h-[240px] overflow-y-auto pr-1">
                      {drinks.map((drink) => (
                        <div 
                          key={drink.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              drink.type === 'beer' ? 'bg-amber-100 text-amber-600' : 
                              drink.type === 'wine' ? 'bg-rose-100 text-rose-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {getTypeIcon(drink.type)}
                            </div>
                            <div>
                              <p className="font-medium">{drink.beerName || drink.type.charAt(0).toUpperCase() + drink.type.slice(1)}</p>
                              <div className="text-xs text-gray-500 space-y-0.5">
                                <p>{drink.amount}ml</p>
                                {drink.alcoholPercentage && (
                                  <p>Alcohol: {drink.alcoholPercentage}</p>
                                )}
                                {drink.beerType && (
                                  <p>Type: {drink.beerType}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(drink.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <button 
                              onClick={() => removeDrink(drink.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {drinks.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No drinks logged today</p>
                  <p className="text-sm text-gray-400 mt-1">Tap a button above to log your first drink</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Data On Safe Beer Consumption</h2>
        <div className="overflow-x-auto rounded-lg shadow-md bg-white mb-6">
          <table className="min-w-[540px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="py-2 px-4">Beer Type</th>
                <th className="py-2 px-4">% Alcohol</th>
                <th className="py-2 px-4">Safe Limit (Men)</th>
                <th className="py-2 px-4">Safe Limit (Women)</th>
              </tr>
            </thead>
            <tbody>
              {beerGuidelines.map((g) => (
                <tr key={g.type} className="text-center border-b last:border-0">
                  <td className="py-2 px-4 font-semibold text-left">{g.type}</td>
                  <td className="py-2 px-4">{g.range}</td>
                  <td className="py-2 px-4">{g.limit.male === -1 ? "No strict limit" : `${g.limit.male} ml`}</td>
                  <td className="py-2 px-4">{g.limit.female === -1 ? "No strict limit" : `${g.limit.female} ml`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-2xl font-bold mb-4">Informacion për Llojet e Birrës</h2>
        <BeerTable />
      </div>
    </div>
  );
};
