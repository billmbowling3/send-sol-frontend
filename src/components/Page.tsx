import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { ChangeEvent, FormEvent, useState } from "react"
import * as web3 from "@solana/web3.js"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

const Page = (): React.ReactElement => {
  const [solToSend, setSolToSend] = useState(0)
  const [transactionStatus, setTransactionStatus] = useState("No Transaction in place")
  const [receiverPublicKey, setReceiverPublicKey] = useState("")
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const handleSolChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sol = Number.parseInt(event.target.value, 10)
    setSolToSend(sol)
  }

  console.log(solToSend)

  const handlePubKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReceiverPublicKey(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setTransactionStatus("Transaction Started")
    event.preventDefault()
    
    if(solToSend <= 0 || !receiverPublicKey || !publicKey)
    {
      return
    }

    // Extract Receiver Public Key
    let toPubKey;
    try {
      toPubKey = new web3.PublicKey(receiverPublicKey)
    } catch (error) {
      console.error("Receiver Public Key Error: ", error)
      return
    }

    // Create Transaction
    const transaction = new web3.Transaction()

    // Create Instruction
    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new web3.PublicKey(toPubKey),
      lamports: solToSend * web3.LAMPORTS_PER_SOL
    })

    transaction.add(sendSolInstruction)

    // Execute Transaction
    let signature
    try {
      signature = await sendTransaction(transaction, connection)
    } catch (error) {
      console.error("Error during transaction: ", error)
      setTransactionStatus("Failed")
      return;
    }

    setTransactionStatus(`Finished. Signature: ${signature}`)
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      rowGap: "24px"
    }}>
      <WalletMultiButton />

      <form 
        action="" 
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          columnGap: "8px"
        }}
      >
        <input 
          type="number" 
          name='sol' 
          value={solToSend}
          onChange={handleSolChange}
        />

        <input  
          name='pubKey' 
          placeholder="Pub"
          value={receiverPublicKey}
          onChange={handlePubKeyChange}
        />

        <button>Send</button>
      </form>

      <span>{transactionStatus}</span>
    </div>
  )
}

export default Page