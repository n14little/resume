import ResumePDF from "./ResumePDF";

type PageProps = {
  searchParams: {
    keywords?: string;
  };
}
export default function UpdatedResume(props: PageProps) {
  const keywords: string[] = props.searchParams.keywords?.split(' ') || []
  const keywordSet = new Set(keywords)

  return (
    <div className="flex flex-row gap-2">
      <ResumePDF keywords={keywordSet} />
    </div>
  )

}
