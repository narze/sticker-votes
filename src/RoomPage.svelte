<script lang="ts">
  import "twind/shim"
  import { tw } from "twind"
  import logo from "./assets/svelte.png"
  import Head from "./lib/Head.svelte"
  import Kofi from "./lib/Kofi.svelte"
  import Menu from "./lib/Menu.svelte"
  import Social from "./lib/Social.svelte"
  import { db } from "./lib/firebase"
  import { collection, onSnapshot, doc, query, limit, setDoc, updateDoc } from "firebase/firestore"
  import { nanoid } from "nanoid"
  import { onDestroy } from "svelte"

  export let roomKey = "SNfjJdRJGeM2lfDN27vz-test"

  const url = "https://sticker-votes.vercel.app"
  const title = "Sticker Votes"

  const localStorageKey = "sticker-votes"

  const menuItems = [{ name: "Github", url: "https://github.com/narze/sticker-votes" }]

  const description = ""
  const imageUrl =
    "https://raw.githubusercontent.com/narze/timelapse/master/projects/sticker-votes_home.png"
  const gtagId = null
  const id = localStorage.getItem(localStorageKey) || nanoid()

  localStorage.setItem(localStorageKey, id)

  let x, y
  let active = true
  let room: Room = { name: "Loading...", pages: {}, admins: [] }
  let pageIndex = 0
  let votesByChoices: Record<string, Array<{ id: string; x: number; y: number }>> = {}
  let roomRef = doc(db, "rooms", roomKey)

  $: page = (room.pages[pageIndex] || {}) as Page
  $: choices = page.choices || []
  $: votes = page.votes || {}
  $: {
    const votesByChoicesTemp = {}
    choices.forEach((choice) => (votesByChoicesTemp[choice] = []))
    Object.entries(votes).forEach(([userId, vote]) => {
      votesByChoicesTemp[vote.choice]?.push({ id: userId, x: vote.x, y: vote.y })
    })
    votesByChoices = votesByChoicesTemp
  }

  $: pageCount = Object.entries(room.pages).length
  $: hasPrevPage = pageIndex > 0
  $: hasNextPage = pageIndex < pageCount - 1
  $: isAdmin = (room?.admins || []).includes(id)

  const unsub = onSnapshot(roomRef, (querySnapshot) => {
    room = querySnapshot.data() as Room

    if (!room) {
      alert("Room not found!")
      window.location.href = "/"
    }
  })

  onDestroy(() => {
    unsub()
  })

  // Active for 10 minutes only, to save quotas,
  setTimeout(() => {
    active = false
    unsub()
  }, 10 * 60 * 1000)

  function prevPage() {
    if (!hasPrevPage) return

    pageIndex -= 1
  }

  function nextPage() {
    if (!hasNextPage) return

    pageIndex += 1
  }

  async function submitVote(e, choice: string) {
    if (!active) {
      return
    }

    const rect = e.target.getBoundingClientRect()
    x = ((e.clientX - rect.left) / rect.width) * 100
    y = ((e.clientY - rect.top) / rect.height) * 100

    await upsert(choice)

    // alert("ขอบคุณสำหรับการโหวต!")
  }

  async function upsert(choice) {
    try {
      await updateDoc(roomRef, {
        [`pages.${pageIndex}.votes.${id}`]: { x: round(x), y: round(y), choice },
      })

      // console.log("Document upserted with ID: ", id, { x, y, value })
    } catch (e) {
      console.error("Error adding document: ", e)
    }
  }

  function round(num, decimalPlaces = 3) {
    var p = Math.pow(10, decimalPlaces)
    return Math.round(num * p) / p
  }
</script>

<!-- <Kofi name="narze" label="Support Me" /> -->
<Menu items={menuItems} />
<Social {url} {title} />
<Head {title} {description} {url} {imageUrl} {gtagId} />

<main class="w-full h-screen p-2 flex flex-col items-center">
  <h1 class="inline-block text-3xl sm:text-4xl md:text-6xl flex gap-3 mt-2 text-center">
    Sticker Votes
  </h1>

  <h2 class="text-2xl">
    Room: {room.name}
    {#if isAdmin}(Admin){/if}
  </h2>
  <h2 class="text-xl">
    {#if hasPrevPage}<button class="text-red-700 text-3xl" on:click={prevPage}>◀</button>{/if}
    {page.name}
    {#if hasNextPage}<button class="text-red-700 text-3xl" on:click={nextPage}>▶</button>{/if}
  </h2>

  <div class="flex-grow w-full flex flex-col md:flex-row">
    {#each choices as choice, idx}
      {@const votes = votesByChoices[choice]}
      {#if idx > 0}
        <span class="h-0.5 w-full md:w-0.5 md:h-full bg-black md:mt-14" />
      {/if}
      <div class="flex-grow text-center flex flex-col">
        <p class="z-10 underline text-red-600 text-xl mt-4">{choice}</p>
        <p class="z-10 mb-2 text-lg">{votes.length}</p>
        <div on:click={(e) => submitVote(e, choice)} class="flex-grow mt-4 relative">
          {#each votes as vote (vote.id)}
            <div class="sticker absolute" style={`top: ${vote.y}%; left: ${vote.x}%; `}>
              <!-- {entry.id} -->
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
      "Open Sans", "Helvetica Neue", sans-serif;
  }

  .sticker {
    margin-top: -2rem;
    margin-left: -2rem;
    height: 4rem;
    width: 4rem;
    background-color: lime;
    border-color: limegreen;
    border-width: 2px;
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    .sticker {
      margin-top: -1rem;
      margin-left: -1rem;
      height: 2rem;
      width: 2rem;
      border-width: 1px;
    }
  }
</style>
