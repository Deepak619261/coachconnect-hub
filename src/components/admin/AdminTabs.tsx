import { Settings, FileText, Bell, MessageSquare, Star, LucideIcon } from "lucide-react";

export type TabKey = "profile" | "notes" | "notices" | "inquiries" | "testimonials";

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "profile", label: "Profile", icon: Settings },
  { key: "notes", label: "Study Material", icon: FileText },
  { key: "notices", label: "Notices", icon: Bell },
  { key: "inquiries", label: "Inquiries", icon: MessageSquare },
  { key: "testimonials", label: "Reviews", icon: Star },
];

interface AdminTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex gap-1 mb-10 bg-muted/60 rounded-2xl p-1.5 w-fit border border-border/50">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTab === tab.key
              ? "bg-card text-foreground shadow-card border border-border/50"
              : "text-muted-foreground hover:text-foreground border border-transparent"
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}