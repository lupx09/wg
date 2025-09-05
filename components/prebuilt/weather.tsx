"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  description: string
}

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase()
  if (lower.includes("rain")) return CloudRain
  if (lower.includes("cloud")) return Cloud
  return Sun
}

export function CurrentWeatherLoading() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Cloud className="h-5 w-5 mr-2" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CurrentWeather(props: WeatherData) {
  const WeatherIcon = getWeatherIcon(props.condition)

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <WeatherIcon className="h-5 w-5 mr-2" />
        <div className="space-y-1 flex-1">
          <CardTitle className="text-sm font-medium">{props.location}</CardTitle>
          <CardDescription className="text-xs">Current Weather</CardDescription>
        </div>
        <Badge variant="secondary">{props.condition}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-2xl font-bold">
            <Thermometer className="h-5 w-5 mr-1" />
            {props.temperature}°C
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{props.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Droplets className="h-3 w-3 mr-1 text-blue-500" />
            <span className="text-muted-foreground">Humidity: {props.humidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-3 w-3 mr-1 text-gray-500" />
            <span className="text-muted-foreground">Wind: {props.windSpeed} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
