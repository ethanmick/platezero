import cx from 'classnames'
import { forwardRef } from 'react'

type TextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

type Props = TextareaProps & {
  label: string
}

export const FormTextarea = forwardRef<any, Props>(function FormInput(
  { className, name, label, ...rest },
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
      <textarea
        className={cx(
          'block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm',
          className
        )}
        ref={ref}
        name={name}
        id={name}
        {...rest}
      />
    </div>
  )
})
