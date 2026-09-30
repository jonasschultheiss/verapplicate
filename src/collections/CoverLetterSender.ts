import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const CoverLetterSender: CollectionConfig = {
  slug: 'cover-letter-senders',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Cover Letter',
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
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'place',
      type: 'text',
      required: true,
    },
    {
      name: 'closing',
      type: 'text',
      required: true,
      admin: {
        description: 'the words before the signature, the component still adds the comma',
      },
    },
    {
      name: 'signature',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
