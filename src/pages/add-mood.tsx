import { Navbar } from '@/components/navbar/navbar.tsx'

export function AddMood() {
  return (
    <>
      <main>
        <DayPreview />
        <FavoriteMoods />
        <SelectFromMoodCollection />
        <div>
          <SelectedMood />
          <MoodEntry />
          <SubmitMood />
        </div>
      </main>
      <Navbar active="add" />
    </>
  )
}