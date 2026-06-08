import { useState } from 'react';
import {
  Users,
  Briefcase,
  ShoppingCart,
  DollarSign,
  Package,
  UserCircle,
  FolderKanban,
  Monitor,
  Wrench,
  Settings,
  Search,
  Star,
  Clock,
  Grid3x3,
  ChevronRight
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  status: 'active' | 'coming_soon';
  category: string;
}

const modules: Module[] = [
  {
    id: 'ats',
    name: 'ATS',
    description: 'Applicant Tracking & Recruitment',
    icon: Users,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    status: 'active',
    category: 'Human Resources'
  },
  {
    id: 'hrms',
    name: 'HRMS',
    description: 'Human Resource Management System',
    icon: UserCircle,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    status: 'coming_soon',
    category: 'Human Resources'
  },
  {
    id: 'procurement',
    name: 'Procurement',
    description: 'Purchase Orders & Vendor Management',
    icon: ShoppingCart,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    status: 'active',
    category: 'Operations'
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Accounting & Financial Management',
    icon: DollarSign,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    status: 'coming_soon',
    category: 'Finance'
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Stock & Warehouse Management',
    icon: Package,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    status: 'coming_soon',
    category: 'Operations'
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Customer Relationship Management',
    icon: Briefcase,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    status: 'coming_soon',
    category: 'Sales & Marketing'
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Project Management & Tracking',
    icon: FolderKanban,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    status: 'coming_soon',
    category: 'Operations'
  },
  {
    id: 'assets',
    name: 'Asset Management',
    description: 'Fixed Assets & Equipment Tracking',
    icon: Monitor,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    status: 'coming_soon',
    category: 'Operations'
  },
  {
    id: 'it-service',
    name: 'IT Service Desk',
    description: 'Helpdesk & Ticket Management',
    icon: Wrench,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    status: 'coming_soon',
    category: 'IT'
  },
  {
    id: 'admin',
    name: 'Administration',
    description: 'System Configuration & Settings',
    icon: Settings,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    status: 'coming_soon',
    category: 'System'
  }
];

interface ERPModuleCatalogProps {
  onModuleSelect: (moduleId: string) => void;
  currentModule?: string;
}

export function ERPModuleCatalog({ onModuleSelect, currentModule }: ERPModuleCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites] = useState<string[]>(['ats', 'procurement']);
  const [recentModules] = useState<string[]>(['ats', 'procurement']);

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteModules = modules.filter(m => favorites.includes(m.id));
  const recentModulesList = modules.filter(m => recentModules.includes(m.id));

  return (
    <div className="h-screen overflow-auto bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-light tracking-wide text-foreground mb-2">
                ERP Module Catalog
              </h1>
              <p className="text-sm text-muted-foreground">
                Select a module to get started
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-muted/30 border border-border">
                <span className="text-xs font-medium text-muted-foreground">
                  {modules.filter(m => m.status === 'active').length} Active Modules
                </span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search modules..."
              className="w-full h-10 pl-10 pr-4 bg-muted/30 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-8">
        {/* Favorites Section */}
        {!searchTerm && favoriteModules.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="text-sm font-semibold text-foreground">Favorites</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {favoriteModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onSelect={onModuleSelect}
                  isFavorite={true}
                  isActive={currentModule === module.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently Used Section */}
        {!searchTerm && recentModulesList.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Recently Used</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {recentModulesList.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onSelect={onModuleSelect}
                  isActive={currentModule === module.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Modules */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Grid3x3 className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              {searchTerm ? 'Search Results' : 'All Modules'}
            </h2>
            {searchTerm && (
              <span className="text-xs text-muted-foreground">
                ({filteredModules.length} results)
              </span>
            )}
          </div>

          {filteredModules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">No modules found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onSelect={onModuleSelect}
                  isFavorite={favorites.includes(module.id)}
                  isActive={currentModule === module.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  module,
  onSelect,
  isFavorite = false,
  isActive = false
}: {
  module: Module;
  onSelect: (moduleId: string) => void;
  isFavorite?: boolean;
  isActive?: boolean;
}) {
  const Icon = module.icon;
  const isComingSoon = module.status === 'coming_soon';

  return (
    <button
      onClick={() => !isComingSoon && onSelect(module.id)}
      disabled={isComingSoon}
      className={`
        group relative p-6 rounded-xl border bg-card
        text-left transition-all duration-200
        ${isComingSoon
          ? 'opacity-50 cursor-not-allowed border-border'
          : isActive
          ? 'border-green-500/40 bg-green-500/5 cursor-pointer'
          : 'border-border hover:bg-muted/20 hover:border-border/80 hover:shadow-lg cursor-pointer'
        }
      `}
    >
      {/* Status Badge */}
      {isComingSoon && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 text-[9px] font-medium tracking-wider bg-muted/50 text-muted-foreground rounded-full">
            COMING SOON
          </span>
        </div>
      )}

      {/* Active Badge - takes precedence over favorite */}
      {isActive && !isComingSoon && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium tracking-wider bg-green-500/20 text-green-500 rounded-full border border-green-500/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            ACTIVE
          </span>
        </div>
      )}

      {/* Favorite Badge */}
      {isFavorite && !isComingSoon && !isActive && (
        <div className="absolute top-3 right-3">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        </div>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4 transition-transform duration-200 ${!isComingSoon && 'group-hover:scale-110'}`}>
        <Icon className={`w-6 h-6 ${module.color}`} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{module.name}</h3>
          {!isComingSoon && (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {module.description}
        </p>
        <div className="pt-2">
          <span className="text-[10px] font-medium text-muted-foreground/60 tracking-wider uppercase">
            {module.category}
          </span>
        </div>
      </div>
    </button>
  );
}
