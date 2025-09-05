"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Calendar, DollarSign } from "lucide-react"

interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  amount: number
  currency: string
  status: "paid" | "pending" | "overdue"
  vendor: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
}

export function InvoiceLoading() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <FileText className="h-5 w-5 mr-2" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export function Invoice(props: InvoiceData) {
  const statusColors = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <FileText className="h-5 w-5 mr-2" />
        <div className="space-y-1 flex-1">
          <CardTitle className="text-sm font-medium">Invoice #{props.invoiceNumber}</CardTitle>
          <CardDescription className="text-xs">{props.vendor}</CardDescription>
        </div>
        <Badge className={statusColors[props.status]}>
          {props.status.charAt(0).toUpperCase() + props.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            Due: {props.dueDate}
          </div>
          <div className="flex items-center font-medium">
            <DollarSign className="h-3 w-3 mr-1" />
            {props.currency} {props.amount.toLocaleString()}
          </div>
        </div>
        <div className="space-y-1">
          {props.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-xs text-muted-foreground">
              <span className="truncate flex-1 mr-2">{item.description}</span>
              <span>
                {props.currency} {item.total.toLocaleString()}
              </span>
            </div>
          ))}
          {props.items.length > 3 && (
            <div className="text-xs text-muted-foreground">+{props.items.length - 3} more items</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
