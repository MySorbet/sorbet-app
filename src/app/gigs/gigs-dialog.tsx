'use client';

import {
  createContract,
  updateContractStatus,
  updateMilestoneStatus,
  updateOfferStatus,
} from '@/api/gigs';
import { Chat } from '@/app/gigs/chat';
import {
  ContractFormContainer,
  ContractFormFixedPriceData,
  ContractMilestoneMinimalProps,
  ContractMilestonesFormData,
  ContractNotFound,
  ContractOverview,
  ContractPendingFreelancer,
  ContractPendingOffer,
  ContractCompleted,
  ContractRejected,
} from '@/app/gigs/contract';
// import { useWalletSelector } from '@/components/common';
import {
  encodeFunctionData,
  parseUnits,
  formatUnits,
  hexToBigInt,
  EIP1193Provider,
} from 'viem';
import { CONTRACT_ABI, TOKEN_ABI } from '@/constant/abis';
import {
  useWallets,
  getEmbeddedConnectedWallet,
  ConnectedWallet,
} from '@privy-io/react-auth';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth, useGetContractForOffer } from '@/hooks';
import { useLocalStorage } from '@/hooks';
import { config } from '@/lib/config';
import { toYoctoNEAR } from '@/lib/helper';
import { cn } from '@/lib/utils';
import { ActiveTab } from '@/types';
import {
  ContractType,
  CreateContractType,
  MilestoneType,
  OfferType,
} from '@/types';
import BigNumber from 'bignumber.js';
import {
  FileCheck2 as IconContract,
  MessageCircle as IconMessage,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export interface GigsDialogProps {
  isOpen: boolean;
  isClient?: boolean;
  chatParticipantName?: string;
  currentOfferId?: string;
  currentOffer?: OfferType;
  onOpenChange: (open: boolean) => void;
  handleRejectOffer?: () => void;
  afterContractSubmitted?: () => void;
}

interface TabSelectorProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const GigsDialog = ({
  isOpen = false,
  onOpenChange,
  afterContractSubmitted,
  isClient = false,
  currentOffer,
  chatParticipantName = '',
  currentOfferId = '',
  handleRejectOffer,
}: GigsDialogProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('Chat');
  const [offers, setOffers] = useState([]);
  const [tab, setTab] = useState<string>('milestones');
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [contractApproved, setContractApproved] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  // const { selector, accounts } = useWalletSelector();
  const { ready, wallets } = useWallets();

  const [lastChainOp, setLastChainOp] = useLocalStorage<string>(
    'lastChainOp',
    ''
  );

  const { user } = useAuth();

  const {
    isPending: getContractPending,
    data: contractData,
    // error: getContractError,
    isError: isGetContractError,
    refetch: refetchContractData,
  } = useGetContractForOffer({
    currentOfferId,
    isOpen,
    activeTab,
  });

  if (isGetContractError) {
    toast({
      title: 'Unable to fetch contract information',
      description: 'If the problem persists, please contract support',
    });
  }

  useEffect(() => {
    if (
      contractData &&
      contractData.status !== 'Rejected' &&
      contractData.status !== 'PendingApproval'
    ) {
      setContractApproved(true);
    }
  }, [contractData]);

  const handleApprove = async () => {
    setIsLoading(true);
    if (contractData) {
      const response = await updateContractStatus(
        contractData.id,
        'NotStarted'
      );
      if (response?.data) {
        // if (currentOffer) {
        //   await updateOfferStatus(currentOffer?.id, 'Accepted');
        // }
        setContractApproved(true);
        toast({
          title: 'Contract approved',
          description: 'You can now fund the contract.',
        });
      } else {
        toast({
          title: 'Something went wrong',
          description:
            'Unable to approve contract. If the issue persists, please contact support',
        });
      }
    }
    setIsLoading(false);
  };

  const handleReject = () => {
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    setIsLoading(true);
    if (contractData) {
      const response = await updateContractStatus(contractData.id, 'Rejected');
      if (response && response.data) {
        setContractApproved(false);
        setIsRejectDialogOpen(false);
        toast({
          title: 'Contract rejected',
          description: 'The contract offer was rejected',
        });
      } else {
        toast({
          title: 'Something went wrong',
          description:
            'Unable to reject contract. If the issue persists, please contact support',
        });
      }
    }
    await refetchContractData();
    setIsLoading(false);
  };

  const cancelReject = () => {
    setIsRejectDialogOpen(false);
  };

  const finishContract = async () => {
    setLastChainOp('end_project');
    if (currentOffer) {
      await updateOfferStatus(currentOffer?.id, 'Completed');
    }
    toast({
      title: 'Contract completed',
      description: 'The contract has been completed',
    });
  };

  const onMilestonesFormSubmit = async (
    formData: ContractMilestonesFormData
  ) => {
    if (tab === 'milestones' && currentOffer) {
      const totalAmount = formData.milestones.reduce(
        (sum, milestone) => sum + milestone.amount,
        0
      );
      console.log('currentOffer', currentOffer);
      const reqBody: CreateContractType = {
        name: formData.projectName,
        totalAmount: totalAmount,
        contractType: 'Milestones',
        milestones: formData.milestones,
        offerId: currentOffer.id,
        clientUsername: currentOffer.username,
      };

      const response = await createContract(reqBody);
      if (response && response.data) {
        setIsFormSubmitted(true);
        if (afterContractSubmitted) {
          afterContractSubmitted();
        }
      } else {
        toast({
          title: 'Unable to submit contract',
          description: 'Something went wrong, please try again',
        });
      }
    }
  };

  const onFixedPriceFormSubmit = async (
    formData: ContractFormFixedPriceData
  ) => {
    if (tab === 'fixed-price' && currentOffer) {
      const reqBody: CreateContractType = {
        name: formData.projectName,
        totalAmount: formData.totalAmount,
        contractType: 'FixedPrice',
        milestones: [
          { name: formData.projectName, amount: formData.totalAmount },
        ],
        offerId: currentOffer.id,
        clientUsername: currentOffer.username,
      };

      const response = await createContract(reqBody);
      if (response && response.data) {
        setIsFormSubmitted(true);
        if (afterContractSubmitted) {
          afterContractSubmitted();
        }
      } else {
        toast({
          title: 'Unable to submit contract',
          description: 'Something went wrong, please try again',
        });
      }
    }
  };

  const handleMilestoneFunding = async (
    projectId: string,
    scheduleId: string,
    amount: number,
    milestoneId: string,
    index: number
  ) => {
    try {
      const wallet = getEmbeddedConnectedWallet(wallets);
      if (wallet) {
        setLastChainOp('fund_schedule');
        const provider = await wallet.getEthereumProvider();
        console.log(wallet);
        const balanceOfData = encodeFunctionData({
          abi: TOKEN_ABI,
          functionName: 'balanceOf',
          args: [wallet.address],
        });

        // Call the contract to get the balance
        const balanceResult = await provider.request({
          method: 'eth_call',
          params: [
            {
              to: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC contract address
              data: balanceOfData,
            },
          ],
        });

        amount = 0.01;

        if (hexToBigInt(balanceResult) < parseUnits(amount.toString(), 6)) {
          toast({
            title: 'Insufficient balance',
            description: `You need at least ${amount} USDC to perform this action. Only ${formatUnits(
              hexToBigInt(balanceResult),
              6
            )} USDC was detected`,
          });
          return;
        }

        const approve_data = encodeFunctionData({
          abi: TOKEN_ABI,
          functionName: 'approve',
          args: [
            '0x2aEF844155a048e1a78B1475a4F948A3F9853971',
            parseUnits(amount.toString(), 6),
          ],
        });

        const transactionapproveRequest = {
          from: wallet.address,
          to: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // usdc address
          data: approve_data,
        };
        const transactionapproveHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [transactionapproveRequest],
        });

        console.log('transactionapproveHash', transactionapproveHash);

        const data = encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: 'fundMilestone',
          args: [
            projectId,
            milestoneId,
            '0xeB46D095618010dd3f84c32865800703EAC83512',
            parseUnits(amount.toString(), 6),
          ],
        });
        const transactionRequest = {
          from: wallet.address,
          to: '0x2aEF844155a048e1a78B1475a4F948A3F9853971',
          data: data,
        };
        const transactionHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [transactionRequest],
        });
        console.log('transactionHash', transactionHash);

        // this code needs to be run on backend web3 event listener
        await updateMilestoneStatus(milestoneId, 'Active');
        await updateContractStatus(projectId, 'InProgress');

        toast({
          title: 'Transaction Successful',
          description: 'Milestone funded successfully ',
        });
      } else {
        toast({
          title: 'Something went wrong',
          description: 'Your Privy wallet was not detected. Please try again',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Transaction Failed',
        description: 'Failed to Fund Milestone. Please try again',
        variant: 'destructive',
      });
      console.error('Failed to fund milestone', err);
      throw err;
    }

    await refetchContractData();
  };

  const handleMilestoneSubmission = async (
    projectId: string,
    milestoneId: string
  ) => {
    // const response = !isFixedPrice
    //   ? await updateMilestoneStatus(milestoneId, 'InReview')
    //   : await updateContractStatus(projectId, 'InReview');
    const response = await updateMilestoneStatus(milestoneId, 'InReview');
    if (response && response.data) {
      toast({
        title: 'Milestone submitted',
        description: 'Milestone is in review now and awaiting approval',
      });
    } else {
      toast({
        title: 'Something went wrong',
        description: 'Unable to submit milestone, please try again',
        variant: 'destructive',
      });
    }

    await refetchContractData();
  };

  const handleMilestoneApprove = async (
    projectId: string,
    milestoneId: string,
    offerId?: string,
    index?: number
  ) => {
    try {
      const wallet = getEmbeddedConnectedWallet(wallets);
      if (wallet) {
        setLastChainOp('approve_schedule');
        const transactionHash = await sendTransaction(
          wallet,
          '0x2aEF844155a048e1a78B1475a4F948A3F9853971',
          CONTRACT_ABI,
          'releaseMilestone',
          [projectId, milestoneId]
        );

        console.log('transactionHash', transactionHash);

        // still backend process
        await updateMilestoneStatus(milestoneId, 'Approved');
        await updateContractStatus(projectId, 'Completed');

        toast({
          title: 'Transaction Successful',
          description: 'Milestone released successfully ',
        });
      } else {
        toast({
          title: 'Something went wrong',
          description: 'Your Privy wallet was not detected. Please try again',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Transaction Failed',
        description: 'Failed to Release Milestone. Please try again',
        variant: 'destructive',
      });
      console.error('Failed to release milestone', err);
      throw err;
    }

    await refetchContractData();
  };

  async function sendTransaction(
    wallet: ConnectedWallet,
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[]
  ): Promise<`0x${string}`> {
    const provider = await wallet.getEthereumProvider();
    // Encode the function data
    const data = encodeFunctionData({
      abi: abi,
      functionName: functionName,
      args: args,
    });

    // Create the transaction request
    const transactionRequest = {
      from: wallet.address as `0x${string}`,
      to: contractAddress as `0x${string}`,
      data: data,
      value: '0x0' as `0x${string}`,
    };

    try {
      // Send the transaction
      const transactionHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [transactionRequest],
      });

      return transactionHash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  const renderContractView = () => {
    if (isClient) {
      if (contractData && currentOffer) {
        if (contractData.status === 'Rejected') {
          return <ContractRejected isClient={isClient} />;
        } else if (
          contractData.status === 'Completed' &&
          currentOffer.status === 'Completed'
        ) {
          return (
            <ContractCompleted
              contract={contractData}
              isClient={isClient}
              milestones={contractData.milestones as MilestoneType[]}
              offer={currentOffer}
              contractApproved={contractApproved}
              isRejectDialogOpen={isRejectDialogOpen}
              setIsRejectDialogOpen={() => setIsRejectDialogOpen(false)}
              isLoading={isLoading}
              handleApprove={handleApprove}
              handleReject={handleReject}
              confirmReject={confirmReject}
              cancelReject={cancelReject}
              finishContract={finishContract}
              handleMilestoneApprove={handleMilestoneApprove}
              handleMilestoneSubmission={handleMilestoneSubmission}
              handleMilestoneFunding={handleMilestoneFunding}
            />
          );
        } else {
          return (
            <ContractOverview
              contract={contractData}
              isClient={isClient}
              milestones={contractData.milestones as MilestoneType[]}
              offer={currentOffer}
              contractApproved={contractApproved}
              isRejectDialogOpen={isRejectDialogOpen}
              setIsRejectDialogOpen={() => setIsRejectDialogOpen(false)}
              isLoading={isLoading}
              handleApprove={handleApprove}
              handleReject={handleReject}
              confirmReject={confirmReject}
              cancelReject={cancelReject}
              finishContract={finishContract}
              handleMilestoneApprove={handleMilestoneApprove}
              handleMilestoneSubmission={handleMilestoneSubmission}
              handleMilestoneFunding={handleMilestoneFunding}
            />
          );
        }
      } else {
        if (offers.length > 0) {
          return <ContractPendingOffer />;
        } else {
          return <ContractNotFound />;
        }
      }
    } else {
      if (contractData && currentOffer) {
        if (contractData.status === 'PendingApproval') {
          return <ContractPendingFreelancer />;
        } else if (contractData.status === 'Rejected') {
          return <ContractRejected isClient={isClient} />;
        } else if (
          contractData.status === 'Completed' &&
          currentOffer.status === 'Completed'
        ) {
          return (
            <ContractCompleted
              contract={contractData}
              isClient={isClient}
              milestones={contractData.milestones as MilestoneType[]}
              offer={currentOffer}
              contractApproved={contractApproved}
              isRejectDialogOpen={isRejectDialogOpen}
              setIsRejectDialogOpen={() => setIsRejectDialogOpen(false)}
              isLoading={isLoading}
              handleApprove={handleApprove}
              handleReject={handleReject}
              confirmReject={confirmReject}
              cancelReject={cancelReject}
              finishContract={finishContract}
              handleMilestoneApprove={handleMilestoneApprove}
              handleMilestoneSubmission={handleMilestoneSubmission}
              handleMilestoneFunding={handleMilestoneFunding}
            />
          );
        } else {
          return (
            <ContractOverview
              contract={contractData}
              isClient={isClient}
              milestones={contractData.milestones as MilestoneType[]}
              offer={currentOffer}
              contractApproved={contractApproved}
              isRejectDialogOpen={isRejectDialogOpen}
              setIsRejectDialogOpen={() => setIsRejectDialogOpen(false)}
              isLoading={isLoading}
              handleApprove={handleApprove}
              handleReject={handleReject}
              confirmReject={confirmReject}
              cancelReject={cancelReject}
              finishContract={finishContract}
              handleMilestoneApprove={handleMilestoneApprove}
              handleMilestoneSubmission={handleMilestoneSubmission}
              handleMilestoneFunding={handleMilestoneFunding}
            />
          );
        }
      } else {
        return (
          <ContractFormContainer
            tab={tab}
            setTab={setTab}
            isFormSubmitted={isFormSubmitted}
            onMilestonesFormSubmit={onMilestonesFormSubmit}
            onFixedPriceFormSubmit={onFixedPriceFormSubmit}
            handleRejectOfferClick={handleRejectOffer}
            currentOffer={currentOffer}
          />
        );
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogOverlay className='bg-[#F3F3F4]/90' />
        <DialogContent
          className='flex max-w-[900px] flex-col rounded-2xl md:h-[75vh]'
          aria-describedby={undefined}
        >
          <DialogTitle className='flex h-14 justify-between px-4 py-2 text-2xl'>
            {activeTab === 'Chat'
              ? chatParticipantName !== ''
                ? `Chat with ${chatParticipantName}`
                : `Chat`
              : `Contract`}
            <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
          </DialogTitle>

          {activeTab === 'Chat' && (
            <Chat
              showTopbar={false}
              isOpen={isOpen}
              offerId={currentOfferId}
              contractStatus={'Approved'}
            />
          )}
          {activeTab === 'Contract' ? (
            getContractPending ? (
              <div className='flex h-full w-full items-center justify-center'>
                <Spinner />
              </div>
            ) : (
              renderContractView()
            )
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className='border-1 h-11 rounded-full border border-solid border-gray-100'>
      <Button
        variant={`outline`}
        className={cn(
          'active:ouline-none hover:bg-sorbet gap-2 rounded-full border-none outline-none hover:text-white focus:outline-none',
          activeTab === 'Chat' && 'bg-sorbet text-white'
        )}
        onClick={() => setActiveTab('Chat')}
      >
        <span>Chat</span>
        <IconMessage size={15} />
      </Button>
      <Button
        variant={`outline`}
        className={cn(
          'active:ouline-none hover:bg-sorbet gap-2 rounded-full border-none hover:text-white focus:outline-none',
          activeTab === 'Contract' && 'bg-sorbet text-white'
        )}
        onClick={() => setActiveTab('Contract')}
      >
        <span>Contract</span>
        <IconContract size={15} />
      </Button>
    </div>
  );
};
