"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, LayoutGrid, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const THEME_OPTIONS = [
  { id: "dark", name: "Based", color: "hsl(25, 95%, 55%)" },
  { id: "dracula", name: "Dracula", color: "hsl(265, 89%, 68%)" },
  { id: "light", name: "Light", color: "hsl(0, 0%, 98%)" },
  { id: "atom", name: "Atom One Dark", color: "hsl(220, 75%, 60%)" },
  { id: "tokyo", name: "Tokyo Night", color: "hsl(237, 51%, 60%)" },
  { id: "monokai-pro", name: "Monokai Pro", color: "hsl(135, 94%, 65%)" },
  {
    id: "monokai-classic",
    name: "Monokai Classic",
    color: "hsl(330, 100%, 70%)",
  },
  { id: "terminal", name: "Terminal", color: "hsl(120, 100%, 50%)" },
  { id: "custom", name: "Custom", color: "hsl(0, 0%, 50%)" },
];

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { setTheme, theme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[80vh] overflow-auto"
        data-testid="dialog-settings"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">App Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="colors"
              className="gap-2"
              data-testid="tab-colors"
            >
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger
              value="fonts"
              className="gap-2"
              data-testid="tab-fonts"
            >
              <Type className="h-4 w-4" />
              Fonts
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="gap-2"
              data-testid="tab-layout"
            >
              <LayoutGrid className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="gap-2"
              data-testid="tab-security"
            >
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6 pt-6">
            <div>
              <h3 className="text-sm font-semibold mb-4">Theme Options</h3>
              <div className="grid grid-cols-3 gap-3">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    className="relative group overflow-hidden rounded-lg border border-border hover-elevate active-elevate-2"
                    onClick={() => {
                      console.log("theme", theme.id);

                      setTheme(theme.id);
                    }}
                    data-testid={`button-theme-${theme.id}`}
                  >
                    <div
                      className="aspect-video bg-card p-3"
                      onClick={() => {
                        console.log("sss");
                      }}
                    >
                      <div
                        className="h-2 w-full rounded-sm mb-2"
                        style={{ backgroundColor: theme.color }}
                      />
                      <div className="flex gap-1">
                        <div className="h-1 w-1/3 bg-accent rounded-sm" />
                        <div className="h-1 w-2/3 bg-muted rounded-sm" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-3 py-2 text-sm font-medium">
                      {theme.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fonts" className="space-y-6 pt-6">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold">Customize Fonts</h3>
              <Button
                variant="outline"
                size="sm"
                data-testid="button-font-reset"
              >
                Reset
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Headers & Labels
                </label>
                <Select defaultValue="inter">
                  <SelectTrigger data-testid="select-header-font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="open-sans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Numbers & Data
                </label>
                <Select defaultValue="jetbrains">
                  <SelectTrigger data-testid="select-data-font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jetbrains">JetBrains Mono</SelectItem>
                    <SelectItem value="roboto-mono">Roboto Mono</SelectItem>
                    <SelectItem value="source-code">Source Code Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Preview</h4>
                <div className="bg-card p-4 rounded-lg space-y-2">
                  <div className="text-xl font-semibold">BTC/USD</div>
                  <div className="text-sm text-muted-foreground">Bitcoin</div>
                  <div className="font-mono text-2xl text-success">
                    $120,250.50
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Order Book: </span>
                    <span className="font-mono text-danger">43,251.00</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6 pt-6">
            <div>
              <h3 className="text-sm font-semibold mb-4">Widget Layout</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="p-4 border border-border rounded-lg hover-elevate flex items-center gap-3 bg-primary/10"
                  data-testid="button-lock-layout"
                >
                  <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                    <LayoutGrid className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-medium">Lock Layout</span>
                </button>
                <button
                  className="p-4 border border-border rounded-lg hover-elevate flex items-center gap-3"
                  data-testid="button-unlock-layout"
                >
                  <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                    <LayoutGrid className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Unlock Layout</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">
                Input & Dropdown Style
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Select Line Style
                  </label>
                  <div className="p-3 bg-card rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-1">
                      Sample line style
                    </div>
                    <div className="font-mono">USDC</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Select Box Style
                  </label>
                  <div className="p-3 bg-card rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-1">
                      Sample box style
                    </div>
                    <div className="font-mono">USDC</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Audio Settings</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="p-4 border border-border rounded-lg hover-elevate flex items-center gap-3 bg-primary/10"
                  data-testid="button-audio-on"
                >
                  <div className="h-8 w-8 bg-primary rounded-md" />
                  <span className="font-medium">Order Fill Audio On</span>
                </button>
                <button
                  className="p-4 border border-border rounded-lg hover-elevate flex items-center gap-3"
                  data-testid="button-audio-off"
                >
                  <div className="h-8 w-8 bg-muted rounded-md" />
                  <span className="font-medium">Order Fill Audio Off</span>
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="pt-6">
            <div className="text-sm text-muted-foreground text-center py-8">
              Security settings will be available in the full version
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
