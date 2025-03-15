import React from 'react'
import RichText from '@/components/RichText'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type BodyProps = {
  title: string
  subTitle: string
  body: string | object
}

export const Body: React.FC<BodyProps> = ({ title, subTitle, body }): React.ReactElement => {
  // Parse the body content if it's a string that might be JSON
  let richTextContent: any = body

  if (typeof body === 'string') {
    try {
      // Check if the string is JSON and parse it
      if (body.trim().startsWith('{')) {
        richTextContent = JSON.parse(body)
      } else {
        // If it's a plain text, split by newlines for simple rendering
        const textLines = body.split('\n')
        return (
          <div className="flex flex-col font-serif">
            <h2 className="mt-2 mb-2 text-2xl font-semibold">{title}</h2>
            <h3 className="mb-1 text-lg font-medium text-gray-800">{subTitle}</h3>
            {textLines.map((line, index) => (
              <p className="text-sm text-justify text-gray-800" key={index}>
                {line}
              </p>
            ))}
          </div>
        )
      }
    } catch (error) {
      console.error('Failed to parse rich text content:', error)
      // Fallback to displaying the string as is
      return (
        <div className="flex flex-col font-serif">
          <h2 className="mt-2 mb-2 text-2xl font-semibold">{title}</h2>
          <h3 className="mb-1 text-lg font-medium text-gray-800">{subTitle}</h3>
          <p className="text-sm text-justify text-gray-800">{body}</p>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col font-serif">
      <h2 className="mt-2 mb-2 text-2xl font-semibold">{title}</h2>
      <h3 className="mb-1 text-lg font-medium text-gray-800">{subTitle}</h3>
      <div className="text-sm text-justify text-gray-800">
        <RichText
          data={richTextContent as DefaultTypedEditorState}
          enableGutter={false}
          enableProse={false}
          className="text-sm text-justify"
        />
      </div>
    </div>
  )
}
