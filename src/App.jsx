import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Customizer from "@/pages/Customizer";
import Gallery from "@/pages/Gallery";
import Home from "@/pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Customizer} />
      <Route path="/customizer" component={Customizer} />
      <Route path="/gallery" component={Gallery} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
