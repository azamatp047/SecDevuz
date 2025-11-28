import Link from "next/link"
import { motion } from "framer-motion"

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  isScrolled: boolean;
  minWidth: number;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  isActive,
  onClick,
  isScrolled,
  minWidth,
}) => {
  return (
    <Link href={href} className="relative block" onClick={onClick}>
      <motion.span
        className={`
          relative inline-block text-sm font-medium transition-colors duration-200
          ${isActive ? "font-black text-blue-400" : ""}
          ${!isActive && isScrolled ? "text-white" : ""}
          hover:text-blue-500
        `}
        style={{
          minWidth: `${minWidth}px`,
          height: "2rem",
          lineHeight: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {label}
      </motion.span>
    </Link>
  )
}
