<script lang="ts">
  import "twind/shim"
  import { tw } from "twind"
  import logo from "./assets/svelte.png"
  import Head from "./lib/Head.svelte"
  import Kofi from "./lib/Kofi.svelte"
  import Menu from "./lib/Menu.svelte"
  import Social from "./lib/Social.svelte"
  import { db } from "./lib/firebase"
  import { collection, onSnapshot, doc, query, limit, setDoc } from "firebase/firestore"
  import { nanoid } from "nanoid"

  const url = "https://sticker-vote.vercel.app"
  const title = "Sticker Vote"

  const localStorageKey = "sticker-vote"

  const menuItems = [{ name: "Github", url: "https://github.com/narze/sticker-vote" }]

  const description = ""
  const imageUrl =
    "https://raw.githubusercontent.com/narze/timelapse/master/projects/sticker-vote_home.png"
  const gtagId = null
  const id = localStorage.getItem(localStorageKey) || nanoid()

  localStorage.setItem(localStorageKey, id)

  let x, y, value
  let troublesomeEntries: Array<{ x: number; y: number; id: string }> = []
  let notTroublesomeEntries: Array<{ x: number; y: number; id: string }> = []
  let active = true
  let room: Room = { name: "Loading...", pages: {} }
  let pageIndex = 0
  let votesByChoices: Record<string, Array<{ id: string; x: number; y: number }>> = {}
  let roomKey = "SNfjJdRJGeM2lfDN27vz-test"
  let roomRef = doc(db, "rooms", roomKey)

  $: page = (room.pages[pageIndex] || {}) as Page
  $: choices = page.choices || []
  $: votes = page.votes || {}
  $: {
    const votesByChoicesTemp = {}
    choices.forEach((choice) => (votesByChoicesTemp[choice] = []))
    Object.entries(votes).forEach(([userId, vote]) => {
      votesByChoicesTemp[vote.choice].push({ id: userId, x: vote.x, y: vote.y })
    })
    votesByChoices = votesByChoicesTemp
  }

  const unsub = onSnapshot(roomRef, (querySnapshot) => {
    room = querySnapshot.data() as Room
    console.log({ room })
    // const entries: Record<string, { x: number; y: number; value: boolean }> = {}
    // const t: Array<{ x: number; y: number; id: string }> = []
    // const nt: Array<{ x: number; y: number; id: string }> = []

    // querySnapshot.forEach((doc) => {
    //   Object.entries(doc.data()).forEach(([id, values]) => {
    //     entries[id] = { id, ...values }
    //   })
    // })

    // // console.log("Current data ", entries)

    // Object.entries(entries).forEach(([id, entry]) => {
    //   const { x, y, value } = entry

    //   if (value) {
    //     t.push({ x, y, id })
    //   } else {
    //     nt.push({ x, y, id })
    //   }
    // })

    // troublesomeEntries = t
    // notTroublesomeEntries = nt
  })

  // Active for 5 minutes only, to save quotas,
  setTimeout(() => {
    active = false
    unsub()
  }, 5 * 60 * 1000)

  async function submitIsTroublesome(e) {
    if (!active) {
      return
    }

    const rect = e.target.getBoundingClientRect()
    x = ((e.clientX - rect.left) / rect.width) * 100
    y = ((e.clientY - rect.top) / rect.height) * 100
    value = true

    await upsert()

    alert("ขอบคุณสำหรับการโหวต!")

    // active = false
  }

  async function submitIsNotTroublesome(e) {
    if (!active) {
      return
    }

    const rect = e.target.getBoundingClientRect()
    x = ((e.clientX - rect.left) / rect.width) * 100
    y = ((e.clientY - rect.top) / rect.height) * 100
    value = false

    await upsert()

    alert("ขอบคุณสำหรับการโหวต!")

    // active = false
  }

  async function upsert() {
    try {
      await setDoc(
        docRef,
        {
          [id]: { x: round(x), y: round(y), value },
        },
        { merge: true }
      )

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
    Sticker Vote
  </h1>

  <h2 class="text-xl">Room: {room.name}</h2>
  <h2 class="text-xl">Page: {page.name}</h2>

  <!-- <div class="fixed">x: {x}, y: {y}, value: {value}</div> -->

  <div class="flex-grow w-full flex flex-col md:flex-row">
    {#each choices as choice, idx}
      {@const votes = votesByChoices[choice]}
      {#if idx > 0}
        <span class="h-0.5 w-full md:w-0.5 md:h-full bg-black md:mt-14" />
      {/if}
      <div class="flex-grow text-center flex flex-col">
        <p class="z-10 underline text-red-600 text-xl mt-4">{choice}</p>
        <p class="z-10 mb-2 text-lg">{troublesomeEntries.length}</p>
        <div on:click={submitIsTroublesome} class="flex-grow mt-4 relative">
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
    margin-top: -1rem;
    margin-left: -1rem;
    height: 2rem;
    width: 2rem;
    background-color: lime;
    border-color: limegreen;
    border-width: 2px;
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    .sticker {
      margin-top: -0.75rem;
      margin-left: -0.75rem;
      height: 1.5rem;
      width: 1.5rem;
      border-width: 1px;
    }
  }
</style>
