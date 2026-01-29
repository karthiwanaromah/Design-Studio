import { useDesigns } from "@/hooks/use-designs"
import { Loader2, ArrowRight, ImageIcon } from "lucide-react"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"

export default function Gallery() {
  const { data: designs, isLoading, error } = useDesigns()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md text-center space-y-4 p-6 bg-white rounded-xl shadow border">
          <h2 className="text-xl font-bold text-destructive">Unable to Load Designs</h2>
          <p className="text-muted-foreground">Something went wrong while fetching the gallery.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
               <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900">Design Gallery</h1>
               <p className="mt-2 text-muted-foreground max-w-2xl">
                 Browse through the collection of custom designs you have created.
               </p>
             </div>
             <Link href="/customizer">
               <Button size="lg" className="shadow-lg shadow-primary/20">
                 Create New Design <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
             </Link>
           </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {designs && designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map((design) => (
              <div 
                key={design.id} 
                className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img 
                    src={design.previewImage} 
                    alt={design.productName}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">{design.productName}</h3>
                    <span className="text-xs font-medium uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md border">
                      {design.side}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full text-xs h-9">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <ImageIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold">No designs yet</h3>
              <p className="text-muted-foreground">
                Be the first to create a custom masterpiece! Use our studio to design your own product.
              </p>
              <Link href="/customizer">
                <Button size="lg">Start Designing</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
