import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useStore from "@/context/store"
import Link from "next/link"
import { User, History, LogOut } from "lucide-react"

interface Props {
    children: React.JSX.Element
}

const PopAccount = ({ children }: Props) => {
    const { logout, user } = useStore()
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent 
                className="w-56 p-0 rounded-lg shadow-lg border border-gray-200"
                sideOffset={5}
            >
                <div className="py-1">
                    {/* Email utilisateur */}
                    <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email || "Mon compte"}
                        </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                        <Link href="/profil">
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start gap-2 rounded-none px-3 py-2 h-auto text-sm font-normal"
                            >
                                <User className="w-4 h-4" />
                                Profil
                            </Button>
                        </Link>

                        <Link href="/historique">
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start gap-2 rounded-none px-3 py-2 h-auto text-sm font-normal"
                            >
                                <History className="w-4 h-4" />
                                Historique
                            </Button>
                        </Link>

                        <Button 
                            onClick={logout}
                            variant="ghost" 
                            className="w-full justify-start gap-2 rounded-none px-3 py-2 h-auto text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default PopAccount