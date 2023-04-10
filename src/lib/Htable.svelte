<script lang="ts">
    import InnerHtable, {
        CaptionOrder,
        ItemGrouping,
        type Column,
        type Item,
    } from "./InnerHtable.svelte";

    export let columns: Column[];
    export let items: Item[];
    export let level: boolean | ((level: number) => string) | undefined =
        undefined;
    export let showPath = false;
    export let pathSeparator = ".";
    export let captionOrder: number = CaptionOrder.PathLevel;
    export let grouping: number = ItemGrouping.ExpansiblesFirst;
    export let summary: string | ((item: Item) => string) | undefined =
        undefined;
    export let pathSegment: string | ((item: Item) => string) | undefined =
        undefined;
    export let maxPathSegmentLength: number | undefined = undefined;

    $: getSummary = (item: Item) => {
        if (!summary) {
            return item[columns[0].key];
        }
        if (typeof summary === "string") {
            return item[summary];
        }
        return summary(item);
    };

    function _render(item: Item, key: string) {
        let data = item[key];
        if (data === null) {
            return "(null)";
        } else if (data === undefined) {
            return "";
        }
        return `${data}`;
    }
</script>

<InnerHtable
    class={$$restProps.class ?? ""}
    {columns}
    {items}
    levelFn={level}
    {showPath}
    {pathSeparator}
    {captionOrder}
    {grouping}
    {summary}
    {pathSegment}
    {maxPathSegmentLength}
>
    <svelte:fragment slot="summary" let:item>
        <slot name="summary" {item}>
            {getSummary(item)}
        </slot>
    </svelte:fragment>
    <svelte:fragment slot="column" let:item let:col>
        {@const render = col.render ?? _render}
        {@const itemData = render(item, col.key)}
        <slot name="column" {item} {col} {render}>
            {#if itemData}
                {itemData}
            {:else}
                &nbsp;
            {/if}
        </slot>
    </svelte:fragment>
</InnerHtable>
