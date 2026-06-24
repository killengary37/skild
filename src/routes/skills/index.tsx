import { getSkills, type GetSkillsData } from '#/dataconnect-generated';
import { dataConnect } from '#/lib/firebase'
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import SkillCard from "#/components/SkillCard";
import Search from '#/components/Search';


const productSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  q: z.string().catch('').transform((value) => value.trim())
})

const DEFAULT_PAGE_SIZE = 10;

export const searchSkillsFn = createServerFn({ method: 'GET'})
  .validator(productSearchSchema)
  .handler(async ({ data }): Promise<GetSkillsData["skills"]> => {
    try {
      const response = await getSkills(dataConnect, {
        searchTerm: data.q || undefined,
        limit: DEFAULT_PAGE_SIZE,
        offset: (data.page -1) * DEFAULT_PAGE_SIZE
      })

      return response.data.skills;
    } catch (error) {
      console.error(error)
      throw error;

    }
  })

export const Route = createFileRoute('/skills/')({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q }),
  loader: ({ deps }) => searchSkillsFn({ data: deps })
})

function RouteComponent() {
  // Search Params
  const { q } = Route.useSearch();
  const skills = Route.useLoaderData();

  const navigate = Route.useNavigate();

  const handleQueryChange = (value: string) => {
    if(value === q) return;

    navigate({
      search: (prev) => ( {...prev, q: value, page: 1}),
      replace: true,
    })
  }

  return <div id ="skills-page">
    <section className="intro">
      <header>
        <h1>Explore <span className="text-gradient">Skills</span></h1>
        <p>Browse, filter, and inspect reusable AI capabilities from a single registry.</p>
      </header>

      <Search query={q} resultCount={skills.length} onQueryChange={handleQueryChange}/>
      
    </section>

    <section className="results">
      {skills.length > 0 ? (
        <div className="skills-grid">
          {skills.map((skill) => (
            <SkillCard key={skill.id} {...skill}/>
          ))}
        </div>
      ) : <p className="empty-state">
        {q ? `No skills found for "${q}` : `No skills available.`}
      </p>}
    </section>
  </div>
}
