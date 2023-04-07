<script context="module" lang="ts">
    export type Column = { key: string; title: string };
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
    export let showLevel: boolean;
    export let level = 1;
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
    $: getSummary = (item: Item) => {
        if (!summary) {
            return item[columns[0].key];
        }
        if (typeof summary === "string") {
            return item[summary];
        }
        return summary(item);
    };

    function shouldShowLevel() {
        return showLevel && level > 1;
    }

    function shouldShowPath() {
        return !!(showPath && path);
    }

    function buildLeftCaptionText() {
        let text = "";
        if (captionOrder === CaptionOrder.LevelPath) {
            text = shouldShowLevel() ? `Level: ${level}` : "";
        } else {
            text = shouldShowPath() ? path : "";
        }
        return text ?? "&nbsp;";
    }

    function buildRightCaptionText() {
        if (captionOrder === CaptionOrder.LevelPath) {
            return shouldShowPath() ? path : "";
        }
        return shouldShowLevel() ? `Level: ${level}` : "";
    }

    function calculateChildPath(item: Item) {
        let childSegment: string;
        if (pathSegment === undefined) {
            childSegment = item[columns[0].key];
        }
        else if (typeof pathSegment === 'string') {
            childSegment = item[pathSegment];
        }
        else {
            childSegment = pathSegment(item);
        }
        if (maxPathSegmentLength !== undefined && childSegment.length > maxPathSegmentLength) {
            childSegment = `${childSegment.substring(0, maxPathSegmentLength - 3)}...`;
        }
        return `${path}${path.length ? pathSeparator : ""}${childSegment}`;
    }
</script>

<table class={(($$restProps.class ?? '') + ((level > 1) ? ` sub sub-${level}` : ''))}>
    {#if shouldShowLevel() || shouldShowPath()}
        <caption>
            <span>
                <span class="cpt-l">{leftCaptionText}</span>
                <span class="cpt-r">{rightCaptionText}</span>
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
                            <summary>{getSummary(item)}</summary>
                            <svelte:self
                                {columns}
                                items={item.subItems}
                                class={$$restProps.class}
                                {showLevel}
                                level={level + 1}
                                {showPath}
                                path={calculateChildPath(item)}
                                {pathSeparator}
                                {captionOrder}
                                {grouping}
                                {summary}
                                {maxPathSegmentLength}
                                {pathSegment}
                            />
                        </details>
                    </td>
                {:else}
                    {#each columns as col}
                        <td>{item[col.key]}</td>
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
