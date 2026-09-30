import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'

export const CoverLetterHeader: CollectionConfig = {
  slug: 'cover-letter-headers',
  access: {
    create: () => false,
    delete: () => false,
    read: anyone,
    update: () => false,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phoneNumber'],
    group: 'Cover Letter (legacy)',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
