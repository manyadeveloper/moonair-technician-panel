"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { formatPhone, toTelHref } from "@/lib/utils/format";
import type { Customer } from "@/types/customer";
import { MapPin, Phone } from "lucide-react";
import { useState } from "react";

interface CustomerCardProps {
  customer: Customer;
  compact?: boolean;
}

export function CustomerCard({ customer, compact = false }: CustomerCardProps) {
  const [addressOpen, setAddressOpen] = useState(false);
  const fullAddress = `${customer.address}, ${customer.city}, ${customer.state} — ${customer.pincode}`;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <dl className={`space-y-3 text-sm ${compact ? "sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0" : ""}`}>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Customer Name
            </dt>
            <dd className="mt-0.5 font-medium text-foreground">{customer.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Primary Phone
            </dt>
            <dd className="mt-0.5">
              <a href={toTelHref(customer.phone)} className="text-accent hover:underline">
                {formatPhone(customer.phone)}
              </a>
            </dd>
          </div>
          {customer.alternate_phone && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Alternate Phone
              </dt>
              <dd className="mt-0.5">{formatPhone(customer.alternate_phone)}</dd>
            </div>
          )}
          <div className={compact ? "sm:col-span-2" : ""}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Address
            </dt>
            <dd className="mt-0.5 flex items-start gap-1.5 text-muted">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{fullAddress}</span>
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          <a href={toTelHref(customer.phone)}>
            <Button variant="outline" size="sm">
              <Phone className="h-3.5 w-3.5" />
              Call Customer
            </Button>
          </a>
          <Button variant="outline" size="sm" onClick={() => setAddressOpen(true)}>
            <MapPin className="h-3.5 w-3.5" />
            View Address
          </Button>
        </div>
      </Card>

      <Modal
        open={addressOpen}
        onClose={() => setAddressOpen(false)}
        title="Customer Address"
        description={customer.name}
        footer={
          <Button variant="outline" onClick={() => setAddressOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="text-sm leading-relaxed text-foreground">{fullAddress}</p>
      </Modal>
    </>
  );
}
