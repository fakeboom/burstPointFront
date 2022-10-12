import { Web3Provider } from '@ethersproject/providers'
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import { ethers } from 'ethers';

export default function getLibrary(provider: any): Web3Provider | any {
  const test1 =  sapphire.wrap(
    ethers.getDefaultProvider(sapphire.NETWORKS.testnet.defaultGateway),
  );
 
  test1.pollingInterval = 3000
  const library = new Web3Provider(sapphire.wrap(window.ethereum as any) , 'any')
  library.pollingInterval = 3000
  
  return library
  return sapphire.wrap(
    ethers.getDefaultProvider(sapphire.NETWORKS.testnet.defaultGateway),
  );
}