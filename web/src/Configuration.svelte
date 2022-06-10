<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import { getKey } from "./api";

    let key = getKey();
    const isInvalid = key === "";
    export let name = "Ryan";

    function onSubmit() {
        dispatch("update", {
            key,
            name
        });
    }
</script>

<details open={isInvalid} class="flex flex-col space-y-2 shadow-xl w-full rounded text-left bg-slate-700 p-2">
    <summary>Configuration</summary>
    {#if isInvalid}
        <p>Enter your details. These will be saved once you click apply</p>
    {/if}
    
    <label>Name
        <input bind:value={name} class="bg-slate-800 rounded h-8 w-full px-2" />
    </label>
    <label>Key
        <input bind:value={key} class="bg-slate-800 rounded h-8 w-full px-2" />
    </label>
    <button on:click={onSubmit} class="w-full transition-all rounded p-2 bg-green-600 hover:bg-green-500 active:bg-green-700">
        <span class="active:bg-green-900">Apply</span>
    </button>
</details>

<style>
</style>