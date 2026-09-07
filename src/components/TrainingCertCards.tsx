 "use client"

 import React from "react"
 import Image from "next/image"
 import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
 import { Badge } from "@/components/ui/badge"

 interface Certification {
   title: string
   institution: string
   duration?: string
   description?: string
   logo?: string
   achievement?: string
   certificate?: string | string[]
   // optional separate image/url fields
   certificate_image?: string | string[]
   certificate_url?: string
 }

 interface TrainingCertCardsProps {
   certifications: Certification[]
 }

 const getImageUrl = (url: string) => {
   if (!url) return url
   if (url.includes("drive.google.com/file/d/")) {
     const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1]
     if (fileId) {
       return `https://drive.google.com/uc?export=view&id=${fileId}`
     }
   }
   return url
 }

 function CertificationCard({ cert }: { cert: Certification }) {
   const containerRef = React.useRef<HTMLDivElement | null>(null)
   const [visible, setVisible] = React.useState(false)
   const [loaded, setLoaded] = React.useState(false)
   const [paused, setPaused] = React.useState(false)
   const [index, setIndex] = React.useState(0)

   const slides: string[] = React.useMemo(() => {
     if (cert.certificate) return Array.isArray(cert.certificate) ? cert.certificate : [cert.certificate]
     if (cert.certificate_image) return Array.isArray(cert.certificate_image) ? cert.certificate_image : [cert.certificate_image]
     return []
   }, [cert.certificate, cert.certificate_image])

   const isExternal = (url: string) => /^https?:\/\//.test(url)

   React.useEffect(() => {
     const el = containerRef.current
     if (!el) return
     const obs = new IntersectionObserver(
       (entries) => {
         if (entries.some((e) => e.isIntersecting)) {
           setVisible(true)
         }
       },
       { threshold: 0.15 }
     )
     obs.observe(el)
     return () => obs.disconnect()
   }, [])

   React.useEffect(() => {
     if (visible) setLoaded(true)
   }, [visible])

   React.useEffect(() => {
     if (!loaded || !visible || paused || slides.length <= 1) return
     const t = setInterval(() => {
       setIndex((i) => (i + 1) % slides.length)
     }, 5000)
     return () => clearInterval(t)
   }, [loaded, visible, paused, slides.length])

   const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
   const next = () => setIndex((i) => (i + 1) % slides.length)
   const openCurrent = () => {
     // prefer explicit certificate_url if provided
     if (cert.certificate_url) {
       window.open(cert.certificate_url, "_blank", "noopener,noreferrer")
       return
     }
     const url = slides[index]
     if (!url) return
     const final = getImageUrl(url)
     window.open(final, "_blank", "noopener,noreferrer")
   }

   const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
     if (e.key === "ArrowLeft") prev()
     if (e.key === "ArrowRight") next()
     if (e.key === "Enter") openCurrent()
   }

   return (
     <Card
       ref={containerRef}
       tabIndex={0}
       onKeyDown={onKeyDown}
       onMouseEnter={() => setPaused(true)}
       onMouseLeave={() => setPaused(false)}
       onFocus={() => setPaused(true)}
       onBlur={() => setPaused(false)}
       className="relative hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700 floating-glass"
     >
       <CardHeader>
         <div className="flex items-start justify-between gap-4">
           <div className="min-w-0 space-y-1.5">
             <CardTitle className="text-xl dark:text-white transition-colors">{cert.title}</CardTitle>
             <CardDescription className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 transition-colors">
               {cert.institution}
             </CardDescription>
           </div>
           {cert.logo && (
             <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white p-1 ring-1 ring-slate-200 dark:ring-white/20">
               <Image src={cert.logo} alt={`${cert.institution} logo`} width={48} height={48} className="h-full w-full object-contain" />
             </div>
           )}
         </div>
       </CardHeader>

       <CardContent>
         <p className="text-slate-600 dark:text-slate-300 mb-4 transition-colors">{cert.description}</p>
         <div className="flex justify-between items-center">
           <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-300">
             {cert.duration}
           </Badge>
           {cert.achievement && (
             <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">{cert.achievement}</Badge>
           )}
         </div>

         <div className="mt-4">
           {loaded && slides.length > 0 ? (
             <div
               className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden group cursor-pointer"
               onClick={openCurrent}
             >
               <Image
                 src={getImageUrl(slides[index])}
                 alt={`${cert.title} certificate ${index + 1}`}
                 fill
                 className="object-contain transition-transform duration-300 group-hover:scale-105"
               />

              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                {slides.length > 1 && (
                  <>
                    <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      {index + 1} / {slides.length}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); prev() }} className="bg-black/50 text-white p-1 rounded" aria-label="Previous certificate">‹</button>
                      <button onClick={(e) => { e.stopPropagation(); next() }} className="bg-black/50 text-white p-1 rounded" aria-label="Next certificate">›</button>
                    </div>
                  </>
                )}
              </div>
             </div>
           ) : null}
         </div>

        {/* removed Verify/View CTA per request */}
       </CardContent>
     </Card>
   )
 }

 export default function TrainingCertCards({ certifications }: TrainingCertCardsProps) {
   return (
     <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
       {certifications.map((cert, i) => (
         <CertificationCard key={i} cert={cert} />
       ))}
     </div>
   )
 }

