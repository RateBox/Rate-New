import React from "react"
import { Data } from "@repo/strapi"

import { BasicImageProps, StrapiBasicImage } from "./StrapiBasicImage"
import { StrapiLink, StrapiLinkProps } from "./StrapiLink"

interface Props {
  readonly component:
    | Data.Component<"utilities.image-with-link">
    | undefined
    | null
  readonly imageProps?: Omit<BasicImageProps, "component">
  readonly linkProps?: Omit<StrapiLinkProps, "component" | "children">
}

export function StrapiImageWithLink({
  component,
  imageProps,
  linkProps,
}: Props) {
  return (
    <StrapiLink component={component?.link} {...linkProps}>
      <StrapiBasicImage component={component?.image} {...imageProps} />
    </StrapiLink>
  )
}

StrapiImageWithLink.displayName = "StrapiImageWithLink"

export default StrapiImageWithLink
