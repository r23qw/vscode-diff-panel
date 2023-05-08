type MessageType = 'command' | 'diff-content'

export interface BaseMessage<P> {
  type: MessageType
  payload: P
}

export interface CommandMessage extends BaseMessage<string[]> {
  type: 'command'
  command: string
  payload: string[]
}

export interface DiffContentMessage extends BaseMessage<string> {
  type: 'diff-content'
  leftOrRight: 'left' | 'right'
  payload: string
}

export type Message = CommandMessage | DiffContentMessage
