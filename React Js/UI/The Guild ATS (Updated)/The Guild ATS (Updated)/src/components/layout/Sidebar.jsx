import { GuildLogo } from "@/components/common/GuildLogo";
import { ChevronDown } from "lucide-react";
import { SIDEBAR_ITEMS } from "@/config/constants";

export function Sidebar({ activeTab, setActiveTab, setSelectedDepartment, theme }) {
  return (
    <div className="w-[220px] flex-shrink-0 min-h-screen border-r border-border bg-card backdrop-blur-xl flex flex-col justify-between px-3 py-6">
      <div>
        <div className="mb-10 flex items-center justify-center px-2">
          <GuildLogo className="h-16 w-16" theme={theme} />
        </div>

        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveTab(item.tab);
                if (item.tab !== "jobs") setSelectedDepartment(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group
                ${item.tab === activeTab ? "bg-foreground/10 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]"}`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-border pt-4">
        <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-foreground/[0.06] transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-[11px] font-semibold text-foreground">
              RO
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-foreground">Rohan Okafor</p>
              <p className="text-[10px] text-muted-foreground">HR Director</p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
