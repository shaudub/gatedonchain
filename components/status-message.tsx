interface StatusMessageProps {
  message: string
}

export default function StatusMessage({ message }: StatusMessageProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-gray-700 dark:text-gray-200">
      <p>{message}</p>
    </div>
  )
}
