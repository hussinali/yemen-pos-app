import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Edit2, Trash2, Search } from "lucide-react";

export default function SuppliersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: suppliers, isLoading } = trpc.suppliers.list.useQuery();

  const filteredSuppliers = suppliers
    ? suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.phone?.includes(searchQuery)
      )
    : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">إدارة الموردين</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground hover:opacity-90"
          >
            <Plus size={20} className="ml-2" />
            مورد جديد
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="ابحث عن المورد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 bg-card text-foreground border-border"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-accent" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="bg-card border-border p-4">
                <div className="text-right">
                  <h3 className="font-bold text-foreground mb-2">{supplier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">📞 {supplier.phone}</p>
                  <p className="text-sm text-muted-foreground mb-1">📧 {supplier.email}</p>
                  <p className="text-sm text-muted-foreground mb-1">👤 {supplier.contactPerson}</p>
                  <p className="text-sm text-accent font-semibold mb-3">
                    شروط الدفع: {supplier.paymentTerms}
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button className="p-2 text-accent hover:bg-accent/20 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-destructive hover:bg-destructive/20 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
