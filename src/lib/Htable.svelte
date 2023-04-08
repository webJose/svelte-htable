<script lang="ts">
    import InnerHtable, {
        CaptionOrder,
        ItemGrouping,
        type Column,
        type Item,
    } from "./InnerHtable.svelte";

    export let columns: Column[];
    export let items: Item[];
    export let showLevel = false;
    export let showPath = false;
    export let pathSeparator = ".";
    export let captionOrder: number = CaptionOrder.PathLevel;
    export let grouping: number = ItemGrouping.ExpansiblesFirst;
    export let summary: string | ((item: Item) => string) | undefined =
        undefined;
    export let pathSegment: string | ((item: Item) => string) | undefined =
        undefined;
    export let maxPathSegmentLength: number | undefined = undefined;
    export let buildLevel: ((level: number) => string) | undefined = undefined;
</script>

<InnerHtable
    class={$$restProps.class ?? ""}
    {columns}
    {items}
    {showLevel}
    {showPath}
    {pathSeparator}
    {captionOrder}
    {grouping}
    {summary}
    {pathSegment}
    {maxPathSegmentLength}
    {buildLevel}
/>
