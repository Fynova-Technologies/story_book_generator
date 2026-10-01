import { Link } from "react-router-dom";
const instagramIcon = "/assets/icons/SocialMedia/Instagram.png";
const facebookIcon = "/assets/icons/SocialMedia/Facebook.png";
const twitterIcon = "/assets/icons/SocialMedia/Twitter.png";
const linkedInIcon = "/assets/icons/SocialMedia/Linkedin.png";
const youTubeIcon = "/assets/icons/SocialMedia/Youtube.png";

const navLinks = [
  { label: "Templates", href: "/templates" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "Samples", href: "/samples" },
  { label: "Pricing", href: "/pricing" },
];

// Social links stay hidden until they have real URLs (href "#").
const socialLinks = [
  {
    id: 1,
    name: "Facebook",
    href: "#",
    icon: facebookIcon,
  },
  {
    id: 2,
    name: "Instagram",
    href: "#",
    icon: instagramIcon,
  },
  {
    id: 3,
    name: "X / Twitter",
    href: "#",
    icon: twitterIcon,
  },
  {
    id: 4,
    name: "LinkedIn",
    href: "#",
    icon: linkedInIcon,
  },
  {
    id: 5,
    name: "YouTube",
    href: "#",
    icon: youTubeIcon,
  },
];

const Footer = () => {
  return (
    <footer
      data-bg="dark"
      className="w-full bg-dark-bg"
    >
      <div className="max-w-8xl mx-auto px-6 md:px-8 xl:px-10 py-10 pb-15">

        {/* ── TOP ROW — Logo + Nav Links + Social Icons ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5">

          {/* ── Logo ── */}
          <div
            className="text-2xl font-bold text-dark-text flex-shrink-0"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Logo
          </div>

          {/* ── Nav Links ── */}
          <div className="flex items-center flex-wrap justify-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="font-body font-bold text-sm text-dark-text opacity-70 hover:opacity-100 hover:text-dark-primary 
                transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Social Icons ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {socialLinks.filter((social) => social.href !== "#").map((social) => (
              <a
                key={social.id}
                href={social.href}
                aria-label={social.name}
                className="w-8 h-8 flex items-center justify-center text-dark-text opacity-70 hover:opacity-100
                 hover:text-dark-primary transition-all duration-200"
              >
                {social.icon ? (
                    <img src={social.icon} alt={social.name} className="w-5 h-5" />
                ) : null}
              </a>
            ))}
          </div>

        </div>

        {/* ── DIVIDER ── */}
        <div className="w-full h-px bg-dark-text opacity-100 my-6" />

        {/* ── BOTTOM ROW — Copyright ── */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">

          {/* Copyright */}
          <p className="font-body text-xs text-dark-text opacity-50">
            © 2026 Storybook AI
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
