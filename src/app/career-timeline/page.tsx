import CareerTimeline from "@/components/career-timeline"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Career Timeline - Soumitra Ghosh",
  description: "Interactive timeline showcasing my career progression and key projects from 1995 to 2025",
}

export default function CareerTimelinePage() {
  return <CareerTimeline />
}
