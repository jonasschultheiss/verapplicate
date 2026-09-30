import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'

export const CoverLetterInfo: CollectionConfig = {
  slug: 'cover-letter-info',
  access: {
    create: () => false,
    delete: () => false,
    read: anyone,
    update: () => false,
  },
  admin: {
    useAsTitle: 'place',
    defaultColumns: ['place'],
    group: 'Cover Letter (legacy)',
  },
  fields: [
    {
      name: 'place',
      type: 'text',
      required: true,
    },
    // The date is dynamically generated in the component, so no need to store it
    {
      name: 'customDate',
      type: 'date',
      admin: {
        description: 'Optional custom date (defaults to current date if not specified)',
      },
      required: false,
    },
  ],
}
