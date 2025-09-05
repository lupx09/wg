// import { Chat } from "@/components/chat"
// import { getModels } from "@/lib/config/models"
// import { generateId } from "ai"

// export default async function Page() {
//   const id = generateId()
//   const models = await getModels()

//   return <Chat id={id} models={models} />
// }


import { Chat } from "@/components/chat"
import { generateId } from "ai"

export default async function Page() {
  const id = generateId()
  // Removed models dependency - using FastAPI backend instead
  return <Chat id={id} />
}
