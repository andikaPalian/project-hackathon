import { Link } from "react-router-dom";
import logoKira from "@/image/logo_kira_hackathon.jpeg";

const footerLinks = {
  produk: [
    { label: "Fitur", href: "/#features" },
    { label: "Cara Kerja", href: "/#how-it-works" },
    // { label: "Harga", href: "/pricing" },
  ],
  bantuan: [
    { label: "FAQ", href: "/#faq" },
    { label: "Kontak", href: "/#hero" },
    { label: "Panduan", href: "/#how-it-works" },
  ],
  legal: [
    { label: "Privasi", href: "/#hero" },
    { label: "Syarat & Ketentuan", href: "/#hero" },
  ],
};

export function Footer() {
  const handleScroll = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logoKira} alt="Logo KIRA" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold gradient-text">KIRA</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Personal AI Learning Companion untuk mahasiswa. Belajar jadi terarah, bukan sekadar
              jawaban.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      onClick={() => handleScroll(link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 KIRA. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Made with 💜 for Indonesian students</p>
        </div>
      </div>
    </footer>
  );
}
