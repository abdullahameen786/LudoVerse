function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-3xl
        bg-white
        shadow-lg
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;