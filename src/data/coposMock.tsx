export interface tiposCopos {
  id: number;
  nome: string;
  imagem: string;
}

export const tiposCoposMock: tiposCopos[] = [
  { id: 1, nome: "Everyday", imagem: "../public/tipo1.png" },
  { id: 2, nome: "Wine", imagem: "../public/tipo2.png" },
  { id: 3, nome: "Quencher", imagem: "../public/tipo3.png" },
  { id: 4, nome: "Growler", imagem: "../public/tipo4.png" },
];
