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
  className,
}: {
  onComplete?: () => void;
  url: string;
  className?: string;
}) => {
  const params = getParams(url);
  const [ready, setReady] = useState(false);

  // Cant load Persona if any of the required params are missing
  const isError =
    !params.inquiryTemplateId || !params.developerId || !params.iqtToken;

  // Reset loading if there is an error
  useEffect(() => {
    isError && setReady(false);
  }, [isError]);

  return (
    <VerifyCard
      className={cn(
        'flex h-[41rem] w-full max-w-[22rem] items-center justify-center',
        className
      )}
    >
      {isError ? (
        <ErrorFallback />
      ) : (
        <>
          <Skeleton
            className={cn('size-full', ready ? 'hidden' : 'block w-[300px]')} // 300px seems to be what the persona iframe wants to take up, so match it for loading
          />
          <div
            className={cn(
              'size-full [&_iframe]:size-full',
              ready ? 'block' : 'hidden'
            )}
          >
            <PersonaReact
              templateId={params.inquiryTemplateId}
              environmentId={params.environmentId}
              referenceId={params.referenceId}
              fields={{
                developer_id: params.developerId ?? '',
                iqt_token: params.iqtToken ?? '',
              }}
              onReady={() => setReady(true)}
              onComplete={() => {
                // TODO: Note that inquiryId, status and fields are available as parameters.
                // TODO: We could store any useful information in our backend.
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
