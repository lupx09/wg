import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { JWT } from "next-auth/jwt"
import type { Session, User, Account, Profile } from "next-auth"


// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken?: string
    userId?: string
    googleToken?: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    userId?: string
    googleToken?: string
    picture?: string
  }
}

// Extend Google Profile to include email_verified
interface GoogleProfile extends Profile {
  email_verified?: boolean
}

// Add console logging to help debug the issue
console.log("NextAuth configuration loading...")
console.log("GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID)
console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET)
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL)
console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET)
console.log("FASTAPI_URL:", process.env.FASTAPI_URL)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: { token: JWT; account: Account | null; user: User }) {
      // If we have an access token, add it to the token
      if (account && user) {
        console.log(
          "Account data received:",
          JSON.stringify({
            provider: account.provider,
            tokenReceived: !!account.access_token,
            email: user.email,
            name: user.name,
          }),
        )
        
        // Store the Google token and user data in the JWT
        token.googleToken = account.access_token || undefined
        token.email = user.email || undefined
        token.name = user.name || undefined
        token.picture = user.image || undefined
        
        try {
          // Validate data before sending to FastAPI
          if (!user.email || !user.name) {
            console.error("Missing required user data:", { 
              email: user.email, 
              name: user.name 
            })
            return token
          }
          
          // Only call FastAPI if we have the URL configured
          if (process.env.FASTAPI_URL) {
            // Clean up the FastAPI URL (remove trailing slash if present)
            const fastApiUrl = process.env.FASTAPI_URL.endsWith('/') 
              ? process.env.FASTAPI_URL.slice(0, -1) 
              : process.env.FASTAPI_URL

            const response = await fetch(`${fastApiUrl}/api/auth/google`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
              },
              body: JSON.stringify({
                token: account.access_token,
                email: user.email,
                name: user.name,
                picture: user.image || null,
              }),
            })
            
            console.log("FastAPI response status:", response.status)
            
            if (!response.ok) {
              const errorText = await response.text()
              console.error("FastAPI error response:", errorText)
              // Don't fail the auth process, just log the error
              console.warn("Continuing without FastAPI backend authentication")
            } else {
              const data = await response.json()
              console.log("FastAPI auth successful:", {
                tokenReceived: !!data.access_token,
                userId: data.user_id
              })
              
              // Store the FastAPI JWT token and user ID
              token.accessToken = data.access_token
              token.userId = data.user_id
            }
          } else {
            console.warn("FASTAPI_URL not configured, skipping backend auth")
          }
        } catch (error) {
          console.error("Error authenticating with FastAPI:", error)
          // Don't fail the NextAuth process, just log the error
        }
      }
      return token
    },
    
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add the access token, user ID, and Google token to the session
      if (token && session.user) {
        session.accessToken = token.accessToken
        session.userId = token.userId
        session.googleToken = token.googleToken
        
        // Ensure user data is properly set in the session
        session.user.id = token.userId || token.sub || ""
        session.user.email = (token.email || session.user.email) || undefined
        session.user.name = (token.name || session.user.name) || undefined
        session.user.image = (token.picture || session.user.image) || undefined
      }
      return session
    },
    
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log("Redirect callback - url:", url, "baseUrl:", baseUrl)
      
      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      
      // If it's the same origin, allow it
      try {
        const urlObj = new URL(url)
        const baseUrlObj = new URL(baseUrl)
        
        if (urlObj.origin === baseUrlObj.origin) {
          return url
        }
      } catch (error) {
        console.error("Error parsing URLs in redirect:", error)
      }
      
      // For all other cases, redirect to base URL
      return baseUrl
    },

    async signIn({ user, account, profile }: { user: User; account: Account | null; profile?: GoogleProfile }) {
      // Additional validation can be done here
      console.log("Sign in callback:", {
        email: user.email,
        provider: account?.provider,
        verified: profile?.email_verified
      })
      
      // Allow sign in for Google users with verified emails
      if (account?.provider === "google" && profile?.email_verified) {
        return true
      }
      
      // For now, allow all Google sign-ins
      if (account?.provider === "google") {
        return true
      }
      
      console.warn("Sign in rejected:", { provider: account?.provider })
      return false
    },
  },
  
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days instead of 4 years (more secure)
  },
  
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
