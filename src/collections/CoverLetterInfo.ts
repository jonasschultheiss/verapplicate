import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const CoverLetterInfo: CollectionConfig = {
  slug: 'cover-letter-info',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'place',
    defaultColumns: ['place'],
    group: 'Cover Letter',
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
