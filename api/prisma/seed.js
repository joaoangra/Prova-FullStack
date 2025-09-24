const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar perfis
  const perfis = await Promise.all([
    prisma.perfil.create({ data: { perfil: 'Comum' } }),
    prisma.perfil.create({ data: { perfil: 'Administrador' } }),
    prisma.perfil.create({ data: { perfil: 'Tecnico' } }),
    prisma.perfil.create({ data: { perfil: 'Gerente' } })
  ]);

  console.log('Perfis criados:', perfis.length);

  // Criar usuários
  const usuarios = await Promise.all([
    prisma.usuario.create({ data: { senha: '111111', perfilId: 1 } }),
    prisma.usuario.create({ data: { senha: '212121', perfilId: 2 } }),
    prisma.usuario.create({ data: { senha: '414141', perfilId: 4 } }),
    prisma.usuario.create({ data: { senha: '313131', perfilId: 3 } })
  ]);

  console.log('Usuários criados:', usuarios.length);

  // Criar equipamentos
  const equipamentos = await Promise.all([
    prisma.equipamento.create({
      data: {
        equipamento: 'Torno Mecânico 500mm Modelo BV20L 220V - TTM520 - Tander',
        imagem: 'Torno_Mecanico_500mm.png',
        descricao: 'O Torno Mecânico Tander TTM520 é uma ferramenta utilizada por vários profissionais na confecção e acabamento de inúmeras peças metálicas, tais como: eixos, polias, pinos, roscas, peças cilíndricas internas e externas, cones, esferas, entre outros. Este torno vem com motor monofásico de 220V e 550W de potência, o que lhe confere maior torque e vida útil, menor consumo de energia e baixo índice de manutenção. Possui interruptor magnético com a função de travagem de emergência, rotação frente/reversa e a função de proteção ao torno e aos componentes elétricos.',
        ativo: true,
        data: new Date('2019-10-01T14:54:20.873Z')
      }
    }),
    prisma.equipamento.create({
      data: {
        equipamento: 'Processador Intel Core i9-7920X Skylake, Cache 16.5MB, 2.9GHz (4.3GHz Max Turbo), LGA 2066 - BX80673I97920X',
        imagem: 'Intel_Core_i9.png',
        descricao: 'Com esse processador inovador e incrível você desfruta ao máximo o verdadeiro potencial do seu computador e desfruta da mais pura velocidade. Maximize o seu desempenho seja trabalhando, jogando, navegando ou assistindo o seu filme preferido, com esse processador você pode tudo!',
        ativo: true,
        data: new Date('2019-10-01T15:00:20.873Z')
      }
    }),
    prisma.equipamento.create({
      data: {
        equipamento: 'Monitor, Dell, U2518D, UltraSharp, Preto e Suporte em Alumínio, 25"',
        imagem: 'Monitor_Dell.png',
        descricao: 'Dê vida ao seu trabalho com uma tela de 25 polegadas quase sem bordas que conta com detalhes em cores vívidas e consistentes graças a tecnologia hdr, resolução qhd e ângulo de visão ultra-amplo. Aumente sua performance com os recursos dell display manager, dell easy arrange e trabalhe confortavelmente graça a um suporte totalmente ajustável e recurso confortview.',
        ativo: false,
        data: new Date('2018-10-01T10:00:20.000Z')
      }
    }),
    prisma.equipamento.create({
      data: {
        equipamento: 'Mouse Gamer Razer Deathadder Essential Óptico 5 Botões 4G 6.400 DPI',
        imagem: 'Mouse_Razer.png',
        descricao: 'Nada melhor do que um mouse gamer com tecnologia de ponta para qualificar seus comandos e aprimorar suas jogadas nos games. Com este Mouse Gamer Razer, sua atuação nas batalhas gamers serão ainda mais bem-sucedidas, com desempenho acima da média e desenvoltura arrasadora, que vai deixar seus oponentes impressionados. O mouse Razer Deathadder Essential tem sensor óptico de 6400 DPI de 4G, 5 botões, design moderno e ergonômico, especialmente projetado para jogadores destros, e uma empunhadura lateral emborrachada que garante mais firmeza ao manuseio do equipamento, melhorando as respostas obtidas pelos players.',
        ativo: true,
        data: new Date('2017-10-01T09:00:20.000Z')
      }
    }),
    prisma.equipamento.create({
      data: {
        equipamento: 'All-in-One Media Keyboard',
        imagem: 'Teclado_Microsoft.png',
        descricao: 'O All-in-One Media Keyboard é o dispositivo ideal para sua sala ou home office. Com teclado em tamanho natural e trackpad multitoque integrado, é possível digitar, passar o dedo, arrastar, fazer zoom e clicar facilmente. O teclado com teclas de atalho de mídia personalizáveis permite que a Web e suas músicas, fotos e filmes favoritos estejam a seu alcance.',
        ativo: false,
        data: new Date('2017-10-01T13:00:00.000Z')
      }
    })
  ]);

  console.log('Equipamentos criados:', equipamentos.length);

  // Criar comentários (agora usando usuarioId)
  // usuarios: [1:Comum, 2:Administrador, 3:Gerente, 4:Tecnico]
  const comentarios = await Promise.all([
    prisma.comentario.create({
      data: {
        comentario: 'Deverá fazer o download do aplicativo da Razer para alterar a cor do mouse.',
        equipamentoId: 2,
        usuarioId: 4,
        data: new Date('2020-09-07T18:00:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Problema de aquecimento no processador após 1 ano de uso.',
        equipamentoId: 2,
        usuarioId: 2,
        data: new Date('2020-05-04T10:30:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Problema de aquecimento no processador após 3 anos de uso.',
        equipamentoId: 3,
        usuarioId: 4,
        data: new Date('2021-03-04T15:30:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Realizada a manutenção preventiva',
        equipamentoId: 3,
        usuarioId: 1,
        data: new Date('2021-06-05T09:30:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Realizada a manutenção corretiva',
        equipamentoId: 4,
        usuarioId: 1,
        data: new Date('2021-07-10T08:00:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Realizada a manutenção corretiva',
        equipamentoId: 5,
        usuarioId: 2,
        data: new Date('2021-07-13T09:00:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Realizada a manutenção corretiva',
        equipamentoId: 3,
        usuarioId: 2,
        data: new Date('2021-08-10T10:00:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Realizada a manutenção corretiva',
        equipamentoId: 4,
        usuarioId: 3,
        data: new Date('2021-09-18T17:00:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Realizada a manutenção corretiva',
        equipamentoId: 5,
        usuarioId: 3,
        data: new Date('2021-10-11T11:00:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Realizada a manutenção corretiva',
        equipamentoId: 3,
        usuarioId: 4,
        data: new Date('2021-11-21T12:00:00.000Z')
      }
    }),
    prisma.comentario.create({
      data: {
        comentario: 'Realizada a manutenção corretiva',
        equipamentoId: 5,
        usuarioId: 4,
        data: new Date('2021-12-22T13:00:00.000Z')
      }
    })
  ]);

  console.log('Comentários criados:', comentarios.length);
  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

