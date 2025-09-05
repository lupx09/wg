"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { GithubIcon, Star, GitFork, ExternalLink } from "lucide-react"

interface GitHubRepoData {
  name: string
  description: string
  stars: number
  forks: number
  language: string
  url: string
  topics?: string[]
}

export function GithubLoading() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <GithubIcon className="h-5 w-5 mr-2" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardContent>
    </Card>
  )
}

export function GitHub(props: GitHubRepoData) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <GithubIcon className="h-5 w-5 mr-2" />
        <div className="space-y-1 flex-1">
          <CardTitle className="text-sm font-medium">{props.name}</CardTitle>
          <CardDescription className="text-xs">GitHub Repository</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={props.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{props.description}</p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Star className="h-3 w-3 mr-1" />
            {props.stars.toLocaleString()}
          </div>
          <div className="flex items-center">
            <GitFork className="h-3 w-3 mr-1" />
            {props.forks.toLocaleString()}
          </div>
          <Badge variant="secondary" className="text-xs">
            {props.language}
          </Badge>
        </div>
        {props.topics && props.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {props.topics.slice(0, 5).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
