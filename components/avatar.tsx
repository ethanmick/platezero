import Image from 'next/image'

type Props = {
  src: string
}

export const Avatar = ({ src }: Props) => {
  return (
    <Image
      className="inline-block h-6 w-6 rounded-full"
      src={src}
      alt="Avatar"
    />
  )
}
