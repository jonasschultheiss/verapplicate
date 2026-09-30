/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'
import type { NextRequest } from 'next/server'

export const POST = GRAPHQL_POST(config)

// REST_OPTIONS is typed for /api/[...slug]. This route has no slug segment.
const graphqlOptions = REST_OPTIONS(config)

export function OPTIONS(request: NextRequest): Promise<Response> {
  return graphqlOptions(request, { params: Promise.resolve({ slug: ['graphql'] }) })
}
