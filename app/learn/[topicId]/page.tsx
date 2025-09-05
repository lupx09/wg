import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { LearningInterface } from "@/components/learning/learning-interface"
import { getTopic } from "@/lib/api/topics"

interface Props {
  params: { topicId: string }
}

export default async function LearnPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth")
  }

  const topic = await getTopic(params.topicId)

  return (
    <div className="min-h-screen bg-background">
      <LearningInterface topic={topic} userId={session.userId} accessToken={session.accessToken} />
    </div>
  )
}
