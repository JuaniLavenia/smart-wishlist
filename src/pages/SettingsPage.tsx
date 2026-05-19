import { useState } from "react";
import { StoreWhitelist } from "@/components/organisms/StoreWhitelist";
import { useStoresStore } from "@/stores/storesStore";
import { useUsageStore } from "@/stores/usageStore";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { RefreshCw } from "lucide-react";

export function SettingsPage() {
  const { stores, toggleStore } = useStoresStore();
  const { getUsage, setCount } = useUsageStore();
  const { count, remaining, percentage } = getUsage();
  const [manualCount, setManualCount] = useState(count.toString());

  const handleUpdateCount = () => {
    const newCount = parseInt(manualCount, 10);
    if (!isNaN(newCount) && newCount >= 0 && newCount <= 250) {
      setCount(newCount);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Configuración
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Ajusta las preferencias de tu cuenta.
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border/60 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Tiendas habilitadas
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Las tiendas deshabilitadas no aparecerán en los resultados de
          búsqueda.
        </p>
        <StoreWhitelist stores={stores} onToggle={toggleStore} />
      </div>

      <div className="bg-card p-6 rounded-xl border border-border/60 shadow-sm">
        <h2 className="text-lg font-semibold mb-2 text-foreground">
          API SerpApi
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          El contador local es un estimado. Para accuracy, ingresá el valor real
          desde el{" "}
          <a
            href="https://serpapi.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            dashboard de SerpApi
          </a>
          .
        </p>

        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-4">
          <div>
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-xs text-muted-foreground">
              búsquedas usadas
            </div>
          </div>
          <div className="text-xl font-medium text-muted-foreground">/ 250</div>
          <div className="ml-auto text-right">
            <div
              className={`text-lg font-semibold ${percentage >= 80 ? "text-amber-600" : "text-green-600"}`}
            >
              {percentage}%
            </div>
            <div className="text-xs text-muted-foreground">
              {remaining} restantes
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            min="0"
            max="250"
            value={manualCount}
            onChange={(e) => setManualCount(e.target.value)}
            placeholder="Cantidad real"
            className="w-32"
          />
          <Button onClick={handleUpdateCount} variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>
    </div>
  );
}
