import React, { CSSProperties } from "react";

export interface IActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties["cursor"];
}

export function Action({
  active,
  className,
  cursor,
  style,
  ...props
}: IActionProps) {
  return (
    <button
      {...props}
      className={`${className} action`}
      tabIndex={0}
      style={
        {
          ...style,
          cursor,
          "--fill": active?.fill,
          "--background": active?.background,
        } as CSSProperties
      }
    />
  );
}
