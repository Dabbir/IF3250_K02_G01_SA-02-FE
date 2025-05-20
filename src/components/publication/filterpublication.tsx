import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";
import { TONE_OPTIONS } from "@/types/publication";
import type { FilterOptions } from "@/types/publication";
import ToneBadge from "./tonebadge";

interface FilterPublicationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toneFilters: string[];
  onToggleToneFilter: (tone: string) => void;
  mediaFilters: string[];
  onMediaFiltersChange: (filters: string[]) => void;
  dateFrom: string;
  onDateFromChange: (date: string) => void;
  dateTo: string;
  onDateToChange: (date: string) => void;
  prValueMin: number | undefined;
  onPrValueMinChange: (value: number | undefined) => void;
  prValueMax: number | undefined;
  onPrValueMaxChange: (value: number | undefined) => void;
  filterOptions: FilterOptions | null;
  onClearFilters: () => void;
}

export default function FilterPublication({
  open,
  onOpenChange,
  toneFilters,
  onToggleToneFilter,
  mediaFilters,
  onMediaFiltersChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  prValueMin,
  onPrValueMinChange,
  prValueMax,
  onPrValueMaxChange,
  filterOptions,
  onClearFilters,
}: FilterPublicationProps) {
  const activeFiltersCount = 
    toneFilters.length + 
    mediaFilters.length + 
    (dateFrom ? 1 : 0) + 
    (dateTo ? 1 : 0) + 
    (prValueMin !== undefined ? 1 : 0) + 
    (prValueMax !== undefined ? 1 : 0);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="max-md:h-8 flex items-center gap-1 md:w-auto">
          <Filter className="h-3 w-3 md:-h4 md:w-4" />
          <span className="max-md:text-[12px]">Filter</span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 bg-[#3A786D] text-white min-w-[20px] h-5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[calc(100vw-32px)] sm:w-[380px] p-0" align="end">
        <div className="max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b px-3 sm:px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold text-base">Filter Publikasi</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-gray-100"
                onClick={onClearFilters}
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-gray-100"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-3 sm:p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">Tone</h4>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {TONE_OPTIONS.map((tone) => (
                  <div key={tone} className="flex items-center space-x-1 py-1.5 px-1 sm:px-2 rounded hover:bg-gray-50">
                    <Checkbox
                      id={`tone-${tone}`}
                      checked={toneFilters.includes(tone)}
                      onCheckedChange={() => onToggleToneFilter(tone)}
                      className="data-[state=checked]:bg-[#3A786D] data-[state=checked]:border-[#3A786D] h-3.5 w-3.5"
                    />
                    <Label htmlFor={`tone-${tone}`} className="cursor-pointer text-xs sm:text-sm">
                      <ToneBadge tone={tone} />
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">Media</h4>
              <div className="grid grid-cols-2 gap-x-1 gap-y-1 sm:gap-x-2">
                {filterOptions?.media.map((media) => (
                  <div key={media} className="flex items-center space-x-1.5 py-1.5 px-1 sm:px-2 rounded hover:bg-gray-50">
                    <Checkbox
                      checked={mediaFilters.includes(media)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onMediaFiltersChange([...mediaFilters, media]);
                        } else {
                          onMediaFiltersChange(mediaFilters.filter(m => m !== media));
                        }
                      }}
                      className="data-[state=checked]:bg-[#3A786D] data-[state=checked]:border-[#3A786D] h-3.5 w-3.5"
                    />
                    <Label className="text-xs sm:text-sm cursor-pointer leading-none truncate">{media}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">Tanggal & PR Value</h4>
              <div className="space-y-3 border rounded-md p-2 sm:p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="dateFrom" className="text-xs text-gray-600 mb-1 block">Dari</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => onDateFromChange(e.target.value)}
                      className="h-8 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTo" className="text-xs text-gray-600 mb-1 block">Sampai</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateTo}
                      onChange={(e) => onDateToChange(e.target.value)}
                      className="h-8 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="prValueMin" className="text-xs text-gray-600 mb-1 block">PR Min</Label>
                    <Input
                      id="prValueMin"
                      type="number"
                      value={prValueMin || ''}
                      onChange={(e) => onPrValueMinChange(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="0"
                      className="h-8 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prValueMax" className="text-xs text-gray-600 mb-1 block">PR Max</Label>
                    <Input
                      id="prValueMax"
                      type="number"
                      value={prValueMax || ''}
                      onChange={(e) => onPrValueMaxChange(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="999999999"
                      className="h-8 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 bg-white border-t px-3 sm:px-4 py-3">
            <Button
              className="w-full bg-[#3A786D] hover:bg-[#2d5f56] text-white h-9 text-sm font-medium"
              onClick={() => onOpenChange(false)}
            >
              Terapkan Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}