import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type {
  CoverLetter,
  CoverLetterBody,
  CoverLetterHeader,
  CoverLetterInfo,
  CoverLetterRecipient,
  CoverLetterSender,
  CoverLetterSignature,
  Media,
} from '@/payload-types'

export type LetterImage = {
  readonly src: string
  readonly width: number
  readonly height: number
}

export type Sender = {
  readonly name: string
  readonly phoneNumber: string
  readonly email: string
  readonly address: string
  readonly portrait: LetterImage
  readonly place: string
  readonly closing: string
  readonly signature: LetterImage
}

type Recipient = {
  readonly name?: string
  readonly role?: string
  readonly email?: string
  readonly company: {
    readonly name: string
    readonly street: string
    readonly postalCode: string
    readonly city: string
  }
}

type LetterBody = {
  readonly title: string
  readonly subTitle: string
  readonly content: DefaultTypedEditorState
}

export type PrintableCoverLetter = {
  readonly title: string
  readonly sender: Sender
  readonly recipient: Recipient
  readonly body: LetterBody
}

export type LoadCoverLetterResult =
  | { readonly status: 'ok'; readonly letter: PrintableCoverLetter }
  | { readonly status: 'not-found' }
  | { readonly status: 'broken'; readonly reason: string }

type Broken = {
  readonly status: 'broken'
  readonly reason: string
}

type Parsed = Sender | Recipient | LetterBody | LetterImage | Broken

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isBroken(value: Parsed): value is Broken {
  return 'status' in value
}

function positiveDimension(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value
  return 100
}

function isMedia(value: unknown): value is Media {
  return isRecord(value) && typeof value.id === 'number'
}

function letterImage(value: unknown, label: string): LetterImage | Broken {
  if (!isMedia(value)) {
    return { status: 'broken', reason: `${label} was not loaded.` }
  }
  const src = value.url
  if (typeof src !== 'string' || src.trim() === '') {
    return { status: 'broken', reason: `${label} is missing a media url.` }
  }
  return {
    src,
    width: positiveDimension(value.width),
    height: positiveDimension(value.height),
  }
}

function isDirection(value: unknown): value is 'ltr' | 'rtl' | null {
  return value === 'ltr' || value === 'rtl' || value === null
}

function isElementFormat(
  value: unknown,
): value is 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '' {
  return (
    value === 'left' ||
    value === 'start' ||
    value === 'center' ||
    value === 'right' ||
    value === 'end' ||
    value === 'justify' ||
    value === ''
  )
}

function isEditorChild(value: unknown): boolean {
  return isRecord(value) && typeof value.type === 'string' && typeof value.version === 'number'
}

function isDefaultTypedEditorState(value: unknown): value is DefaultTypedEditorState {
  if (!isRecord(value)) return false
  const root = value.root
  if (!isRecord(root)) return false
  if (root.type !== 'root') return false
  if (!Array.isArray(root.children) || !root.children.every(isEditorChild)) return false
  if (!isDirection(root.direction)) return false
  if (!isElementFormat(root.format)) return false
  if (typeof root.indent !== 'number' || !Number.isFinite(root.indent)) return false
  if (typeof root.version !== 'number' || !Number.isFinite(root.version)) return false
  return true
}

function optionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  return value
}

function isCompany(
  value: unknown,
): value is { name: string; street: string; postalCode: string; city: string } {
  if (!isRecord(value)) return false
  return (
    typeof value.name === 'string' &&
    typeof value.street === 'string' &&
    typeof value.postalCode === 'string' &&
    typeof value.city === 'string'
  )
}

function isCoverLetterSender(value: unknown): value is CoverLetterSender {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.phoneNumber === 'string' &&
    typeof value.email === 'string' &&
    typeof value.address === 'string' &&
    typeof value.place === 'string' &&
    typeof value.closing === 'string'
  )
}

function isCoverLetterHeader(value: unknown): value is CoverLetterHeader {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.phoneNumber === 'string' &&
    typeof value.email === 'string' &&
    typeof value.address === 'string'
  )
}

function isCoverLetterInfo(value: unknown): value is CoverLetterInfo {
  return isRecord(value) && typeof value.id === 'number' && typeof value.place === 'string'
}

function isCoverLetterSignature(value: unknown): value is CoverLetterSignature {
  return isRecord(value) && typeof value.id === 'number' && typeof value.text === 'string'
}

function isCoverLetterRecipient(value: unknown): value is CoverLetterRecipient {
  return isRecord(value) && typeof value.id === 'number'
}

function isCoverLetterBody(value: unknown): value is CoverLetterBody {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.subTitle === 'string'
  )
}

