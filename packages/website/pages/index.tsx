import Head from 'next/head'
import { useState, useEffect, useRef, FormEvent } from 'react'
import { CrypticatClient } from '@crypticat/core'
import createUid from 'uid-promise'
import { useOnlineState } from '../lib/hooks'

import NickIcon from '@crypticat/ionicons/lib/at-outline'
import RoomIcon from '@crypticat/ionicons/lib/swap-horizontal-outline'
import JoinIcon from '@crypticat/ionicons/lib/arrow-forward-outline'
import LeaveIcon from '@crypticat/ionicons/lib/arrow-back-outline'
import OfflineIcon from '@crypticat/ionicons/lib/cloud-offline'

import Markdown, { InlineTypes } from '../components/markdown'
import Box from '../components/box'
import Text from '../components/text'
import Input from '../components/input'
import Button from '../components/button'
import ChatInput from '../components/chat-input'
import IconButton from '../components/icon-button'
import TypingIndicator, { TypingUser } from '../components/typing-indicator';

import NickModal from '../modals/nick'
import RoomModal from '../modals/room'

interface MessageGroup {
  nick: string | null
  userUid: string
  uid: string
  you: boolean
  messages: {
    content: string
    uid: string
  }[]
}

interface JoinOrLeave {
  uid: string
  userUid: string
  nick: string | null
  joined: boolean
}

const isJol = (thing: any): thing is JoinOrLeave => thing.uid && thing.userUid && !thing.messages && !thing.content && thing.joined !== undefined
const isMessageGroup = (thing: any): thing is MessageGroup => thing.uid && thing.userUid && thing.you !== undefined && thing.messages

const markdownInnerAllowed: InlineTypes[] = [
  'text',
  'backticks',
  'emphasis',
  'link',
  'strikethrough'
]

