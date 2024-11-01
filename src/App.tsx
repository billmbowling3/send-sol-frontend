import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import Page from './components/Page'
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import "@solana/wallet-adapter-react-ui/styles.css"

const ENDPOINT = clusterApiUrl("devnet")
const wallets = [new walletAdapterWallets.PhantomWalletAdapter()]

function App() {

  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <Page/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
