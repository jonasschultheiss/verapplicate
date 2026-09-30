import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'

export const CoverLetterSignature: CollectionConfig = {
  slug: 'cover-letter-signatures',
  access: {
    create: () => false,
    delete: () => false,
    read: anyone,
    update: () => false,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'text'],
    group: 'Cover Letter (legacy)',
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
