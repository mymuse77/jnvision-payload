import type { Access, CollectionConfig } from 'payload'

const isEditor: Access = ({ req: { user } }) => Boolean(user)

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'updatedAt'] },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'englishTitle', type: 'text' },
    { name: 'category', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'capabilities', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'order', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
