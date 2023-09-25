import { redirect } from 'next/navigation'
export default function JobDescription() {
  async function getKeywords(formData: FormData) {
    'use server'
    const jobDescription = formData.get("jobDescription")
    const keywords = ['python', 'nodejs']
    // chat gpt?
    //    add good contextual information about the types of keywords that you care about makes a big difference
    // some other api like textrazor, etc.
    redirect(`/updated-resume?keywords=${encodeURIComponent(keywords.join(' '))}`)

  }
  return (
    <section>
      <h2 className="font-bold">Applications</h2>
      <form action={getKeywords} className="flex flex-col gap-2 p-4">
        <label>Job descrption</label>
        <textarea id="jobDescription" name="jobDescription" className="border-2 h-96" />
        <button type="submit" className="bg-gray-200 rounded-md p-2">Get keywords</button>
      </form>
    </section>
  )
}
