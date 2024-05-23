import { ChatList } from './chat-list';
import ChatTopbar from './chat-topbar';
import { Message, UserData } from './data';
import React from 'react';

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
  showTopbar?: boolean;
  handlewNewMessage?: (newMessage: Message) => void;
}

export function Chat({
  messages,
  selectedUser,
  isMobile,
  showTopbar = true,
  handlewNewMessage,
}: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>(
    messages ?? []
  );

  const sendMessage = (newMessage: Message) => {
    setMessages([...messagesState, newMessage]);
    if (handlewNewMessage) {
      handlewNewMessage(newMessage);
    }
  };

  return (
    <div className='flex flex-col justify-between w-full h-full bg-gray-100 p-2 py-3 rounded-2xl'>
      {showTopbar && <ChatTopbar selectedUser={selectedUser} />}

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
