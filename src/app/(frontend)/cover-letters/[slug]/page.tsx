import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { Header } from '@/components/coverletter/header'
import { Recipient } from '@/components/coverletter/recipient'
import { Info } from '@/components/coverletter/info'
import { Body } from '@/components/coverletter/body'
import { Signature } from '@/components/coverletter/signature'
import { notFound } from 'next/navigation'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Image from 'next/image'
import { StaticImageData } from 'next/image'
import PrintButton from './PrintButton'

// Typecast collections to avoid TS errors until payload-types are regenerated
const COVER_LETTERS_COLLECTION = 'cover-letters' as any
const COVER_LETTER_HEADERS_COLLECTION = 'cover-letter-headers' as any
const COVER_LETTER_INFO_COLLECTION = 'cover-letter-info' as any
const COVER_LETTER_RECIPIENTS_COLLECTION = 'cover-letter-recipients' as any
const COVER_LETTER_BODIES_COLLECTION = 'cover-letter-bodies' as any
const COVER_LETTER_SIGNATURES_COLLECTION = 'cover-letter-signatures' as any
const MEDIA_COLLECTION = 'media' as any

// Update type definition to match Next.js App Router expectations
type Args = {
  params: Promise<{
    slug?: string
  }>
}

// Helper function to convert image data to ImageProps
function createImageProps(imageData: any, altText: string): any {
  if (!imageData?.url) return null

  return {
    src: imageData.url,
    height: imageData.height || 100,
    width: imageData.width || 100,
    alt: imageData.alt || altText,
  }
}

// Helper to safely extract ID from relationship field
function safelyGetId(value: any): string | number | null {
  if (!value) return null

  // If it's a simple ID (number or string)
  if (typeof value === 'number' || typeof value === 'string') {
    return value
  }

  // If it's an object with an id property
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return value.id
  }

  return null
}

export default async function CoverLetterPage({ params }: Args) {
  try {
    // Access draft mode safely
    const draftModeData = await draftMode()
    const draft = draftModeData.isEnabled

    // Await the params object before accessing its properties
    const resolvedParams = await params
    const { slug = '' } = resolvedParams
    const url = '/cover-letters/' + slug

    // Fetch the cover letter
    const payload = await getPayload({ config: configPromise })
    const coverLetterResult = await payload.find({
      collection: COVER_LETTERS_COLLECTION,
      depth: 0,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    const coverLetter = coverLetterResult.docs?.[0]
    if (!coverLetter) return notFound()

    // Fetch all related components with individual queries
    // Header
    let headerData = null
    if (coverLetter.header) {
      const headerId = safelyGetId(coverLetter.header)
      if (headerId) {
        headerData = await payload.findByID({
          collection: COVER_LETTER_HEADERS_COLLECTION,
          id: headerId,
        })
      }
    }

    // Header image
    let headerImage = null
    if (headerData?.image) {
      const headerImageId = safelyGetId(headerData.image)
      if (headerImageId) {
        headerImage = await payload.findByID({
          collection: MEDIA_COLLECTION,
          id: headerImageId,
        })
      }
    }

    // Info
    let infoData = null
    if (coverLetter.info) {
      const infoId = safelyGetId(coverLetter.info)
      if (infoId) {
        infoData = await payload.findByID({
          collection: COVER_LETTER_INFO_COLLECTION,
          id: infoId,
        })
      }
    }

    // Recipient
    let recipientData = null
    if (coverLetter.recipient) {
      const recipientId = safelyGetId(coverLetter.recipient)
      if (recipientId) {
        recipientData = await payload.findByID({
          collection: COVER_LETTER_RECIPIENTS_COLLECTION,
          id: recipientId,
        })
      }
    }

    // Body
    let bodyData = null
    if (coverLetter.body) {
      const bodyId = safelyGetId(coverLetter.body)
      if (bodyId) {
        bodyData = await payload.findByID({
          collection: COVER_LETTER_BODIES_COLLECTION,
          id: bodyId,
        })
      }
    }

    // Signature
    let signatureData = null
    if (coverLetter.signature) {
      const signatureId = safelyGetId(coverLetter.signature)
      if (signatureId) {
        signatureData = await payload.findByID({
          collection: COVER_LETTER_SIGNATURES_COLLECTION,
          id: signatureId,
        })
      }
    }

    // Signature image
    let signatureImage = null
    if (signatureData?.signature) {
      const signatureImageId = safelyGetId(signatureData.signature)
      if (signatureImageId) {
        signatureImage = await payload.findByID({
          collection: MEDIA_COLLECTION,
          id: signatureImageId,
        })
      }
    }

    // Create image data objects
    const headerImageProps = headerImage
      ? createImageProps(headerImage, `Image of ${headerData?.name || 'recipient'}`)
      : null
    const signatureImageProps = signatureImage
      ? createImageProps(signatureImage, `Signature of ${signatureData?.name || 'sender'}`)
      : null

    return (
      <article className="flex flex-col items-start justify-start w-full min-h-screen px-8 py-4 text-gray-900 bg-white gap-y-3 cover-letter-container">
        <div className="no-print">
          <PageClient />
        </div>
        {draft && <LivePreviewListener />}

        <PrintButton />

        {headerData && (
          <Header
            name={headerData.name}
            phoneNumber={headerData.phoneNumber}
            email={headerData.email}
            address={headerData.address}
            image={headerImageProps}
          />
        )}

        <div className="flex flex-row items-end justify-between w-full mt-4">
          {recipientData && (
            <Recipient
              name={recipientData.name}
              role={recipientData.role}
              email={recipientData.email}
              company={{
                name: recipientData.company.name,
                street: recipientData.company.street,
                postalCode: recipientData.company.postalCode,
                city: recipientData.company.city,
              }}
            />
          )}

          {infoData && <Info place={infoData.place} />}
        </div>

        {bodyData && (
          <Body title={bodyData.title} subTitle={bodyData.subTitle} body={bodyData.body} />
        )}

        {signatureData && (
          <Signature
            name={signatureData.name}
            text={signatureData.text}
            signature={signatureImageProps}
          />
        )}
      </article>
    )
  } catch (error) {
    console.error('Error in CoverLetterPage:', error)
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Error Loading Cover Letter</h1>
        <p>There was a problem loading this cover letter. Please try again later.</p>
      </div>
    )
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  try {
    // Await the params object before accessing its properties
    const resolvedParams = await params
    const { slug = '' } = resolvedParams

    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: COVER_LETTERS_COLLECTION,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    const coverLetter = result.docs?.[0]

    if (!coverLetter) {
      return {
        title: 'Cover Letter Not Found',
      }
    }

    return {
      title: coverLetter.title,
      description: `Cover letter for ${coverLetter.title}`,
    }
  } catch (error) {
    console.error('Error in generateMetadata:', error)
    return {
      title: 'Cover Letter',
      description: 'Error loading cover letter metadata',
    }
  }
}
