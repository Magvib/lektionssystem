"use client";
import React, { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

export default function TimeLeft({ dueDate }: { dueDate: Date | null }) {
    const [timeLeft, setTimeLeft] = useState(<Skeleton className="h-6 w-28" />);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const taskDueDate = dueDate ? dueDate : new Date();
            const diff = taskDueDate.getTime() - new Date().getTime();

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            var color = days > 0 ? "text-green-600" : "text-yellow-600";

            setTimeLeft(
                <span className={color}>
                    {days}d {hours}h {minutes}m {seconds}s
                </span>
            );

            if (diff < 0) {
                setTimeLeft(<span className="text-red-600">Time is up</span>);
            }
        };

        calculateTimeLeft();

        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [dueDate]);

    return timeLeft;
}
