"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full">
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  )
}
