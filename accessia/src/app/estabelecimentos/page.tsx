interface EstabelecimentosProps {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface ResponseProps {
  estabelecimentos: EstabelecimentosProps[];
}

export default async function EstabelecimentosPage() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data: EstabelecimentosProps[] = await response.json();

  console.log(data);

  return (
    <div className="flex flex-col gap-4">
      <h1>Todos os Estabelecimentos encontrados</h1>
    </div>
  );
}