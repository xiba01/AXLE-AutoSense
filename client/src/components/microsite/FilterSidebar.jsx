import React, { useState } from "react";
import {
  Slider,
  CheckboxGroup,
  Checkbox,
  Input,
  Accordion,
  AccordionItem,
  Button,
  Chip,
} from "@heroui/react";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";

export default function FilterSidebar({ onFilterChange }) {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState([]);

  const hasFilters =
    selectedMakes.length > 0 ||
    selectedTypes.length > 0 ||
    selectedFuel.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000;

  const clearFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedMakes([]);
    setSelectedTypes([]);
    setSelectedFuel([]);
  };

  return (
    <div className="w-full space-y-6 sticky top-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-gray-500" />
          <h2 className="font-bold text-gray-900">Filters</h2>
        </div>
        {hasFilters && (
          <Button
            size="sm"
            variant="light"
            className="text-gray-500 text-xs h-7"
            startContent={<RotateCcw size={12} />}
            onPress={clearFilters}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-1">
          {selectedMakes.map((make) => (
            <Chip
              key={make}
              size="sm"
              variant="flat"
              onClose={() =>
                setSelectedMakes(selectedMakes.filter((m) => m !== make))
              }
              className="text-xs"
            >
              {make}
            </Chip>
          ))}
        </div>
      )}

      {/* Search */}
      <div>
        <Input
          placeholder="Search make, model..."
          startContent={<Search size={16} className="text-gray-400" />}
          variant="bordered"
          radius="lg"
          size="sm"
          classNames={{
            inputWrapper:
              "bg-white border-gray-200 hover:border-gray-300 focus-within:border-gray-400",
            input: "text-sm",
          }}
        />
      </div>

      {/* Filters Accordion */}
      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["price", "make"]}
        className="px-0"
        itemClasses={{
          base: "py-0",
          title: "font-semibold text-sm text-gray-800",
          trigger: "py-3 data-[hover=true]:bg-transparent",
          content: "pt-0 pb-4",
        }}
      >
        {/* Price Range */}
        <AccordionItem key="price" title="Price Range" aria-label="Price Range">
          <div className="space-y-4">
            <Slider
              step={5000}
              minValue={0}
              maxValue={150000}
              value={priceRange}
              onChange={setPriceRange}
              formatOptions={{
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }}
              className="max-w-full"
              size="sm"
              color="foreground"
              classNames={{
                filler: "bg-gray-900",
                thumb: "bg-gray-900 border-gray-900",
              }}
            />
            <div className="flex gap-2">
              <Input
                type="number"
                size="sm"
                variant="bordered"
                value={priceRange[0].toString()}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                startContent={<span className="text-gray-400 text-xs">$</span>}
                classNames={{ input: "text-xs", inputWrapper: "h-8" }}
              />
              <span className="text-gray-400 self-center">—</span>
              <Input
                type="number"
                size="sm"
                variant="bordered"
                value={priceRange[1].toString()}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                startContent={<span className="text-gray-400 text-xs">$</span>}
                classNames={{ input: "text-xs", inputWrapper: "h-8" }}
              />
            </div>
          </div>
        </AccordionItem>

        {/* Make */}
        <AccordionItem key="make" title="Make" aria-label="Make">
          <CheckboxGroup
            value={selectedMakes}
            onValueChange={setSelectedMakes}
            classNames={{ wrapper: "gap-2" }}
          >
            {[
              { value: "BMW", count: 4 },
              { value: "Mercedes-Benz", count: 6 },
              { value: "Audi", count: 3 },
              { value: "Tesla", count: 2 },
              { value: "Porsche", count: 1 },
              { value: "Lexus", count: 3 },
            ].map((make) => (
              <Checkbox
                key={make.value}
                value={make.value}
                classNames={{
                  label: "text-sm text-gray-700",
                  wrapper: "before:border-gray-300",
                }}
              >
                <span className="flex items-center justify-between w-full">
                  {make.value}
                  <span className="text-xs text-gray-400 ml-2">
                    ({make.count})
                  </span>
                </span>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>

        {/* Body Type */}
        <AccordionItem key="type" title="Body Type" aria-label="Body Type">
          <CheckboxGroup
            value={selectedTypes}
            onValueChange={setSelectedTypes}
            classNames={{ wrapper: "gap-2" }}
          >
            {["Sedan", "SUV", "Coupe", "Truck", "Convertible", "Hatchback"].map(
              (type) => (
                <Checkbox
                  key={type}
                  value={type}
                  classNames={{
                    label: "text-sm text-gray-700",
                    wrapper: "before:border-gray-300",
                  }}
                >
                  {type}
                </Checkbox>
              ),
            )}
          </CheckboxGroup>
        </AccordionItem>

        {/* Fuel Type */}
        <AccordionItem key="fuel" title="Fuel Type" aria-label="Fuel Type">
          <CheckboxGroup
            value={selectedFuel}
            onValueChange={setSelectedFuel}
            classNames={{ wrapper: "gap-2" }}
          >
            {["Gasoline", "Electric", "Hybrid", "Diesel"].map((fuel) => (
              <Checkbox
                key={fuel}
                value={fuel}
                classNames={{
                  label: "text-sm text-gray-700",
                  wrapper: "before:border-gray-300",
                }}
              >
                {fuel}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </AccordionItem>
      </Accordion>

      {/* Apply Button (Mobile) */}
      <Button
        className="w-full font-semibold bg-gray-900 text-white lg:hidden"
        size="lg"
      >
        Show Results
      </Button>
    </div>
  );
}
