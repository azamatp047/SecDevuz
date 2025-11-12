import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

// Shuffle hook (siz yozganingiz)
const useTextShuffle = (text: string, isHovered: boolean): string => {
  const [displayText, setDisplayText] = useState<string>(text)

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text)
      return
    }

    let iteration = 0
    const maxIterations = 12

    const interval = setInterval(() => {
      const chars = text.split("")
      for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[chars[i], chars[j]] = [chars[j], chars[i]]
      }
      setDisplayText(chars.join(""))

      iteration++
      if (iteration >= maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [text, isHovered])

  return displayText
}

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
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const shuffledText = useTextShuffle(label, isHovered)

  return (
    <Link href={href} className="relative block" onClick={onClick}>
      <motion.span
        className={`relative inline-block text-sm font-medium transition-colors duration-200 hover:text-blue-500 ${
          isActive
            ? "font-black! text-blue-400 "
            : isScrolled
            ? "text-white "
            : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          minWidth: `${minWidth}px`,
          height: "2rem",
          lineHeight: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="block">{shuffledText}</span>
      </motion.span>
    </Link>
  )
}
