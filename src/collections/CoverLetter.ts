import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNumericString(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length === 0) return false
  return Number.isFinite(Number(trimmed))
}

function recordField(value: unknown, key: string): unknown {
  if (!isRecord(value)) return undefined
  return value[key]
}

function senderIdFrom(value: unknown): number | string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && isNumericString(value)) return value
  if (!isRecord(value)) return undefined
  const id = value.id
  if (typeof id === 'number' && Number.isFinite(id)) return id
  if (typeof id === 'string' && isNumericString(id)) return id
  return undefined
}

function hasSenderId(value: unknown): boolean {
  return senderIdFrom(recordField(value, 'sender')) !== undefined
}

function senderWasCleared(value: unknown): boolean {
  if (!isRecord(value)) return false
  if (!Object.prototype.hasOwnProperty.call(value, 'sender')) return false
  return value.sender === null
}

const enforceSender: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  switch (operation) {
    case 'create':
      if (!hasSenderId(data)) {
        throw new Error('Choose a sender. A cover letter has to say who it is from.')
      }
      break
    case 'update':
      if (senderWasCleared(data) && hasSenderId(originalDoc)) {
        throw new Error('This letter already has a sender. Choose a sender instead of clearing it.')
      }
      break
    default: {
      const unreachable: never = operation
      return unreachable
    }
  }

  if (hasSenderId(data)) {
    return {
      ...data,
      header: null,
      info: null,
      signature: null,
    }
  }

  return data
}

export const CoverLetter: CollectionConfig = {
  slug: 'cover-letters',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'recipient', 'createdAt'],
    group: 'Cover Letter',
  },
  hooks: {
    beforeChange: [enforceSender],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Name this cover letter for easy reference',
      },
    },
    ...slugField(),
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'cover-letter-senders',
      required: false,
      label: 'The person the letter is from',
    },
    {
      name: 'header',
      type: 'relationship',
      relationTo: 'cover-letter-headers',
      required: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => !hasSenderId(data),
      },
    },
    {
      name: 'info',
      type: 'relationship',
      relationTo: 'cover-letter-info',
      required: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => !hasSenderId(data),
      },
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'cover-letter-recipients',
      required: true,
    },
    {
      name: 'body',
      type: 'relationship',
      relationTo: 'cover-letter-bodies',
      required: true,
    },
    {
      name: 'signature',
      type: 'relationship',
      relationTo: 'cover-letter-signatures',
      required: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => !hasSenderId(data),
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Under Review',
          value: 'review',
        },
        {
          label: 'Sent',
          value: 'sent',
        },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'sentDate',
      type: 'date',
      admin: {
        condition: (data) => data?.status === 'sent',
        description: 'Date when this cover letter was sent',
      },
    },
  ],
}
