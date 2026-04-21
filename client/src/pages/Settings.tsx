import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    storeName: "متجر اليمن",
    storePhone: "+967-123456789",
    storeEmail: "store@yemen.com",
    taxRate: "5",
    currency: "ر.ي",
  });

  const handleSave = () => {
    // TODO: Save settings to backend
    alert("تم حفظ الإعدادات بنجاح");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">الإعدادات</h1>

        <Card className="bg-card border-border p-6 space-y-6">
          {/* Store Information */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">معلومات المتجر</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  اسم المتجر
                </label>
                <Input
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="bg-input text-foreground border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  رقم الهاتف
                </label>
                <Input
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  className="bg-input text-foreground border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  className="bg-input text-foreground border-border"
                />
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-bold text-foreground mb-4">الإعدادات المالية</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  نسبة الضريبة (%)
                </label>
                <Input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                  className="bg-input text-foreground border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  العملة
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full bg-input text-foreground border border-border rounded p-2"
                >
                  <option>ر.ي</option>
                  <option>$</option>
                  <option>€</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-border pt-6 flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 bg-success text-success-foreground hover:opacity-90"
            >
              حفظ الإعدادات
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-border text-foreground"
            >
              إلغاء
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