export default () => {
  const isOnline = useOnlineState()

  const [address, setAddress] = useState('wss://u.kognise.dev')
  const [client, setClient] = useState<CrypticatClient | null>(null)
  const [connecting, setConnecting] = useState(false)

  const [nick, setNick] = useState<string | null>(null)
  const [room, setRoom] = useState('lobby')
  const [messageGroups, setMessageGroups] = useState<(MessageGroup | JoinOrLeave)[]>([])
  const [missed, setMissed] = useState(0)

  const [showNickModal, setShowNickModal] = useState(false)
  const [showRoomModal, setShowRoomModal] = useState(false)

  const [typing, setTyping] = useState(false)

  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  // Store a ref to a certain element so we can easily scroll
  // to the bottom of the chat window.
  const scrollBottomRef = useRef<HTMLDivElement>(null)

  const joinRoom = async (newRoom: string, thisClient: CrypticatClient | null = client) => {
    setMessageGroups([])
    setMissed(0)
    if (!thisClient) return setRoom('lobby')
    if (newRoom.startsWith('#')) newRoom = newRoom.slice(1)
    await thisClient.joinRoom(newRoom)
    setRoom(newRoom)
  }

  const addMessage = async (userUid: string, nick: string | null, content: string, you: boolean) => {
    const uid = await createUid(8)

    setMessageGroups((messageGroups) => {
      const last = messageGroups[messageGroups.length - 1]
      if (last?.userUid === userUid && isMessageGroup(last)) {
        return messageGroups.slice(0, -1).concat([
          {
            ...last,
            messages: last.messages.concat([
              { content, uid }
            ])
          }
        ])
      } else {
        return messageGroups.concat([
          {
            nick, you,
            messages: [{ content, uid }],
            uid, userUid
          }
        ])
      }
    })

    scrollBottomRef.current?.scrollIntoView()
    if (document.hidden) setMissed((missed) => missed + 1)
  }

  const addJol = async (userUid: string, nick: string | null, joined: boolean) => {
    const uid = await createUid(8)

    setMessageGroups((messageGroups) => messageGroups.concat([
      { uid, userUid, nick, joined }
    ]))

    scrollBottomRef.current?.scrollIntoView()
    if (document.hidden) setMissed((missed) => missed + 1)
  }

  // Update unread message count when a message is recieved
  // and the tab is unfocused. Clear the count when the tab
  // is focused again.
  useEffect(() => {
    const address = localStorage.getItem('address')
    const nick = localStorage.getItem('nick')

    if (address) setAddress(address)
    if (nick) setNick(nick)

    const listener = () => { if (!document.hidden) setMissed(0) }
    document.addEventListener('visibilitychange', listener)
    return () => document.removeEventListener('visibilitychange', listener)
  }, [])

  // Store the nickname in local storage.
  useEffect(() => {
    client?.setNick(nick)
    if (nick) {
      localStorage.setItem('nick', nick)
    } else {
      localStorage.removeItem('nick')
    }
  }, [client, nick])

  // Store the server address in local storage.
  useEffect(() => localStorage.setItem('address', address), [address])

  // Set the room and add listeners when the client changes.
  useEffect(() => {
    if (!client) return
    setRoom('lobby')

    client.on('message', (userUid, nick, content) => addMessage(userUid, nick, content, false))

    client.on('typing', (userUid: string, nick: string | null) => {
      if (typeof nick === 'string') {
        setTypingUsers((typingUsers) => [ ...typingUsers, { nick, id: userUid }])
      }
    })

    client.on('stopTyping', (userUid: string, nick: string | null) => {
      if (typeof nick === 'string') {
        setTypingUsers((typingUsers) => {
          return typingUsers.filter(({ id }) => id != userUid)
        })
      }
    })
  
    client.on('connect', async (userUid, nick) => addJol(userUid, nick, true))
    client.on('disconnect', async (userUid, nick) => addJol(userUid, nick, false))
    
    client.on('close', () => setClient(null))
  
    return () => { client.removeAllListeners() }
  }, [client])

  // Close the client when the user goes offline.
  useEffect(() => {
    if (!isOnline) client?.close()
  }, [isOnline])

  if (!isOnline) {
    return (
      <Box flex direction='column' fullHeight>
        <Head>
          <title>disconnected</title>
        </Head>

        <Box $='header' flex background='header' px={24} py={16}>
          <Text $='h1' weight={700} color='heading-primary' mr={8} noInteraction>
            internet disconnected
          </Text>
        </Box>

        <Box flex direction='column' expand background='chat' align='center' justify='center' p={24}>
          <Box mb={16}>
            <Text color='text-muted' size={5}>
              <OfflineIcon display='block' fill='currentColor' />
            </Text>
          </Box>

          <Text size='lg' weight={700} color='heading-primary' centered mb={16} noInteraction>
            You're offline!
          </Text>

          <Text color='heading-secondary' centered noInteraction>
            Crypticat should automatically refresh when your internet connection returns.
          </Text>
        </Box>
      </Box>
    )
  }

  if (!client) {
    return (
      <Box flex direction='column' fullHeight>
        <Head>
          <title>crypticat</title>
        </Head>

        <Box $='header' flex background='header' px={24} py={16}>
          <Text $='h1' weight={700} color='heading-primary' mr={8} noInteraction>
            crypticat
          </Text>
          <Text color='heading-secondary' noInteraction>
            dead simple secure chat
          </Text>
        </Box>

        <Box flex direction='column' expand background='chat' align='center' justify='center' p={24}>
          <Text size='lg' weight={700} color='heading-primary' centered mb={16} noInteraction>
            Connect to a server
          </Text>

          <Text color='heading-secondary' centered noInteraction>
            Get started by choosing a server to connect to. This will be saved when you visit the site in the future.
          </Text>

          <Box $='form' flex fullWidth justify='center' mt={32} onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()

            if (connecting) return
            const newClient = new CrypticatClient()
            setConnecting(true)
            await newClient.connect(address)
            newClient.setNick(nick)
            await joinRoom('lobby', newClient)

            setConnecting(false)

            setClient(newClient)
            if (!nick) setShowNickModal(true)
          }}>
            <Input placeholder='WebSocket address' value={address} onChange={setAddress} mr={16} />
            <Button submit disabled={!address || connecting}>Connect</Button>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box flex direction='column' fullHeight>
      <Head>
        <title>{missed ? `(${missed}) ` : ''}#{room}</title>
      </Head>

      <NickModal
        show={showNickModal}
        close={() => setShowNickModal(false)}
        setNick={setNick}
      />
      <RoomModal
        show={showRoomModal}
        close={() => setShowRoomModal(false)}
        setRoom={joinRoom}
      />

      <Box $='header' flex background='header' align='center' px={24}>
        <Text size={1.375} color='text-muted' mr={8} noInteraction>
          #
        </Text>

        <Box py={16} expand>
          <Text color='heading-primary' weight={700} noInteraction>
            {room}
          </Text>
        </Box>

        <Box flex>
          <IconButton icon={NickIcon} onClick={() => setShowNickModal(true)} mr={8} />
          <IconButton icon={RoomIcon} onClick={() => setShowRoomModal(true)} />
        </Box>
      </Box>

      <Box $='main' flex direction='column' expand background='chat' px={24} py={16} scrollfix>
        <Box mb={54} expand='1 1 auto' flex justify='flex-end' direction='column'>
          <Text size='lg' weight={700} color='heading-primary' mb={16} noInteraction>
            Welcome to #{room}
          </Text>

          <Text color='heading-secondary' noInteraction>
            All of your messages are encrypted to the highest standards, and nothing is stored.
          </Text>
        </Box>

        {messageGroups.map((messageGroup) => {
          if (isMessageGroup(messageGroup)) {
            const { nick, messages, uid, you } = messageGroup
            return (
              <Box mb={16} key={uid}>
                <Text weight={500} color={you ? 'yellow' : 'blue'}>{nick ?? 'unnicked'}</Text>
                {messages.map(({ content, uid }) => (
                  <Text color='text-normal' mt={4} key={uid} $='div'>
                    <Markdown
                      className='message-markdown'
                      inlineAllowed={markdownInnerAllowed}
                      linkify={true}
                      text={content}
                    />
                  </Text>
                ))}
              </Box>
            )
          } else if (isJol(messageGroup)) {
            const { uid, nick, joined } = messageGroup
            const Icon = joined ? JoinIcon : LeaveIcon
            return (
              <Box flex mb={16} key={uid} align='center'>
                <Text color='heading-primary' size={2}><Icon display='block' /></Text>
                <Text color='text-normal' ml={8}>
                  {nick ? (<Text $='span' color='blue'>{nick}</Text>) : 'Someone'} {joined ? 'joined' : 'left'} the room
                </Text>
              </Box>
            )
          }
        })}

        <div aria-hidden ref={scrollBottomRef} />
      </Box>
      <TypingIndicator typingUsers={typingUsers}/>
      <ChatInput room={room} onSend={async (content) => {
        client.sendMessage(content)
        addMessage('_', nick ?? 'unnicked', content, true)
        setTyping(false)
        client.stopTyping()
      }} onType={(empty) => {
        if(empty === true && typing === true) {
          client.stopTyping()
          setTyping(false)
        } else if(empty === false && typing === false) {
          client.startTyping()
          setTyping(true)
        }
      }}/>
    </Box>
  )
}