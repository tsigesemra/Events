'use client';
import Image from "next/image";

const ExploreBtn = () => {
    return (
        <button type="button" id="exptlore-btn" className="mt-7 mx-auto">
            <a href="#events">
                Explore Events
                <Image src="/icons/arrow-down.svg" alt="arrow-dowen" width={24} height={24} />
            </a>
        </button>
    )
}

export default ExploreBtn