import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { CoverLetter, Page, Post } from '@/payload-types'
import { PaginatedDocs } from 'payload'

type CoverLettersType = {
  coverLetters: {
    id: number
    title: string
    slug?: string | null | undefined
  }[]
}

export const CoverLetters: React.FC<CoverLettersType> = ({ coverLetters }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coverLetters.map(({ id, title, slug }) => (
        <Link
          href={`/cover-letters/${slug}`}
          key={id}
          className={cn(
            'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer m-4 p-4',
          )}
        >
          <h2>{title}</h2>
        </Link>
      ))}
    </div>
  )
}
