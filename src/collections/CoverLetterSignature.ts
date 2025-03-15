import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const CoverLetterSignature: CollectionConfig = {
  slug: 'cover-letter-signatures',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'text'],
    group: 'Cover Letter',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      type: 'text',
      required: true,
      admin: {
        description:
          'The text that appears before the signature (e.g., "Sincerely", "Best regards")',
      },
    },
    {
      name: 'signature',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'An image of your signature',
      },
    },
  ],
}
