"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MultiSelectCombobox,
    type ComboboxOption,
} from "@/components/ui/combobox";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { useFilterStore } from "@/store/filterStore";
import { useSitesStore } from "@/store/sitesStore";
import { Filter, X } from "lucide-react";
import type React from "react";
import { useEffect, useState, useMemo } from "react";

export const createSelectedFilterBadge = (
    label: string,
    removeFilter?: () => void
) => (
    <Badge
        key={label}
        variant="secondary"
        className="rounded-lg px-2 py-1 text-xs bg-[#CAF0F8] text-fg-black capitalize max-w-full"
    >
        <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {label}
        </span>
        {removeFilter && (
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-1 h-6 w-3 p-0 bg-transparent"
                onClick={removeFilter}
            >
                <X className="h-2 w-2 text-black" />
            </Button>
        )}
    </Badge>
);

const Filters: React.FC = () => {
    const { setSites } = useSitesStore();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [locationOptions, setLocationOptions] = useState<ComboboxOption[]>(
        []
    );

    const locationsData = useMemo(() => ({
        sites: [
            {
                id: "0abf114b-2366-4840-9beb-560ffd189817",
                siteCode: "COMM",
                siteName: "Suds Deluxe Commerce",
                region: "America/Chicago",
                server: "",
                address: null,
                city: null,
                state: null,
                country: null,
                pincode: null,
                isActive: true,
                createdAt: "1751249436687",
                updatedAt: "1751249574847"
            },
            {
                id: "0dbca276-da19-4b42-93c6-dfb0f8214b94",
                siteCode: "SMRF",
                siteName: "Suds Deluxe San Marcos 2 C-Store",
                region: "America/Chicago",
                server: "",
                address: null,
                city: null,
                state: null,
                country: null,
                pincode: null,
                isActive: true,
                createdAt: "1751249436687",
                updatedAt: "1751249574847"
            },
            {
                id: "1154211b-cd26-435b-a3cd-49c0b6b99da0",
                siteCode: "SMWW",
                siteName: "Suds Deluxe San Marcos",
                region: "America/Chicago",
                server: "",
                address: null,
                city: null,
                state: null,
                country: null,
                pincode: null,
                isActive: true,
                createdAt: "1751249436687",
                updatedAt: "1751249574847"
            },
            {
                id: "2e626ef1-8c58-4572-9a85-20c6392f8b9a",
                siteCode: "GTWH",
                siteName: "Suds Deluxe Georgetown",
                region: "America/Chicago",
                server: "",
                address: null,
                city: null,
                state: null,
                country: null,
                pincode: null,
                isActive: true,
                createdAt: "1751249436687",
                updatedAt: "1751249574847"
            },
            {
                id: "41a74909-34ab-4f27-b6e7-074759d9b293",
                siteCode: "TMBL",
                siteName: "Suds Deluxe Tomball",
                region: "America/Chicago",
                server: "",
                address: null,
                city: null,
                state: null,
                country: null,
                pincode: null,
                isActive: true,
                createdAt: "1751249436687",
                updatedAt: "1751249574847"
            },
            {
                id: "632676cb-a987-4c7e-bedd-a58d8e9d25a4",
                siteCode: "KYLE",
                siteName: "Suds Deluxe Kyle",
                region: "America/Chicago",
                server: "",
                address: null,
                city: null,
                state: null,
                country: null,
                pincode: null,
                isActive: true,
                createdAt: "1751249436687",
                updatedAt: "1751249574847"
            },
            {
                id: "7579c1a4-04c9-4620-8fa2-2c4bcaafe974",
                siteCode: "HWY6",
                siteName: "Suds Deluxe Highway 6",
                region: "America/Chicago",
                server: "",
                address: null,
                city: null,
                state: null,
                country: null,
                pincode: null,
                isActive: true,
                createdAt: "1751249436687",
                updatedAt: "1751249574847"
            },
            {
                id: "769ad1a1-c3a9-47ee-bb08-aca282a5e606",
                siteCode: "PSDA",
                siteName: "Suds Deluxe Pasadena",
                region: "America/Chicago",
                server: "",
                address: null,
                city: null,
                state: null,
                country: null,
                pincode: null,
                isActive: true,
                createdAt: "1751249436687",
                updatedAt: "1751249574847"
            },
        ]
    }), []);

    const {
        locations: appliedLocations,
        setLocations,
        clearAllFilters,
    } = useFilterStore();

    const [tempSelectedLocations, setTempSelectedLocations] =
        useState<string[]>(appliedLocations);

    const handleApplyFilters = () => {
        setLocations(tempSelectedLocations);
        setIsSheetOpen(false);
    };

    const handleClearAll = () => {
        setTempSelectedLocations([]);
        clearAllFilters();
        if (appliedLocations?.length > 0) {
            setIsSheetOpen(false);
        }
    };

    const removeFilter = (
        type: "locations",
        value: string
    ) => {
        switch (type) {
            case "locations":
                setTempSelectedLocations((prev) =>
                    prev?.filter((v) => v !== value)
                );
                break;
        }
    };

    const getFilterLabel = (
        type: "locations",
        value: string
    ) => {
        const options =
            type === "locations"
                ? locationOptions
                : [];
        return options?.find((opt) => opt.value === value)?.label || value;
    };

    const totalTemp = appliedLocations?.length

    useEffect(() => {
        if (isSheetOpen) {
            setTempSelectedLocations(appliedLocations);
        }
    }, [
        isSheetOpen,
        appliedLocations,
    ]);

    useEffect(() => {
        if (!locationsData?.sites || locationsData?.sites?.length === 0) return;
        const locations = locationsData?.sites?.map((site) => ({
            value: site.siteCode,
            label: site.siteName,
        }));

        setLocationOptions(locations);
        setSites(locations);
    }, [locationsData?.sites, setSites]);

    useEffect(() => {
        if (appliedLocations?.length > 0) {
            setTempSelectedLocations(appliedLocations);
        }
    }, [appliedLocations]);

    return (
        <div className="flex flex-wrap items-center gap-3 px-3">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="relative text-sm border-primary text-fg-black h-9 w-9"
                    >
                        <Filter className="h-4 w-4 text-primary" />
                        {totalTemp > 0 && <span className="absolute top-2 right-2 size-1.5 bg-red-500 rounded-full" />}
                    </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-[300px] gap-0">
                    <SheetHeader className="border-b">
                        <SheetTitle className="text-xl">Filters</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-4 p-4 overflow-y-auto overflow-x-hidden">
                        <MultiSelectCombobox
                            options={locationOptions}
                            values={tempSelectedLocations}
                            onValuesChange={setTempSelectedLocations}
                            placeholder="All Locations"
                            searchPlaceholder="Search locations..."
                            emptyText="No locations found."
                        />
                        {tempSelectedLocations?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tempSelectedLocations?.map((location) =>
                                    createSelectedFilterBadge(
                                        getFilterLabel("locations", location),
                                        () =>
                                            removeFilter("locations", location)
                                    )
                                )}
                            </div>
                        )}

                        {totalTemp > 0 && (
                            <div className="flex items-center justify-center w-full">
                                <Button
                                    variant="ghost"
                                    onClick={handleClearAll}
                                    className="text-red-500 hover:text-red-700 bg-transparent underline"
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}
                    </div>

                    <SheetFooter className="p-4">
                        <Button onClick={handleApplyFilters} className="w-full">
                            Apply Filters
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Filters;
