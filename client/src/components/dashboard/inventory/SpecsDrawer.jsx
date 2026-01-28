import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Input,
  Button,
  ScrollShadow,
  Divider,
} from "@heroui/react";
import { Search, Trash2, Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function SpecsDrawer({ isOpen, onClose, specs, setSpecs }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false);
  const listRef = useRef(null);

  // 1. FILTER LOGIC
  const filteredSpecs = specs.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.value).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 2. HANDLERS
  const handleUpdate = (id, field, newValue) => {
    setSpecs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item,
      ),
    );
  };

  const handleDelete = (id) => {
    setSpecs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const newItem = { id: uuidv4(), key: "custom_spec", label: "", value: "" };
    setSpecs((prev) => [...prev, newItem]);
    setSearchQuery("");
    setShouldScrollToEnd(true);
  };

  useEffect(() => {
    if (shouldScrollToEnd && listRef.current) {
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
        setShouldScrollToEnd(false);
      });
    }
  }, [specs.length, shouldScrollToEnd]);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="right"
      size="md" // Medium width (approx 400px)
      //   backdrop="blur"
    >
      <DrawerContent>
        {(onClose) => (
          <>
            {/* --- HEADER: TITLE & SEARCH --- */}
            <DrawerHeader className="flex flex-col gap-4 border-b border-default-200 px-6 py-4">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold">Technical Specs</h3>
                <p className="text-small text-default-500">
                  {specs.length} items loaded
                </p>
              </div>

              <Input
                placeholder="Search specs (e.g. Torque, MPG)..."
                startContent={<Search className="text-default-400" size={18} />}
                variant="bordered"
                radius="lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                isClearable
                onClear={() => setSearchQuery("")}
              />
            </DrawerHeader>

            {/* --- BODY: THE LIST --- */}
            <DrawerBody className="p-0">
              <ScrollShadow className="h-full p-6 space-y-4" ref={listRef}>
                {filteredSpecs.length === 0 ? (
                  <div className="text-center py-10 text-default-400">
                    <p>No specs found matching "{searchQuery}"</p>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      className="mt-4"
                      onPress={handleAdd}
                    >
                      Create Custom Spec
                    </Button>
                  </div>
                ) : (
                  filteredSpecs.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-2 items-start group animate-in fade-in slide-in-from-left-2 duration-300"
                    >
                      {/* Label Input */}
                      <Input
                        size="sm"
                        variant="flat"
                        label="Label"
                        value={item.label}
                        onChange={(e) =>
                          handleUpdate(item.id, "label", e.target.value)
                        }
                        className="flex-1"
                        classNames={{
                          inputWrapper:
                            "bg-default-100 group-hover:bg-default-200 transition-colors",
                        }}
                      />

                      {/* Value Input */}
                      <Input
                        size="sm"
                        variant="flat"
                        label="Value"
                        value={item.value}
                        onChange={(e) =>
                          handleUpdate(item.id, "value", e.target.value)
                        }
                        className="flex-1"
                        classNames={{
                          inputWrapper:
                            "bg-default-100 group-hover:bg-default-200 transition-colors",
                        }}
                      />

                      {/* Delete Button */}
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        size="lg"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onPress={() => handleDelete(item.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))
                )}
              </ScrollShadow>
            </DrawerBody>

            {/* --- FOOTER: ACTIONS --- */}
            <DrawerFooter className="border-t border-default-200">
              <Button
                variant="flat"
                color="default"
                startContent={<Plus size={18} />}
                onPress={handleAdd}
                className="mr-auto"
              >
                Add Custom Spec
              </Button>
              <Button color="primary" onPress={onClose}>
                Done
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
