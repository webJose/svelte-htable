<script lang="ts">
    import Htable from "$lib/Htable.svelte";
    import {
        CaptionOrder,
        ItemGrouping,
        type Column,
        type Item,
    } from "$lib/InnerHtable.svelte";

    interface DataItem extends Item {
        first_name: string;
        last_name: string;
        email: string;
        gender: string;
        country_code: string;
        manager_id: number;
    }

    export let data: { data: DataItem[] };

    const columns: Column[] = [
        {
            key: "id",
            title: "ID",
        },
        {
            key: "first_name",
            title: "First Name",
        },
        {
            key: "last_name",
            title: "Last Name",
        },
        {
            key: "birth_date",
            title: "Birth Date",
            renderValue: (i, k) => new Date(i[k]).toLocaleDateString(),
        },
        {
            key: "age",
            title: "Age",
            renderValue: (i, k) => {
                const diff = Date.now() - Date.parse(i.birth_date);
                return Math.floor(
                    diff / (365 * 24 * 60 * 60 * 1000)
                ).toString();
            },
        },
        {
            key: "gender",
            title: "Gender",
        },
        {
            key: "country_code",
            title: "Country Code",
        },
        {
            key: "manager_id",
            title: "Manager's ID",
        },
    ];

    function buildData(rawData: DataItem[]) {
        const managers: { [x: number]: DataItem | undefined } = {};
        for (let item of rawData) {
            item.subItems = [];
            managers[item.id as number] = item;
        }
        return rawData.reduce((prev, curr) => {
            if (curr.manager_id) {
                managers[curr.manager_id]?.subItems?.push(curr);
            } else {
                prev.push(curr);
            }
            return prev;
        }, [] as DataItem[]);
    }
</script>

<Htable
    class="data"
    items={buildData(data.data)}
    {columns}
    level={(l) => `Level: ${l}`}
    showPath={true}
    captionOrder={CaptionOrder.LevelPath}
    summary={(i) => `${i.last_name}, ${i.first_name}`}
    grouping={ItemGrouping.Undefined}
    pathSegment={(i) => i.last_name}
    pathSeparator=" > "
    maxPathSegmentLength={10}
    initialOpenLevel={5}
    on:toggle={(e) => console.log("Toggle!", e)}
>
    <svelte:fragment slot="summary" let:item>
        <img
            class="flag"
            src="https://flagcdn.com/{item.country_code.toLowerCase()}.svg"
            alt={item.country_code}
        />&nbsp;{item.last_name},&nbsp;{item.first_name}
    </svelte:fragment>
    <svelte:fragment slot="column" let:item let:col let:renderValue>
        {@const value = renderValue(item, col.key)}
        {#if col.key === "id"}
            <span class="inverted">{value}</span>
        {:else if col.key === "country_code"}
            <a
                href="https://flagpedia.net/{item.country_code.toLowerCase()}"
                target="_blank">{value}</a
            >
        {:else}
            {#if value}
                {value}
            {:else}
                &nbsp;
            {/if}
        {/if}
    </svelte:fragment>
</Htable>

<style>
    :global(:root) {
        --headerColor: rgb(0, 108, 232);
        --headerTextColor: white;
        --tableTextColor: white;
        --expansibleTextColor: rgb(216, 216, 140);
    }
    :global(body) {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        background-color: rgb(6, 6, 42);
        color: white;
    }
    :global(table.data) {
        --tableColor: rgb(16, 16, 61);
        border: 0.15em solid var(--headerColor);
        background-color: var(--tableColor);
    }
    :global(table.data th) {
        background-color: var(--headerColor);
        color: var(--headerTextColor);
        padding: 0.3em 1em;
    }
    :global(table.data a) {
        color: goldenrod;
        text-decoration: none;
    }
    :global(table.data a:hover) {
        color: gold;
    }

    :global(table.data td) {
        padding: 0.1em 0.7em;
        color: var(--tableTextColor);
    }
    :global(table.data summary) {
        font-weight: 900;
        font-size: larger;
        font-style: italic;
        color: var(--expansibleTextColor);
    }
    :global(table.data caption) {
        font-weight: bold;
    }
    :global(table.data .cpt-r) {
        border: 0.2em solid var(--headerColor);
        border-radius: 0.3em;
        padding: 0.1em 0.5em;
    }
    :global(table.data.sub td) {
        --tableTextColor: rgb(109, 238, 255);
        color: var(--tableTextColor);
    }
    :global(table.data.sub-even) {
        --tableColor: rgb(0, 82, 123);
        background-color: var(--tableColor);
    }

    :global(table.data.sub-odd) {
        --tableColor: rgb(0, 139, 185);
        background-color: var(--tableColor);
    }

    :global(table.data > tbody > tr > td > span.inverted) {
        background-color: var(--tableTextColor);
        color: var(--tableColor);
        width: 100%;
        display: inline-block;
        font-weight: bold;
        padding: 0.1em 0.3em;
        text-align: center;
    }

    img.flag {
        max-height: 1em;
    }
</style>
