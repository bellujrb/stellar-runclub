import { useState, useCallback } from 'react'
import { 
  Contract, 
  SorobanRpc, 
  TransactionBuilder, 
  Networks, 
  BASE_FEE,
  xdr,
  Address,
  nativeToScVal
} from '@stellar/stellar-sdk'
import { useWallet } from '../contexts/wallet-context'

interface CreateClubData {
  name: string
  tokenSymbol: string
  description: string
  bannerImage: string | null
  totalDeposit: number
  isEquilibrated: boolean
  expirationMonths: number
  dollarsPerKm: number
}

interface CreateClubResult {
  success: boolean
  clubId?: string
  transactionHash?: string
  error?: string
}

export function useCreateClub() {
  const { publicKey, signTransaction, isConnected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clubId, setClubId] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const createClub = useCallback(async (data: CreateClubData): Promise<CreateClubResult | null> => {
    // Verificar se a carteira está conectada
    if (!isConnected || !publicKey) {
      setError('Carteira não conectada')
      return {
        success: false,
        error: 'Carteira não conectada'
      }
    }

    setIsLoading(true)
    setError(null)
    setClubId(null)
    setTransactionHash(null)

    try {
      // Configuração do contrato real
      const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID
      if (!contractId) {
        throw new Error('Contract ID não configurado')
      }

      // Configurar o servidor RPC do Soroban
      const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org')
      
      // Criar instância do contrato
      const contract = new Contract(contractId)
      
      // Obter a conta do organizador
      const sourceAccount = await server.getAccount(publicKey)
      
      // Converter parâmetros para os tipos corretos do Soroban
      const durationDays = data.expirationMonths * 30
      const usdcPerKm = Math.floor(data.dollarsPerKm * 1000000) // Converter para micro-USDC (como number)
      
      // Determinar regra de retirada
      const withdrawalRule = data.isEquilibrated ? 'Equal' : 'Proportional'
      
      // Construir a operação de criação do clube usando nativeToScVal
      const operation = contract.call(
        'create_club',
        nativeToScVal(publicKey, { type: 'address' }), // organizer
        nativeToScVal(data.name, { type: 'string' }), // name
        nativeToScVal(usdcPerKm, { type: 'u64' }), // usdc_per_km
        nativeToScVal(withdrawalRule, { type: 'symbol' }), // withdrawal_rule
        nativeToScVal(durationDays, { type: 'u32' }) // duration_days
      )
      
      // Construir a transação
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build()
      
      // Preparar a transação para o Soroban
      const preparedTransaction = await server.prepareTransaction(transaction)
      
      // Assinar a transação usando a carteira
      const signedXdr = await signTransaction(preparedTransaction.toXDR())
      
      if (!signedXdr) {
        throw new Error('Falha ao assinar a transação')
      }
      
      // Reconstruir a transação assinada
      const signedTransaction = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET)
      
      // Enviar a transação
      const result = await server.sendTransaction(signedTransaction)
      
      if (result.status === 'PENDING') {
        // Aguardar confirmação da transação
        let getResponse = await server.getTransaction(result.hash)
        
        // Aguardar até a transação ser processada
        while (getResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          getResponse = await server.getTransaction(result.hash)
        }
        
        if (getResponse.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
          // Extrair o ID do clube do resultado da transação
          const returnValue = getResponse.returnValue
          let createdClubId = `club_${Date.now()}` // Fallback
          
          if (returnValue) {
            try {
              // Tentar extrair o ID real do clube do valor de retorno
              createdClubId = returnValue.toString()
            } catch (e) {
              console.warn('Não foi possível extrair o ID do clube do resultado:', e)
            }
          }
          
          setClubId(createdClubId)
          setTransactionHash(result.hash)
          
          console.log('Clube criado com sucesso!')
          console.log('Club ID:', createdClubId)
          console.log('Transaction hash:', result.hash)
          console.log('Public Key used:', publicKey)
          
          return {
            success: true,
            clubId: createdClubId,
            transactionHash: result.hash
          }
        } else {
          throw new Error(`Transação falhou: ${getResponse.status}`)
        }
      } else {
        throw new Error(`Falha ao enviar transação: ${result.status}`)
      }
      
    } catch (err: any) {
      let errorMessage = 'Erro desconhecido ao criar clube'
      
      if (err.message) {
        errorMessage = err.message
      } else if (err.response?.data?.extras?.result_codes) {
        errorMessage = `Erro do contrato: ${JSON.stringify(err.response.data.extras.result_codes)}`
      }
      
      setError(errorMessage)
      console.error('Erro ao criar clube:', err)
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, signTransaction, isConnected])

  const resetResult = useCallback(() => {
    setError(null)
    setClubId(null)
    setTransactionHash(null)
  }, [])

  return {
    createClub,
    isLoading,
    error,
    clubId,
    transactionHash,
    resetResult
  }
}