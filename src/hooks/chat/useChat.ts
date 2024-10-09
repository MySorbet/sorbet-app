import { useSendbirdStateContext } from '@sendbird/uikit-react/SendbirdProvider';
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useChat = (
  userId: string,
  channelId: string | undefined,
  isOfferLoading: boolean
) => {
  const globalStore = useSendbirdStateContext();

  const sendMessage = sendbirdSelectors.getSendUserMessage(globalStore);
  const sendFileMessage = sendbirdSelectors.getSendFileMessage(globalStore);
  const connect = sendbirdSelectors.getConnect(globalStore);
  const disconnect = sendbirdSelectors.getDisconnect(globalStore);
  /**
   * @param {string} channelUrl
   */
  const getChannel = sendbirdSelectors.getGetGroupChannel(globalStore);

  const getChannelData = useQuery({
    queryKey: ['channel'],
    queryFn: async () => {
      if (!channelId) {
        return;
      }
      return await getChannel(channelId);
    },
    enabled: !isOfferLoading && !!channelId,
  });

  useEffect(() => {
    const initializeConnection = async () => {
      await connect(userId);
      console.log('connected to sendbird server');
    };
    initializeConnection();
  }, [connect, userId]);

  return {
    sendMessage,
    getChannel,
    getChannelData,
    connect,
    disconnect,
    sendFileMessage,
  };
};
