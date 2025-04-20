
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Beer, Wine, Clock, GlassWater, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface Drink {
  type: 'beer' | 'wine' | 'spirits';
  amount: number;
  timestamp: Date;
  id: string;
}

export const DrinkLogger = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const { toast } = useToast();
  
  // Calculate total amount in ml
  const totalAmount = drinks.reduce((sum, drink) => sum + drink.amount, 0);
  // Recommended daily limit in ml (approx 2 standard drinks)
  const recommendedLimit = 600;
  const percentOfLimit = Math.min(100, (totalAmount / recommendedLimit) * 100);

  const logDrink = (type: Drink['type']) => {
    const newDrink = {
      type,
      amount: type === 'beer' ? 330 : type === 'wine' ? 150 : 45,
      timestamp: new Date(),
      id: Date.now().toString()
    };
    
    setDrinks([...drinks, newDrink]);
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} added`,
      description: `${newDrink.amount}ml logged successfully`,
    });
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

  return (
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
                className="h-2"
                indicatorClassName={percentOfLimit > 80 ? "bg-red-500" : "bg-blue-500"}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => logDrink('beer')}
                className="flex flex-col items-center justify-center gap-2 py-6 bg-amber-600 hover:bg-amber-700"
              >
                <Beer className="w-6 h-6" />
                <span className="text-xs font-medium">Beer</span>
              </Button>
              
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
                            <p className="font-medium capitalize">{drink.type}</p>
                            <p className="text-xs text-gray-500">{drink.amount}ml</p>
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
  );
};
