import type { Access, CollectionConfig } from 'payload'

const isEditor: Access = ({ req: { user } }) => Boolean(user)

export const Insights: CollectionConfig = {
  slug: 'insights',
  labels: { singular: '资讯', plural: '资讯与案例' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'topic', 'publishedAt'] },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'title', label: '标题', type: 'text', required: true },
    { name: 'topic', label: '栏目', type: 'text', required: true },
    { name: 'publishedAt', label: '发布时间', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'excerpt', label: '内容摘要', type: 'textarea', required: true },
    {
      name: 'body',
      label: '正文',
      type: 'richText',
      required: false,
      admin: { description: '可选；未填写时详情页会展示内容摘要。' },
    },
    { name: 'featured', label: '首页推荐', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
