import { CircleAlert } from 'lucide-react';
import PersonaReact from 'persona-react';
import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { VerifyCard } from './verify-card';

/** Extracts relevant fields from a persona url */
const getParams = (urlString: string) => {
  const url = new URL(urlString);
  const searchParams = url.searchParams;
  const inquiryTemplateId =
    searchParams.get('inquiry-template-id') ?? undefined;
  const developerId = searchParams.get('fields[developer_id]') ?? undefined;
  const iqtToken = searchParams.get('fields[iqt_token]') ?? undefined;
  const referenceId = searchParams.get('reference-id') ?? undefined;
  const environmentId = searchParams.get('environment-id') ?? undefined;
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

  // Cant load Persona if no inquiry template id is found
  const isError = !params.inquiryTemplateId;

  // Reset loading if there is an error
  useEffect(() => {
    isError && setReady(false);
  }, [isError]);

  return (
    <VerifyCard className='flex h-[41rem] w-[28rem] items-center justify-center'>
      {isError ? (
        <ErrorFallback />
      ) : (
        <>
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
        </>
      )}
    </VerifyCard>
  );
};

/** Fallback component for when Persona fails to load */
const ErrorFallback = () => {
  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <CircleAlert className='size-10 text-red-500' />
      <span className='text-lg font-medium'>
        We ran into an issue with your verification
      </span>
      <span className='text-muted-foreground text-sm'>
        Please try again. If the issue persists, please contact support.
      </span>
    </div>
  );
};
