"use client";

import {
    useContext,
} from "react";

import type {
    Cable,
    Watch,
} from "@alfredoball/watch";

import {
    allWorkflowsActiveFrame,
} from "@alfredoball/watch/time";

import {
    WatchContext,
} from "../WatchContext.ts";

export type WatchTime<
    TState extends object,
> = {
    readonly allWorkflowsActiveFrame: () =>
        ReturnType<
            typeof allWorkflowsActiveFrame<TState>
        >;
};

export type UseWatchResult<
    TState extends object,
> = {
    readonly watch: Watch<TState>;
    readonly cables: readonly Cable<TState>[];
    readonly time: WatchTime<TState>;
};

export default function useWatch<
    TState extends object,
>(): UseWatchResult<TState> {
    const watch =
        useContext(
            WatchContext,
        ) as Watch<TState> | null;

    if (watch === null) {
        throw new Error(
            "useWatch must be used within a WatchProvider.",
        );
    }

    return {
        watch,
        cables: watch.bundle.cables,
        time: {
            allWorkflowsActiveFrame: () =>
                allWorkflowsActiveFrame(watch),
        },
    };
}