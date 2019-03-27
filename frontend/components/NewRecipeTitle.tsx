import React from 'react'
import { FormGroup, Input, Label } from 'reactstrap'

export interface Props {
  value: string
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
}

export const NewRecipeTitle = ({ value, onChange }: Props) => (
  <FormGroup>
    <Label for="title" className="m-0">
      <strong>Title</strong>
    </Label>
    <Input
      type="text"
      name="title"
      id="title"
      required
      autoFocus={true}
      tabIndex={1}
      value={value}
      onChange={onChange}
    />
  </FormGroup>
)