import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuestionStore } from '@/store/questionStore';
import { Award, Star, BookOpen, Layers } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export const ProfileDialog = () => {
  const store = useQuestionStore();
  const { 
    profileOpen, 
    setProfileOpen, 
    questions, 
    topics, 
    subTopics 
  } = store;

  const completedCount = questions.filter(q => q.completed).length;
  const totalCount = questions.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const starredQuestions = questions.filter(q => q.isStarred);
  const starredTopics = topics.filter(t => t.isStarred);
  const starredSubTopics = subTopics.filter(st => st.isStarred);

  return (
    <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">U</span>
            </div>
            User Profile
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
            <Award className="h-8 w-8 text-yellow-500" />
            <div className="text-3xl font-bold">{completedCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Problems Solved</div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
            <div className="relative h-12 w-12 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted/20"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                />
              </svg>
              <span className="absolute text-xs font-bold">{percentage}%</span>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Progress</div>
          </div>
           <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="text-3xl font-bold">
              {starredQuestions.length + starredTopics.length + starredSubTopics.length}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Starred Items</div>
          </div>
        </div>

        <Tabs defaultValue="questions" className="flex-1 flex flex-col mt-6 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questions" className="gap-2">
                <BookOpen className="h-4 w-4" /> Questions ({starredQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="topics" className="gap-2">
                <Layers className="h-4 w-4" /> Topics ({starredTopics.length})
            </TabsTrigger>
            <TabsTrigger value="subtopics" className="gap-2">
                <Layers className="h-4 w-4" /> Sub-Topics ({starredSubTopics.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 border rounded-md mt-2 p-4">
            <TabsContent value="questions" className="mt-0 space-y-2">
              {starredQuestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No starred questions yet.</div>
              ) : (
                starredQuestions.map(q => (
                  <div key={q.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${q.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {q.title}
                        </span>
                        <Badge variant="outline" className="text-[10px]">{q.difficulty}</Badge>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 text-yellow-500 hover:text-yellow-600"
                        onClick={() => store.toggleStarQuestion(q.id)}
                    >
                        <Star className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="topics" className="mt-0 space-y-2">
               {starredTopics.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No starred topics yet.</div>
              ) : (
                starredTopics.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                     <span className="font-semibold">{t.name}</span>
                     <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 text-yellow-500 hover:text-yellow-600"
                        onClick={() => store.toggleStarTopic(t.id)}
                    >
                        <Star className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="subtopics" className="mt-0 space-y-2">
               {starredSubTopics.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No starred sub-topics yet.</div>
              ) : (
                starredSubTopics.map(st => {
                    const topicName = topics.find(t => t.id === st.topicId)?.name;
                    return (
                        <div key={st.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                            <div className="flex flex-col">
                                <span className="font-medium">{st.name}</span>
                                {topicName && <span className="text-xs text-muted-foreground">{topicName}</span>}
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 text-yellow-500 hover:text-yellow-600"
                                onClick={() => store.toggleStarSubTopic(st.id)}
                            >
                                <Star className="h-4 w-4 fill-current" />
                            </Button>
                        </div>
                    );
                })
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
};
