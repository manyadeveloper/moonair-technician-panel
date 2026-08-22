import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  const warrantyVariant =
    product.warranty_status === "active"
      ? "success"
      : product.warranty_status === "expired"
        ? "warning"
        : "error";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <div className="mb-4">
        <p className="text-base font-semibold text-gray-900">{product.name}</p>
        <p className="text-sm text-muted">Model: {product.model_number}</p>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Serial Number
          </dt>
          <dd className="mt-0.5 font-mono text-xs text-gray-700">
            {product.serial_number}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Category
          </dt>
          <dd className="mt-0.5 text-gray-700">{product.category}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Purchase Date
          </dt>
          <dd className="mt-0.5 text-gray-700">
            {formatDate(product.purchase_date)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Warranty
          </dt>
          <dd className="mt-0.5">
            <Badge variant={warrantyVariant}>
              {product.warranty_status === "active"
                ? "Active"
                : product.warranty_status === "expired"
                  ? "Expired"
                  : "Void"}
            </Badge>
          </dd>
        </div>
        {product.dealer && (
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Dealer
            </dt>
            <dd className="mt-0.5 text-gray-700">{product.dealer}</dd>
          </div>
        )}
        {product.installation_date && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Installation Date
            </dt>
            <dd className="mt-0.5 text-gray-700">
              {formatDate(product.installation_date)}
            </dd>
          </div>
        )}
      </dl>
    </Card>
  );
}
