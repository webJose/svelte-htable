<script lang="ts">
    export let title: string;
    export let messages: string[];
</script>
<div>
    <h3>{title}</h3>
    <ul>
        {#each messages as msg}
            <li>{msg}</li>
        {/each}
    </ul>
</div>
<style>
    ul {
        display: flex;
        flex-flow: column;
    }
    li {
        list-style: none;
        background-color: lightgray;
        color: black;
        font-family: monospace;
    }
</style>