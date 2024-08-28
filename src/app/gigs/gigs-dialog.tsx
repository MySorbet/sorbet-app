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
  ContractRejected,
} from '@/app/gigs/contract';
// import { useWalletSelector } from '@/components/common';
import { encodeFunctionData } from 'viem';
import { ethers } from 'ethers';
import { CONTRACT_ABI, TOKEN_ABI } from '@/constant/abis';
import { useWallets, getEmbeddedConnectedWallet } from '@privy-io/react-auth';
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
        if (currentOffer) {
          await updateOfferStatus(currentOffer?.id, 'Accepted');
        }
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
    setIsLoading(false);
  };

  const cancelReject = () => {
    setIsRejectDialogOpen(false);
  };

  const finishContract = async () => {
    const response = await updateContractStatus(contractData.id, 'Completed');
    if (response.status && response.data) {
      setLastChainOp('end_project');
      if (currentOffer) {
        await updateOfferStatus(currentOffer?.id, 'Completed');
      }
      // const wallet = wallets[0]; // Replace this with your desired wallet
      // const provider = await wallet.getEthereumProvider();
      // const data = encodeFunctionData({
      //   abi: abi,
      //   functionName: 'end_project',
      //   args: [contractData.id],
      // });
      // // const contractInterface = new ethers.Interface(abi);
      // // const data = contractInterface.encodeFunctionData("end_project", [0]);
      // const transactionRequest = {
      //   to: '0xeB46D095618010dd3f84c32865800703EAC83512',
      //   data: data,
      //   value: 0,
      // };
      // try {
      //   const transactionHash = await provider.request({
      //     method: 'eth_sendTransaction',
      //     params: [transactionRequest],
      //   });
      // } catch (err) {
      //   toast({
      //     title: 'Transaction Failed',
      //     description: 'Failed to end project on the BASE blockchain.',
      //     variant: 'destructive',
      //   });
      //   console.error('Failed to fund milestone', err);
      //   throw err;
      // }
      try {
        const wallet = wallets[0];
        console.log(wallets);
        const provider = await wallet.getEthereumProvider();
        const data = encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: 'create_project',
          args: ['0x1223f6fB23AaB92EA97E21d3428A736BF6B7b01d'],
        });
        const transactionRequest = {
          from: wallet.address,
          to: '0xeB46D095618010dd3f84c32865800703EAC83512',
          data: data,
          value: 0,
        };
        const transactionHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [transactionRequest],
        });
      } catch (err) {
        toast({
          title: 'Transaction Failed',
          description: 'Failed to end project on the Base blockchain.',
          variant: 'destructive',
        });
        console.error('Failed to fund milestone', err);
        throw err;
      }

      // const wallet = await selector.wallet();
      // await wallet
      //   .signAndSendTransaction({
      //     signerId: accounts[0].accountId,
      //     receiverId: config.contractId,
      //     actions: [
      //       {
      //         type: 'FunctionCall',
      //         params: {
      //           methodName: 'end_project',
      //           args: {
      //             project_id: contractData.id,
      //           },
      //           gas: '300000000000000',
      //           deposit: toYoctoNEAR('0'),
      //         },
      //       },
      //     ],
      //   })
      //   .catch((err) => {
      //     toast({
      //       title: 'Transaction Failed',
      //       description: 'Failed to end project on the NEAR blockchain.',
      //       variant: 'destructive',
      //     });
      //     console.error('Failed to fund milestone', err);
      //     throw err;
      //   });
    }
  };

  const createOnchainContract = async (
    contract: ContractType,
    clientAccountId: string,
    milestones?: ContractMilestoneMinimalProps[]
  ) => {
    // if (accounts.length > 0) {
    //   setLastChainOp('create_project');
    //   const transactions: Array<Transaction> = [];
    //   transactions.push({
    //     signerId: accounts[0].accountId,
    //     receiverId: config.contractId,
    //     actions: [
    //       {
    //         type: 'FunctionCall',
    //         params: {
    //           methodName: 'create_project',
    //           args: {
    //             project_id: contract.id,
    //             client_id: clientAccountId,
    //           },
    //           gas: '300000000000000', // gas amount
    //           deposit: '0', // No deposit needed for this function call
    //         },
    //       },
    //     ],
    //   });
    //   if (milestones) {
    //     milestones.forEach(
    //       (milestone: ContractMilestoneMinimalProps, index: number) => {
    //         transactions.push({
    //           signerId: accounts[0].accountId,
    //           receiverId: config.contractId,
    //           actions: [
    //             {
    //               type: 'FunctionCall',
    //               params: {
    //                 methodName: 'add_schedule',
    //                 args: {
    //                   project_id: contract.id,
    //                   short_code: `m${index + 1}`,
    //                   description: milestone.name,
    //                   value: toYoctoNEAR(milestone.amount.toFixed()),
    //                 },
    //                 gas: '300000000000000', // gas amount
    //                 deposit: '100000000000000000000000', // 0.1 NEAR deposit
    //               },
    //             },
    //           ],
    //         });
    //       }
    //     );
    //   } else {
    //     transactions.push({
    //       signerId: accounts[0].accountId,
    //       receiverId: config.contractId,
    //       actions: [
    //         {
    //           type: 'FunctionCall',
    //           params: {
    //             methodName: 'add_schedule',
    //             args: {
    //               project_id: contract.id,
    //               short_code: `m0`,
    //               description: contract.name,
    //               value: toYoctoNEAR(contract.totalAmount.toFixed()),
    //             },
    //             gas: '300000000000000', // gas amount
    //             deposit: '100000000000000000000000', // 0.1 NEAR deposit
    //           },
    //         },
    //       ],
    //     });
    //   }
    //   const wallet = await selector.wallet();
    //   return await wallet
    //     .signAndSendTransactions({ transactions })
    //     .catch((err) => {
    //       toast({
    //         title: 'Transaction Failed',
    //         description: 'Failed to create project on the NEAR blockchain.',
    //         variant: 'destructive',
    //       });
    //       console.error('Failed to create project', err);
    //       throw err;
    //     });
    // }
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
        await createOnchainContract(
          response.data,
          currentOffer.username,
          formData.milestones
        );
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
        offerId: currentOffer.id,
        clientUsername: currentOffer.username,
      };

      const response = await createContract(reqBody);
      if (response && response.data) {
        await createOnchainContract(response.data, currentOffer.username);
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

  const onMilestoneFunded = async (
    projectId: string,
    scheduleId: string,
    amount: number,
    milestoneId: string,
    isFixedPrice: boolean,
    index: number
  ) => {
    try {
      const wallet = wallets[0];
      console.log(wallets);
      const provider = await wallet.getEthereumProvider();
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'fund_schedule',
        args: [BigInt(projectId), BigInt(scheduleId)],
      });
      const transactionRequest = {
        from: wallet.address,
        to: '0xeB46D095618010dd3f84c32865800703EAC83512',
        data: data,
        value: 0,
      };
      const transactionHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [transactionRequest],
      });
    } catch (err) {
      toast({
        title: 'Transaction Failed',
        description: 'Failed to end project on the Base blockchain.',
        variant: 'destructive',
      });
      console.error('Failed to fund milestone', err);
      throw err;
    }
    // if (accounts.length > 0) {
    //   setLastChainOp('fund_schedule');
    //   if (!isFixedPrice) {
    //     await updateMilestoneStatus(milestoneId, 'Active');
    //   } else {
    //     await updateContractStatus(projectId, 'InProgress');
    //   }
    //   if (index == 0 && !isFixedPrice) {
    //     await updateContractStatus(projectId, 'InProgress');
    //   }
    //   const finalAmount = BigNumber(amount).toFixed();
    //   const wallet = await selector.wallet();
    //   return await wallet
    //     .signAndSendTransaction({
    //       signerId: accounts[0].accountId,
    //       receiverId: config.contractId,
    //       actions: [
    //         {
    //           type: 'FunctionCall',
    //           params: {
    //             methodName: 'fund_schedule',
    //             args: {
    //               project_id: projectId,
    //               schedule_id: scheduleId,
    //             },
    //             gas: '300000000000000',
    //             deposit: toYoctoNEAR(finalAmount),
    //           },
    //         },
    //       ],
    //     })
    //     .catch((err) => {
    //       toast({
    //         title: 'Transaction Failed',
    //         description: 'Failed to fund milestone on the NEAR blockchain.',
    //         variant: 'destructive',
    //       });
    //       console.error('Failed to fund milestone', err);
    //       throw err;
    //     });
    // } else {
    //   toast({
    //     title: 'Unable to fund milestone',
    //     description: 'No connected wallet was detected. Please try again.',
    //   });
    // }
  };

  const handleMilestoneFunding = async (
    projectId: string,
    scheduleId: string,
    amount: number,
    milestoneId: string,
    isFixedPrice: boolean,
    index: number
  ) => {
    // if (accounts.length > 0) {
    //   if (user?.balance?.near && user?.balance?.near >= amount) {
    //     setLastChainOp('fund_schedule');
    //     await onMilestoneFunded(
    //       projectId,
    //       scheduleId,
    //       amount,
    //       milestoneId,
    //       isFixedPrice,
    //       index
    //     );
    //   } else {
    //     toast({
    //       title: 'Insufficient balance',
    //       description: `You need at least ${amount} NEAR to perform this action. Only ${user?.balance?.usdc} NEAR was detected`,
    //     });
    //   }
    // } else {
    //   toast({
    //     title: 'Something went wrong',
    //     description: 'Your NEAR wallet was not detected. Please try again',
    //     variant: 'destructive',
    //   });
    // }

    try {
      const wallet =
        wallets.find((wallet) => wallet.connectorType != 'embedded') ||
        wallets.find((wallet) => wallet.connectorType === 'embedded');
      if (!wallet) {
        throw new Error('No wallet found!');
      }

      // const wallet = wallets[0];
      console.log('wallet', wallet);

      const provider = await wallet.getEthereumProvider();
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'create_project',
        args: ['0xeB46D095618010dd3f84c32865800703EAC83512'],
      });
      const transactionRequest = {
        from: wallet.address,
        to: '0xeB46D095618010dd3f84c32865800703EAC83512',
        data: data,
        value: 0,
      };
      const transactionHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [transactionRequest],
      });
    } catch (err) {
      toast({
        title: 'Transaction Failed',
        description: 'Failed to end project on the BASE blockchain.',
        variant: 'destructive',
      });
      console.error('Failed to fund milestone', err);
      throw err;
    }

    await refetchContractData();
  };

  const handleMilestoneSubmission = async (
    projectId: string,
    milestoneId: string,
    isFixedPrice: boolean
  ) => {
    const response = !isFixedPrice
      ? await updateMilestoneStatus(milestoneId, 'InReview')
      : await updateContractStatus(projectId, 'InReview');
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
    isFixedPrice: boolean,
    offerId?: string,
    index?: number
  ) => {
    const response = !isFixedPrice
      ? await updateMilestoneStatus(milestoneId, 'Approved')
      : await updateContractStatus(projectId, 'Completed');
    // if (response && response.data) {
    //   setLastChainOp('approve_schedule');
    //   if (isFixedPrice && offerId) {
    //     await updateOfferStatus(offerId, 'Completed');
    //   }
    //   const wallet = await selector.wallet();
    //   await wallet
    //     .signAndSendTransaction({
    //       signerId: accounts[0].accountId,
    //       receiverId: config.contractId,
    //       actions: [
    //         {
    //           type: 'FunctionCall',
    //           params: {
    //             methodName: 'approve_schedule',
    //             args: {
    //               project_id: projectId.toString(),
    //               schedule_id: index?.toString(),
    //             },
    //             gas: '300000000000000',
    //             deposit: toYoctoNEAR('0'),
    //           },
    //         },
    //       ],
    //     })
    //     .catch((err) => {
    //       toast({
    //         title: 'Transaction Failed',
    //         description: 'Failed to approve milestone on the NEAR blockchain.',
    //         variant: 'destructive',
    //       });
    //       console.error('Failed to fund milestone', err);
    //       throw err;
    //     });
    // } else {
    //   toast({
    //     title: 'Something went wrong',
    //     description: 'Unable to approve milestone, please try again',
    //     variant: 'destructive',
    //   });
    // }

    await refetchContractData();
  };

  const renderContractView = () => {
    if (isClient) {
      if (contractData) {
        if (contractData.status === 'Rejected') {
          return <ContractRejected isClient={isClient} />;
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
      if (contractData) {
        if (contractData.status === 'PendingApproval') {
          return <ContractPendingFreelancer />;
        } else if (contractData.status === 'Rejected') {
          return <ContractRejected isClient={isClient} />;
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
