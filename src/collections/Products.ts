import type { Access, CollectionConfig } from 'payload'

const isEditor: Access = ({ req: { user } }) => Boolean(user)

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: '产品', plural: '产品中心' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'updatedAt'] },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'title', label: '产品名称', type: 'text', required: true },
    { name: 'englishTitle', label: '英文名称', type: 'text' },
    { name: 'category', label: '产品分类', type: 'text', required: true },
    { name: 'summary', label: '产品简介', type: 'textarea', required: true },
    { name: 'capabilities', label: '核心能力', type: 'array', labels: { singular: '能力', plural: '能力' }, fields: [{ name: 'text', label: '能力说明', type: 'text', required: true }] },
    { name: 'order', label: '显示顺序', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
