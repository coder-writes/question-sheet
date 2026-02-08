
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ideas = [
  {
    title: "1. Random Question Picker (Focus Mode)",
    problem: "Students often waste time deciding which question to solve next.",
    solution: "A simple tool that picks a question for you based on your filters.",
    benefit: "Removes decision fatigue and simulates interview pressure.",
  },
  {
    title: "2. Competition Mode (Friends Practice)",
    problem: "Practicing alone reduces motivation.",
    solution: "A mode where you and your friends solve the same set of questions.",
    benefit: "Encourages healthy competition and consistency.",
  },
  {
    title: "3. Environment-Based Practice",
    problem: "Students practice randomly without matching real interview environments.",
    solution: "Predefined modes: Interview (timed, no hints), Contest (mixed), Revision (weak areas).",
    benefit: "Improves adaptability and real-world readiness.",
  },
  {
    title: "4. Smart Ranking System",
    problem: "Global rankings can be discouraging.",
    solution: "Self-ranking based on personal progress and consistency, not just speed.",
    benefit: "Encourages a growth mindset and reduces unnecessary pressure.",
  },
  {
    title: "5. Asynchronous Challenge Mode",
    problem: "Friends are rarely available at the same time.",
    solution: "Send challenge links to friends to solve at their convenience.",
    benefit: "Flexible collaboration without scheduling conflicts.",
  },
];

const UniqueIdeas = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="-ml-3 h-10 w-10 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Project Roadmap & Ideas
            </h1>
            <p className="text-muted-foreground text-lg">
              A collection of features we're planning to build.
            </p>
          </div>
        </div>
        
        <div className="space-y-16">
          {ideas.map((idea, index) => (
            <div key={index} className="relative pl-6 border-l-2 border-muted hover:border-primary/50 transition-colors">
              <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">
                {idea.title}
              </h2>
              
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground text-sm uppercase tracking-wide block mb-1">The Problem</span>
                  <p className="leading-relaxed">{idea.problem}</p>
                </div>
                
                <div>
                  <span className="font-medium text-foreground text-sm uppercase tracking-wide block mb-1">Our Solution</span>
                  <p className="leading-relaxed">{idea.solution}</p>
                </div>

                <div>
                   <span className="font-medium text-foreground text-sm uppercase tracking-wide block mb-1">Why it helps</span>
                   <p className="leading-relaxed">{idea.benefit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t text-center text-muted-foreground">
          <p>Have more ideas? reaching out.</p>
        </div>
      </div>
    </div>
  );
};

export default UniqueIdeas;
