function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold transition-all duration-200";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700",

    outline:
      "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",

    secondary:
      "bg-gray-100 hover:bg-gray-200",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;