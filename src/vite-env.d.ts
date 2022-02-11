/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Window {
  kofiWidgetOverlay: any
}

interface Rooms {
  [roomKey: string]: Room
}

interface Room {
  name: string
  pages: Pages
  admins: string[]
}

interface Pages {
  [pageKey: any]: Page
}

interface Page {
  name: string
  choices: string[]
  votes: Votes
}

interface Votes {
  [userId: string]: Vote
}

interface Vote {
  choice: string
  x: number
  y: number
}

// {
//   rooms: {
//     "room-key-1": {
//       name: "Room 1",
//       pages: {
//         "0": {
//           name: "Page 1"
//           choices: ["A", "B", "C"]
//           votes: {
//             "user-id-1": {
//               choice: "A",
//               x: 100,
//               y: 100
//             },
//             "user-id-2": {
//               choice: "B",
//               x: 100,
//               y: 100
//             },
//           }
//         }
//       }
//     }
//     "room-key-2":
//   }
// }
