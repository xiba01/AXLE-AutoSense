import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Drawer,
  DrawerContent,
  DrawerBody,
  useDisclosure,
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
          {
            label: "All Vehicles",
            path: "/dashboard/inventory",
            icon: Car,
            exact: true,
          },
          {
            label: "Add Vehicle",
            path: "#",
            icon: PlusCircle,
            action: "openModal",
            highlight: true,
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

  // Hide secondary sidebar on Overview page
  const showSecondarySidebar = location.pathname !== "/dashboard";

  // ----------------------------------------------------------------------
  // 🎨 COMPONENT: PRIMARY RAIL
  // ----------------------------------------------------------------------
  const PrimaryRail = () => (
    <div className="flex flex-col h-full bg-background border-r border-default-200 w-18 shrink-0 z-30 items-center py-4">
      <Link to="/dashboard" className="mb-8">
        <div className="size-10 flex items-center justify-center">
          <img
            src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AXLE-logo-mini.png"
            alt="Logo"
            className="w-9 h-auto object-contain hover:opacity-80 transition-opacity"
          />
        </div>
      </Link>

      <nav className="flex-1 flex flex-col gap-2 w-full px-2">
        {PRIMARY_NAV.map((item) => {
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
              closeDelay={0}
              classNames={{
                content:
                  "bg-foreground text-background text-xs font-medium px-2 py-1.5 rounded-lg",
              }}
            >
              <Link to={item.path} className="w-full flex justify-center">
                <div
                  className={`
                  size-11 rounded-xl flex items-center justify-center transition-all
                  ${
                    isActive
                      ? "bg-default-100 text-foreground"
                      : "text-default-400 hover:text-foreground hover:bg-default-50"
                  }
                `}
                >
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                </div>
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Tooltip
          content="Sign Out"
          placement="right"
          classNames={{
            content:
              "bg-foreground text-background text-xs font-medium px-2 py-1.5 rounded-lg",
          }}
        >
          <button
            onClick={handleLogout}
            className="size-11 rounded-xl flex items-center justify-center text-default-400 hover:text-foreground hover:bg-default-50 transition-all"
          >
            <LogOut size={18} />
          </button>
        </Tooltip>
      </div>
    </div>
  );

  // ----------------------------------------------------------------------
  // 🎨 COMPONENT: SECONDARY SIDEBAR
  // ----------------------------------------------------------------------
  const SecondarySidebar = () => (
    <div className="flex flex-col h-full w-60 bg-background border-r border-default-200 shrink-0 z-20">
      {/* User Profile */}
      <div className="h-16 flex items-center px-4 border-b border-default-100">
        <Dropdown placement="bottom-start" className="w-full">
          <DropdownTrigger>
            <div className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-default-50 cursor-pointer transition-colors group">
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-medium truncate leading-tight text-foreground">
                  {dealerName}
                </p>
                <p className="text-[11px] text-default-400 tracking-wide font-medium">
                  {subscription}
                </p>
              </div>
              <ChevronDown
                size={14}
                className="text-default-400 group-hover:text-foreground transition-colors"
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="settings" startContent={<Settings size={14} />}>
              Settings
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
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
        {currentSecondaryItems.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-1.5 text-[11px] font-medium text-default-400 tracking-wide">
              {section.section}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                      ${
                        isActive
                          ? "bg-default-100 text-foreground font-medium"
                          : item.highlight
                            ? "text-foreground hover:bg-default-50 font-medium"
                            : "text-default-500 hover:bg-default-50 hover:text-foreground"
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2 : 1.5}
                      className={
                        isActive
                          ? "text-foreground"
                          : item.highlight
                            ? "text-foreground"
                            : "text-default-400"
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
        <div className="p-4 mt-auto border-t border-default-100">
          <div className="bg-default-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-foreground" />
              <p className="text-sm font-semibold text-foreground">
                Upgrade to Pro
              </p>
            </div>
            <p className="text-xs text-default-500 mb-3">
              Unlock unlimited AI stories
            </p>
            <button
              onClick={() => navigate("/dashboard/settings")}
              className="w-full h-8 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              View Plans
            </button>
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
        {showSecondarySidebar && <SecondarySidebar />}
      </div>

      {/* MOBILE */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        size="xs"
        classNames={{
          base: "max-w-[312px]",
          backdrop: "bg-black/40",
        }}
      >
        <DrawerContent className="flex flex-row p-0 gap-0">
          {() => (
            <DrawerBody className="p-0 flex flex-row gap-0 overflow-hidden">
              <PrimaryRail />
              {showSecondarySidebar && <SecondarySidebar />}
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen min-w-0 bg-background">
        <header className="h-14 lg:hidden shrink-0 sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-default-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpen}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-default-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="font-semibold text-base tracking-tight">AXLE</span>
          </div>
          <Avatar src={dealerLogo} size="sm" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div
            className={`mx-auto h-full flex flex-col ${showSecondarySidebar ? "max-w-400" : "max-w-450"}`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
