import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Sparkles,
  Play,
  MoreVertical,
  Edit3,
  Trash2,
  Share2,
} from "lucide-react";

export default function StudioCard({ car, onGenerate, onPlay, onEdit }) {
  const hasStory = car.hasStory;
  const thumbnail =
    car.photos?.[0] || "https://placehold.co/600x400/1a1a1a/FFF?text=No+Image";

  // -----------------------------------------------------------
  // VARIANT A: THE "SHOWROOM" CARD (Story Exists)
  // -----------------------------------------------------------
  if (hasStory) {
    return (
      <Card isFooterBlurred className="w-full h-[300px] col-span-1 group">
        {/* Header (Status) */}
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <div className="flex justify-between w-full">
            <Chip
              size="sm"
              color={car.storyStatus === "published" ? "success" : "warning"}
              variant="flat"
              className="uppercase font-bold text-[10px] tracking-wider"
            >
              {car.storyStatus || "Draft"}
            </Chip>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-white/70 hover:text-white"
                >
                  <MoreVertical size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Story Actions">
                <DropdownItem
                  key="edit"
                  startContent={<Edit3 size={16} />}
                  onPress={() => onEdit(car)}
                >
                  Edit Story
                </DropdownItem>
                <DropdownItem key="share" startContent={<Share2 size={16} />}>
                  Share Link
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<Trash2 size={16} />}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardHeader>

        {/* Background Image */}
        <Image
          removeWrapper
          alt="Car Thumbnail"
          className="z-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={thumbnail}
        />

        {/* The "Play" Overlay */}
        <div className="absolute inset-0 z-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            isIconOnly
            radius="full"
            className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/50 text-white shadow-2xl"
            onPress={() => onPlay(car)}
          >
            <Play fill="currentColor" size={24} />
          </Button>
        </div>

        {/* Footer Info */}
        <CardFooter className="absolute bg-black/60 bottom-0 z-10 border-t-1 border-white/20 flex justify-between items-center">
          <div className="flex flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              {car.year} {car.make}
            </p>
            <h4 className="text-white font-medium text-large truncate max-w-[200px]">
              {car.model} {car.trim}
            </h4>
          </div>
          <Button
            radius="full"
            size="sm"
            className="bg-white/10 text-white backdrop-blur-md border border-white/20"
            onPress={() => onEdit(car)}
          >
            Studio
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // -----------------------------------------------------------
  // VARIANT B: THE "UNEXPLORED" CARD (No Story)
  // -----------------------------------------------------------
  return (
    <Card className="w-full h-[300px] col-span-1 border border-default-200 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
      {/* Visual Header */}
      <div className="h-[160px] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <Image
          removeWrapper
          alt="Car Thumbnail"
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all"
          src={thumbnail}
        />
        <div className="absolute bottom-3 left-3 z-20 text-white">
          <p className="text-tiny font-bold uppercase opacity-80">
            {car.year} {car.make}
          </p>
          <p className="font-semibold text-lg">{car.model}</p>
        </div>
      </div>

      <CardBody className="flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-2 rounded-full bg-warning animate-pulse" />
            <span className="text-tiny font-bold uppercase text-warning tracking-widest">
              Unexplored
            </span>
          </div>
          <p className="text-sm text-default-500 line-clamp-2">
            This vehicle has specs data but no story. Generate one to boost
            engagement.
          </p>
        </div>

        <Button
          className="w-full font-semibold shadow-lg shadow-primary/20"
          color="primary"
          startContent={<Sparkles size={18} />}
          onPress={() => onGenerate(car)}
        >
          Generate Story
        </Button>
      </CardBody>
    </Card>
  );
}
