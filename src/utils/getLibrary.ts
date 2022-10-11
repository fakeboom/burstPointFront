import { Web3Provider } from '@ethersproject/providers'
import * as sapphire from '@oasisprotocol/sapphire-paratime';

export default function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 3000
  return library
}