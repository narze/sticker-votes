<script type="ts">
  import url from "./lib/url"

  import RoomPage from "./RoomPage.svelte"
  import CreateRoomPage from "./CreateRoomPage.svelte"
  import EditRoomPage from "./EditRoomPage.svelte"
</script>

{#if $url.hash.indexOf("#/rooms/") === 0}
  <RoomPage roomKey={$url.hash.split(["#/rooms/"])[1]} />
{:else if $url.hash.indexOf("#/edit/") === 0}
  <EditRoomPage roomKey={$url.hash.split(["#/edit/"])[1]} />
{:else}
  <CreateRoomPage />
{/if}
