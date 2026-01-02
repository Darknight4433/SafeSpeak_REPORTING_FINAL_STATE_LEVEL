import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import { toast } from 'sonner';

// Global error hooks to avoid blank white screens and surface helpful messages
window.addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled Promise Rejection:', ev.reason);
  try { toast.error('An error occurred (network or server). Please try again.'); } catch (e) { /* ignore */ }
});

window.addEventListener('error', (ev) => {
  console.error('Global error:', ev.error || ev.message);
  try { toast.error('A client error occurred. Refresh the page and try again.'); } catch (e) { /* ignore */ }
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

