import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, Layers, Download } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary-foreground text-sm font-medium mb-6 animate-in fade-in-50 zoom-in-95 duration-700">
            Next Gen Customization
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
            Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Unique Style</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create custom apparel in minutes. Upload your art, add text, and visualize your product in 3D-like quality before you buy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/customizer">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Start Creating <Palette className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                View Gallery <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 -mt-32 relative z-20">
            {[
              {
                icon: <Palette className="w-8 h-8 text-primary" />,
                title: "Easy Editor",
                desc: "Intuitive drag-and-drop interface powered by advanced canvas technology."
              },
              {
                icon: <Layers className="w-8 h-8 text-indigo-500" />,
                title: "Premium Products",
                desc: "Choose from our curated collection of high-quality fabrics and cuts."
              },
              {
                icon: <Download className="w-8 h-8 text-blue-500" />,
                title: "Instant Export",
                desc: "Download high-resolution mockups of your designs instantly."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
