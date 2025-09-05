import "server-only"
import { AIProvider } from "../lib/client-utils"
import type { ReactNode } from "react"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

export const LAMBDA_STREAM_WRAPPER_NAME = "lambda_stream_wrapper"

/**
 * Polyfill to emulate the upcoming Promise.withResolvers
 */
export function withResolvers<T>() {
  let resolve: (value: T) => void
  let reject: (reason?: any) => void

  const innerPromise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  // @ts-expect-error
  return [innerPromise, resolve, reject] as const
}

/**
 * Expose these endpoints outside for the client
 * We wrap the functions in order to properly resolve importing
 * client components.
 *
 * @param actions
 */
export function exposeEndpoints<T extends Record<string, unknown>>(
  actions: T,
): {
  (props: { children: ReactNode }): Promise<JSX.Element>
  $$types?: T
} {
  return async function AI(props: { children: ReactNode }) {
    return <AIProvider actions={actions}>{props.children}</AIProvider>
  }
}
