import CareerTimeline from "@/components/career-timeline"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Career Timeline",
  description: "Interactive timeline showcasing Soumitra Ghosh's career progression and key projects from 1995 to 2025",
}

export default function CareerTimelinePage() {
  return <CareerTimeline />
}
