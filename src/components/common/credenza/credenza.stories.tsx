import { Meta } from '@storybook/react';

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/common/credenza/credenza';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Common/Credenza',
  component: Credenza,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Credenza>;

export default meta;

export const Default = () => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>Open modal</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Credenza</CredenzaTitle>
          <CredenzaDescription>
            A responsive modal component for shadcn/ui.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          This component is built using shadcn/ui&apos;s dialog and drawer
          component, which is built on top of Vaul.
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
