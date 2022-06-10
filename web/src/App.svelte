<script>
	import "./app.css"
	import { addItem, deleteItem, getItems, setBought, setConfig } from "./api";

	import List from "./List.svelte";
	import AddItem from "./AddItem.svelte";
	import Configuration from "./Configuration.svelte";

	let name = "Ryan";
	const nameStorage = localStorage.getItem("listName");
	if (nameStorage !== null) {
		name = nameStorage;
	}

	let items;
	let groups = {};

	const groupByKey = (list, key) => list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})
	
	items = getItems();
	items.then(items => {
		groups = groupByKey(items, "group");
	});

	// setInterval(() => {
	// 	refresh();
	// }, 5000);

	async function onBought(event) {
		const item = event.detail;
		console.log("bought", item);
		await setBought(item);
		refresh();
	}

	async function onDelete(event) {
		const item = event.detail;
		console.log("delete", item);
		await deleteItem(item);
		refresh();
	}

	async function onAdd(event) {
		const item = event.detail;
		await addItem(item);
		refresh();
	}

	function settingUpdate(event) {
		const update = event.detail;
		name = update.name;
		localStorage.setItem("listName", name);
		setConfig(update.key);
		refresh();
	}

	function refresh() {
		items = getItems();
		items.then(items => {
			groups = groupByKey(items, "group");
		});
	}

</script>

<main>
	<h1>Shopping List</h1>
	<button on:click={refresh} class="w-full transition-all rounded p-2 mb-6 bg-teal-600 hover:bg-teal-500 active:bg-teal-700">
        <span>Refresh</span>
    </button>
	<Configuration on:update={settingUpdate} {name}></Configuration>
	<List listItems={items} on:bought={onBought} on:delete={onDelete}></List>
	<AddItem groups={Object.keys(groups)} userName={name} on:add={onAdd}/>
	<a target="_blank" href="https://icons8.com/icon/85081/trash">Trash</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
</main>

<style>
	main {
		text-align: center;
		padding: 0;
		max-width: unset;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: 640px;
			margin: 0 auto;
		}
	}
</style>