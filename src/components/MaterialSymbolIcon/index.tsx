import { Icon, type IconProps } from "@mui/material";
import { forwardRef } from "react";
import type { MaterialSymbolWeight, SymbolCodepoints } from "./materialSymbols";

export interface MaterialSymbolIconProps extends IconProps {
  icon: SymbolCodepoints;
  fill?: boolean;
  weight?: MaterialSymbolWeight;
  grade?: number;
  size?: number;
}

const MaterialSymbolIcon = forwardRef<HTMLSpanElement, MaterialSymbolIconProps>(
  ({ icon, fill, weight, grade, size, sx, className, ...props }, ref) => {
    return (
      <Icon
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        sx={{
          fontVariationSettings: `"FILL" ${fill ? 1 : 0}, "GRAD" ${grade ?? 0}`,
          fontWeight: weight,
          fontSize: `${size ?? 24}px`,
          transition: `font-variation-settings 300ms`,
          fontFamily: "Material Symbols Rounded Variable",
          lineHeight: "1em",
          ...(sx || {}),
        }}
        ref={ref}
      >
        {icon}
      </Icon>
    );
  }
);

export default MaterialSymbolIcon;
