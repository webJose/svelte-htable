<script lang="ts">
    export let itemData: string;
</script>
{#if itemData}
    {itemData}
{:else}
    &nbsp;
{/if}
