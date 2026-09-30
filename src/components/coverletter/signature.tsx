import Image from 'next/image'

import type { LetterImage } from '@/utilities/loadCoverLetter'

type InfoProps = {
  signature: LetterImage
  name: string
  text: string
}

export const Signature: React.FC<InfoProps> = ({ name, text, signature }) => {
  return (
    <div className="font-serif text-gray-800">
      <p className="font-medium ">{text},</p>
      <Image
        quality={100}
        src={signature}
        width={100}
        alt={`a signature of ${name}`}
        className="my-1"
      />
      <p className="text-sm">{name}</p>
    </div>
  )
}
