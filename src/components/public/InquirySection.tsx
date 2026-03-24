import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateInquiry } from "@/hooks/useCoaching";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function InquirySection({ coachingId, inquiryConfig }: { coachingId: string, inquiryConfig?: any }) {
  const questions = typeof inquiryConfig === 'object' && inquiryConfig?.questions ? inquiryConfig.questions as string[] : [];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const { mutate: createInquiry, isPending } = useCreateInquiry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    createInquiry(
      { coaching_id: coachingId, name, email, phone, message },
      {
        onSuccess: () => {
          toast.success("Message sent successfully!");
          setName("");
          setEmail("");
          setPhone("");
          setMessage("");
        },
        onError: () => {
          toast.error("Failed to send message. Please try again.");
        },
      }
    );
  };

  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display text-foreground">Get in Touch</h2>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Message</label>
            {questions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {questions.map((q: string, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(prev => prev ? `${prev}\n${q}` : q)}
                    className="text-[10px] bg-accent/5 hover:bg-accent/10 text-accent border border-accent/20 px-2 py-1 rounded-full transition-colors"
                  >
                    + {q}
                  </button>
                ))}
              </div>
            )}
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="How can we help you?"
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? "Sending..." : "Send Message"}
            {!isPending && <Send className="w-4 h-4 ml-2" />}
          </Button>
        </form>
      </div>
    </motion.section>
  );
}
