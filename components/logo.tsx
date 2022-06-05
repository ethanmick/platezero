import cx from 'classnames'

type Props = {
  className?: string
}

export const Logo = ({ className = 'text-2xl' }: Props) => (
  <span className={cx('font-light text-sky-500', className)}>PlateZero</span>
)
