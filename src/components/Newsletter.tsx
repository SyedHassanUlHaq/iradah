import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
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
    <section className="py-14 md:py-28 bg-secondary/40">
      <div className="container mx-auto px-5 md:px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="w-7 h-7 md:w-8 md:h-8 mx-auto text-muted-foreground mb-4 md:mb-5" />
          <h2 className="font-display text-2xl md:text-4xl mb-2 md:mb-3">Join the Family</h2>
          <p className="text-muted-foreground text-xs md:text-sm mb-6 md:mb-8 max-w-md mx-auto">
            Be the first to know about new drops, exclusive deals, and style inspiration delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-background border border-border px-5 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow text-sm"
              required
            />
            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 group whitespace-nowrap px-6"
            >
              Subscribe
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-wider">
            No spam · Unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
};
