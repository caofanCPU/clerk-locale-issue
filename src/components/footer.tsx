import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="container mx-auto px-4 py-12 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <Zap className="h-6 w-6 text-purple-500" />
          <span className="text-xl font-bold">Reve Image</span>
        </div>
        <div className="text-gray-400 text-sm">© {new Date().getFullYear()} Reve Image. All rights reserved.</div>
      </div>
    </footer>
  )
}

