type InfoProps = {
  place: string
}

export const Info: React.FC<InfoProps> = ({ place }) => {
  return (
    <p className="text-sm text-gray-800">
      {place}, {new Date().toLocaleDateString('de-CH')}
    </p>
  )
}
