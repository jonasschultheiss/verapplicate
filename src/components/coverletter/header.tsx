import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid'
import Image, { StaticImageData } from 'next/image'

type HeaderProps = {
  name: string
  phoneNumber: string
  email: string
  address: string
  image: StaticImageData
}

export const Header: React.FC<HeaderProps> = ({
  name,
  phoneNumber,
  email,
  address,
  image,
}): JSX.Element => {
  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div className="flex flex-col items-start justify-start">
        <h1 className="mb-4 text-3xl font-bold">{name}</h1>
        <div className="flex flex-row items-stretch justify-start w-full text-xs gap-x-2">
          <h4 className="inline-flex flex-row items-center justify-start text-gray-800 gap-x-1">
            <PhoneIcon className="w-4 h-4" />
            {phoneNumber}
          </h4>
          <p className="text-gray-800">|</p>
          <h4 className="inline-flex flex-row items-center justify-start text-gray-800 gap-x-1">
            <EnvelopeIcon className="w-4 h-4" />
            {email}
          </h4>
          <p className="text-gray-800">|</p>
          <h4 className="inline-flex flex-row items-center justify-start text-gray-800 gap-x-1">
            <MapPinIcon className="w-4 h-4" />
            {address}
          </h4>
        </div>
      </div>
      <Image quality={100} src={image} alt={`image of ${name}`} width={100} />
    </div>
  )
}
