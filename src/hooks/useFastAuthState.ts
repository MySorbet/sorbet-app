import { fetchAccountIdsFromTwoKeys } from '../api/fastAuthApi';
import { checkFirestoreReady, firebaseAuth } from '../utils/fastAuth/firebase';
import { networkId } from '@/lib/config';
import { setAccountIdToController } from '@/utils/fastAuth';
import { getKeys, isPassKeyAvailable } from '@near-js/biometric-ed25519/lib';
import { KeyPairEd25519 } from '@near-js/crypto';
import { captureException } from '@sentry/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom/dist';

type AuthState = 'loading' | boolean | Error;

export const getFastAuthState = async (): Promise<AuthState> => {
  try {
    const controllerState = await window.fastAuthController.isSignedIn();
    const isFirestoreReady = await checkFirestoreReady();
    const isPasskeySupported = await isPassKeyAvailable();

    if (controllerState === true) {
      return true;
    }
    if (isPasskeySupported) {
      const keypairs = await getKeys('dontcare');
      const accountInfo = await fetchAccountIdsFromTwoKeys(
        keypairs[0],
        keypairs[1]
      );

      if (!accountInfo?.accId) {
        return false;
      }

      setAccountIdToController({
        accountId: accountInfo.accId,
        networkId,
      });

      await window.fastAuthController.setKey(
        new KeyPairEd25519(accountInfo.keyPair?.toString()?.split(':')[1])
      );
      return true;
    }
    if (isFirestoreReady && firebaseAuth.currentUser) {
      const oidcToken = await firebaseAuth.currentUser.getIdToken();
      const localStoreKey = await window.fastAuthController.getLocalStoreKey(
        `oidc_keypair_${oidcToken}`
      );

      if (localStoreKey) {
        const account =
          await window.fastAuthController.recoverAccountWithOIDCToken(
            oidcToken
          );

        if (!account) return false;

        setAccountIdToController({
          accountId: account?.accountId,
          networkId,
        });

        return true;
      }
    }
  } catch (e) {
    captureException(e);
    return false;
  }

  return false;
};

export const useFastAuthState = (): { authenticated: AuthState } => {
  const [authenticated, setAuthenticated] = useState<AuthState>('loading');
  const [query] = useSearchParams();
  const email = query.get('email');

  useEffect(() => {
    const handleAuthState = async () => {
      setAuthenticated(await getFastAuthState());
    };

    handleAuthState();
  }, [email]);

  return { authenticated };
};
