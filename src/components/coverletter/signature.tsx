import Image, { StaticImageData } from 'next/image';

type InfoProps = {
  signature: StaticImageData;
  name: string;
  text: string;
};

export const Signature: React.FC<InfoProps> = ({ name, text, signature }): JSX.Element => {
  return (
    <div className="font-serif text-gray-800">
      <p className="font-medium ">{text},</p>
      <Image quality={100} src={signature} width={100} alt={`a signature of ${name}`} className="my-1" />
      <p className="text-sm">{name}</p>
    </div>
  );
};
