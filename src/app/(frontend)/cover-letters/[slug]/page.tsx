import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Body } from '@/components/coverletter/body'
import { Header } from '@/components/coverletter/header'
import { Info } from '@/components/coverletter/info'
import { Recipient } from '@/components/coverletter/recipient'
import { Signature } from '@/components/coverletter/signature'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { loadCoverLetter, type LoadCoverLetterResult } from '@/utilities/loadCoverLetter'

import PageClient from './page.client'
import PrintButton from './PrintButton'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function CoverLetterPage({ params }: Args) {
  let loaded: LoadCoverLetterResult
  let draft = false

  try {
    const draftModeData = await draftMode()
    draft = draftModeData.isEnabled
    const resolvedParams = await params
    const { slug = '' } = resolvedParams
    loaded = await loadCoverLetter(slug)
  } catch (error) {
    console.error('Error in CoverLetterPage:', error)
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Error Loading Cover Letter</h1>
        <p>There was a problem loading this cover letter. Please try again later.</p>
      </div>
    )
  }

  switch (loaded.status) {
    case 'not-found':
      return notFound()
    case 'broken':
      return (
        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold mb-4">Error Loading Cover Letter</h1>
          <p>{loaded.reason}</p>
        </div>
      )
    case 'ok': {
      const { sender, recipient, body } = loaded.letter
      return (
        <article className="flex flex-col items-start justify-start w-full min-h-screen px-8 py-4 text-gray-900 bg-white gap-y-3 cover-letter-container">
          <div className="no-print">
            <PageClient />
          </div>
          {draft && <LivePreviewListener />}

          <PrintButton />

          <Header
            name={sender.name}
            phoneNumber={sender.phoneNumber}
            email={sender.email}
            address={sender.address}
            image={sender.portrait}
          />

          <div className="flex flex-row items-end justify-between w-full mt-4">
            <Recipient
              name={recipient.name}
              role={recipient.role}
              email={recipient.email}
              company={recipient.company}
            />
            <Info place={sender.place} />
          </div>

          <Body title={body.title} subTitle={body.subTitle} body={body.content} />

          <Signature name={sender.name} text={sender.closing} signature={sender.signature} />
        </article>
      )
    }
    default: {
      const unreachable: never = loaded
      return unreachable
    }
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const { slug = '' } = resolvedParams
    const loaded = await loadCoverLetter(slug)

    switch (loaded.status) {
      case 'not-found':
        return { title: 'Cover Letter Not Found' }
      case 'broken':
        return { title: 'Cover Letter' }
      case 'ok':
        return {
          title: loaded.letter.title,
          description: `Cover letter for ${loaded.letter.title}`,
        }
      default: {
        const unreachable: never = loaded
        return unreachable
      }
    }
  } catch (error) {
    console.error('Error in generateMetadata:', error)
    return {
      title: 'Cover Letter',
      description: 'Error loading cover letter metadata',
    }
  }
}
