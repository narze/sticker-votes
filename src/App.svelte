<script type="ts">
  import { doc, setDoc } from "firebase/firestore"
  import { nanoid } from "nanoid"

  import { tick } from "svelte"

  import "twind/shim"
  import { db } from "./lib/firebase"

  import url from "./lib/url"
  import Room from "./Room.svelte"

  const defaultPage: Page = {
    name: "Page Name",
    choices: ["A", "B"],
    votes: {},
  }

  let roomName = "Room Name"
  let pages = [pageClone()]

  function pageClone() {
    return { ...defaultPage }
  }

  async function createRoom() {
    // Create new doc
    const room = { name: roomName, pages: { ...pages } }
    console.log({ room })
    // Redirect to hash
    const roomKey = nanoid()
    let roomRef = doc(db, "rooms", roomKey)

    try {
      await setDoc(roomRef, room)

      console.log("Document created", { room, roomKey })

      window.location.href = `/#/rooms/${roomKey}`
    } catch (e) {
      console.error("Error adding document: ", e)
    }
  }

  function addNewPage() {
    pages = [...pages, pageClone()]
  }

  function removePage(idx) {
    if (confirm("Delete page?")) {
      pages = pages.splice(idx, 1)
    }
  }

  function addNewChoice(pageIdx: number) {
    pages[pageIdx].choices = [...pages[pageIdx].choices, ""]
  }

  function removeChoice(pageIdx: number, choiceIdx: number) {
    pages[pageIdx].choices == pages[pageIdx].choices.splice(choiceIdx, 1)
    pages = pages
  }
</script>

{#if $url.hash.indexOf("#/rooms/") === 0}
  <Room roomKey={$url.hash.split(["#/rooms/"])[1]} />
{:else}
  <main class="container mx-auto flex flex-col gap-4 py-4">
    <h1 class="text-2xl">Create new room</h1>

    <input type="text" class="w-48 p-2 rounded" bind:value={roomName} placeholder="Room Name" />

    <h2>Pages</h2>

    {#each pages as page, i (i)}
      <div class="page border p-2 flex flex-col gap-2">
        <div>
          <input type="text" bind:value={page.name} placeholder="Page Name" />
          <button class="border border-red-400 rounded px-1" on:click={() => removePage(i)}
            >Delete Page</button
          >
        </div>

        <h3>Choices</h3>
        {#each page.choices as choice, j (j)}
          <div>
            <input type="text" bind:value={choice} placeholder="Choice" />
            <button class="border border-red-400 rounded px-2" on:click={() => removeChoice(i, j)}
              >-</button
            >
          </div>
        {/each}
        <button class="w-32" on:click={() => addNewChoice(i)}>+ Choice</button>
      </div>
    {/each}
    <button class="w-32" on:click={addNewPage}>+ Page</button>

    <button class="w-32" on:click={createRoom}>Create</button>
  </main>
{/if}

<style>
  input {
    border: 1px solid gray;
    padding: 0.25rem;
    border-radius: 0.25rem;
  }

  button {
    border: 1px solid gray;
    padding: 0.25rem;
    border-radius: 0.25rem;
  }
</style>
