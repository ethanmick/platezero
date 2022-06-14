import cx from 'classnames'
import { forwardRef } from 'react'

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type Props = InputProps & {
  label: string
}

export const FormInput = forwardRef<any, Props>(function FormInput(
  { className, name, type, label, ...rest },
  ref
) {
  return (
    <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-neutral-900 focus-within:border-neutral-600">
      <label
        htmlFor={name}
        className="block text-xs font-medium text-neutral-700"
      >
        {label}
      </label>
      <input
        className={cx(
          'block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm',
          className
        )}
        ref={ref}
        type={type}
        name={name}
        id={name}
        {...rest}
      />
    </div>
  )
})
