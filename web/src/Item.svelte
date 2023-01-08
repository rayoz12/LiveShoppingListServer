<script>
    import { createEventDispatcher } from 'svelte';

    export let item;
    export let index;
    export let length;

    const dispatch = createEventDispatcher();

    const isFirst = index === 0;
    const isLast = index === (length - 1);

    function toggleBought() {
        item.bought = !item.bought;
        dispatch("bought", item)
    }

    function deleteItem() {
        dispatch("delete", item);
    }
</script>

<main>
    <div class="transition-all flex flex-row justify-between shadow-md bg-slate-700" class:rounded-t-xl={isFirst} class:rounded-b-xl={isLast}>
        <div class="flex flex-row divide-x-2 divide-slate-600 w-full">
            <label class="w-[60px] flex justify-center cursor-pointer hover:bg-slate-600" class:rounded-tl-xl={isFirst} class:rounded-bl-xl={isLast}>
                <input type="checkbox" class="cursor-pointer p-[60px]" checked={item.bought} on:change={toggleBought}/>
            </label>
            <div class="flex flex-row justify-between w-full cursor-pointer hover:bg-slate-600" on:click={toggleBought}>
                <div class="flex flex-col items-start w-full pl-[20px] py-1">
                    <p class="text-xl transition-all duration-200" class:line-through={item.bought} class:text-slate-500={item.bought}>{item.quantity > 1 ? item.quantity : ""} {item.item}</p>
                    <p class="text-sm italic transition-all duration-200 text-slate-400" class:line-through={item.bought}>{item.is_private ? "Private" : ""}</p>
                    <p class="text-base transition-all duration-200" class:line-through={item.bought} class:text-slate-500={item.bought}>{item.comments}</p>
                </div>
                <div class="flex flex-col justify-center pr-[20px]">
                    <p>{item.added_by}</p>
                </div>
            </div>
            <div class="flex flex-col justify-center items-center w-[60px] cursor-pointer hover:bg-red-800" class:rounded-tr-xl={isFirst} class:rounded-br-xl={isLast} on:click={deleteItem}>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 96 96" width="32px" height="32px">
                    <g id="surface812820">
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(90.588236%,29.803923%,23.529412%);fill-opacity:1;" d="M 40 8 L 36 12 L 16 12 L 16 20 L 20 20 L 20 80 C 20 82.089844 20.765625 84.21875 22.273438 85.726562 C 23.78125 87.234375 25.910156 88 28 88 L 68 88 C 70.089844 88 72.21875 87.234375 73.726562 85.726562 C 75.234375 84.21875 76 82.089844 76 80 L 76 20 L 80 20 L 80 12 L 60 12 L 56 8 Z M 28 20 L 68 20 L 68 80 L 28 80 Z M 36 28 L 36 72 L 44 72 L 44 28 Z M 52 28 L 52 72 L 60 72 L 60 28 Z M 52 28 "/>
                    </g>
                </svg>
            </div>
            
        </div>
    </div>
</main>

<style>
</style>