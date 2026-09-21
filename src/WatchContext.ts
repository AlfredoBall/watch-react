import {
    createContext,
} from "react";

import type {
    Watch,
} from "@alfredoball/watch";

export const WatchContext =
    createContext<Watch<object> | null>(null);