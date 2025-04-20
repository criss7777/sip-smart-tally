
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Beer } from "@/types/beer";

const beerData: Beer[] = [
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

export const BeerTable = () => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Birra</TableHead>
            <TableHead>% Alkooli</TableHead>
            <TableHead>Lloji</TableHead>
            <TableHead>Sasia e Sigurt për Meshkuj</TableHead>
            <TableHead>Sasia e Sigurt për Femra</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {beerData.map((beer) => (
            <TableRow key={beer.name}>
              <TableCell className="font-medium">{beer.name}</TableCell>
              <TableCell>{beer.alcoholPercentage}</TableCell>
              <TableCell>{beer.type}</TableCell>
              <TableCell>{beer.safeAmountMale}</TableCell>
              <TableCell>{beer.safeAmountFemale}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
