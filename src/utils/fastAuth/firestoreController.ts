import { fetchAccountIds } from '@/api/fastAuthApi';
import {
  checkFirestoreReady,
  firebaseApp,
  firebaseAuth,
} from '@/utils/fastAuth/firebase';
import { getDeleteKeysAction } from '@/utils/fastAuth/mpc-service';
import { Device } from '@/utils/fastAuth/types';
import { captureException } from '@sentry/react';
import { User } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  setDoc,
  getDoc,
  getDocs,
  query,
  doc,
  CollectionReference,
  deleteDoc,
} from 'firebase/firestore';
import UAParser from 'ua-parser-js';

class FirestoreController {
  private firestore: Firestore;

  private userUid: string | undefined;

  private oidcToken: string | undefined;

  constructor() {
    this.firestore = getFirestore(firebaseApp);

    firebaseAuth.onIdTokenChanged(async (user: User | null) => {
      if (!user) {
        return;
      }
      this.userUid = user.uid;
      this.oidcToken = await user.getIdToken();
    });

    checkFirestoreReady();
  }

  async getAccountIdFromOidcToken() {
    const recoveryPK = await window.fastAuthController.getUserCredential(
      this.oidcToken
    );
    const accountIds = await fetchAccountIds(recoveryPK);
    if (!accountIds.length) {
      const noAccountIdError = new Error('Unable to retrieve account Id');
      captureException(noAccountIdError);
      throw noAccountIdError;
    }
    return accountIds[0];
  }

  async addDeviceCollection({
    fakPublicKey,
    lakPublicKey,
    gateway,
    accountId,
  }: {
    fakPublicKey: any;
    lakPublicKey: string;
    gateway: any;
    accountId?: string;
  }) {
    try {
      const parser = new UAParser();
      const device = parser.getDevice();
      const os = parser.getOS();
      const browser = parser.getBrowser();
      const dateTime = new Date().toISOString();

      const docPromises = [];

      if (accountId && fakPublicKey) {
        await window.firestoreController.addAccountIdPublicKey(
          fakPublicKey,
          accountId
        );
      }

      if (fakPublicKey) {
        const fakDoc = setDoc(
          doc(this.firestore, `/users/${this.userUid}/devices`, fakPublicKey),
          {
            device: `${device.vendor} ${device.model}`,
            os: `${os.name} ${os.version}`,
            browser: `${browser.name} ${browser.version}`,
            publicKeys: [fakPublicKey],
            uid: this.userUid,
            gateway: gateway || 'Unknown Gateway',
            dateTime,
            keyType: 'fak',
          },
          { merge: true }
        );
        docPromises.push(fakDoc);
      }

      if (lakPublicKey) {
        const lakDoc = setDoc(
          doc(this.firestore, `/users/${this.userUid}/devices`, lakPublicKey),
          {
            device: `${device.vendor} ${device.model}`,
            os: `${os.name} ${os.version}`,
            browser: `${browser.name} ${browser.version}`,
            publicKeys: [lakPublicKey],
            uid: this.userUid,
            gateway: gateway || 'Unknown Gateway',
            dateTime,
            keyType: 'lak',
          },
          { merge: true }
        );
        docPromises.push(lakDoc);
      }

      return await Promise.all(docPromises);
    } catch (err) {
      console.error('Failed to add device collection:', err);
      throw new Error('Failed to add device collection');
    }
  }

