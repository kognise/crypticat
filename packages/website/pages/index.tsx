import { useState } from 'react'
import { CrypticatClient } from '@crypticat/core'

import Box from '../components/box'
import Text from '../components/text'
import Input from '../components/input'
import Button from '../components/button'

export default () => {
  const [address, setAddress] = useState('ws://localhost:8080')
  const [client, setClient] = useState<CrypticatClient | null>(null)
  const [connecting, setConnecting] = useState(false)

  return (
    <Box flex direction='column' fullHeight>
      <Box $='header' flex background='header' px={24} py={16}>
        <Text $='h1' weight={700} color='heading-primary' mr={8}>
          crypticat
        </Text>
        <Text color='heading-secondary'>
          dead simple secure chat
        </Text>
      </Box>

      <Box flex direction='column' expand background='chat' align='center' justify='center' p={24}>
        <Text size='lg' weight={700} color='heading-primary' centered mb={16}>
          Connect to a server
        </Text>

        <Text color='heading-secondary' centered>
          Get started by choosing a server to connect to. This will be saved when you visit the site in the future.
        </Text>

        <Box flex fullWidth justify='center' mt={32}>
          <Input placeholder='WebSocket address' value={address} onChange={setAddress} mr={16} />
          <Button onClick={async () => {
            if (connecting) return
            const newClient = new CrypticatClient()
            setConnecting(true)
            await newClient.connect(address)
            setConnecting(false)
            setClient(newClient)
          }} disabled={!address || connecting}>Connect</Button>
        </Box>
      </Box>
    </Box>
  )
}