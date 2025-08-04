export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800 dark:text-white">SecureFile</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Help
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
