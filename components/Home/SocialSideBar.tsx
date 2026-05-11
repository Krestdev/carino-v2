import Link from 'next/link';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaTiktok, FaLinkedin } from 'react-icons/fa';

const SocialSidebar = () => {
    return (
        <div className="fixed right-6 bottom-50 z-50 flex flex-col-reverse items-center group">
            <Link target='_blank'
                href="https://wa.me/237696541055"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg mt-4"
            >
                <FaWhatsapp className="text-[#25D366] text-2xl" />
            </Link>
            <Link target='_blank'
                href="https://www.facebook.com/LeCarinoPizzeria"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
                <FaFacebookF className="text-[#1877F2] text-2xl" />
            </Link>

            <div className="flex flex-col items-center gap-4 overflow-hidden max-h-0 opacity-0 group-hover:max-h-[300px] group-hover:opacity-100 group-hover:mb-4
                      transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">

                <Link target='_blank' href="https://www.tiktok.com/@lecarinopizzeria" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <FaTiktok className="text-black text-2xl" />
                </Link>

                <Link target='_blank' href="https://www.instagram.com/le_carino_pizzeria" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <FaInstagram className="text-[#E4405F] text-2xl" />
                </Link>

                <Link target='_blank' href="https://www.linkedin.com/company/le-carino-pizzeria" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <FaLinkedin className="text-black text-2xl" />
                </Link>
            </div>
        </div>
    );
};

export default SocialSidebar;