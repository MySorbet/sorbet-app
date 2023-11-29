import { getMyContactsAsync } from '@/api/contract';
import { CONTRACT } from '@/constant/constant';
import { viewMethod } from '@/utils/wallet';

import { ContractType, ProjectStatus } from '@/types';

export const getProducts = async (
  user: any,
  role: any,
  selector: any
): Promise<ContractType[]> => {
  let myContractFromM: ContractType[] = [];
  const res = await getMyContactsAsync(user?.id, role);
  myContractFromM = res.data;
  let myContractFromW = [];
  const myContractsInto: ContractType[] = [];

  if (role == 'client') {
    const clientRes = await viewMethod({
      selector: selector,
      contractId: CONTRACT,
      method: 'get_projects_by_client',
      args: { client: user?.nearWallet },
    });
    myContractFromW = clientRes;
  } else {
    const freelancerRes = await viewMethod({
      selector: selector,
      contractId: CONTRACT,
      method: 'get_projects_by_freelancer',
      args: { freelancer: user?.nearWallet },
    });
    myContractFromW = freelancerRes;
  }
  if (myContractFromM) {
    for (let i = 0; i < myContractFromM.length; i++) {
      let bContractCreated = false;
      for (let j = 0; j < myContractFromW.length; j++) {
        if (myContractFromM[i].projectId == myContractFromW[j][0]) {
          const schedules = await viewMethod({
            selector: selector,
            contractId: CONTRACT,
            method: 'get_schedules_by_projectid',
            args: {
              project_id: myContractFromW[j][0],
            },
          });
          let bAllCompleted = true;
          for (let k = 0; k < schedules.length; k++) {
            if (schedules[k][1].schedule_state != 'Approved') {
              bAllCompleted = false;
              break;
            }
          }
          if (bAllCompleted && schedules.length > 0) {
            myContractsInto.push({
              ...myContractFromM[i],
              status: ProjectStatus.Completed,
            });
          } else {
            myContractsInto.push({
              ...myContractFromM[i],
              status: ProjectStatus.InProgress,
            });
          }
          bContractCreated = true;
          break;
        }
      }
      if (!bContractCreated) {
        myContractsInto.push({
          ...myContractFromM[i],
          status: ProjectStatus.Pending,
        });
      }
    }
  }
  return myContractsInto;
};
