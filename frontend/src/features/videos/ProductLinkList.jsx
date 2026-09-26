import { ArrowUpRight, ShoppingBag } from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export function ProductLinkList({ productLinks = [] }) {
  if (productLinks.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Gear used in this video"
        description="Links open in external stores"
        action={
          <span className="bg-warning/15 text-warning rounded-full px-2 py-0.5 text-xs font-semibold">
            {productLinks.length} items
          </span>
        }
      />
      <CardBody className="p-0">
        <ul className="divide-line divide-y">
          {productLinks.map((link, index) => (
            <li
              key={link.productLinkId}
              className="animate-reveal"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="hover:bg-raised/60 group flex items-center gap-3 px-4 py-3.5 transition-colors"
              >
                <span className="from-warning/25 text-warning flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br to-transparent transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <ShoppingBag size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-fg group-hover:text-primary-light block truncate text-sm font-medium transition-colors">
                    {link.productName}
                  </span>
                  {link.storeName && (
                    <span className="text-subtle block truncate text-xs">{link.storeName}</span>
                  )}
                </span>
                <span className="border-line text-subtle group-hover:border-primary/50 group-hover:bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 group-hover:rotate-45 group-hover:text-white">
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-rotate-45"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
