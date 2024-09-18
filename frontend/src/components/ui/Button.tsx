import { FC, ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  size = "medium",
  fullWidth = false,
  loading = false,
  children,
  className,
  ...props
}) => {
  const baseStyles =
    "text-white bg-deepRed font-medium shadow-md border border-grey transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deepRed relative";

  const sizeStyles = clsx({
    "px-3 py-2 text-sm rounded-md": size === "small",
    "px-4 py-2 text-base rounded-lg": size === "medium",
    "px-5 py-3 text-base rounded-xl": size === "large", // Adjusted for larger screens
  });

  const fullWidthStyles = fullWidth ? "w-full" : "";

  const hoverStyles =
    "hover:bg-deepRed-dark hover:border-deepRed-dark hover:shadow-lg active:bg-deepRed-darker active:border-deepRed-darker active:shadow-sm";

  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles,
        fullWidthStyles,
        hoverStyles,
        {
          [disabledStyles]: loading || props.disabled,
        },
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="flex justify-center items-center">
          <LoaderCircle className="animate-spin text-sm sm:text-base md:text-sm lg:text-base" />
        </div>
      ) : (
        <span className="text-sm sm:text-base md:text-sm lg:text-base">
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;
