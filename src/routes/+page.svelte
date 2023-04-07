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
            key: "email",
            title: "Email",
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

<h1>Welcome to your library project</h1>
<p>
    Create your package using @sveltejs/package and preview/showcase your work
    with SvelteKit
</p>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<Htable
    class="data"
    items={buildData(data.data)}
    {columns}
    showLevel={true}
    showPath={true}
    captionOrder={CaptionOrder.LevelPath}
    expansibleTitle={(i) => `${i.last_name}, ${i.first_name}`}
    grouping={ItemGrouping.ExpansiblesFirst}
    pathSegment={(i) => i.last_name}
    pathSeparator=" > "
    maxPathSegmentLength={10}
/>

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
    }
    :global(table.data) {
        border: 0.15em solid var(--headerColor);
    }
    :global(table.data) :global(th) {
        background-color: var(--headerColor);
        color: var(--headerTextColor);
        padding: 0.3em 1em;
    }
    :global(table.data) :global(td) {
        padding: 0.1em 0.7em;
        color: var(--tableTextColor);
    }
    :global(table.data) :global(summary) {
        font-weight: 900;
        font-size: larger;
        font-style: italic;
        color: var(--expansibleTextColor);
    }
    :global(table.data) :global(caption) {
        font-weight: bold;
    }
    :global(table.data) :global(.cpt-r) {
        border: 0.2em solid var(--headerColor);
        border-radius: 0.3em;
        padding: 0.1em 0.5em;
    }
    :global(table.data.sub) {
        background-color: rgb(23, 101, 144);
    }
    :global(table.data.sub-2) {
        text-decoration: line-through;
    }
</style>
