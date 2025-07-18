import { NextResponse } from "next/server"
import { env } from "@/env.mjs"

/**
 * This route handler acts as a public proxy for frontend requests with two primary goals:
 * - Hide the authenticated API token from the client (for both SSR and client-side components).
 * - Hide the backend URL, so it cannot be accessed directly.
 *
 * It is a public proxy that injects the Strapi API token (https://docs.strapi.io/cms/features/api-tokens) into the request.
 *
 * Since the STRAPI_REST_READONLY_API_KEY is injected into every GET request and Strapi does not block findOne and findMany
 * operations for any content type, this proxy checks if the requested content type is allowed to be fetched.
 */
async function handler(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const path = Array.isArray(slug) ? slug.join("/") : slug
  const isReadOnly = request.method === "GET" || request.method === "HEAD"

  if (
    isReadOnly &&
    !ALLOWED_STRAPI_ENDPOINTS.some((endpoint) => {
      // Add leading slash to path for proper comparison
      const fullPath = `/${path}`
      return fullPath === endpoint
    })
  ) {
    return NextResponse.json(
      {
        error: {
          message: `Endpoint "${path}" is not allowed for GET requests`,
          name: "Forbidden",
        },
      },
      { status: 403 }
    )
  }

  const { search } = new URL(request.url)
  const url = `${env.STRAPI_URL}/${path}${search ?? ""}`

  const clonedRequest = request.clone()
  // Extract the body explicitly from the cloned request
  const body = isReadOnly ? undefined : await clonedRequest.text()

  const injectedAuthHeader = `Bearer ${
    isReadOnly
      ? env.STRAPI_REST_READONLY_API_KEY
      : env.STRAPI_REST_CUSTOM_API_KEY
  }`

  return fetch(url, {
    headers: {
      // Convert headers to object
      ...Object.fromEntries(clonedRequest.headers),
      // Override the Authorization header with the injected token
      Authorization: injectedAuthHeader,
    },
    body,
    // this needs to be explicitly stated, because it is defaulted to GET
    method: request.method,
  })
}

export {
  handler as HEAD,
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
}

// List of allowed endpoints for GET requests
const ALLOWED_STRAPI_ENDPOINTS = [
  "/api/pages", 
  "/api/footer", 
  "/api/navbar",
  "/api/categories",
  "/api/criteria", 
  "/api/directories",
  "/api/identities",
  "/api/items",
  "/api/listings",
  "/api/listing-types",
  "/api/platforms",
  "/api/reports",
  "/api/reviews",
  "/api/review-votes",
  "/api/subscribers"
]
