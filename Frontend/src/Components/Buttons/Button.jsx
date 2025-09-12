const Button = ({ children, onClick, styles = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-full px-5 py-2 m-2 w-[132px] h-[40px]
        font-semibold transition duration-200
        ${disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
          : "bg-black text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
        }
        ${styles}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
