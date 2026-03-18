import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, Sparkles, Globe, Shield } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg text-foreground">CoachHub Lite</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="font-body" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button size="sm" className="font-body" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-body font-medium mb-6">
              <Sparkles className="w-4 h-4" /> Free for tutors
            </div>
            <h1 className="text-4xl sm:text-6xl font-display text-foreground leading-tight mb-6">
              Your coaching,<br />your brand,<br />
              <span className="text-accent">one simple page.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-body max-w-xl mx-auto mb-8">
              Create a beautiful public coaching page in minutes. Share study materials, post announcements, and grow your tuition brand.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="font-body h-12 px-6" asChild>
                <Link to="/auth">
                  Start for Free <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: Globe,
              title: "Public Page",
              desc: "A sleek, shareable coaching page with your branding, contact info, and materials.",
            },
            {
              icon: Shield,
              title: "Secure Admin",
              desc: "Manage your profile, upload notes, and post notices from a clean dashboard.",
            },
            {
              icon: Sparkles,
              title: "White-Labeled",
              desc: "Your brand, your identity. Customize your logo, banner, and slug.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} CoachHub Lite. Built for educators.
        </p>
      </footer>
    </div>
  );
}
