<script lang="ts">
    import InnerHtable, {
        CaptionOrder,
        ItemGrouping,
        type Column,
        type Item,
    } from "./InnerHtable.svelte";

    export let columns: Column[];
    export let items: Item[];
    export let cascadedClasses: string | undefined = undefined;
    export let showLevel = false;
    export let showPath = false;
    export let pathSeparator = ".";
    export let captionOrder: number = CaptionOrder.PathLevel;
    export let grouping: number = ItemGrouping.ExpansiblesFirst;
    export let expansibleTitle: string | ((item: Item) => string) | undefined =
        undefined;
    export let pathSegment: string | ((item: Item) => string) | undefined =
        undefined;
    export let maxPathSegmentLength: number | undefined = undefined;
</script>

<InnerHtable
    class={$$restProps.class ?? ""}
    {columns}
    {items}
    {cascadedClasses}
    {showLevel}
    {showPath}
    {pathSeparator}
    {captionOrder}
    {grouping}
    {expansibleTitle}
    {pathSegment}
    {maxPathSegmentLength}
/>
