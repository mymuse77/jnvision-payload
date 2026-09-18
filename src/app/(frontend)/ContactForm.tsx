'use client'

import { FormEvent, useState } from 'react'

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setState('sending')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('submit failed')
      form.reset()
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field-row">
        <label><span>姓名 *</span><input name="name" autoComplete="name" required /></label>
        <label><span>电话 *</span><input name="phone" type="tel" autoComplete="tel" required /></label>
      </div>
      <label><span>联系邮箱</span><input name="email" type="email" autoComplete="email" /></label>
      <label><span>项目需求 *</span><textarea name="message" rows={5} required /></label>
      <button className="submit-button" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? '正在提交…' : '提交咨询'} <span>↗</span>
      </button>
      <p className={`form-state ${state}`} aria-live="polite">
        {state === 'success' && '信息已提交，团队会尽快与您联系。'}
        {state === 'error' && '暂时无法提交，请拨打 010-58851134 联系团队。'}
      </p>
    </form>
  )
}