  async listDevices() {
    const q = query(
      collection(
        this.firestore,
        `/users/${this.userUid}/devices`
      ) as CollectionReference<Device>
    );
    const querySnapshot = await getDocs(q);
    const collections: {
      firebaseId: string;
      id: string;
      label: string;
      createdAt: string | Date;
      device: string;
      os: string;
      browser: string;
      publicKeys: string[];
      uid: string;
      gateway: string | null;
      dateTime: Date;
      keyType: string;
    }[] = [];

    querySnapshot.forEach((document) => {
      const data = document.data();
      collections.push({
        ...data,
        firebaseId: document.id,
        id: data.publicKeys[0],
        label: `${data.gateway || 'Unknown Gateway'} (${
          data.keyType || 'Unknown Key Type'
        }) ${data.device} - ${data.browser} - ${data.os}`,
        createdAt: data.dateTime ? new Date(data.dateTime) : 'Unknown',
      });
    });

    const existingKeyPair = window.fastAuthController.findInKeyStores(
      `oidc_keypair_${this.oidcToken}`
    );
    if (!existingKeyPair) {
      await (window as any).fastAuthController.claimOidcToken(this.oidcToken);
    }

    const accountId = await this.getAccountIdFromOidcToken();
    window.fastAuthController.setAccountId(accountId);

    const accessKeysWithoutRecoveryKey =
      await window.fastAuthController.getAllAccessKeysExceptRecoveryKey(
        this.oidcToken ?? ''
      );

    // TODO: from the list, exclude record that has same key from recovery service
    return accessKeysWithoutRecoveryKey.map((key: any) => {
      const item = collections.find((col) => col.publicKeys.includes(key));
      if (item) {
        return item;
      }
      return {
        id: key,
        firebaseId: null,
        label: 'Unknown Device',
        createdAt: 'Unknown',
        publicKeys: [key],
      };
    });
  }

  async deleteDeviceCollections(list: { firebaseId: any }[]) {
    const recoveryPK = await window.fastAuthController.getUserCredential(
      this.oidcToken
    );
    const accountIds = await fetchAccountIds(recoveryPK);

    if (!accountIds.length) {
      const noAccountIdError = new Error('Unable to retrieve account Id');
      captureException(noAccountIdError);
      throw noAccountIdError;
    }
    // delete firebase records
    try {
      const firestoreIds = list
        .map(({ firebaseId }) => firebaseId)
        .filter((id) => id);
      if (firestoreIds.length) {
        // delete all records except the one that has LAK
        const deletePromises = firestoreIds.flatMap((id) => [
          deleteDoc(doc(this.firestore, `/users/${this.userUid}/devices`, id)),
          deleteDoc(doc(this.firestore, '/publicKeys', id)),
        ]);
        await Promise.allSettled(deletePromises);
      }
    } catch (err: any) {
      console.log('Fail to delete firestore records', err);
      throw new Error(err);
    }

    // delete keys from recovery service
    try {
      const publicKeys = list.reduce(
        (acc: any, curr: any) => acc.concat(curr.publicKeys),
        []
      );
      const deleteAction = getDeleteKeysAction(publicKeys);
      await (
        window as any
      ).fastAuthController.signAndSendActionsWithRecoveryKey({
        oidcToken: this.oidcToken,
        accountId: accountIds[0],
        recoveryPK,
        actions: deleteAction,
      });
    } catch (err: any) {
      console.log('Fail to delete keys', err);
      throw new Error(err);
    }
  }

  async getDeviceCollection(fakPublicKey: string) {
    const docRef = doc(
      this.firestore,
      'users',
      this.userUid ?? '',
      'devices',
      fakPublicKey
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  updateUser = async ({
    userUid,
    oidcToken,
  }: {
    userUid: any;
    oidcToken: any;
  }) => {
    this.userUid = userUid;
    this.oidcToken = oidcToken;
  };

  getUserOidcToken = () => this.oidcToken;

  async addAccountIdPublicKey(publicKey: string, accountId: string) {
    await setDoc(doc(this.firestore, 'publicKeys', publicKey), {
      accountId,
    });
  }

  async getAccountIdByPublicKey(publicKey: string): Promise<any> {
    const publicKeyDoc = await getDoc(
      doc(this.firestore, 'publicKeys', publicKey)
    );
    if (!publicKeyDoc.exists()) {
      return undefined;
    }

    const { accountId } = publicKeyDoc.data() as { accountId: string };

    return accountId;
  }
}

export default FirestoreController;
