import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Avatar,
  Drawer,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  Divider,
  User,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Home,
  Car,
  Video,
  Settings,
  LogOut,
  Menu,
  Sparkles,
  ChevronDown,
  Library,
  Film,
  Trash2,
  PlusCircle,
  BarChart3,
  CreditCard,
  Users,
  Archive,
} from "lucide-react";
import { supabase } from "../config/supabaseClient";
import { logout } from "../store/slices/authSlice";
import { clearDealerData } from "../store/slices/dealerSlice";

export default function DashboardLayout() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.dealer);

  const dealerName = profile?.dealership_name || "Dealer";
  const dealerLogo = profile?.logo_url;
  const subscription = profile?.subscription_tier || "free";
  const isPro = subscription === "pro" || subscription === "enterprise";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    dispatch(clearDealerData());
    navigate("/login");
  };

  // ----------------------------------------------------------------------
  // 1. NAVIGATION CONFIGURATION
  // ----------------------------------------------------------------------

  const PRIMARY_NAV = [
    { key: "dashboard", label: "Overview", path: "/dashboard", icon: Home },
    {
      key: "inventory",
      label: "Inventory",
      path: "/dashboard/inventory",
      icon: Car,
    },
    // Clicking Studio defaults to /dashboard/studio which maps to "All Stories"
    { key: "studio", label: "Studio", path: "/dashboard/studio", icon: Video },
    {
      key: "settings",
      label: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const SECONDARY_MENUS = {
    // 1. STUDIO CONTEXT
    "/dashboard/studio": [
      {
        section: "Library",
        items: [
          // "Home" = All Stories
          {
            label: "All Stories",
            path: "/dashboard/studio",
            icon: Library,
            exact: true,
          },
          // "Published" = Completed Stories
          {
            label: "Published",
            path: "/dashboard/studio/published",
            icon: Film,
          },
          // "Trash" = Archived/Deleted
          { label: "Trash", path: "/dashboard/studio/trash", icon: Trash2 },
        ],
      },
      {
        section: "Create",
        items: [
          {
            label: "New Story",
            path: "/dashboard/studio/wizard",
            icon: Sparkles,
            highlight: true,
          },
        ],
      },
    ],
    // 2. INVENTORY CONTEXT
    "/dashboard/inventory": [
      {
        section: "Fleet",
        items: [
          { label: "All Vehicles", path: "/dashboard/inventory", icon: Car },
          {
            label: "Add Vehicle",
            path: "/dashboard/inventory",
            icon: PlusCircle,
            action: "openModal",
          },
        ],
      },
    ],
    // 3. SETTINGS CONTEXT
    "/dashboard/settings": [
      {
        section: "Account",
        items: [
          { label: "General", path: "/dashboard/settings", icon: Settings },
          { label: "Billing", path: "/dashboard/settings", icon: CreditCard },
          { label: "Team", path: "/dashboard/settings", icon: Users },
        ],
      },
    ],
    // 4. DEFAULT
    "/dashboard": [
      {
        section: "Analytics",
        items: [{ label: "Overview", path: "/dashboard", icon: BarChart3 }],
      },
    ],
  };

  // Determine active menu based on path start
  const activeSectionKey =
    Object.keys(SECONDARY_MENUS).find(
      (path) =>
        location.pathname === path || location.pathname.startsWith(path + "/"),
    ) || "/dashboard";

  const currentSecondaryItems = SECONDARY_MENUS[activeSectionKey];

  // ----------------------------------------------------------------------
  // 🎨 COMPONENT: PRIMARY RAIL
  // ----------------------------------------------------------------------
  const PrimaryRail = () => (
    <div className="flex flex-col h-full bg-[#f7f7f5] dark:bg-[#151516] border-r border-default-200 w-[72px] shrink-0 z-30 items-center py-4">
      <Link to="/dashboard" className="mb-6">
        <div className="size-10 flex items-center justify-center">
          <img
            src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AXLE-logo-mini.png"
            alt="Logo"
            className="w-10 h-auto object-contain group-hover:scale-110 transition-transform"
          />
        </div>
      </Link>

      <nav className="flex-1 flex flex-col gap-3 w-full px-2">
        {PRIMARY_NAV.map((item) => {
          // Check if this primary item is active (including sub-routes)
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/dashboard" &&
              location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Tooltip
              key={item.key}
              content={item.label}
              placement="right"
              color="foreground"
              closeDelay={0}
            >
              <Link to={item.path} className="w-full flex justify-center">
                <div
                  className={`
                  size-10 rounded-xl flex items-center justify-center transition-all duration-200
                  ${
                    isActive
                      ? "bg-white dark:bg-default-100 text-primary shadow-sm border border-default-200"
                      : "text-default-400 hover:text-default-600 hover:bg-default-100/50"
                  }
                `}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <Tooltip content="Sign Out" placement="right" color="danger">
          <button
            onClick={handleLogout}
            className="size-10 rounded-xl flex items-center justify-center text-default-400 hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </Tooltip>
      </div>
    </div>
  );

  // ----------------------------------------------------------------------
  // 🎨 COMPONENT: SECONDARY SIDEBAR
  // ----------------------------------------------------------------------
  const SecondarySidebar = () => (
    <div className="flex flex-col h-full w-[240px] bg-background border-r border-default-200 shrink-0 z-20">
      {/* User Profile */}
      <div className="h-16 flex items-center px-4 border-b border-default-100">
        <Dropdown placement="bottom-start" className="w-full">
          <DropdownTrigger>
            <div className="flex items-center gap-3 w-full p-1.5 rounded-lg hover:bg-default-100 cursor-pointer transition-colors group">
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-semibold truncate leading-tight text-foreground">
                  {dealerName}
                </p>
                <p className="text-[10px] text-default-400 uppercase tracking-wide font-medium">
                  {subscription} Plan
                </p>
              </div>
              <ChevronDown
                size={14}
                className="text-default-400 group-hover:text-foreground"
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="settings" startContent={<Settings size={14} />}>
              Workspace Settings
            </DropdownItem>
            <DropdownItem key="billing" startContent={<CreditCard size={14} />}>
              Billing
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              className="text-danger"
              startContent={<LogOut size={14} />}
              onPress={handleLogout}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {currentSecondaryItems.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-[11px] font-bold text-default-400 uppercase tracking-wider">
              {section.section}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;

                // Active Logic:
                // 1. Exact Match (e.g. "All Stories" should only highlight on /dashboard/studio, not sub-routes)
                // 2. Prefix Match (e.g. /dashboard/studio/published)
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group
                      ${
                        isActive
                          ? "bg-default-100 text-foreground font-medium"
                          : item.highlight
                            ? "bg-primary/10 text-primary hover:bg-primary/20 font-medium mt-2"
                            : "text-default-500 hover:bg-default-50 hover:text-foreground"
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-foreground"
                          : item.highlight
                            ? "text-primary"
                            : "text-default-400 group-hover:text-default-600"
                      }
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Card */}
      {!isPro && (
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 rounded-xl p-4 text-center">
            <Sparkles className="size-6 text-primary mx-auto mb-2" />
            <p className="text-xs font-semibold text-primary-600 mb-2">
              Upgrade to Pro
            </p>
            <Button
              size="sm"
              color="primary"
              variant="shadow"
              fullWidth
              className="h-8 text-xs font-bold"
              onPress={() => navigate("/dashboard/settings")}
            >
              Unlock AI
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background">
      {/* DESKTOP */}
      <div className="hidden lg:flex h-full">
        <PrimaryRail />
        <SecondarySidebar />
      </div>

      {/* MOBILE */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        size="xs"
      >
        <DrawerContent className="max-w-[300px] flex flex-row p-0 gap-0">
          {(onClose) => (
            <DrawerBody className="p-0 flex flex-row gap-0">
              <PrimaryRail />
              <SecondarySidebar />
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen min-w-0 bg-default-50/50">
        <header className="h-14 lg:hidden shrink-0 sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-default-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button isIconOnly variant="light" size="sm" onPress={onOpen}>
              <Menu size={24} />
            </Button>
            <span className="font-bold text-large tracking-tight">AXLE</span>
          </div>
          <Avatar src={dealerLogo} size="sm" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
