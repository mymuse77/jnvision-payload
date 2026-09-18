import type { Access, CollectionConfig } from 'payload'

const isEditor: Access = ({ req: { user } }) => Boolean(user)

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'phone', 'email', 'createdAt'] },
  access: { create: () => true, read: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'status', type: 'select', defaultValue: 'new', options: [{ label: '新咨询', value: 'new' }, { label: '跟进中', value: 'contacted' }, { label: '已完成', value: 'closed' }] },
  ],
}
