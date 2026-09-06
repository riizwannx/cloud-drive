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
      <div className="page-shell max-w-5xl">

        {/* ============================== */}
        {/* Header */}
        {/* ============================== */}

        <div>

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft
              size={18}
              className="mr-2"
            />

            Back
          </Button>

          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-500"><Crown className="h-6 w-6" /></div>
          <h1 className="page-heading">
            CloudDrive Plans
          </h1>

          <p className="page-description">
            Choose the plan that fits your storage needs.
          </p>

        </div>

        {/* ============================== */}
        {/* Plans */}
        {/* ============================== */}

        <div className="grid gap-5 md:grid-cols-2">

          {/* ============================== */}
          {/* Free Plan */}
          {/* ============================== */}

          <div className="surface-card rounded-2xl p-6">

            <div className="flex items-center gap-4">

              <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary">
                <HardDrive size={24} />
              </div>

              <div>

                <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                  Free
                </h2>

                <p className="text-sm text-muted-foreground">
                  Perfect for getting started.
                </p>

              </div>

            </div>

            <div className="mt-6">

              <span className="text-4xl font-semibold tracking-[-0.04em]">
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
              className="mt-8 h-11 w-full rounded-xl"
            >
              Current Plan
            </Button>

          </div>

          {/* ============================== */}
          {/* VIP Plan */}
          {/* ============================== */}

          <div className="relative overflow-hidden rounded-2xl border border-indigo-400/40 bg-gradient-to-br from-indigo-500/10 via-card to-blue-500/10 p-6 shadow-xl shadow-indigo-500/10">

            {/* Recommended Badge */}

            <div className="absolute right-5 top-5 rounded-full bg-indigo-500 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-white">
              RECOMMENDED
            </div>

            <div className="flex items-center gap-4">

              <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-500/15">

                <Crown
                  size={24}
                  className="text-indigo-600 dark:text-indigo-300"
                />

              </div>

              <div>

                <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                  VIP
                </h2>

                <p className="text-sm text-muted-foreground">
                  For users who need more.
                </p>

              </div>

            </div>

            <div className="mt-6">

              <span className="text-4xl font-semibold tracking-[-0.04em]">
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
              className="mt-8 h-11 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 shadow-md shadow-indigo-500/20"
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

        <div className="surface-card rounded-2xl bg-secondary/35 p-6">

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
