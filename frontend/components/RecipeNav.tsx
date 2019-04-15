import React, { useState, useContext } from 'react'
import Router from 'next/router'
import {
  Alert,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'

import { RecipeJSON } from '../models/recipe'
import { UserContext } from '../context/UserContext'
import { PlateZeroApiError, api } from '../common/http'
import { IfLoggedIn } from './IfLoggedIn'
import { Link } from '../routes'

export const RecipeNav = ({
  recipe,
  route
}: {
  recipe: RecipeJSON
  route: string
}) => {
  const baseURL = `/${recipe.owner.username}/${recipe.slug}`
  return (
    <Nav tabs className="mb-3">
      <NavItem>
        <Link route={baseURL} passHref>
          <NavLink active={route === '/recipe'}>Recipe</NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link route={`${baseURL}/history`} passHref>
          <NavLink active={route === '/recipe-history'}>History</NavLink>
        </Link>
      </NavItem>
      <IfLoggedIn username={recipe.owner.username}>
        <ActionMenu recipe={recipe} />
      </IfLoggedIn>
    </Nav>
  )
}

const ActionMenu = ({ recipe }: { recipe: RecipeJSON }) => {
  const [isOpen, setOpen] = useState(false)
  const [isRenameModalOpen, setRenameModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  return (
    <>
      <Dropdown
        nav
        isOpen={isOpen}
        toggle={() => setOpen(!isOpen)}
        className="ml-auto"
      >
        <DropdownToggle nav caret onClick={() => setOpen(true)}>
          Actions
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => setRenameModalOpen(true)}>
            Edit Title and Description
          </DropdownItem>
          <DropdownItem
            href={`/${recipe.owner.username}/${
              recipe.slug
            }/branches/master/edit`}
          >
            Update Recipe
          </DropdownItem>
          <DropdownItem
            onClick={() => setDeleteModalOpen(true)}
            className="text-danger"
          >
            Delete Recipe&hellip;
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <RenameModal
        isOpen={isRenameModalOpen}
        recipe={recipe}
        toggle={() => setRenameModalOpen(!isRenameModalOpen)}
        close={() => setRenameModalOpen(false)}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        recipe={recipe}
        toggle={() => setDeleteModalOpen(!isDeleteModalOpen)}
        close={() => setDeleteModalOpen(false)}
      />
    </>
  )
}

const DeleteModal = ({
  recipe,
  isOpen,
  toggle,
  close
}: {
  recipe: RecipeJSON
  isOpen: boolean
  toggle: () => void
  close: () => void
}) => {
  const { user } = useContext(UserContext)
  const handleDelete = async () => {
    try {
      await api.deleteRecipe(recipe.slug)
    } catch {}
    Router.push(`/${user.username}`)
  }
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalBody>
        <h5>Permanently delete {recipe.title}</h5>
        <p>
          Are you sure you want to permanently delete{' '}
          <strong>{recipe.title}</strong>?
        </p>
        <Button color="danger" block onClick={handleDelete}>
          Yes, delete it forever
        </Button>
        <Button
          color="link"
          className="text-muted"
          outline
          block
          onClick={close}
        >
          Never mind, keep it for now
        </Button>
      </ModalBody>
    </Modal>
  )
}

const RenameModal = ({
  recipe,
  isOpen,
  toggle,
  close
}: {
  recipe: RecipeJSON
  isOpen: boolean
  toggle: () => void
  close: () => void
}) => {
  const [title, setTitle] = useState(recipe.title)
  const [subtitle, setSubtitle] = useState(recipe.subtitle || '')
  const [description, setDescription] = useState(recipe.description || '')
  const [errors, setErrors] = useState([])
  const handleSave = async () => {
    const patch = { title, subtitle, description }
    setErrors([])
    try {
      await api.patchRecipe(recipe.slug, patch)
      Router.push(`/${recipe.owner.username}/${recipe.slug}`)
    } catch (e) {
      if (e instanceof PlateZeroApiError) {
        setErrors(e.messages)
      } else {
        setErrors([e])
      }
    }
  }
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalBody>
        <FormGroup>
          <Label>Recipe Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Subtitle</Label>
          <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <Input
            type="textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </FormGroup>
        {errors.map((e, key) => (
          <Alert color="danger" key={key}>
            {e}
          </Alert>
        ))}
        <Button color="success" block onClick={handleSave}>
          Save
        </Button>
        <Button
          color="link"
          className="text-muted"
          outline
          block
          onClick={close}
        >
          Never mind
        </Button>
      </ModalBody>
    </Modal>
  )
}