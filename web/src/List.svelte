<script>    
    import { createEventDispatcher } from 'svelte';
    import Item from './Item.svelte'
    import ItemSkeleton from "./Item-skeleton.svelte";
    
    const dispatch = createEventDispatcher();
    /*
     * Events:
     * bought, item
     * delete, item
     * add, item
     */

    export let listItems;
    export let shouldGroupItems = true;
    export let groups = {};

    let currentItems = [];
    let currentlistItemsPromise;

    /**
     * After we've first loaded with a list of actions
     */
    let hasFirstLoaded = false;

    const groupByKey = (list, key) => list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})
    
    // Only run when listItems changes
    $: {
        console.log("Change");
        if (listItems && (listItems !== currentlistItemsPromise)) {
            // debugger;
            currentlistItemsPromise = listItems;
            currentlistItemsPromise.then(items => {
                currentItems = items;
                groups = groupByKey(items, "group");
                console.log(groups);
                hasFirstLoaded = true;
            })
        }  
    } 

    function onBought(event) {
        dispatch("bought", event.detail);
    }

    function onDelete(event) {
        dispatch("delete", event.detail);
    }

</script>

<main>
    <!-- {@debug listItems} -->
    {#await currentlistItemsPromise}
		{#if hasFirstLoaded}
            <!-- Continue to display the list -->
            {#each Object.entries(groups) as [key, value], index}
                <h1 class="text-lg text-left pl-1">{key}</h1>
                <hr class="py-1">
                <ol class="divide-y-2 divide-slate-600 shadow-lg">
                    {#each value as item, index}
                        <li class="first:pt-0 last:pb-0">
                            <Item {item} {index} length={value.length}></Item>
                        </li>
                    {/each}
                </ol>
            {/each}
        {:else}
            <!-- Display a skeleton -->
            <p class="h-5 leading-7 ml-1 my-2 pl-1 rounded w-[120px] bg-slate-300 animate-pulse"></p>
            <hr class="py-1  animate-pulse">
            <ol class="divide-y-2 divide-slate-600 shadow-lg">
                {#each Array(5) as _, index}
                    <li class="first:pt-0 last:pb-0">
                        <ItemSkeleton {index} length={5} />
                    </li>
                {/each}
            </ol>
        {/if}
	{:then}
        {#each Object.entries(groups) as [key, value], index}
            <h1 class="text-lg text-left pl-1">{key}</h1>
            <hr class="py-1">
            <ol class="divide-y-2 divide-slate-600 shadow-lg">
                {#each value as item, index}
                    <li class="first:pt-0 last:pb-0">
                        <Item {item} {index} length={value.length} on:bought={onBought} on:delete={onDelete}></Item>
                    </li>
                {/each}
            </ol>
        {/each}
	{:catch error}
		<p>Something went wrong: {error.message}</p>
	{/await}
</main>

<style>
    main {
        width: 100%;
    }
</style>