// @ts-nocheck

import { Pagination, PaginationItemType, cn } from "@heroui/react";

export const ChevronIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="5em"
            {...props}
        >
            <path
                d="M15.5 19l-7-7 7-7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4.5"
            />
        </svg>
    );
};

export default function Paginator({ page, onChange, total }) {
    const renderItem = ({ ref, key, value, isActive, onNext, onPrevious, setPage, className }) => {
        if (value === PaginationItemType.NEXT) {
            return (
                <button
                    key={key}
                    className={cn("flex items-center pr-2 rounded-3xl hover:text-white/70 text-white bg-transparent min-w-25 w-25 h-10")}
                    onClick={onNext}
                >
                    <ChevronIcon className="rotate-180" /> Previous
                </button>
            );
        }

        if (value === PaginationItemType.PREV) {
            return (
                <button
                    key={key}
                    className={cn("flex items-center pr-2 rounded-3xl hover:text-white/70 text-white bg-transparent min-w-20 w-20 h-10")}
                    onClick={onPrevious}
                >
                    <ChevronIcon /> Next
                </button>
            );
        }

        if (value === PaginationItemType.DOTS) {
            return (
                <button key={key} className={"text-white w-10 h-10"}>
                    ...
                </button>
            );
        }

        // cursor is the default item
        return (
            <button
                key={key}
                ref={ref}
                className={cn(
                    className,
                    "text-white hover:bg-brand/50 hover:rounded-3xl w-[3rem]",
                    isActive && "text-white bg-brand font-bold text-md w-[3rem]",
                )}
                onClick={() => setPage(value)}
            >
                {value}
            </button>
        );
    };

    return (
        <Pagination
            disableCursorAnimation
            showControls
            className="gap-2 m-3"
            page={page}
            onChange={onChange}
            radius="full"
            renderItem={renderItem}
            total={total}
            variant="dark"
        />
    );
}
