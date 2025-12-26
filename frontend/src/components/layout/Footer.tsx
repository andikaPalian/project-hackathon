import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const footerLinks = {
  produk: [
    { label: 'Fitur', href: '/#features' },
    { label: 'Cara Kerja', href: '/#how-it-works' },
    { label: 'Harga', href: '/pricing' },
  ],
  bantuan: [
    { label: 'FAQ', href: '/#faq' },
    { label: 'Kontak', href: '/contact' },
    { label: 'Panduan', href: '/guide' },
  ],
  legal: [
    { label: 'Privasi', href: '/privacy' },
    { label: 'Syarat & Ketentuan', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold gradient-text">KARI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Personal AI Learning Companion untuk mahasiswa. Belajar jadi terarah, bukan sekadar jawaban.
            </p>
          </div>

          {/* Produk */}
          <div>
            <h4 className="font-semibold mb-4">Produk</h4>
            <ul className="space-y-2">
              {footerLinks.produk.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2">
              {footerLinks.bantuan.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 KARI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with 💜 for Indonesian students
          </p>
        </div>
      </div>
    </footer>
  );
}