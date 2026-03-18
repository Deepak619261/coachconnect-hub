import { Settings, FileText, Bell, LucideIcon } from "lucide-react";

export type TabKey = "profile" | "notes" | "notices";

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "profile", label: "Profile", icon: Settings },
  { key: "notes", label: "Study Material", icon: FileText },
  { key: "notices", label: "Notices", icon: Bell },
];

interface AdminTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex gap-1 mb-8 bg-muted rounded-xl p-1 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab.key
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
