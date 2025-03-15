import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

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
      name: 'header',
      type: 'relationship',
      relationTo: 'cover-letter-headers',
      required: true,
    } as any,
    {
      name: 'info',
      type: 'relationship',
      relationTo: 'cover-letter-info',
      required: true,
    } as any,
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'cover-letter-recipients',
      required: true,
    } as any,
    {
      name: 'body',
      type: 'relationship',
      relationTo: 'cover-letter-bodies',
      required: true,
    } as any,
    {
      name: 'signature',
      type: 'relationship',
      relationTo: 'cover-letter-signatures',
      required: true,
    } as any,
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
