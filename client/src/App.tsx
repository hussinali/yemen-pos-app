import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import POSInterface from "./pages/POSInterface";
import ProductsManagement from "./pages/ProductsManagement";
import CustomersManagement from "./pages/CustomersManagement";
import SuppliersManagement from "./pages/SuppliersManagement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/pos"} component={POSInterface} />
      <Route path={"/products"} component={ProductsManagement} />
      <Route path={"/customers"} component={CustomersManagement} />
      <Route path={"/suppliers"} component={SuppliersManagement} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
