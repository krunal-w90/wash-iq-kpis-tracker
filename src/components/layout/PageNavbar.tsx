"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

function PageNavbarLeftContent({ ref, ...props }: React.ComponentPropsWithoutRef<"div"> & { ref?: React.RefObject<HTMLDivElement | null> }) {
    return (
        <div
            ref={ref}
            className="flex items-center justify-between gap-2 lg:h-10 w-full"
            {...props}
        />
    );
}

PageNavbarLeftContent.displayName = "PageNavbarLeftContent";

function PageNavbarRightContent({ ref, ...props }: React.ComponentPropsWithoutRef<"div"> & { ref?: React.RefObject<HTMLDivElement | null> }) {
    return (
        <div
            ref={ref}
            className="text-gray-500 flex gap-2"
            {...props}
        />
    );
}

PageNavbarRightContent.displayName = "PageNavbarRightContent";

function PageNavbarIconButton({ ref, className, ...props }: React.ComponentPropsWithoutRef<"button"> & { ref?: React.RefObject<HTMLButtonElement | null> }) {
    return (
        <button
            type="button"
            ref={ref}
            className={twMerge(
                "all-center h-8 w-8 duration-200 hover:bg-gray-100 rounded-lg",
                className,
            )}
            {...props}
        />
    );
}

PageNavbarIconButton.displayName = "PageNavbarIconButton";

function PageNavbarPrimaryButton({ ref, className, ...props }: React.ComponentPropsWithoutRef<"button"> & { ref?: React.RefObject<HTMLButtonElement | null> }) {
    return (
        <button
            type="button"
            ref={ref}
            className={twMerge(
                "h-8 gap-1 bg-primary hidden py-1 px-2 duration-200 text-white rounded-lg text-xs md:flex items-center justify-center",
                className,
            )}
            {...props}
        />
    );
}
PageNavbarPrimaryButton.displayName = "PageNavbarPrimaryButton";

function PageNavbar({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    // const { setIsSidebarOpen } = useCentralStore();

    return (
        <div
            className={twMerge(
                "h-[var(--h-nav)] flex py-2 px-4 text-gray-500 justify-between items-center gap-2 w-full",
                className,
            )}
        >
            <div className="flex items-center justify-between w-full lg:gap-4 gap-2 h-full">
                {children}
            </div>
        </div>
    );
}

export default PageNavbar;

export {
    PageNavbarIconButton,
    PageNavbarLeftContent,
    PageNavbarPrimaryButton,
    PageNavbarRightContent
};

