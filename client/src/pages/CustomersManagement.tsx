import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Edit2, Trash2, Search } from "lucide-react";

export default function CustomersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const { data: customers, isLoading } = trpc.customers.list.useQuery();

  const filteredCustomers = customers
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone?.includes(searchQuery)
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ name: "", phone: "", email: "", address: "" });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">إدارة العملاء</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground hover:opacity-90"
          >
            <Plus size={20} className="ml-2" />
            عميل جديد
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="ابحث عن العميل..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="bg-card border-border p-4">
                <div className="text-right">
                  <h3 className="font-bold text-foreground mb-2">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">📞 {customer.phone}</p>
                  <p className="text-sm text-muted-foreground mb-1">📧 {customer.email}</p>
                  <p className="text-sm text-accent font-semibold mb-3">
                    النقاط: {customer.loyaltyPoints}
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
