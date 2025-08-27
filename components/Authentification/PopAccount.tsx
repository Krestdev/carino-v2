import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import useStore from "@/context/store"
import Link from "next/link"

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
            <PopoverContent className="w-fit px-0">
                <div className="grid gap-4">
                    <div className="w-full border-b border-black pb-1">
                        <h4 className="leading-none font-medium px-4">Mon Compte</h4>
                    </div>
                    <div className="flex flex-col gap-2 px-4">
                        <Link href={"/profil"}>
                            <Button className="px-0" variant={"link"}>{"Profil"}</Button>
                        </Link>
                        <Link href={"/historique"}>
                            <Button className="px-0" variant={"link"}>{"Historique"}</Button>
                        </Link>
                        <Button className="px-0 justify-start" variant={"link"}>{`Points de fidélité: ${user?.loyalty} pts`}</Button>
                        <Button onClick={logout} className="pl-0 justify-start" variant={"link"}>{"Déconnexion"}</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default PopAccount