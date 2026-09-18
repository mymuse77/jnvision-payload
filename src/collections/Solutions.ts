import type { Access, CollectionConfig } from 'payload'

const isEditor: Access = ({ req: { user } }) => Boolean(user)

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'sector', 'updatedAt'] },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'sector', type: 'select', required: true, options: ['能源行业', '公共安全', '智能制造'] },
    { name: 'eyebrow', type: 'text' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'highlights', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'order', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
