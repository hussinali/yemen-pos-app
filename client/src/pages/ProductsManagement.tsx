import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Edit2, Trash2, Search } from "lucide-react";

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    categoryId: 1,
    purchasePrice: "",
    sellingPrice: "",
    taxRate: "0",
    unit: "حبة",
    minStock: "10",
  });

  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();

  const filteredProducts = products
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode?.includes(searchQuery)
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({
      name: "",
      barcode: "",
      categoryId: 1,
      purchasePrice: "",
      sellingPrice: "",
      taxRate: "0",
      unit: "حبة",
      minStock: "10",
    });
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      barcode: product.barcode || "",
      categoryId: product.categoryId,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      taxRate: product.taxRate,
      unit: product.unit,
      minStock: product.minStock.toString(),
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">إدارة المنتجات</h1>
          <Button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                barcode: "",
                categoryId: 1,
                purchasePrice: "",
                sellingPrice: "",
                taxRate: "0",
                unit: "حبة",
                minStock: "10",
              });
              setShowForm(!showForm);
            }}
            className="bg-accent text-accent-foreground hover:opacity-90"
          >
            <Plus size={20} className="ml-2" />
            منتج جديد
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="ابحث عن المنتج..."
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
          <Card className="bg-card border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background border-b border-border">
                    <th className="px-4 py-3 text-right font-bold text-foreground">اسم المنتج</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground">الباركود</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground">سعر الشراء</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground">سعر البيع</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground">الحد الأدنى</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        لا توجد منتجات
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/10">
                        <td className="px-4 py-3 text-right text-foreground">{product.name}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{product.barcode}</td>
                        <td className="px-4 py-3 text-right text-foreground">
                          {parseFloat(product.purchasePrice.toString()).toFixed(2)} ر.ي
                        </td>
                        <td className="px-4 py-3 text-right text-accent font-semibold">
                          {parseFloat(product.sellingPrice.toString()).toFixed(2)} ر.ي
                        </td>
                        <td className="px-4 py-3 text-right text-foreground">{product.minStock}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleEdit(product)} className="p-2 text-accent">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 text-destructive">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
