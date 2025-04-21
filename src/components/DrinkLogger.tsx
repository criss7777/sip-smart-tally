import React, { useState, useEffect } from "react";
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

import { GenderSelector } from "./GenderSelector";
import { beerGuidelines, findBeerGuideline } from "./beerGuidelines";
import { DrinkLogList } from "./DrinkLogList";

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

type Drink = {
  type: "beer" | "wine" | "spirits";
  amount: number;
  timestamp: Date;
  id: string;
  beerName?: string;
  alcoholPercentage?: string;
  beerType?: string;
};

export const DrinkLogger = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedBeer, setSelectedBeer] = useState<string>("");
  const { toast } = useToast();
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  // gender dialog handled in GenderSelector

  // Daily consumption calculations
  const totalAmount = drinks.reduce((sum, drink) => sum + drink.amount, 0);
  // pick highest for recommended limit by gender
  const recommendedLimit = gender === "male" ? 600 : 400;
  const percentOfLimit = Math.min(100, (totalAmount / recommendedLimit) * 100);

  // -- DRINK HANDLING LOGIC --
  const logDrink = (type: Drink["type"], beerName?: string) => {
    const selectedBeerData =
      type === "beer" ? beerData.find((b) => b.name === beerName) : null;

    const newDrink: Drink = {
      type,
      amount: type === "beer" ? 330 : type === "wine" ? 150 : 45,
      timestamp: new Date(),
      id: Date.now().toString(),
      beerName,
      alcoholPercentage: selectedBeerData?.alcoholPercentage,
      beerType: selectedBeerData?.type,
    };

    const warning =
      type === "beer" && gender
        ? checkBeerLimit([...drinks, newDrink], newDrink)
        : null;

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
    setDrinks(drinks.filter((drink) => drink.id !== id));
    toast({
      title: "Drink removed",
      description: "Drink has been removed from your log",
    });
  };

  const handleBeerSelect = (value: string) => {
    setSelectedBeer(value);
    logDrink("beer", value);
  };

  // This function calculates if the user is over the safe guideline, based on gender and guidelines
  const checkBeerLimit = (drinks: Drink[], latest?: Drink) => {
    if (!gender) return null;
    const genderKey = gender;
    const beerDrinks = drinks.filter((d) => d.type === "beer" && d.alcoholPercentage && d.beerType);
    let overLimitInfo: { type?: string; limit?: number; actual?: number } | null = null;

    beerDrinks.forEach((curr) => {
      const guideline = findBeerGuideline(curr.alcoholPercentage!, curr.beerType!);
      if (!guideline || guideline.limit[genderKey] === -1) return;
      const sumAmount = beerDrinks
        .filter(
          (d) => findBeerGuideline(d.alcoholPercentage!, d.beerType!)?.type === guideline.type
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
            (d) => findBeerGuideline(d.alcoholPercentage!, d.beerType!)?.type === guideline.type
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
      {/* Gender pop up */}
      <GenderSelector gender={gender} setGender={setGender} />

      {/* Main Card */}
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
              <Button
                size="sm"
                variant="outline"
                className="text-xs py-1 px-2"
                onClick={() => {
                  localStorage.removeItem("gender");
                  setGender(null);
                }}
              >
                Switch Gender
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Progress & Guide */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Daily consumption</h3>
                  <span className="text-sm font-medium">
                    {totalAmount}ml / {recommendedLimit}ml
                  </span>
                </div>
                <Progress
                  value={percentOfLimit}
                  className={`h-2 ${percentOfLimit > 80 ? "bg-red-500" : "bg-blue-500"}`}
                />
              </div>
              {/* Drinks Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                  <Select value={selectedBeer} onValueChange={handleBeerSelect}>
                    <SelectTrigger className="w-full h-full min-h-[96px] flex flex-col items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                      <span>
                        <Beer className="w-6 h-6" />
                      </span>
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
                  onClick={() => logDrink("wine")}
                  className="flex flex-col items-center justify-center gap-2 py-6 bg-rose-600 hover:bg-rose-700"
                >
                  <Wine className="w-6 h-6" />
                  <span className="text-xs font-medium">Wine</span>
                </Button>
                <Button
                  onClick={() => logDrink("spirits")}
                  className="flex flex-col items-center justify-center gap-2 py-6 bg-blue-600 hover:bg-blue-700"
                >
                  <GlassWater className="w-6 h-6" />
                  <span className="text-xs font-medium">Spirits</span>
                </Button>
              </div>
              {/* Drink Log List */}
              <DrinkLogList drinks={drinks} onRemove={removeDrink} />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Guideline Table */}
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
