"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

function NavigationBreadcrumb({className, lastValue}:{className?:string; lastValue?:string}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const formatSegment = (segment: string) => {
    return segment.split("-").join(" ");
  };

  // Rien à afficher pour "/"
  if (pathSegments.length === 0) return null;

  const length = pathSegments.length;

  return (
    <Breadcrumb className={cn("px-4 py-2", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
            <BreadcrumbLink className="text-base" asChild>
                <Link href={"/"} className="first-letter:uppercase">{"Accueil"}</Link>
            </BreadcrumbLink>
        </BreadcrumbItem>
      <BreadcrumbSeparator />
        {length <= 2 ? (
          // 🔹 Cas simple : 1 ou 2 segments → on affiche tout
          pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            const isLast = index === length - 1;
            const formattedSegment = formatSegment(segment);

            return (
              <React.Fragment key={href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="first-letter:uppercase text-accent text-base">
                      {lastValue ?? formattedSegment}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={href}
                        className="first-letter:uppercase text-base"
                      >
                        {formattedSegment}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })
        ) : (
          // 🔹 Cas 3+ segments : ... > avant-dernier > dernier
          <>
            {/* Ellipsis qui pointe vers le parent de l’avant-dernier, ou la racine si besoin */}
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
              >
                <Link
                  href={
                    "/" +
                    pathSegments
                      .slice(0, length - 2) // jusqu'à l’avant-dernier
                      .join("/")
                  }
                  className="first-letter:uppercase"
                >
                  <BreadcrumbEllipsis className="size-4"/>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Avant-dernier segment (lien) */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={
                    "/" +
                    pathSegments
                      .slice(0, length - 1)
                      .join("/")
                  }
                  className="first-letter:uppercase"
                >
                  {formatSegment(pathSegments[length - 2])}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Dernier segment (page courante) */}
            <BreadcrumbItem>
              <BreadcrumbPage className="first-letter:uppercase">
                {formatSegment(pathSegments[length - 1])}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default NavigationBreadcrumb;
