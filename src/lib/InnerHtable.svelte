<script context="module" lang="ts">
    /**
     * Defines the properties expected in column definitions.
     */
    export type Column = {
        /**
         * Unique column identifier.  It is assumed to be the property name in item objects by the default
         * value-rendering function.
         */
        key: string;
        /**
         * Column title.  It is the text shown in column headers when no header slots are used.
         */
        title: string;
        /**
         * Value-rendering function for this particular column.  If not provided, the default value-rendering function
         * will be use instead.
         */
        renderValue?: ((item: Item, key: string) => string) | undefined;
    };

    /**
     * Defines the expected properties in data item objects (the objects that represent that table's data).
     */
    export type Item = {
        /**
         * Unique item identifier.  It is used to key the data rows.
         */
        id: string | number;
        /**
         * Optional list of sub-items.  Items with sub-items generate sub-tables.
         */
        subItems?: Item[] | undefined;
        [x: string]: any;
    };

    /**
     * Enumeration used to control the order of the data shown in sub-tables' captions.
     */
    export const CaptionOrder = Object.freeze({
        /**
         * Show path to the left; level to the right.
         */
        PathLevel: 1,
        /**
         * Show level to the left; path to the right.
         */
        LevelPath: 2,
    });

    /**
     * Enumeration used to control how data items are grouped within the table and sub-tables.
     */
    export const ItemGrouping = Object.freeze({
        /**
         * No grouping is done, and the data items are rendered in the order they are provided.
         */
        Undefined: 0,
        /**
         * Data items with sub-items are moved to the top of the table.
         */
        ExpansiblesFirst: 1,
        /**
         * Data items with sub-items are moved to the bottom of the table.
         */
        ExpansiblesLast: 2,
    });
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";

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
    export let initialOpenLevel: number;

    let regulars: Item[] = [];
    let expansibles: Item[] = [];
    let dispatch = createEventDispatcher();

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
        {#each workItems as item, index (item.id)}
            {#if item.subItems?.length}
                {@const childPath = calculateChildPath(item)}
                <tr class:sub={item.subItems?.length}>
                    <td colspan={columns.length}>
                        <details
                            open={level + 1 <= initialOpenLevel}
                            on:toggle={(e) =>
                                dispatch("toggle", {
                                    item,
                                    level: level + 1,
                                    path: childPath,
                                    open: e.currentTarget.open,
                                })}
                        >
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
                                path={childPath}
                                {pathSeparator}
                                {captionOrder}
                                {grouping}
                                {summary}
                                {maxPathSegmentLength}
                                {pathSegment}
                                {initialOpenLevel}
                                on:toggle
                            >
                                <svelte:fragment slot="summary" let:item>
                                    <slot name="summary" {item} />
                                </svelte:fragment>
                                <svelte:fragment slot="datarow" let:item let:index>
                                    <slot name="datarow" {item} {index} />
                                </svelte:fragment>
                            </svelte:self>
                        </details>
                    </td>
                </tr>
            {:else}
                <slot name="datarow" {item} {index} />
            {/if}
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
