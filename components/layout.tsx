import cx from 'classnames'

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>

export const Main = ({ className, ...rest }: Props) => {
  return (
    <main
      className={cx('mx-auto container p-2', className)}
      tabIndex={-1}
      {...rest}
    />
  )
}
