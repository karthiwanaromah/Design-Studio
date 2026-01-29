import { cn } from "@/lib/utils"

export function ColorPicker({ colors, selectedColor, onColorSelect, label }) {
  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all duration-200",
              selectedColor === color 
                ? "border-primary ring-2 ring-primary/20 scale-110" 
                : "border-transparent hover:scale-105"
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  )
}
