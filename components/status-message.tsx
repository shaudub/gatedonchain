interface StatusMessageProps {
  message: string
}

export default function StatusMessage({ message }: StatusMessageProps) {
  // Parse the message for transaction hash and explorer URL
  const lines = message.split('\n')
  const isSuccessMessage = message.includes('✅ Payment successful!')
  
  const bgClass = isSuccessMessage 
    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
    : message.includes('❌')
    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
    : "bg-gray-100 dark:bg-gray-700"
  
  const textClass = isSuccessMessage
    ? "text-green-700 dark:text-green-200"
    : message.includes('❌')
    ? "text-red-700 dark:text-red-200" 
    : "text-gray-700 dark:text-gray-200"

  return (
    <div className={`${bgClass} rounded-lg p-4 ${textClass}`}>
      {lines.map((line, index) => {
        // Check if line contains a URL
        if (line.includes('📋 View on explorer:')) {
          const url = line.split('📋 View on explorer: ')[1]
          return (
            <p key={index} className="flex items-center space-x-2">
              <span>📋 View on explorer:</span>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-mono text-sm"
              >
                {url.split('/').pop()}
              </a>
            </p>
          )
        }
        
        // Check if line contains transaction hash
        if (line.includes('🔗 Transaction:')) {
          const txHash = line.split('🔗 Transaction: ')[1]
          return (
            <p key={index} className="font-mono text-sm">
              <span>🔗 Transaction: </span>
              <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                {txHash}
              </span>
            </p>
          )
        }
        
        return <p key={index}>{line}</p>
      })}
    </div>
  )
}
