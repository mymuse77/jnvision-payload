import type { Access, CollectionConfig } from 'payload'

const isEditor: Access = ({ req: { user } }) => Boolean(user)

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: '咨询线索', plural: '咨询线索' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'phone', 'email', 'createdAt'] },
  access: { create: () => true, read: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'name', label: '姓名', type: 'text', required: true },
    { name: 'phone', label: '联系电话', type: 'text', required: true },
    { name: 'email', label: '电子邮箱', type: 'email' },
    { name: 'message', label: '需求描述', type: 'textarea', required: true },
    { name: 'status', label: '跟进状态', type: 'select', defaultValue: 'new', options: [{ label: '新咨询', value: 'new' }, { label: '跟进中', value: 'contacted' }, { label: '已完成', value: 'closed' }] },
  ],
}
