import BookRatingCard from "@/components/BookRatingCard";

const bookData = {
  title: "O Pequeno Príncipe",
  author: "Antoine de Saint-Exupéry",
  coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop&q=80",
  overallRating: 5,
  criteria: [
    {
      label: "🌟 História e Enredo",
      rating: 5,
      comment:
        "Uma narrativa encantadora que mistura simplicidade com profundidade filosófica. Cada capítulo revela camadas de significado que tocam leitores de todas as idades.",
    },
    {
      label: "💫 Desenvolvimento dos Personagens",
      rating: 4,
      comment:
        "O Pequeno Príncipe e a Raposa são inesquecíveis. Os personagens dos planetas são deliciosamente simbólicos, embora alguns pudessem ter mais espaço.",
    },
    {
      label: "✍️ Estilo de Escrita",
      rating: 5,
      comment:
        "Poético, delicado e fluido como um sonho. Saint-Exupéry transforma palavras simples em verdades universais com uma elegância rara.",
    },
    {
      label: "💖 Envolvimento Geral",
      rating: 5,
      comment:
        "Um livro que aquece o coração e faz pensar. Impossível não se emocionar — daqueles que a gente relê e descobre algo novo a cada vez.",
    },
  ],
  summary:
    "O Pequeno Príncipe é uma obra-prima atemporal que merece cada um dos seus 5 morangos! 🍓 Uma leitura obrigatória que nos lembra das coisas mais importantes da vida — aquelas que só se vê bem com o coração. Perfeito para qualquer momento e qualquer idade!",
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <BookRatingCard {...bookData} />
    </div>
  );
};

export default Index;
