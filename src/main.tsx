import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./Index.css";

// Note: pages prerendered by scripts/prerender.mjs ship with real content in #root for
// crawlers, but every route here fetches its data client-side via useEffect — so the
// first real client render is always a loading state, which can never match the
// prerendered "loaded" markup. hydrateRoot would just hit that mismatch and silently
// fall back to a full re-render anyway, so we render directly instead of hydrating.
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
