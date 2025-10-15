"use client";

import { useTheme } from "next-themes";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-[200px]">Theme: {theme}</SelectTrigger>
      <SelectContent>
        <SelectItem value="based">Based</SelectItem>
        <SelectItem value="dracula">Dracula</SelectItem>
        <SelectItem value="tokyo">Tokyo Night</SelectItem>
        <SelectItem value="light">Light</SelectItem>
      </SelectContent>
    </Select>
  );
}
