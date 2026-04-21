import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Reports() {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [branchId, setBranchId] = useState(1);

  const { data: salesReport, isLoading: loadingSales } = trpc.reports.salesReport.useQuery({
    branchId,
    startDate,
    endDate,
  });

  const { data: topProducts, isLoading: loadingTop } = trpc.reports.topProducts.useQuery({
    branchId,
    limit: 10,
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">التقارير والإحصائيات</h1>

        {/* Filters */}
        <Card className="bg-card border-border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">من التاريخ</label>
              <Input
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">إلى التاريخ</label>
              <Input
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="bg-input text-foreground border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">الفرع</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(parseInt(e.target.value))}
                className="w-full bg-input text-foreground border border-border rounded p-2"
              >
                <option value={1}>الفرع الرئيسي</option>
                <option value={2}>الفرع الثاني</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Sales Report */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">تقرير المبيعات</h2>
            {loadingSales ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-accent" size={32} />
              </div>
            ) : (
              <div className="space-y-3">
                {salesReport && salesReport.length > 0 ? (
                  salesReport.map((item: any, idx) => (
                    <div key={idx} className="flex justify-between p-3 bg-background rounded">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                        <p className="text-xs text-muted-foreground">عدد المبيعات: {item.count}</p>
                      </div>
                      <p className="font-bold text-accent">{item.total?.toFixed(2)} ر.ي</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">لا توجد بيانات</p>
                )}
              </div>
            )}
          </Card>

          {/* Top Products */}
          <Card className="bg-card border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">أفضل المنتجات مبيعاً</h2>
            {loadingTop ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-accent" size={32} />
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts && topProducts.length > 0 ? (
                  topProducts.map((item: any, idx) => (
                    <div key={idx} className="flex justify-between p-3 bg-background rounded">
                      <div>
                        <p className="text-sm text-foreground">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          الكمية: {item.totalQuantity}
                        </p>
                      </div>
                      <p className="font-bold text-success">
                        {item.totalRevenue?.toFixed(2)} ر.ي
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">لا توجد بيانات</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
