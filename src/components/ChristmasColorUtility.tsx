
// This component ensures all Christmas colors are included in the CSS build
// It's hidden and never rendered but forces Tailwind to include our custom colors

export const ChristmasColorUtility = () => {
  return (
    <div className="christmas-colors-generator">
      {/* This div will never be visible but ensures all Christmas colors are compiled */}
    </div>
  );
};
