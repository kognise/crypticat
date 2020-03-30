import { useState } from 'react'
import Modal from 'react-modal'

import Box from '../components/box'
import Text from '../components/text'
import Input from '../components/input'
import Button from '../components/button'

Modal.setAppElement('#__next')

interface Props {
  show: boolean
  close: () => void
  setRoom: (newRoom: string) => Promise<void>
}

export default ({ show, close, setRoom }: Props) => {
  const [tempRoom, setTempRoom] = useState('')
  const [joining, setJoining] = useState(false)

  return (
    <Modal
      isOpen={show}
      onRequestClose={close}
      onAfterClose={() => setTempRoom('')}
      portalClassName='ReactModalPortal dark-theme'
      className='ReactModal__Content'
      overlayClassName='ReactModal__Overlay'
      closeTimeoutMS={200}
    >
      <Text $='h1' weight={700} color='heading-primary' uppercase mt={4} mb={24} noInteraction>
        Join a room
      </Text>

      <form onSubmit={async (event) => {
        event.preventDefault()
        setJoining(true)
        await setRoom(tempRoom)
        setJoining(false)
        close()
      }}>
        <Input autoFocus placeholder='Room name (eg. #random)' value={tempRoom} onChange={setTempRoom} mb={24} />

        <Box flex justify='flex-end'>
          <Button onClick={close} color='ghost' mr={16}>Cancel</Button>
          <Button submit disabled={!tempRoom || joining}>Join</Button>
        </Box>
      </form>
    </Modal>
  )
}