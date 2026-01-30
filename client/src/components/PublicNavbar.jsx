import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  Menu,
  Car,
  Wrench,
  FileText,
} from "lucide-react";

export default function PublicNavbar({ dealer }) {
  const { dealerId } = useParams();
  const dealerName = dealer?.dealership_name || "Dealership";
  const dealerLogo = dealer?.logo_url;
  const brandColor = dealer?.primary_color || "#1a1a1a";

  return (
    <>
      {/* TOP BAR - Contact Info */}
      <div className="bg-gray-900 text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="opacity-70" />
              Mon - Sat: 9AM - 7PM
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="opacity-70" />
              123 Auto Drive, City, ST 12345
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+1234567890"
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
            >
              <Phone size={12} />
              (123) 456-7890
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <Navbar
        maxWidth="xl"
        className="border-b border-gray-100 bg-white h-20 shadow-sm"
        classNames={{ wrapper: "px-4 sm:px-8" }}
      >
        <NavbarBrand>
          <Link to={`/sites/${dealerId}`} className="flex items-center gap-3">
            {dealerLogo ? (
              <img
                src={dealerLogo}
                alt={dealerName}
                className="h-12 w-auto object-contain max-w-[180px]"
              />
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="size-11 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: brandColor }}
                >
                  {dealerName.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-lg tracking-tight text-gray-900 block leading-tight">
                    {dealerName}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Premium Automobiles
                  </span>
                </div>
              </div>
            )}
          </Link>
        </NavbarBrand>

        {/* Desktop Navigation */}
        <NavbarContent className="hidden lg:flex gap-8" justify="center">
          <NavbarItem>
            <Link
              to={`/sites/${dealerId}`}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              Inventory
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="text-sm font-semibold text-gray-700 p-0 h-auto min-w-0 data-[hover=true]:bg-transparent"
                  endContent={<ChevronDown size={14} />}
                >
                  Services
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Services">
                <DropdownItem
                  key="financing"
                  startContent={<FileText size={16} />}
                >
                  Financing
                </DropdownItem>
                <DropdownItem key="trade-in" startContent={<Car size={16} />}>
                  Trade-In Appraisal
                </DropdownItem>
                <DropdownItem key="service" startContent={<Wrench size={16} />}>
                  Service Center
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          <NavbarItem>
            <Link
              to="#"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              About Us
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              to="#"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="gap-2">
          <NavbarItem className="hidden sm:flex">
            <Button
              variant="light"
              className="text-gray-600 font-semibold"
              startContent={<MapPin size={16} />}
            >
              Directions
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              className="font-bold text-white px-6 shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: brandColor }}
              startContent={<Phone size={16} />}
            >
              <span className="hidden sm:inline">Call Now</span>
              <span className="sm:hidden">Call</span>
            </Button>
          </NavbarItem>
          {/* Mobile Menu */}
          <NavbarItem className="lg:hidden">
            <Button isIconOnly variant="light" className="text-gray-700">
              <Menu size={24} />
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}
