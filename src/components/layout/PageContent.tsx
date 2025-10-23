import React from "react";
import { twMerge } from "tailwind-merge";

function PageContent({
    children,
    className,
    mainClassName,
}: {
    children: React.ReactNode;
    className?: string;
    mainClassName?: string;
}) {
    return (
        <main
            className={twMerge(
                "h-[calc(100vh-var(--h-nav))] space-y-4 overflow-hidden",
                mainClassName,
            )}
        >
            <div
                className={twMerge(
                    "w-full h-full overflow-y-auto rounded-xl",
                    className,
                )}
            >
                {children}
            </div>
        </main>
    );
}

export default PageContent;
