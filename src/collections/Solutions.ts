import type { Access, CollectionConfig } from 'payload'

const isEditor: Access = ({ req: { user } }) => Boolean(user)

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: { singular: '解决方案', plural: '解决方案' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'sector', 'updatedAt'] },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'title', label: '方案名称', type: 'text', required: true },
    { name: 'sector', label: '业务领域', type: 'select', required: true, options: ['能源行业', '公共安全', '智能制造'] },
    { name: 'eyebrow', label: '辅助标题', type: 'text' },
    { name: 'summary', label: '方案简介', type: 'textarea', required: true },
    { name: 'highlights', label: '核心亮点', type: 'array', labels: { singular: '亮点', plural: '亮点' }, fields: [{ name: 'text', label: '亮点内容', type: 'text', required: true }] },
    { name: 'order', label: '显示顺序', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
  ],
}
