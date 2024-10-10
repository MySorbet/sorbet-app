import ConnectionHandler from '@sendbird/uikit-react/handlers/ConnectionHandler';
import GroupChannelHandler from '@sendbird/uikit-react/handlers/GroupChannelHandler';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import { useEffect } from 'react';

/**
 * This is a component to define and register Sendbird handler functions that trigger on specific events
 */
export const CustomSendbirdHandler = () => {
  const store = useSendbirdStateContext();
  const sdk = store?.stores?.sdkStore?.sdk;

  useEffect(() => {
    try {
      const groupChannelHandler = new GroupChannelHandler({
        onTypingStatusUpdated: (channel) => {
          console.log('onTypingStatusUpdated handler fired');
        },
      });
      const connectionHandler = new ConnectionHandler({
        onDisconnected: () => {
          console.log('Disconnected from Sendbird');
        },
        onConnected: () => {
          console.log('Connected to Sendbird');
        },
        onReconnectStarted: () => {
          console.log('Reconnecting to Sendbird');
        },
        onReconnectSucceeded: () => {
          console.log('Reconnection to Sendbird successful');
        },
        onReconnectFailed: () => {
          console.log('Reconnection to Sendbird failed');
        },
      });
      if (typeof sdk?.addConnectionHandler === 'function') {
        sdk.addConnectionHandler('SorbetConnectionHandler', connectionHandler);
        // sdk.addGroupChannelHandler('SorbetGroupChannel', groupChannelHandler);
      }
    } catch (error: unknown) {
      console.log(
        'Something went wrong with the Sendbird handler registration'
      );
      console.log(error);
    }

    return () => {
      try {
        sdk.removeConnectionHandler('SorbetConnectionHandler');
        // sdk.removeGroupChannelHandler('SorbetGroupChannel')
      } catch (error: unknown) {
        console.error('Failed to remove custom handlers');
        console.error(error);
      }
    };
  }, [sdk]);

  return null;
};
