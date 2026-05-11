"use client"

import { Star } from "lucide-react"

const Reviews = () => {
    const stars = (x: number) => Array.from({ length: 5 }).map((_, index) => (
        <img key={index} src={index < x ? "/starOn.png" : "/starOff.png"} alt="" />
    ))
    return (
        <div className="flex mx-auto gap-10 py-10 md:py-12">
            <div className="w-fit px-7 flex flex-col md:flex-row items-center gap-7 md:gap-12 mx-auto">
                <div className="flex flex-col items-center gap-2 p-5">
                    <div className="flex flex-row gap-1">
                        {stars(4)}
                    </div>
                    <p className="font-medium font-general">{"4,1 sur 600+ avis"}</p>
                    <img src="/Google.png" alt="Google" />
                </div>
                <div className="flex flex-row items-start gap-3 p-5">
                    <div className="flex flex-col gap-4">
                        <p className="text_[18px] font-semibold">{"Blasco Medou"}</p>
                        <div className="flex flex-row gap-1">
                            {stars(5)}
                        </div>
                        <p className="w-[250px] md:w-[372px]">{"La cuisine est raffinée, les assiettes sont généreuses et bien présentées . Le coulis de tomates on le sent jusque dans les papilles."}</p>
                    </div>
                    <img src="google-2.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Reviews
