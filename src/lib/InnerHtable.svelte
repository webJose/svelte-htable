<script context="module" lang="ts">
    export type Column = {
        key: string;
        title: string;
        render?: ((item: Item, key: string) => string) | undefined;
    };
    export type Item = {
        id: string | number;
        subItems?: Item[] | undefined;
        [x: string]: any;
    };
    export const CaptionOrder = Object.freeze({
        PathLevel: 1,
        LevelPath: 2,
    });
    export const ItemGrouping = Object.freeze({
        Undefined: 0,
        ExpansiblesFirst: 1,
        ExpansiblesLast: 2,
    });
</script>

<script lang="ts">
    export let columns: Column[];
    export let items: Item[];
    export let level = 1;
    export let levelFn: boolean | ((level: number) => string) | undefined;
    export let showPath: boolean;
    export let path = "";
    export let pathSeparator: string;
    export let captionOrder: number;
    export let grouping: number;
    export let summary: string | ((item: Item) => string) | undefined;
    export let pathSegment: string | ((item: Item) => string) | undefined;
    export let maxPathSegmentLength: number | undefined;

    let regulars: Item[] = [];
    let expansibles: Item[] = [];

    $: {
        if (grouping !== ItemGrouping.Undefined) {
            items.forEach((i) => {
                if (i.subItems?.length) {
                    expansibles.push(i);
                } else {
                    regulars.push(i);
                }
            });
            regulars = regulars;
            expansibles = expansibles;
        }
    }
    $: workItems =
        grouping === ItemGrouping.ExpansiblesFirst
            ? [...expansibles, ...regulars]
            : grouping === ItemGrouping.ExpansiblesLast
            ? [...regulars, ...expansibles]
            : items;
    $: leftCaptionText = buildLeftCaptionText();
    $: rightCaptionText = buildRightCaptionText();

    function buildLevelText() {
        if (typeof levelFn === "function") {
            return levelFn(level);
        }
        return level.toString();
    }

    function shouldShowLevel() {
        let should = false;
        if (typeof levelFn === "boolean") {
            should = levelFn;
        } else if (typeof levelFn === "function") {
            should = true;
        }
        return should && level > 1;
    }

    function shouldShowPath() {
        return !!(showPath && path);
    }

    function buildLeftCaptionText() {
        let text = "";
        if (captionOrder === CaptionOrder.LevelPath) {
            text = shouldShowLevel() ? buildLevelText() : "";
        } else {
            text = shouldShowPath() ? path : "";
        }
        return text ?? "&nbsp;";
    }

    function buildRightCaptionText() {
        if (captionOrder === CaptionOrder.LevelPath) {
            return shouldShowPath() ? path : "";
        }
        return shouldShowLevel() ? buildLevelText() : "";
    }

    function calculateChildPath(item: Item) {
        let childSegment: string;
        if (pathSegment === undefined) {
            childSegment = item[columns[0].key];
        } else if (typeof pathSegment === "string") {
            childSegment = item[pathSegment];
        } else {
            childSegment = pathSegment(item);
        }
        if (
            maxPathSegmentLength !== undefined &&
            childSegment.length > maxPathSegmentLength
        ) {
            childSegment = `${childSegment.substring(
                0,
                maxPathSegmentLength - 1
            )}&hellip;`;
        }
        return `${path}${path.length ? pathSeparator : ""}${childSegment}`;
    }
</script>

<table
    class={($$restProps.class ?? "") +
        (level > 1
            ? ` sub sub-${level} sub-${level % 2 === 0 ? "even" : "odd"}`
            : "")}
    data-level={level}
>
    {#if shouldShowLevel() || shouldShowPath()}
        <caption>
            <span>
                <span class="cpt-l">
                    {#if leftCaptionText}
                        {@html leftCaptionText}
                    {:else}
                        &nbsp;
                    {/if}
                </span>
                <span class="cpt-r">{@html rightCaptionText}</span>
            </span>
        </caption>
    {/if}
    <thead>
        <tr>
            {#each columns as col}
                <th>{col.title}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each workItems as item}
            <tr class:sub={item.subItems?.length}>
                {#if item.subItems?.length}
                    <td colspan={columns.length}>
                        <details>
                            <summary>
                                <slot name="summary" {item} />
                            </summary>
                            <svelte:self
                                {columns}
                                items={item.subItems}
                                class={$$restProps.class}
                                level={level + 1}
                                {levelFn}
                                {showPath}
                                path={calculateChildPath(item)}
                                {pathSeparator}
                                {captionOrder}
                                {grouping}
                                {summary}
                                {maxPathSegmentLength}
                                {pathSegment}
                            >
                                <svelte:fragment slot="summary" let:item>
                                    <slot name="summary" {item} />
                                </svelte:fragment>
                                <svelte:fragment slot="column" let:item let:col>
                                    <slot name="column" {item} {col} />
                                </svelte:fragment>
                            </svelte:self>
                        </details>
                    </td>
                {:else}
                    {#each columns as col}
                        <td>
                            <slot name="column" {item} {col} />
                        </td>
                    {/each}
                {/if}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    caption > span {
        display: inline-flex;
        width: 100%;
        justify-content: space-between;
    }

    caption > span > span {
        display: inline-block;
    }
    td > details > summary {
        cursor: pointer;
    }
</style>
