import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '网站信息',
  access: { read: () => true },
  fields: [
    { name: 'companyName', label: '公司名称', type: 'text', required: true, defaultValue: '北京捷诺视讯数码科技有限公司' },
    { name: 'heroTitle', label: '首页主标题', type: 'text', required: true, defaultValue: '让每一个复杂场景，都拥有清晰的数字视野' },
    { name: 'companyIntro', label: '公司简介', type: 'textarea', required: true, defaultValue: '公司成立于1997年，注册资金1500万，是国内领先的智能化软件平台开发商和解决方案提供商。' },
    { name: 'phone', label: '联系电话', type: 'text', required: true, defaultValue: '010-58851134/5/6/7/8' },
    { name: 'fax', label: '传真', type: 'text', defaultValue: '010-58851134-209' },
    { name: 'address', label: '公司地址', type: 'text', required: true, defaultValue: '北京市海淀区上地东路一号盈创动力E座504室' },
    { name: 'icp', label: 'ICP备案号', type: 'text', defaultValue: '京ICP备14042411号-1' },
  ],
}
