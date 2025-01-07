<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import { Item } from "./api";

    const itemNames = ["Bread", "Tea", "Kia Stinger", "Milk", "Grand Theft Auto 6", "Speakers", "RAM", "SSD", "Name", "Monitor", "The Twilight Saga", "Pants", "Lives", "TV Shows", "Ryan", "Manjusha", "Music", "Vampire Books", "Plushies", "Roses", "Maid Costumes"]
    const namePlaceholder = itemNames[Math.floor(Math.random()*itemNames.length)]; 

    export let groups;
    export let userName;
    let componentGroups = [];
    let qty = 1;
    let name;
    let selectedGroup;
    let comments;
    let is_private = false;

    $: {
        // Lets make sure the groups are in component groups and add them if they don't exist
        if (groups) {
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                if (!componentGroups.includes(group)) {
                    componentGroups.push(group);
                }
            }
            componentGroups = componentGroups;
            if (selectedGroup === "New" && componentGroups.length > 0) {
                selectedGroup = componentGroups[0];
            }
            
        }
    }  

    function onSubmit() {
        if (name === "") {
            return;
        }

        const item = new Item(name, qty, false, userName, comments, selectedGroup, is_private);
        dispatch('add', item);
        name = "";
        qty = 1;
        comments = "";
    }

    function newGroup() {
        const group = prompt("Name:");
        console.log(group);
        if (group !== null) {
            componentGroups = [...componentGroups, group]
            selectedGroup = group;
        }
    }

    function selectChange(evt) {
        if (evt.target.value === "New") {
            console.log("new");
            newGroup();
        }
    }
</script>

<main>
    <p class="text-left text-lg pl-1">Add an Item</p>
    <div class="flex flex-col space-y-4 shadow-xl bg-slate-700 p-4 rounded">
        <div class="flex flex-row justify-between items-center">
            <!-- <label class="flex-grow pr-2" for="name">
                Name
            </label> -->
            <input bind:value={name} name="name" placeholder={namePlaceholder} class="w-full bg-slate-800 rounded h-8 pl-2" />
        </div>
        <div class="flex flex-row justify-between items-center">
            <label>
                Qty
                <input bind:value={qty} type="number" placeholder="Qty" class="bg-slate-800 rounded w-16 h-8 px-2" min="1" />
            </label>
            <label for="group" class="px-2">
                Group
            </label>
            <select bind:value={selectedGroup} name="group" on:change={selectChange} class="flex-grow bg-slate-800 rounded h-8 pl-2">
                {#each componentGroups as group}
                    <option>{group}</option>
                {/each}
                <option>New</option>
            </select>
            
        </div>
        <div class="flex flex-row justify-between">
            <label>
                Private
                <input type="checkbox" class="cursor-pointer p-[60px]" bind:checked={is_private}/>
            </label>
        </div>
        <div class="w-full">
            <label>
                <textarea bind:value={comments} placeholder="Comments" class="w-full rounded px-2 bg-slate-800"></textarea>
            </label>
        </div>
        <button on:click={onSubmit} class="w-full transition-all rounded p-2 bg-green-600 hover:bg-green-500 active:bg-green-700">
            <span class="active:bg-green-900">Add</span>
        </button>
    </div>
</main>

<style>
</style>