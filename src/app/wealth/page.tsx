import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const paycheck = {
  gross: 5200,
  taxes: 1140,
  retirement401k: 312,
  net: 3748,
};

const budget = [
  { category: "Housing", spent: 1450, budget: 1500 },
  { category: "Food", spent: 480, budget: 500 },
  { category: "Transportation", spent: 210, budget: 250 },
  { category: "Subscriptions", spent: 64, budget: 75 },
  { category: "Entertainment", spent: 190, budget: 150 },
];

const cashFlow = [
  { label: "Income", value: 3748, type: "in" },
  { label: "Fixed Expenses", value: -1450, type: "out" },
  { label: "Variable Expenses", value: -944, type: "out" },
  { label: "Savings Transfer", value: -800, type: "out" },
  { label: "Net Remaining", value: 554, type: "net" },
];

export default function WealthPage() {
  return (
    <>
      <Topbar title="Wealth" subtitle="Paycheck, budgeting, and cash flow in one view." />
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Paycheck Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm font-mono">
              <Row label="Gross Pay" value={paycheck.gross} />
              <Row label="Taxes" value={-paycheck.taxes} />
              <Row label="401(k)" value={-paycheck.retirement401k} />
              <div className="border-t border-border pt-2 mt-2">
                <Row label="Net Pay" value={paycheck.net} bold />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Cash Flow Engine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cashFlow.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className={row.type === "net" ? "font-medium" : "text-text-secondary"}>
                    {row.label}
                  </span>
                  <span
                    className={`font-mono ${
                      row.type === "net"
                        ? "text-gold font-semibold"
                        : row.value < 0
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {row.value < 0 ? "-" : "+"}
                    {formatCurrency(Math.abs(row.value))}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budget.map((b) => {
              const pct = Math.min(100, (b.spent / b.budget) * 100);
              const over = b.spent > b.budget;
              return (
                <div key={b.category}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span>{b.category}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-xs text-text-secondary">
                        {formatCurrency(b.spent)} / {formatCurrency(b.budget)}
                      </span>
                      {over && <Badge variant="danger">Over</Badge>}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className={`h-full rounded-full ${over ? "bg-danger" : "bg-gold"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-medium text-text-primary" : "text-text-secondary"}>{label}</span>
      <span className={bold ? "font-semibold text-gold" : ""}>
        {value < 0 ? "-" : ""}
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}
