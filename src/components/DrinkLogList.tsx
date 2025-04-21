
import React from "react";
import { Beer, Wine, GlassWater, Clock, Trash2 } from "lucide-react";

interface Drink {
  type: "beer" | "wine" | "spirits";
  amount: number;
  timestamp: Date;
  id: string;
  beerName?: string;
  alcoholPercentage?: string;
  beerType?: string;
}

interface DrinkLogListProps {
  drinks: Drink[];
  onRemove: (id: string) => void;
}

const getTypeIcon = (type: Drink["type"]) => {
  switch (type) {
    case "beer":
      return <Beer className="w-4 h-4" />;
    case "wine":
      return <Wine className="w-4 h-4" />;
    case "spirits":
      return <GlassWater className="w-4 h-4" />;
    default:
      return <div className="w-4 h-4"></div>;
  }
};

export const DrinkLogList: React.FC<DrinkLogListProps> = ({ drinks, onRemove }) => {
  if (drinks.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No drinks logged today</p>
        <p className="text-sm text-gray-400 mt-1">Tap a button above to log your first drink</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h3 className="text-base font-semibold">Today's Log</h3>
      <div className="space-y-2 mt-3 max-h-[240px] overflow-y-auto pr-1">
        {drinks.map((drink) => (
          <div
            key={drink.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  drink.type === "beer"
                    ? "bg-amber-100 text-amber-600"
                    : drink.type === "wine"
                    ? "bg-rose-100 text-rose-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
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
                {new Date(drink.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <button
                onClick={() => onRemove(drink.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
