<script lang="ts">
    import InnerHtable, {
        CaptionOrder,
        ItemGrouping,
        type Column,
        type Item,
    } from "./InnerHtable.svelte";

    /**
     * List of column definitions.  The order in the list determines the order of columns in the tables.
     */
    export let columns: Column[];
    /**
     * List of data items.  They must conform to the Item type.
     */
    export let items: Item[];
    /**
     * Controls whether or not the level is shown in sub-tables' captions, as well as the text shown.
     */
    export let level: boolean | ((level: number) => string) | undefined =
        undefined;
    /**
     * Controls whether or not the sub-tables' paths are shown.
     */
    export let showPath = false;
    /**
     * Text used to join path segments.  It defaults to a single period (.).
     */
    export let pathSeparator = ".";
    /**
     * Controls the order of data in sub-tables' captions.
     */
    export let captionOrder: number = CaptionOrder.PathLevel;
    /**
     * Controls how data items are grouped.  It defaults to putting expansible items at the top of the tables.
     */
    export let grouping: number = ItemGrouping.ExpansiblesFirst;
    /**
     * Defines the text shown as summary in the expansible items when the summary slot is not used.
     */
    export let summary: string | ((item: Item) => string) | undefined =
        undefined;
    /**
     * Defines how path segments are calculated.
     */
    export let pathSegment: string | ((item: Item) => string) | undefined =
        undefined;
    /**
     * Defines a maximum length for path segments.
     */
    export let maxPathSegmentLength: number | undefined = undefined;
    /**
     * Sets the maximum level of sub-tables that will be open (shown) initially.
     */
    export let initialOpenLevel = 1;

    function getSummary(item: Item) {
        if (!summary) {
            return item[columns[0].key];
        }
        if (typeof summary === "string") {
            return item[summary];
        }
        return summary(item);
    };

    function _renderValue(item: Item, key: string) {
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
    {initialOpenLevel}
    on:toggle
>
    <svelte:fragment slot="summary" let:item>
        <slot name="summary" {item}>
            {getSummary(item)}
        </slot>
    </svelte:fragment>
    <svelte:fragment slot="column" let:item let:col>
        {@const renderValue = col.renderValue ?? _renderValue}
        {@const itemData = renderValue(item, col.key)}
        <slot name="column" {item} {col} {renderValue}>
            {#if itemData}
                {itemData}
            {:else}
                &nbsp;
            {/if}
        </slot>
    </svelte:fragment>
</InnerHtable>
