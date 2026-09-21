import {
    renderHook,
} from "@testing-library/react";

import {
    describe,
    expect,
    it,
} from "vitest";

import {
    Bundle,
    Strand,
    Watch,
    type WatchTickContext,
    WorkflowFrameRun,
} from "@alfredoball/watch";

import {
    WatchContext,
} from "../src/WatchContext";

import useWatch from "../src/hooks/useWatch";

type State = {
    readonly value: string;
};

class TestWorkflowFrameRun
    extends WorkflowFrameRun<State>
{
    protected establishStory(
        initialState: State,
        _initialUrl: string,
    ) {
        return [
            {
                name: "Initial",
                state: initialState,
            },
        ];
    }

    protected load(
        initialState: State,
        initialUrl: string,
    ): void {
        this.story = this.establishStory(
            initialState,
            initialUrl,
        );
    }

    protected establishProgress(
        _context: WatchTickContext<State>,
    ): void {
        this.progress =
            this.story?.[0] ?? null;
    }

    protected establishActiveFrame(): void {
        this.activeFrame =
            this.story?.[0] ?? null;
    }
}

class TestStrand
    extends Strand<
        TestWorkflowFrameRun,
        State
    >
{
    protected configureInstances(
        initialState: State,
        initialUrl: string,
    ) {
        return [
            new TestWorkflowFrameRun(
                "TestWorkflowFrameRun",
                initialState,
                initialUrl,
            ),
        ];
    }

    public async tick(
        context: WatchTickContext<State>,
    ): Promise<void> {
        await Promise.all(
            this.instances.map(
                (instance) =>
                    instance.tick(context),
            ),
        );
    }
}

const createStrand = (
    name: string,
): TestStrand =>
    new TestStrand(
        {
            value: name,
        },
        `/${name}`,
    );

class TestWatch
    extends Watch<State>
{
    public async tick(
        context: WatchTickContext<State>,
    ): Promise<void> {
        await this.bundle.tick(context);
    }
}

const createWatch = (): TestWatch => {
    const bundle =
        new Bundle<State>([
            {
                core: createStrand(
                    "core",
                ),
                strands: [],
            },
        ]);

    return new TestWatch(bundle);
};

const renderWatchHook = (
    watch: TestWatch,
) =>
    renderHook(
        () =>
            useWatch<State>(),
        {
            wrapper: ({
                children,
            }) => (
                <WatchContext.Provider
                    value={
                        watch
                    }
                >
                    {
                        children
                    }
                </WatchContext.Provider>
            ),
        },
    );

describe(
    "useWatch",
    () => {
        it(
            "throws when used without a Watch provider",
            () => {
                expect(
                    () =>
                        renderHook(() =>
                            useWatch<State>(),
                        ),
                ).toThrow(
                    "useWatch must be used within a WatchProvider.",
                );
            },
        );

        it(
            "returns the Watch instance",
            () => {
                const watch =
                    createWatch();

                const { result } =
                    renderWatchHook(
                        watch,
                    );

                expect(
                    result.current.watch,
                ).toBe(
                    watch,
                );
            },
        );

        it(
            "exposes the Watch bundle cables",
            () => {
                const watch =
                    createWatch();

                const { result } =
                    renderWatchHook(
                        watch,
                    );

                expect(
                    result.current.cables,
                ).toBe(
                    watch.bundle.cables,
                );
            },
        );

        it(
            "exposes the active-frame time report",
            () => {
                const watch =
                    createWatch();

                const { result } =
                    renderWatchHook(
                        watch,
                    );

                expect(
                    result.current.time
                        .allWorkflowsActiveFrame(),
                ).toEqual([]);
            },
        );

        it(
            "evaluates the time report against the current Watch",
            () => {
                const watch =
                    createWatch();

                const { result } =
                    renderWatchHook(
                        watch,
                    );

                const report =
                    result.current.time
                        .allWorkflowsActiveFrame();

                expect(
                    report,
                ).toEqual([]);
            },
        );
    },
);