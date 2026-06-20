'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import { adminNavItems } from '@/lib/constants/admin-navitems';

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
          <Menu className="h-12 w-12" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-50! max-w-[75vw]!">
        <SheetHeader>
          <SheetTitle>Admin Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-2">
          {adminNavItems.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 hover:bg-accent"
              >
                {item.title}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
