import type { Access, CollectionConfig } from 'payload'

const isEditor: Access = ({ req: { user } }) => Boolean(user)

export const Insights: CollectionConfig = {
  slug: 'insights',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'topic', 'publishedAt'] },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'topic', type: 'text', required: true },
    { name: 'publishedAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'body', type: 'richText', required: true },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
