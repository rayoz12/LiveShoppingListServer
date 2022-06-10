<script>
    export let index;
    export let length;

    const isFirst = index === 0;
    const isLast = index === (length - 1);
</script>

<main>
    <div class="flex flex-row justify-between shadow-md bg-slate-700 animate-pulse" class:rounded-t-xl={isFirst} class:rounded-b-xl={isLast}>
        <div class="flex flex-row divide-x-2 divide-slate-600 w-full">
            <label class="w-[60px] flex justify-center cursor-pointer hover:bg-slate-600" class:rounded-tl-xl={isFirst} class:rounded-bl-xl={isLast}>
                <input type="checkbox" class="cursor-pointer p-[60px]" checked={true} disabled/>
            </label>
            <div class="flex flex-row justify-between w-full cursor-pointer hover:bg-slate-600" class:rounded-tr-xl={isFirst} class:rounded-br-xl={isLast}>
                <div class="flex flex-col items-start w-full pl-[20px] py-1">
                    <p class="h-5 leading-7 my-1 w-[60px] rounded bg-slate-600"></p>
                    <p class="h-4 leading-6 my-1 w-[120px] rounded bg-slate-600"></p>
                </div>
                <div class="flex flex-col justify-center pr-[20px]">
                    <p class="h-4 leading-6 my-1 w-[60px] rounded bg-slate-600"></p>
                </div>
            </div>
            
        </div>
    </div>
</main>

<style>
</style>