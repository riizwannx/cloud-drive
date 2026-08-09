import {
  Check,
  Crown,
  HardDrive,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";

export default function Upgrade() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* ============================== */}
        {/* Header */}
        {/* ============================== */}

        <div>

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft
              size={18}
              className="mr-2"
            />

            Back
          </Button>

          <h1 className="text-4xl font-bold">
            CloudDrive Plans
          </h1>

          <p className="mt-2 text-muted-foreground">
            Choose the plan that fits your storage needs.
          </p>

        </div>

        {/* ============================== */}
        {/* Plans */}
        {/* ============================== */}

        <div className="grid gap-6 md:grid-cols-2">

          {/* ============================== */}
          {/* Free Plan */}
          {/* ============================== */}

          <div className="rounded-2xl border bg-card p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <HardDrive size={24} />
              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Free
                </h2>

                <p className="text-sm text-muted-foreground">
                  Perfect for getting started.
                </p>

              </div>

            </div>

            <div className="mt-6">

              <span className="text-4xl font-bold">
                ₹0
              </span>

              <span className="ml-2 text-muted-foreground">
                / forever
              </span>

            </div>

            <div className="my-6 h-px bg-border" />

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Check
                  size={18}
                  className="text-green-600"
                />

                <span>
                  5 GB cloud storage
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check
                  size={18}
                  className="text-green-600"
                />

                <span>
                  File upload and download
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check
                  size={18}
                  className="text-green-600"
                />

                <span>
                  Folders and file organization
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check
                  size={18}
                  className="text-green-600"
                />

                <span>
                  Favorites and Trash
                </span>
              </div>

            </div>

            <Button
              variant="outline"
              disabled
              className="mt-8 w-full"
            >
              Current Plan
            </Button>

          </div>

          {/* ============================== */}
          {/* VIP Plan */}
          {/* ============================== */}

          <div className="relative rounded-2xl border-2 border-primary bg-card p-6 shadow-md">

            {/* Recommended Badge */}

            <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              RECOMMENDED
            </div>

            <div className="flex items-center gap-4">

              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">

                <Crown
                  size={24}
                  className="text-primary"
                />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  VIP
                </h2>

                <p className="text-sm text-muted-foreground">
                  For users who need more.
                </p>

              </div>

            </div>

            <div className="mt-6">

              <span className="text-4xl font-bold">
                Coming Soon
              </span>

            </div>

            <div className="my-6 h-px bg-border" />

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Check
                  size={18}
                  className="text-green-600"
                />

                <span>
                  Increased storage
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check
                  size={18}
                  className="text-green-600"
                />

                <span>
                  VIP account status
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check
                  size={18}
                  className="text-green-600"
                />

                <span>
                  Extended file recovery
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check
                  size={18}
                  className="text-green-600"
                />

                <span>
                  Additional CloudDrive features
                </span>
              </div>

            </div>

            <Button
              className="mt-8 w-full"
              onClick={() =>
                alert(
                  "VIP plans and payment options are coming soon."
                )
              }
            >
              <Crown
                size={18}
                className="mr-2"
              />

              Upgrade to VIP
            </Button>

          </div>

        </div>

        {/* ============================== */}
        {/* Information */}
        {/* ============================== */}

        <div className="rounded-2xl border bg-muted/30 p-6">

          <h2 className="font-semibold">
            About CloudDrive Plans
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            CloudDrive currently provides 5 GB of storage
            for free. VIP plans are under development and
            will be available once payment and subscription
            features are ready.
          </p>

        </div>

      </div>
    </MainLayout>
  );
}