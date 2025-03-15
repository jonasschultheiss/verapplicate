type RecipientProps = {
  name?: string
  role?: string
  email?: string
  company: {
    name: string
    street: string
    postalCode: string
    city: string
  }
}

export const Recipient: React.FC<RecipientProps> = ({
  name,
  role,
  email,
  company,
}): JSX.Element => {
  return (
    <div className="flex flex-col">
      <pre className="text-xs font-bold">To:</pre>
      <div className="text-sm text-gray-800">
        {name && <p>{name}</p>}
        {role && <p>{role}</p>}
        {email && <p>{email}</p>}
        <p>{company.name}</p>
        <p>{company.street}</p>
        <p>{`${company.postalCode} ${company.city}`}</p>
      </div>
    </div>
  )
}
