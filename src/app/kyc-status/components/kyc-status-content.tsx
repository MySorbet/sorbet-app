'use client';

import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { cn } from '@/lib/utils';

type KycStatus = 'success' | 'failed';

export const KycStatusContent = ({
  status,
  className,
}: {
  status: KycStatus;
  className?: string;
}) => {
  const { data: bridgeCustomer } = useBridgeCustomer();

  const isBridgeVerified = bridgeCustomer?.customer?.status === 'active';
  const hasBridgeVirtualAccounts = !!(
    bridgeCustomer?.virtual_account || bridgeCustomer?.virtual_account_eur
  );

  const showBridgeFailedMessage =
    status === 'failed' && isBridgeVerified && hasBridgeVirtualAccounts;

  if (status === 'success') {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-6 px-4 py-8 sm:px-6',
          className
        )}
      >
        <Image
          src="/svg/logo.svg"
          alt="Sorbet"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
        <Card className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Thanks for submitting your details!
            </h1>
            <p className="text-sm text-gray-600">
              Your KYC has been successful. You can claim your virtual accounts
              from the accounts page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (showBridgeFailedMessage) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-6 px-4 py-8 sm:px-6',
          className
        )}
      >
        <Image
          src="/svg/logo.svg"
          alt="Sorbet"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
        <Card className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Your KYC verification was not approved
            </h1>
            <p className="text-sm text-gray-600">
              Even though your verification failed, you can continue to use your
              existing virtual accounts to accept payments.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-6 px-4 py-8 sm:px-6',
        className
      )}
    >
      <Image
        src="/svg/logo.svg"
        alt="Sorbet"
        width={120}
        height={40}
        className="h-10 w-auto"
      />
      <Card className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Your KYC verification was not approved
          </h1>
          <p className="text-sm text-gray-600">
            Please contact support if you need help or would like to try again.
          </p>
        </div>
      </Card>
    </div>
  );
};
