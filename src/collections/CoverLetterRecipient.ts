import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const CoverLetterRecipient: CollectionConfig = {
  slug: 'cover-letter-recipients',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'name', 'role'],
    group: 'Cover Letter',
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        description: 'Name used for display in the admin panel (automatically generated)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (!data) return 'Unnamed Recipient'

            if (
              data.company &&
              typeof data.company === 'object' &&
              'name' in data.company &&
              data.company.name
            ) {
              return data.name ? `${data.company.name} - ${data.name}` : data.company.name
            }
            return data.name || 'Unnamed Recipient'
          },
        ],
      },
    },
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'role',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      type: 'email',
      required: false,
    },
    {
      name: 'company',
      type: 'group',
      admin: {
        condition: () => true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
