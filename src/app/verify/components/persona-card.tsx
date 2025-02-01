import PersonaReact from 'persona-react';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { VerifyCard } from './verify-card';

/** Extracts relevant fields from a persona url */
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
export const PersonaCard = ({
  onComplete,
  url,
}: {
  onComplete?: () => void;
  url: string;
}) => {
  const params = getParams(url);
  const [ready, setReady] = useState(false);

  // TODO: Better error state (boundary?)
  if (!params.inquiryTemplateId || !params.environmentId) {
    return <span>There was an error loading the Persona iframe</span>;
  }

  console.log(ready);
  return (
    <VerifyCard className='flex h-[41rem] w-[28rem] items-center justify-center'>
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
          onReady={() => setReady(true)}
          onComplete={({ inquiryId, status, fields }) => {
            // Inquiry completed. Optionally tell your server about it.
            console.log(`Sending finished inquiry ${inquiryId} to backend`);
            onComplete?.();
          }}
        />
      </div>
    </VerifyCard>
  );
};
