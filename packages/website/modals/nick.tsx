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
  setNick: (newNick: string) => void
}

export default ({ show, close, setNick }: Props) => {
  const [tempNick, setTempNick] = useState('')

  return (
    <Modal
      isOpen={show}
      onRequestClose={close}
      onAfterClose={() => setTempNick('')}
      portalClassName='ReactModalPortal dark-theme'
      className='ReactModal__Content'
      overlayClassName='ReactModal__Overlay'
      closeTimeoutMS={200}
    >
      <Text $='h1' weight={700} color='heading-primary' uppercase mt={4} mb={24} noInteraction>
        Change nickname
      </Text>

      <form onSubmit={(event) => {
        event.preventDefault()
        setNick(tempNick)
        close()
      }}>
        <Input autoFocus placeholder='New nickname' value={tempNick} onChange={setTempNick} mb={24} />

        <Box flex justify='flex-end'>
          <Button onClick={close} color='ghost' mr={16}>Cancel</Button>
          <Button submit disabled={!tempNick}>Update</Button>
        </Box>
      </form>
    </Modal>
  )
}