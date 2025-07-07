import type React from "react";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

function parseCSV(csvText: string) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map(h=>h.trim());
  return lines.slice(1).map(line=>{
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((key,i)=>{row[key]=values[i]?.trim()||""});
    return row;
  });
}

function daysUntil(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  return Math.ceil((+d - +today) / (1000 * 60 * 60 * 24));
}

function suggestDiscount(days: number) {
  if (Number.isNaN(days)) return "-";
  if (days > 14) return "No Discount";
  if (days > 7) return "10% Off";
  if (days > 3) return "20% Off";
  if (days > 1) return "30% Off";
  if (days >= 0) return "50% Off";
  return "Expired";
}

function getBundleSuggestions(products: any[]) {
  // Simple pairing: suggest first two slow movers together
  if (products.length < 2) return [];
  return [
    {
      items: [products[0]?.Name || "Item 1", products[1]?.Name || "Item 2"],
      reason: "Both expiring soon"
    }
  ];
}

function App() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [pushed, setPushed] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const parsed = parseCSV(csvText);
      setProducts(parsed);
      setBundles(getBundleSuggestions(parsed));
      setPushed(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Walmart Clearance Dashboard</h2>
        <div className="flex gap-4 items-center">
          <Input
            type="file"
            accept=".csv"
            ref={fileInput}
            onChange={handleUpload}
            className="max-w-xs"
          />
          <span className="text-sm text-muted-foreground">Upload products CSV (Name,Category,Expiry,Sales7d,Stock)</span>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold mb-2">Current Products</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>7d Sales</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Suggested Discount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p, i)=>(
              <TableRow key={i}>
                <TableCell>{p.Name}</TableCell>
                <TableCell>{p.Category}</TableCell>
                <TableCell>{p.Expiry}</TableCell>
                <TableCell>{daysUntil(p.Expiry)}</TableCell>
                <TableCell>{p.Sales7d}</TableCell>
                <TableCell>{p.Stock}</TableCell>
                <TableCell>{suggestDiscount(daysUntil(p.Expiry))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && (
          <div className="text-muted-foreground text-center py-4">No data yet</div>
        )}
        <div className="flex justify-end mt-4">
          <Button onClick={()=>setPushed(true)} disabled={!products.length || pushed}>
            {pushed ? "Prices Pushed!" : "Push Price Suggestions"}
          </Button>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold mb-2">Bundle Suggestions</h3>
        {bundles.length === 0 ? (
          <div className="text-muted-foreground">No bundle suggestions yet.</div>
        ) : (
          <ul className="list-disc pl-6 space-y-2">
            {bundles.map((b, i) => (
              <li key={i} className="">Suggest bundle: <b>{b.items.join(" + ")}</b> <span className="text-muted-foreground">({b.reason})</span></li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default App;

