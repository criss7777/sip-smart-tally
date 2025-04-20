import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Beer, Wine, Clock, GlassWater, Trash2 } from "lucide-react";
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

export const DrinkLogger = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedBeer, setSelectedBeer] = useState<string>("");
  const { toast } = useToast();
  
  const totalAmount = drinks.reduce((sum, drink) => sum + drink.amount, 0);
  const recommendedLimit = 600;
  const percentOfLimit = Math.min(100, (totalAmount / recommendedLimit) * 100);

  const logDrink = (type: Drink['type'], beerName?: string) => {
    const selectedBeerData = type === 'beer' ? beerData.find(b => b.name === beerName) : null;
    
    const newDrink = {
      type,
      amount: type === 'beer' ? 330 : type === 'wine' ? 150 : 45,
      timestamp: new Date(),
      id: Date.now().toString(),
      beerName,
      alcoholPercentage: selectedBeerData?.alcoholPercentage,
      beerType: selectedBeerData?.type
    };
    
    setDrinks([...drinks, newDrink]);
    
    toast({
      title: `${beerName || type.charAt(0).toUpperCase() + type.slice(1)} added`,
      description: `${newDrink.amount}ml logged successfully`,
    });

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

  return (
    <div className="space-y-8">
      <div className="p-4 max-w-md mx-auto">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">Drink Tracker</CardTitle>
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
        <h2 className="text-2xl font-bold mb-4">Informacion për Llojet e Birrës</h2>
        <BeerTable />
      </div>
    </div>
  );
};
