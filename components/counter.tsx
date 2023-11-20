"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <Button onClick={() => setCount(count + 1)}>Click me</Button>
        </div>
    );
}
