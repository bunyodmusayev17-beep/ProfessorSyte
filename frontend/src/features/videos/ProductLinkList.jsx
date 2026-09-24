import { ExternalLink, ShoppingBag } from 'lucide-react';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export function ProductLinkList({ productLinks = [] }) {
  if (productLinks.length === 0) return null;

  return (
    <Card>
      <CardHeader title="Gear used in this video" description="Links open in external stores" />
      <CardBody className="p-0">
        <ul className="divide-line divide-y">
          {productLinks.map((link) => (
            <li key={link.productLinkId}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="hover:bg-raised group flex items-center gap-3 px-4 py-3 transition-colors"
              >
                <span className="bg-primary/15 text-primary-light flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <ShoppingBag size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-fg group-hover:text-primary-light block truncate text-sm font-medium transition-colors">
                    {link.productName}
                  </span>
                  {link.storeName && (
                    <span className="text-subtle block truncate text-xs">{link.storeName}</span>
                  )}
                </span>
                <ExternalLink size={14} className="text-subtle shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
