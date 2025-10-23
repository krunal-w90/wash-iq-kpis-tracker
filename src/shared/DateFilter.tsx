"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    comparisonOptions,
    predefinedRanges,
} from "@/constants/filter-options-data";
import {
    calculateComparisonPeriod,
    calculateDateRange,
    cn,
    comparisonType,
    rangeType,
    showToast
} from "@/lib/utils";
import { useFilterStore } from "@/store/filterStore";
import { Calendar } from "iconsax-reactjs";
import { LucideChevronDown } from "lucide-react";
import moment from "moment";
import type React from "react";
import { useEffect, useState } from "react";

const DateFilter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        selectedRangeType,
        comparisonType,
        currentEnvelope,
        priorEnvelope,
        setCurrentEnvelope,
        setPriorEnvelope,
        setSelectedRangeType,
        setComparisonType,
        clearComparison,
    } = useFilterStore();

    const [tempSelectedRangeType, setTempSelectedRangeType] =
        useState(selectedRangeType);
    const [tempComparisonType, setTempComparisonType] =
        useState(comparisonType);
    const [customStartDate, setCustomStartDate] = useState(moment().utc().format("YYYY-MM-DD"));
    const [customEndDate, setCustomEndDate] = useState(moment().utc().format("YYYY-MM-DD"));
    const [comparisonStartDate, setComparisonStartDate] = useState(moment().utc().format("YYYY-MM-DD"));
    const [comparisonEndDate, setComparisonEndDate] = useState(moment().utc().format("YYYY-MM-DD"));

    const isApplyDisabled = () => {
        if (tempSelectedRangeType === "custom") {
            return !customStartDate || !customEndDate;
        }
        if (tempComparisonType === "custom") {
            return !comparisonStartDate || !comparisonEndDate;
        }
        return false;
    };

    const handleApply = () => {
        if (tempSelectedRangeType === "custom") {
            if (!customStartDate || !customEndDate) {
                showToast(
                    "warning",
                    "Please select both start and end dates for the custom range"
                );
                return;
            }

            const start = moment(customStartDate);
            const end = moment(customEndDate);

            if (end.isBefore(start)) {
                showToast("warning", "End date cannot be before start date");
                return;
            }
        }

        if (tempComparisonType === "custom") {
            if (!comparisonStartDate || !comparisonEndDate) {
                showToast(
                    "warning",
                    "Please select both start and end dates for the comparison range"
                );
                return;
            }

            const compStart = moment(comparisonStartDate);
            const compEnd = moment(comparisonEndDate);

            if (compEnd.isBefore(compStart)) {
                showToast(
                    "warning",
                    "Comparison end date cannot be before start date"
                );
                return;
            }
        }

        setSelectedRangeType(tempSelectedRangeType);
        setComparisonType(tempComparisonType);

        const primaryRange = calculateDateRange(
            tempSelectedRangeType,
            customStartDate,
            customEndDate
        );

        let startMoment, endMoment;

        if (moment.isMoment(primaryRange?.start)) {
            startMoment = primaryRange?.start;
        } else {
            startMoment = moment(primaryRange?.start);
        }

        if (moment.isMoment(primaryRange?.end)) {
            endMoment = primaryRange?.end;
        } else {
            endMoment = moment(primaryRange?.end);
        }

        if (!startMoment.isValid() || !endMoment.isValid()) {
            showToast("error", "Invalid date range calculated:");
            return;
        }

        const envelope = {
            // Use UTC day boundaries to avoid local timezone shifting the date
            start: moment
                .utc(startMoment.format("YYYY-MM-DD"), "YYYY-MM-DD")
                .startOf("day")
                .toISOString(),
            end: moment
                .utc(endMoment.format("YYYY-MM-DD"), "YYYY-MM-DD")
                .endOf("day")
                .toISOString(),
        }

        setCurrentEnvelope(envelope);

        if (tempComparisonType) {
            const comparisonRange = calculateComparisonPeriod(
                tempSelectedRangeType,
                tempComparisonType,
                customStartDate,
                customEndDate,
                comparisonStartDate,
                comparisonEndDate
            );
            if (comparisonRange) {
                let compStartMoment, compEndMoment;

                if (moment.isMoment(comparisonRange?.start)) {
                    compStartMoment = comparisonRange?.start;
                } else {
                    compStartMoment = moment(comparisonRange?.start);
                }

                if (moment.isMoment(comparisonRange?.end)) {
                    compEndMoment = comparisonRange?.end;
                } else {
                    compEndMoment = moment(comparisonRange?.end);
                }

                setPriorEnvelope({
                    // Use UTC day boundaries for comparison as well
                    start: moment
                        .utc(compStartMoment.format("YYYY-MM-DD"), "YYYY-MM-DD")
                        .startOf("day")
                        .toISOString(),
                    end: moment
                        .utc(compEndMoment.format("YYYY-MM-DD"), "YYYY-MM-DD")
                        .endOf("day")
                        .toISOString(),
                });
            }
        } else {
            clearComparison();
        }

        setIsOpen(false);
    };

    const handleRangeSelect = (range: rangeType) => {
        if (range === "custom") {
            setCustomStartDate(moment().utc().startOf("day").format("YYYY-MM-DD"));
            setCustomEndDate(moment().utc().endOf("day").format("YYYY-MM-DD"));
        }
        setTempSelectedRangeType(range);
    };

    const handleComparisonChange = (comparison: string, checked: boolean) => {
        if (comparison === "custom") {
            setComparisonStartDate(moment().utc().startOf("day").format("YYYY-MM-DD"));
            setComparisonEndDate(moment().utc().endOf("day").format("YYYY-MM-DD"));
        }

        if (checked) {
            setTempComparisonType(comparison as comparisonType);
        } else if (tempComparisonType === comparison) {
            setTempComparisonType("" as comparisonType);
        }
    };

    const getSelectedLabel = () => {
        const primaryLabel =
            selectedRangeType === "custom"
                ? customStartDate && customEndDate
                    ? `${formatDateForDisplay(
                        moment(currentEnvelope?.start).utc()
                    )} - ${formatDateForDisplay(
                        moment(currentEnvelope?.end).utc()
                    )}`
                    : "Custom Range"
                : predefinedRanges?.find(
                    (range) => range.value === selectedRangeType
                )?.label || "Last 7 Days";

        if (!comparisonType) {
            return primaryLabel;
        }

        const comparisonLabel =
            comparisonOptions?.find((opt) => opt.value === comparisonType)
                ?.label || "";
        return `${primaryLabel} vs ${comparisonLabel === "Custom Comparison Range"
            ? `${formatDateForDisplay(
                moment(priorEnvelope?.start).utc()
            )} - ${formatDateForDisplay(moment(priorEnvelope?.end).utc())}`
            : comparisonLabel
            }`;
    };

    const formatDateForDisplay = (date: moment.Moment) => {
        return date.format("MMM D, YYYY");
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setTempSelectedRangeType(selectedRangeType);
            setTempComparisonType(comparisonType);
        }
        setIsOpen(open);
    };

    // To set comparison date range according to selected range type from filter dropdown
    const setComparisonRange = () => {
        // if (!comparisonType) {
        //   setComparisonType("previous");
        //   return;
        // }
        const comparisonRange = calculateComparisonPeriod(
            selectedRangeType || "last7days",
            comparisonType,
            customStartDate,
            customEndDate,
            comparisonStartDate,
            comparisonEndDate
        );
        if (comparisonRange && comparisonRange.start && comparisonRange.end) {
            const newStart = moment
                .utc(moment(comparisonRange.start).format("YYYY-MM-DD"))
                .startOf("day")
                .toISOString();
            const newEnd = moment
                .utc(moment(comparisonRange.end).format("YYYY-MM-DD"))
                .endOf("day")
                .toISOString();
            if (
                priorEnvelope?.start !== newStart ||
                priorEnvelope?.end !== newEnd
            ) {
                setPriorEnvelope({
                    start: newStart,
                    end: newEnd,
                });
            }
        }
    };

    // To set custom date range
    useEffect(() => {
        if (
            selectedRangeType === "custom" &&
            currentEnvelope?.start &&
            currentEnvelope?.end
        ) {
            setCustomStartDate(
                moment(currentEnvelope.start).utc().format("YYYY-MM-DD")
            );
            setCustomEndDate(moment(currentEnvelope.end).utc().format("YYYY-MM-DD"));
        }
    }, [selectedRangeType, currentEnvelope]);

    // To set date range according to selected range type from filter dropdown
    useEffect(() => {
        if (selectedRangeType === "custom") {
            return;
        }

        if (!selectedRangeType) {
            setSelectedRangeType("last7days");
            return;
        }

        const primaryRange = calculateDateRange(
            selectedRangeType || "last7days"
        );

        if (primaryRange && primaryRange.start && primaryRange.end) {
            const newStart = moment
                .utc(moment(primaryRange.start).format("YYYY-MM-DD"), "YYYY-MM-DD")
                .startOf("day")
                .toISOString();
            const newEnd = moment
                .utc(moment(primaryRange.end).format("YYYY-MM-DD"), "YYYY-MM-DD")
                .endOf("day")
                .toISOString();

            if (
                currentEnvelope?.start !== newStart ||
                currentEnvelope?.end !== newEnd
            ) {
                setCurrentEnvelope({
                    start: newStart,
                    end: newEnd,
                });
            }
        }

        setComparisonRange();
    }, [selectedRangeType]);

    // To set custom comparison date range
    useEffect(() => {
        if (
            comparisonType === "custom" &&
            priorEnvelope?.start &&
            priorEnvelope?.end
        ) {
            setComparisonStartDate(
                moment(priorEnvelope.start).utc().format("YYYY-MM-DD")
            );
            setComparisonEndDate(
                moment(priorEnvelope.end).utc().format("YYYY-MM-DD")
            );
        }
    }, [comparisonType, priorEnvelope]);

    // To set comparison date range
    useEffect(() => {
        setTempSelectedRangeType(selectedRangeType);
        setTempComparisonType(comparisonType);

        // setComparisonRange();
    }, [selectedRangeType, comparisonType]);

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="max-w-[200px] md:max-w-none flex items-center gap-2 px-4 py-2 md:min-w-[200px] min-w-full justify-between rounded-xl text-fg-black border-b-default h-11"
                >
                    <span className="text-xs font-medium truncate">
                        {getSelectedLabel()}
                    </span>
                    <LucideChevronDown
                        className={cn(
                            "transition-transform duration-200 text-fg-black",
                            isOpen ? "rotate-180" : ""
                        )}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="md:w-[450px] w-[320px] p-0 rounded-xl"
                align="end"
                side="bottom"
                sideOffset={4}
            >
                <div className="grid grid-cols-2 lg:h-[450px] md:h-[400px] h-[350px] overflow-auto">
                    <div className="border-r border-b-default">
                        <div className="space-y-1">
                            {predefinedRanges?.map((range) => (
                                <button
                                    key={range.value}
                                    onClick={() =>
                                        handleRangeSelect(
                                            range.value as rangeType
                                        )
                                    }
                                    className={cn(
                                        "w-full text-left px-6 py-2 first:pt-4 text-xs font-medium rounded-none transition-colors border-b border-b-default last:border-b-0 cursor-pointer outline-none",
                                        tempSelectedRangeType === range.value
                                            ? "text-primary font-medium"
                                            : "text-fg-black hover:bg-gray-50"
                                    )}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>

                        {tempSelectedRangeType === "custom" && (
                            <div className="space-y-3 pt-4 border-t border-b-default p-4">
                                <div>
                                    <Label className="text-xs font-medium text-fg-black mb-2 flex items-center gap-2">
                                        <Calendar
                                            size={16}
                                            className="stroke-primary"
                                        />
                                        Start Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={customStartDate}
                                        onChange={(e) =>
                                            setCustomStartDate(e.target.value)
                                        }
                                        className="block !text-xs w-full border-b-default outline-none"
                                        max={customEndDate}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-fg-black mb-2 flex items-center gap-2">
                                        <Calendar
                                            size={16}
                                            className="stroke-primary"
                                        />
                                        End Date
                                    </Label>
                                    <Input
                                        type="date"
                                        value={customEndDate}
                                        onChange={(e) =>
                                            setCustomEndDate(e.target.value)
                                        }
                                        className="block !text-xs w-full border-b-default outline-none"
                                        min={customStartDate}
                                        max={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 flex flex-col">
                        <h4 className="text-xs font-semibold text-black mb-4">
                            Compare To:
                        </h4>

                        <div className="space-y-3 flex-1">
                            {comparisonOptions?.map((option) => (
                                <div
                                    key={option.value}
                                    className="flex items-center space-x-3"
                                >
                                    <Checkbox
                                        id={option.value}
                                        checked={
                                            tempComparisonType === option.value
                                        }
                                        onCheckedChange={(checked) =>
                                            handleComparisonChange(
                                                option.value,
                                                checked as boolean
                                            )
                                        }
                                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
                                    />
                                    <Label
                                        htmlFor={option.value}
                                        className="text-xs text-black cursor-pointer font-medium"
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                            {tempComparisonType === "custom" && (
                                <div className="space-y-3 mb-4 pt-3 border-t border-b-default">
                                    <div>
                                        <Label className="text-xs font-medium text-fg-black mb-2 flex items-center gap-2">
                                            <Calendar
                                                size={16}
                                                className="stroke-primary"
                                            />
                                            Comparison Start
                                        </Label>
                                        <Input
                                            type="date"
                                            value={comparisonStartDate}
                                            onChange={(e) =>
                                                setComparisonStartDate(
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full !text-xs border-b-default outline-none "
                                            max={comparisonEndDate}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-medium text-fg-black mb-2 flex items-center gap-2">
                                            <Calendar
                                                size={16}
                                                className="stroke-primary"
                                            />
                                            Comparison End
                                        </Label>
                                        <Input
                                            type="date"
                                            value={comparisonEndDate}
                                            onChange={(e) =>
                                                setComparisonEndDate(
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full !text-xs border-b-default outline-none"
                                            min={comparisonStartDate}
                                            max={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {tempComparisonType && (
                            <div className="mt-4 mb-4 bg-[#EEFBFF] rounded-xl p-4">
                                <div className="text-center">
                                    <div className="text-xs font-medium text-primary mb-2">
                                        Comparison Period
                                    </div>
                                    <div className="text-xs text-black leading-relaxed">
                                        {(() => {
                                            const primaryRange =
                                                calculateDateRange(
                                                    tempSelectedRangeType,
                                                    customStartDate,
                                                    customEndDate
                                                );
                                            const comparisonRange =
                                                calculateComparisonPeriod(
                                                    tempSelectedRangeType,
                                                    tempComparisonType,
                                                    customStartDate,
                                                    customEndDate,
                                                    comparisonStartDate,
                                                    comparisonEndDate
                                                );

                                            if (!comparisonRange) {
                                                return (
                                                    <div className="font-medium">
                                                        No comparison data
                                                        available
                                                    </div>
                                                );
                                            }

                                            return (
                                                <>
                                                    <div className="font-medium">
                                                        {formatDateForDisplay(
                                                            primaryRange?.start ||
                                                            moment().startOf(
                                                                "day"
                                                            )
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDateForDisplay(
                                                            primaryRange?.end ||
                                                            moment().endOf(
                                                                "day"
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="text-black my-1">
                                                        vs
                                                    </div>
                                                    <div className="font-medium">
                                                        {formatDateForDisplay(
                                                            comparisonRange?.start ||
                                                            moment().startOf(
                                                                "day"
                                                            )
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDateForDisplay(
                                                            comparisonRange?.end ||
                                                            moment().endOf(
                                                                "day"
                                                            )
                                                        )}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleApply}
                            disabled={isApplyDisabled()}
                            className="w-full bg-primary text-white font-medium rounded-lg py-2 text-xs"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default DateFilter;