function senderFromDocument(sender: CoverLetterSender): Sender | Broken {
  const portrait = letterImage(sender.portrait, 'Sender portrait')
  if (isBroken(portrait)) return portrait
  const signature = letterImage(sender.signature, 'Sender signature')
  if (isBroken(signature)) return signature
  return {
    name: sender.name,
    phoneNumber: sender.phoneNumber,
    email: sender.email,
    address: sender.address,
    portrait,
    place: sender.place,
    closing: sender.closing,
    signature,
  }
}

function incompleteSender(sender: Record<string, unknown>): Broken {
  if (typeof sender.id !== 'number') {
    return { status: 'broken', reason: 'Cover letter sender was not loaded.' }
  }
  if (typeof sender.name !== 'string') {
    return { status: 'broken', reason: 'Cover letter sender is missing a name.' }
  }
  if (typeof sender.phoneNumber !== 'string') {
    return { status: 'broken', reason: 'Cover letter sender is missing a phone number.' }
  }
  if (typeof sender.email !== 'string') {
    return { status: 'broken', reason: 'Cover letter sender is missing an email.' }
  }
  if (typeof sender.address !== 'string') {
    return { status: 'broken', reason: 'Cover letter sender is missing an address.' }
  }
  if (typeof sender.place !== 'string') {
    return { status: 'broken', reason: 'Cover letter sender is missing a place.' }
  }
  if (typeof sender.closing !== 'string') {
    return { status: 'broken', reason: 'Cover letter sender is missing a closing.' }
  }
  return { status: 'broken', reason: 'Cover letter sender is incomplete.' }
}

function senderFromLegacy(doc: CoverLetter): Sender | Broken {
  if (!isCoverLetterHeader(doc.header)) {
    return { status: 'broken', reason: 'Cover letter has no sender and its header is missing.' }
  }
  if (!isCoverLetterInfo(doc.info)) {
    return { status: 'broken', reason: 'Cover letter has no sender and its place is missing.' }
  }
  if (!isCoverLetterSignature(doc.signature)) {
    return { status: 'broken', reason: 'Cover letter has no sender and its signature is missing.' }
  }

  const portrait = letterImage(doc.header.image, 'Cover letter header portrait')
  if (isBroken(portrait)) return portrait
  const signatureImage = letterImage(doc.signature.signature, 'Cover letter signature image')
  if (isBroken(signatureImage)) return signatureImage

  return {
    // header.name is the only name because a Sender has one name.
    name: doc.header.name,
    phoneNumber: doc.header.phoneNumber,
    email: doc.header.email,
    address: doc.header.address,
    portrait,
    place: doc.info.place,
    closing: doc.signature.text,
    signature: signatureImage,
  }
}

function resolveSender(doc: CoverLetter): Sender | Broken {
  if (isCoverLetterSender(doc.sender)) return senderFromDocument(doc.sender)
  if (isRecord(doc.sender)) return incompleteSender(doc.sender)
  if (doc.sender == null) return senderFromLegacy(doc)
  return { status: 'broken', reason: 'Cover letter sender was not loaded.' }
}

function resolveRecipient(value: unknown): Recipient | Broken {
  if (!isCoverLetterRecipient(value)) {
    return { status: 'broken', reason: 'Cover letter recipient was not loaded.' }
  }
  if (!isCompany(value.company)) {
    return { status: 'broken', reason: 'Cover letter recipient is missing a company.' }
  }
  return {
    name: optionalText(value.name),
    role: optionalText(value.role),
    email: optionalText(value.email),
    company: {
      name: value.company.name,
      street: value.company.street,
      postalCode: value.company.postalCode,
      city: value.company.city,
    },
  }
}

function resolveBody(value: unknown): LetterBody | Broken {
  if (!isCoverLetterBody(value)) {
    return { status: 'broken', reason: 'Cover letter body was not loaded.' }
  }
  if (!isDefaultTypedEditorState(value.body)) {
    return { status: 'broken', reason: 'Cover letter body is not editor state.' }
  }
  return {
    title: value.title,
    subTitle: value.subTitle,
    content: value.body,
  }
}

function toPrintable(doc: CoverLetter): LoadCoverLetterResult {
  const sender = resolveSender(doc)
  if (isBroken(sender)) return sender

  const recipient = resolveRecipient(doc.recipient)
  if (isBroken(recipient)) return recipient

  const body = resolveBody(doc.body)
  if (isBroken(body)) return body

  return {
    status: 'ok',
    letter: {
      title: doc.title,
      sender,
      recipient,
      body,
    },
  }
}

const readCoverLetter = cache(async (slug: string): Promise<LoadCoverLetterResult> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'cover-letters',
    depth: 2,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const doc = result.docs[0]
  if (doc === undefined) return { status: 'not-found' }
  return toPrintable(doc)
})

export function loadCoverLetter(slug: string): Promise<LoadCoverLetterResult> {
  return readCoverLetter(slug)
}
