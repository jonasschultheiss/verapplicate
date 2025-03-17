import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { getMeUser } from '@/utilities/getMeUser'
import { CoverLetters } from '@/components/cover-letters'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const coverLetters = await payload.find({
    collection: 'cover-letters',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Cover Letters</h1>
        </div>
      </div>

      <div className="container mb-8">
        <CoverLetters coverLetters={coverLetters.docs} />
        <PageRange
          collection="cover-letters"
          currentPage={coverLetters.page}
          limit={12}
          totalDocs={coverLetters.totalDocs}
        />
      </div>

      <div className="container">
        {coverLetters.totalPages > 1 && coverLetters.page && (
          <Pagination page={coverLetters.page} totalPages={coverLetters.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Protected Cover Letters - Payload Website Template`,
  }
}
