import PersonaReact from 'persona-react';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { VerifyCard } from './verify-card';

const PERSONA_URL =
  'https://bridge.withpersona.com/verify?inquiry-template-id=itmpl_NtHYpb9AbEYCPxGo5iRbc9d2&fields%5Bdeveloper_id%5D=cd950d34-5f99-43cb-b707-104d7d6f15fc&fields%5Biqt_token%5D=46f7565fe2ba42843b957cec6d783e48f85dff6d6ea56cf5753634b09a3214e8&reference-id=992366a2-5eea-4431-a559-5d26bc7f1436&environment-id=env_UWeuo2CnqFQXVeKujbQLBx6u';

const getParams = (urlString: string) => {
  const url = new URL(urlString);
  const searchParams = url.searchParams;
  const inquiryTemplateId = searchParams.get('inquiry-template-id');
  const developerId = searchParams.get('fields[developer_id]');
  const iqtToken = searchParams.get('fields[iqt_token]');
  const referenceId = searchParams.get('reference-id');
  const environmentId = searchParams.get('environment-id');
  return {
    inquiryTemplateId,
    developerId,
    iqtToken,
    referenceId,
    environmentId,
  };
};

/** Render a persona flow according to https://docs.withpersona.com/docs/inlined-flow */
export const PersonaCard = () => {
  const params = getParams(PERSONA_URL);
  const [ready, setReady] = useState(false);

  if (!params.inquiryTemplateId || !params.environmentId) {
    return <span>There was an error loading the Persona iframe</span>;
  }

  console.log(ready);
  return (
    <VerifyCard className='flex h-[41rem] w-[25rem] items-center justify-center'>
      <Skeleton className={cn('size-full', ready ? 'hidden' : 'block')} />

      <div
        className={cn(
          'size-full [&_iframe]:size-full',
          ready ? 'block' : 'hidden'
        )}
      >
        <PersonaReact
          templateId={params.inquiryTemplateId}
          environmentId={params.environmentId}
          onLoad={() => {
            console.log('Loaded inline');
          }}
          onReady={() => setReady(true)}
          onComplete={({ inquiryId, status, fields }) => {
            // Inquiry completed. Optionally tell your server about it.
            console.log(`Sending finished inquiry ${inquiryId} to backend`);
          }}
        />
      </div>
    </VerifyCard>
  );
};
