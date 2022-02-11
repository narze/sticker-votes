<script type="ts">
  import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
  import { nanoid } from "nanoid"

  import "twind/shim"
  import { db } from "./lib/firebase"

  export let roomKey = "SNfjJdRJGeM2lfDN27vz-test"

  const localStorageKey = "sticker-votes"
  const id = localStorage.getItem(localStorageKey) || nanoid()
  localStorage.setItem(localStorageKey, id)

  const defaultPage: Page = {
    name: "Page Name",
    choices: ["A", "B"],
    votes: {},
  }

  let room: Room
  let roomName = "Room Name"
  let pages = []
  const roomRef = doc(db, "rooms", roomKey)

  getDoc(roomRef).then((snapshot) => {
    if (!snapshot.exists()) {
      alert("Room not found, or you are not admin of the room")
      window.location.href = "/"
    }

    room = snapshot.data() as Room

    console.log({ room })
    pages = Object.values(room.pages)
    roomName = room.name
  })

  function pageClone() {
    return { ...defaultPage }
  }

  async function updateRoom() {
    try {
      // update pages of the room, excluding votes
      await updateDoc(roomRef, {
        name: roomName,
        pages: Object.assign({}, pages),
        admins: [id],
      })

      console.log("Document updated", { room, roomKey })

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
      console.log({ pages })
      pages.splice(idx, 1)
      pages = pages
      console.log({ pages })
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

  <button class="w-32" on:click={updateRoom}>Update</button>
</main>

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
