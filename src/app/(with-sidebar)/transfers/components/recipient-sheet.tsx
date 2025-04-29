import {
  RecipientButton,
  RecipientButtonContent,
  RecipientButtonDescription,
  RecipientButtonDetail,
  RecipientButtonIcon,
  RecipientButtonTitle,
} from './recipient-button';
import {
  VaulSheet,
  VaulSheetContent,
  VaulSheetDescription,
  VaulSheetHeader,
  VaulSheetTitle,
  VaulSheetTrigger,
} from './vaul-sheet';

/** Render a sheet to walk the user through new recipient creation */
export const RecipientSheet = () => {
  return (
    <VaulSheet direction='right'>
      <VaulSheetTrigger>Open</VaulSheetTrigger>
      <VaulSheetContent>
        <VaulSheetHeader>
          <VaulSheetTitle>New recipient</VaulSheetTitle>
          <VaulSheetDescription>
            Select how you want to transfer funds
          </VaulSheetDescription>
        </VaulSheetHeader>
        <div className='flex flex-col gap-3'>
          <RecipientButton>
            <RecipientButtonIcon type='bank' />
            <RecipientButtonContent>
              <RecipientButtonTitle>Bank recipient</RecipientButtonTitle>
              <RecipientButtonDescription>
                Transfer to a business or individual bank
              </RecipientButtonDescription>
              <RecipientButtonDetail>
                Arrives in 1-2 business days
              </RecipientButtonDetail>
            </RecipientButtonContent>
          </RecipientButton>
          <RecipientButton>
            <RecipientButtonIcon type='wallet' />
            <RecipientButtonContent>
              <RecipientButtonTitle>Crypto wallet</RecipientButtonTitle>
              <RecipientButtonDescription>
                Transfer to crypto wallet or exchange
              </RecipientButtonDescription>
              <RecipientButtonDetail>Arrives instantly</RecipientButtonDetail>
            </RecipientButtonContent>
          </RecipientButton>
        </div>
      </VaulSheetContent>
    </VaulSheet>
  );
};
