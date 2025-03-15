import React from 'react'
import '../print.css'

export const metadata = {
  title: 'Cover Letter',
  description: 'Your personalized cover letter',
}

export default function CoverLetterLayout({ children }: { children: React.ReactNode }) {
  return <div className="cover-letter-layout">{children}</div>
}
