import { gql, useMutation } from '@apollo/client'
import { AddRecipeMutation, AddRecipeMutationVariables } from 'lib/generated'
import type { NextPage } from 'next'
import React, { useState } from 'react'

const mutation = gql`
  mutation addRecipe($url: String!) {
    addRecipe(url: $url) {
      slug
    }
  }
`

const Add: NextPage = () => {
  const [url, setURL] = useState('')

  const [addRecipe] = useMutation<
    AddRecipeMutation,
    AddRecipeMutationVariables
  >(mutation, {
    onCompleted: (data) => {
      console.log('YOU DID IT', data)
    },
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    addRecipe({
      variables: {
        url,
      },
    })
  }
  return (
    <div>
      <div>Add</div>
      <form onSubmit={onSubmit}>
        <input
          className="border"
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
      </form>
    </div>
  )
}

export default Add
