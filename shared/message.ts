type MessageType = 'command'

export interface BaseMessage<P> {
  type: MessageType
  payload: P
}

export interface CommandMessage extends BaseMessage<unknown> {
  type: 'command'
  command: string
  payload: any[]
}

export type Message = CommandMessage
