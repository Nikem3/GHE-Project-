import AnnouncementBar from './sections/AnnouncementBar'
import Hero from './sections/Hero'
import StatsRow from './sections/StatsRow'
import FeatureHighlights from './sections/FeatureHighlights'
import CoursePreview from './sections/CoursePreview'
import CTABanner from './sections/CTABanner'

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <StatsRow />
      <FeatureHighlights />
      <CoursePreview />
      <CTABanner />
    </>
  )
}
