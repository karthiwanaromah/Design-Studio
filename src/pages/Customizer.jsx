import { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import {
  Type,
  Image as ImageIcon,
  Download,
  Save,
  Trash2,
  Layers,
  Shirt,
  Undo2,
  Loader2,
  Upload,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ColorPicker";
import { useSaveDesign } from "@/hooks/use-designs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TEXT_COLORS = [
  "#000000",
  "#FFFFFF",
  "#EF4444",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];
const CANVAS_SIZE = 600;

export default function Customizer() {
  const { toast } = useToast();
  const saveDesignMutation = useSaveDesign();

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [productName, setProductName] = useState("My Custom Product");
  const [editorReady, setEditorReady] = useState(false);

  const [side, setSide] = useState("front");
  const [inputText, setInputText] = useState("");
  const [activeObject, setActiveObject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const frontDesignRef = useRef(null);
  const backDesignRef = useRef(null);
  const bgImageRef = useRef(null);

  const hasProduct = frontImage && backImage;

  const saveCurrentDesign = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objects = canvas
      .getObjects()
      .filter((obj) => obj !== bgImageRef.current);
    const json = { objects: objects.map((obj) => obj.toObject()) };

    if (side === "front") {
      frontDesignRef.current = json;
    } else {
      backDesignRef.current = json;
    }
  }, [side]);

  const loadBackgroundImage = useCallback((imgUrl) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    return new Promise((resolve) => {
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.onload = () => {
        const img = new fabric.FabricImage(imgElement);

        const scaleX = CANVAS_SIZE / img.width;
        const scaleY = CANVAS_SIZE / img.height;
        const scale = Math.min(scaleX, scaleY);

        img.set({
          left: CANVAS_SIZE / 2,
          top: CANVAS_SIZE / 2,
          originX: "center",
          originY: "center",
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          hoverCursor: "default",
        });

        if (bgImageRef.current) {
          canvas.remove(bgImageRef.current);
        }

        bgImageRef.current = img;
        canvas.add(img);
        canvas.sendObjectToBack(img);
        canvas.renderAll();
        resolve();
      };
      imgElement.src = imgUrl;
    });
  }, []);

  const restoreDesignObjects = useCallback((designJson) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !designJson?.objects) return;

    fabric.util.enlivenObjects(designJson.objects).then((objects) => {
      objects.forEach((obj) => {
        canvas.add(obj);
      });
      canvas.renderAll();
    });
  }, []);

  const switchSide = useCallback(
    async (newSide) => {
      if (newSide === side) return;

      saveCurrentDesign();

      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      canvas.getObjects().forEach((obj) => canvas.remove(obj));
      bgImageRef.current = null;

      setSide(newSide);

      const imgUrl = newSide === "front" ? frontImage : backImage;
      if (imgUrl) {
        await loadBackgroundImage(imgUrl);

        const savedDesign =
          newSide === "front" ? frontDesignRef.current : backDesignRef.current;
        if (savedDesign) {
          restoreDesignObjects(savedDesign);
        }
      }
    },
    [
      side,
      frontImage,
      backImage,
      saveCurrentDesign,
      loadBackgroundImage,
      restoreDesignObjects,
    ],
  );

  useEffect(() => {
    if (!editorReady || !canvasRef.current) return;
    if (fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      backgroundColor: "#f3f4f6",
      preserveObjectStacking: true,
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    const updateActiveObject = () => {
      const active = canvas.getActiveObject();
      if (active === bgImageRef.current) {
        canvas.discardActiveObject();
        setActiveObject(null);
        return;
      }
      setActiveObject(active || null);
    };

    canvas.on("selection:created", updateActiveObject);
    canvas.on("selection:updated", updateActiveObject);
    canvas.on("selection:cleared", () => setActiveObject(null));

    if (frontImage) {
      loadBackgroundImage(frontImage);
    }

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [editorReady, frontImage, loadBackgroundImage]);

  const handleFrontUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      setFrontImage(f.target?.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleBackUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      setBackImage(f.target?.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleStartDesigning = () => {
    if (frontImage && backImage) {
      setEditorReady(true);
    }
  };

  const addText = () => {
    if (!fabricCanvasRef.current || !inputText.trim()) return;
    const text = new fabric.FabricText(inputText, {
      left: CANVAS_SIZE / 2,
      top: CANVAS_SIZE / 2,
      fontFamily: "Arial Black",
      fill: "#000000",
      fontSize: 40,
      originX: "center",
      originY: "center",
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    setInputText("");
    fabricCanvasRef.current.renderAll();
  };

  const handleArtworkUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result;
      const imgElement = new Image();
      imgElement.onload = () => {
        const img = new fabric.FabricImage(imgElement);

        const maxSize = 200;
        if (img.width > maxSize || img.height > maxSize) {
          const scale = maxSize / Math.max(img.width, img.height);
          img.set({ scaleX: scale, scaleY: scale });
        }

        img.set({
          left: CANVAS_SIZE / 2,
          top: CANVAS_SIZE / 2,
          originX: "center",
          originY: "center",
        });

        fabricCanvasRef.current?.add(img);
        fabricCanvasRef.current?.setActiveObject(img);
        fabricCanvasRef.current?.renderAll();
      };
      imgElement.src = data;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deleteActiveObject = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active && active !== bgImageRef.current) {
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.renderAll();
      setActiveObject(null);
    }
  };

  const changeColor = (color) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();

    if (
      active &&
      (active.type === "text" ||
        active.type === "i-text" ||
        active.type === "path")
    ) {
      active.set("fill", color);
      canvas.renderAll();
    }
  };

  const handleExport = () => {
    if (!fabricCanvasRef.current) return;
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement("a");
    link.download = `${productName.replace(/\s+/g, "-")}-${side}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Design Downloaded",
      description: "Your design has been exported as a PNG.",
    });
  };

  const handleSaveDesign = async () => {
    if (!fabricCanvasRef.current) return;
    setIsSaving(true);

    try {
      const json = fabricCanvasRef.current.toJSON();
      const preview = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 0.8,
        multiplier: 0.5,
      });

      await saveDesignMutation.mutateAsync({
        productId: 1,
        productName: productName,
        side: side,
        canvasJson: json,
        previewImage: preview,
      });
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objectsToRemove = canvas
      .getObjects()
      .filter((obj) => obj !== bgImageRef.current);
    objectsToRemove.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
    setActiveObject(null);

    if (side === "front") {
      frontDesignRef.current = null;
    } else {
      backDesignRef.current = null;
    }
  };

  const handleStartOver = () => {
    setFrontImage(null);
    setBackImage(null);
    setSide("front");
    setEditorReady(false);
    frontDesignRef.current = null;
    backDesignRef.current = null;
    bgImageRef.current = null;
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
  };

  if (!editorReady) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-card border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">
                <img
                  src="/SIBP-Logo.png"
                  style={{ height: "40px" }}
                  alt=""
                  srcset=""
                />
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Upload Your Product Images</h2>
              <p className="text-muted-foreground">
                Upload front and back images of your product to start designing
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Product Name
                </label>
                <Input
                  placeholder="My Custom Product"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  data-testid="input-product-name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Front Image</label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                    frontImage
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50",
                  )}
                >
                  {frontImage ? (
                    <div className="space-y-3">
                      <img
                        src={frontImage}
                        alt="Front"
                        className="w-full h-48 object-contain rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">
                        Front image uploaded
                      </p>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFrontUpload}
                        className="hidden"
                        data-testid="input-front-image"
                      />
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                      <p className="font-medium">Click to upload front image</p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </label>
                  )}
                </div>
                {frontImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFrontImage(null)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Back Image</label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                    backImage
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50",
                  )}
                >
                  {backImage ? (
                    <div className="space-y-3">
                      <img
                        src={backImage}
                        alt="Back"
                        className="w-full h-48 object-contain rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">
                        Back image uploaded
                      </p>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackUpload}
                        className="hidden"
                        data-testid="input-back-image"
                      />
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                      <p className="font-medium">Click to upload back image</p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </label>
                  )}
                </div>
                {backImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBackImage(null)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {frontImage && backImage && (
              <div className="text-center pt-4">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={handleStartDesigning}
                  data-testid="button-start-designing"
                >
                  Start Designing <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Shirt className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">{productName}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartOver}
              data-testid="button-start-over"
            >
              New Product
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              data-testid="button-reset"
            >
              <Undo2 className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              data-testid="button-export"
            >
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button
              size="sm"
              onClick={handleSaveDesign}
              disabled={isSaving || saveDesignMutation.isPending}
              data-testid="button-save"
            >
              {isSaving || saveDesignMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Design
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-64px)] overflow-hidden">
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2 pb-20">
          <div className="bg-card rounded-xl shadow-sm border p-5 space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Tools
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Art</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArtworkUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      data-testid="input-artwork-upload"
                    />
                    <Button
                      variant="outline"
                      className="w-full justify-start border-dashed border-2"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" /> Choose Image
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Add Text</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Your text..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addText()}
                      data-testid="input-add-text"
                    />
                    <Button
                      size="icon"
                      onClick={addText}
                      data-testid="button-add-text"
                    >
                      <Type className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Properties
              </h3>

              {activeObject ? (
                <div className="space-y-6">
                  {(activeObject.type === "text" ||
                    activeObject.type === "i-text" ||
                    activeObject.type === "path") && (
                    <ColorPicker
                      label="Color"
                      colors={TEXT_COLORS}
                      selectedColor={activeObject.fill}
                      onColorSelect={changeColor}
                    />
                  )}

                  <div className="pt-2">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={deleteActiveObject}
                      data-testid="button-delete-object"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove Object
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-8 text-center bg-muted/50 rounded-lg border border-dashed">
                  Select an object on canvas to edit properties
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex items-center justify-center bg-muted/30 rounded-2xl border-2 border-dashed border-border relative overflow-hidden">
          <div className="relative shadow-2xl rounded-lg overflow-hidden bg-card">
            <canvas ref={canvasRef} />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border flex gap-4 text-sm font-medium">
            <button
              onClick={() => switchSide("front")}
              className={cn(
                "px-3 py-1 rounded-full transition-colors",
                side === "front"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
              data-testid="button-front-view"
            >
              Front View
            </button>
            <button
              onClick={() => switchSide("back")}
              className={cn(
                "px-3 py-1 rounded-full transition-colors",
                side === "back"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
              data-testid="button-back-view"
            >
              Back View
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6 overflow-y-auto pl-2 pb-20">
          <div className="bg-card rounded-xl shadow-sm border p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Preview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={cn(
                  "aspect-square rounded-lg border-2 cursor-pointer overflow-hidden transition-all",
                  side === "front"
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-border",
                )}
                onClick={() => switchSide("front")}
              >
                {frontImage && (
                  <img
                    src={frontImage}
                    alt="Front preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div
                className={cn(
                  "aspect-square rounded-lg border-2 cursor-pointer overflow-hidden transition-all",
                  side === "back"
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-border",
                )}
                onClick={() => switchSide("back")}
              >
                {backImage && (
                  <img
                    src={backImage}
                    alt="Back preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground text-center">
              Click to switch view
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
