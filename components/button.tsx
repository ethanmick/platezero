import cx from 'classnames'
import Link from 'next/link'
import { URL } from 'url'

const classes = {
  secondary:
    'inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
  primary:
    'inline-flex items-center px-5 py-2 border border-transparent font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-cyan-500 to-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition disabled:opacity-50',
}

export type Props = {
  href?: URL | string
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const Button = ({ className, type, ...rest }: Props) => {
  return (
    <button
      type={type || 'button'}
      className={cx(classes['primary'], className)}
      {...rest}
    />
  )
}

export const ButtonLink = ({ href, children }: any) => {
  return (
    <Link href={href}>
      <a className={classes['primary']} role="button">
        {children}
      </a>
    </Link>
  )
}
