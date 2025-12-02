export const Footer = () => {

  return (
    <footer className="bg-white dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Data provided by{' '}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition-colors"
            >
              PokeAPI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
