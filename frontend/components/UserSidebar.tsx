import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalFooter,
  Button,
  Spinner,
  ModalBody,
  FormGroup,
  FormText,
  Input,
  Label,
  ModalHeader
} from 'reactstrap'
import { IfLoggedIn } from './IfLoggedIn'
import { AlertErrors } from './AlertErrors'
import { EditableImage } from './EditableImage'
import { ProfilePicture } from './ProfilePicture'
import { api, getErrorMessages } from '../common/http'
import { UserJSON } from '../models'

export const UserSidebar = (props: { user: UserJSON }) => {
  const [user, setUser] = useState(props.user)
  const [avatarErrors, setAvatarErrors] = useState([])
  const [isEditOpen, setEditOpen] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [isSaving, setSaving] = useState(false)
  const [editErrors, setEditErrors] = useState([])

  useEffect(() => {
    setUser(props.user)
  }, [props.user])

  const onAvatarChange = async (avatar_url: string) => {
    setAvatarErrors([])
    try {
      const newUser = await api.updateUser({ avatar_url })
      setUser(newUser)
    } catch (err) {
      setAvatarErrors(getErrorMessages(err))
    }
  }

  const toggleEdit = () => setEditOpen(!isEditOpen)

  const saveDisplayName = async () => {
    setSaving(true)
    setEditErrors([])
    try {
      const newUser = await api.updateUser({ name: name || null })
      setUser(newUser)
      setEditOpen(false)
    } catch (err) {
      setEditErrors(getErrorMessages(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="mb-3 text-center">
        <ProfilePicture size={128} img={user.avatar_url} />
        <IfLoggedIn username={user.username}>
          <EditableImage
            hasExisting={!!user.avatar_url}
            onUpdate={onAvatarChange}
          />
          <AlertErrors errors={avatarErrors} />
        </IfLoggedIn>
      </div>
      {user.name && (
        <div className="text-truncate" style={{ fontSize: '1.25rem' }}>
          <strong title={user.name}>{user.name}</strong>
        </div>
      )}
      <div
        className="text-muted mb-3 text-truncate"
        style={{ fontSize: '1.25rem' }}
      >
        <span title={user.username}>{user.username}</span>
      </div>
      <IfLoggedIn username={user.username}>
        <Button
          block
          outline
          color="primary"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          Change Name&hellip;
        </Button>
        <Modal isOpen={isEditOpen} toggle={toggleEdit}>
          <ModalHeader toggle={toggleEdit}>Change Display Name</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Display Name</Label>
              <Input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <FormText>
                If you add a display name, it will appear instead of your
                username across PlateZero.
              </FormText>
            </FormGroup>
            <AlertErrors errors={editErrors} />
          </ModalBody>
          <ModalFooter>
            <Button
              color="link"
              className="text-secondary"
              onClick={toggleEdit}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              outline
              onClick={saveDisplayName}
              disabled={isSaving}
            >
              {isSaving && <Spinner size="sm" />} Save Changes
            </Button>
          </ModalFooter>
        </Modal>
      </IfLoggedIn>
    </>
  )
}
