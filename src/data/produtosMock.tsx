// src/data/produtosMock.ts
export interface Produto {
  id: number;
  nome: string;
  imagem: string;
  preco: number; // agora é number
}

export const produtosMock: Produto[] = [
  { id: 1, nome: "Copo térmico com tampa aço inox", imagem: "../public/copo1.png", preco: 249.90 },
  { id: 2, nome: "Copo termico casca de ovo aço inox", imagem: "../public/copo2.png", preco: 179.89 },
  { id: 3, nome: "Garrafa termica aço inox", imagem: "../public/copo3.png", preco: 211.90 },
  { id: 4, nome: "Copo termico aço inox", imagem: "../public/copo4.png", preco: 139.90 },
];
