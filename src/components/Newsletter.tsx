import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!", {
        description: "You'll receive updates on new arrivals and exclusive offers.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Newsletter</span>
          <h2 className="font-display text-4xl md:text-5xl mt-2 mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe for exclusive offers, new arrivals, and style inspiration.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-secondary border-0 px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow text-sm"
              required
            />
            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              Subscribe
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-wider">
            No spam, unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
};