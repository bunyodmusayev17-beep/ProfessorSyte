import { ArrowUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { InstagramIcon, TelegramIcon, YoutubeIcon } from '@/components/ui/SocialIcons';
import { SOCIAL_LINKS } from '@/constants/social';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { env } from '@/lib/env';

import { Brand } from './Brand';

const SOCIALS = [
  {
    key: 'instagram',
    label: 'Instagram',
    icon: InstagramIcon,
    href: SOCIAL_LINKS.instagram,
    // Instagram's own sunset gradient on hover.
    hover:
      'hover:border-transparent hover:bg-[linear-gradient(45deg,#f58529,#dd2a7b,#8134af,#515bd4)] hover:shadow-[0_10px_30px_-8px_rgb(221_42_123_/_0.7)]',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: YoutubeIcon,
    href: SOCIAL_LINKS.youtube,
    hover:
      'hover:border-transparent hover:bg-[#ff0033] hover:shadow-[0_10px_30px_-8px_rgb(255_0_51_/_0.7)]',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    icon: TelegramIcon,
    href: SOCIAL_LINKS.telegram,
    hover:
      'hover:border-transparent hover:bg-[#229ed9] hover:shadow-[0_10px_30px_-8px_rgb(34_158_217_/_0.7)]',
  },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-fg mb-4 text-sm font-semibold">{title}</h3>
      <ul className="space-y-2.5">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className="text-muted hover:text-fg group inline-flex items-center gap-2 text-sm transition-colors"
            >
              <span className="bg-brand h-px w-0 transition-all duration-300 group-hover:w-3" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SocialLinks({ className }) {
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {SOCIALS.map(({ key, label, icon: Icon, href, hover }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={cn(
              'border-line bg-raised/60 text-muted flex size-11 items-center justify-center rounded-xl border',
              'transition-all duration-300 ease-(--ease-spring) hover:-translate-y-1 hover:scale-110 hover:text-white',
              hover
            )}
          >
            <Icon size={19} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const { isAuthenticated } = useAuth();
  const year = new Date().getFullYear();

  const learnLinks = [
    { to: '/videos', label: 'All videos' },
    { to: '/projects', label: 'Projects' },
    ...(isAuthenticated ? [{ to: '/my-progress', label: 'My progress' }] : []),
  ];
  const accountLinks = isAuthenticated
    ? [{ to: '/my-progress', label: 'Saved videos' }]
    : [
        { to: '/login', label: 'Sign in' },
        { to: '/register', label: 'Create account' },
      ];

  return (
    <footer className="border-line relative mt-16 overflow-hidden border-t">
      {/* Glowing hairline + ambient light along the top edge. */}
      <span className="via-primary/60 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />
      <span className="bg-primary/10 pointer-events-none absolute -top-40 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full blur-3xl" />

      <div className="relative px-4 pt-12 pb-28 md:px-8 md:pb-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div className="max-w-xs">
            <Brand />
            <p className="text-muted mt-4 text-sm leading-relaxed">
              Hands-on lessons in Arduino, 3D printing, robotics and drones — with the exact gear
              list for every build.
            </p>
          </div>

          <FooterColumn title="Learn" links={learnLinks} />
          <FooterColumn title="Account" links={accountLinks} />

          <div>
            <h3 className="text-fg mb-4 text-sm font-semibold">Follow us</h3>
            <p className="text-muted mb-4 text-sm">New builds and behind-the-scenes every week.</p>
            <SocialLinks />
          </div>
        </div>

        <div className="border-line mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-subtle flex items-center gap-1.5 text-xs">
            © {year} {env.appName}. Made with
            <Heart size={12} className="fill-danger text-danger animate-pulse" />
            for makers.
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-muted hover:text-fg group flex items-center gap-2 text-xs transition-colors"
          >
            Back to top
            <span className="border-line bg-raised/60 group-hover:border-primary/50 group-hover:bg-primary/15 flex size-8 items-center justify-center rounded-lg border transition-all duration-300 group-hover:-translate-y-0.5">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
