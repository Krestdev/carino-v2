import Link from "next/link";
import {
    FaFacebookF,
    FaWhatsapp,
    FaInstagram,
    FaTiktok,
    FaLinkedin,
} from "react-icons/fa";

const SocialSidebar = () => {
    return (
        <div className="fixed right-6 bottom-50 z-50 flex flex-col-reverse items-center  gap-2 md:gap-4">
            {/* WhatsApp */}
            <Link
                target="_blank"
                href="https://wa.me/237696541055"
                className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
                <FaWhatsapp className="text-[#25D366] text-md md:text-2xl" />
            </Link>

            {/* Facebook */}
            <Link
                target="_blank"
                href="https://www.facebook.com/LeCarinoPizzeria"
                className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
                <FaFacebookF className="text-[#1877F2] text-md md:text-2xl" />
            </Link>
            <Link
                target="_blank"
                href="https://www.tiktok.com/@lecarinopizzeria"
                className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md"
            >
                <FaTiktok className="text-black text-md md:text-2xl" />
            </Link>

            {/* Instagram */}
            <Link
                target="_blank"
                href="https://www.instagram.com/le_carino_pizzeria"
                className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md"
            >
                <FaInstagram className="text-[#E4405F] text-md md:text-2xl" />
            </Link>

            {/* LinkedIn */}
            <Link
                target="_blank"
                href="https://www.linkedin.com/company/le-carino-pizzeria"
                className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md"
            >
                <FaLinkedin className="text-[#0A66C2] text-md md:text-2xl" />
            </Link>
        </div>
    );
};

export default SocialSidebar;