import { ThemeProvider } from "@/components/theme-provider.tsx"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster richColors position="top-center" />
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>
)
