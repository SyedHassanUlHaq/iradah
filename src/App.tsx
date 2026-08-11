import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const Collection = lazy(() => import("./pages/Collection"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Policy = lazy(() => import("./pages/Policy"));
const SizeGuide = lazy(() => import("./pages/SizeGuide"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ProductRedirect = () => {
  const { slug } = useParams();
  const location = useLocation();
  return <Navigate to={`/product/${slug}${location.search}`} replace />;
};

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductRedirect />} />
            <Route path="/collection/:category" element={<Collection />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/shipping" element={<Policy />} />
            <Route path="/returns" element={<Policy />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/contact" element={<Policy />} />
            <Route path="/privacy" element={<Policy />} />
            <Route path="/terms" element={<Policy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
