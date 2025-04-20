
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Beer, Wine, Clock } from "lucide-react";

interface Drink {
  type: 'beer' | 'wine' | 'spirits';
  amount: number;
  timestamp: Date;
}

export const DrinkLogger = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  const logDrink = (type: Drink['type']) => {
    const newDrink = {
      type,
      amount: type === 'beer' ? 330 : type === 'wine' ? 150 : 45,
      timestamp: new Date(),
    };
    setDrinks([...drinks, newDrink]);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card className="p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Track Drink</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => logDrink('beer')}
            className="flex items-center justify-center gap-2 bg-[#403E43] hover:bg-[#2a292b]"
          >
            <Beer className="w-5 h-5" />
            Beer
          </Button>
          
          <Button
            onClick={() => logDrink('wine')}
            className="flex items-center justify-center gap-2 bg-[#403E43] hover:bg-[#2a292b]"
          >
            <Wine className="w-5 h-5" />
            Wine
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Today's Log</h3>
          {drinks.length === 0 ? (
            <p className="text-gray-500 text-center">No drinks logged today</p>
          ) : (
            <div className="space-y-2">
              {drinks.map((drink, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    {drink.type === 'beer' ? <Beer className="w-4 h-4" /> : 
                     drink.type === 'wine' ? <Wine className="w-4 h-4" /> : 
                     <div className="w-4 h-4" />}
                    <span className="capitalize">{drink.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {new Date(drink.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
