import { sequelize } from '../config/database.js';
import { Product } from '../models/product.model.js';
import { logger } from '../utils/logger.js';

/**
 * Catálogo curado para desenvolvimento/demo (~46 itens, ~15 categorias),
 * usando imagens copiadas de c:\projects\Zap-List\server\src\imgs. Não é o
 * catálogo completo do projeto original (~150 itens) — os dados reais desse
 * catálogo (nomes, categorias, preços) só existem no banco de produção
 * antigo, não em um arquivo de seed, então não puderam ser migrados
 * automaticamente. Rodar de novo é seguro: usa `name` como chave para
 * criar-ou-atualizar (idempotente).
 */
const products = [
  { name: 'Arroz', category: 'Grãos', photo: 'arroz.png', price: 24.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Feijão', category: 'Grãos', photo: 'feijao.png', price: 8.5, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Macarrão Espaguete', category: 'Massas', photo: 'macarraoEspaguete.png', price: 5.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Leite', category: 'Laticínios e ovos', photo: 'leite.png', price: 5.2, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Ovos', category: 'Laticínios e ovos', photo: 'ovos.png', price: 12.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Queijo Mussarela', category: 'Laticínios e ovos', photo: 'queijoMussarela.png', price: 45.9, averageWeightGrams: 400, unitOfMeasure: 'Unidade', unitOfCalculation: 'KG' },
  { name: 'Iogurte', category: 'Laticínios e ovos', photo: 'iogurte.png', price: 4.5, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Manteiga', category: 'Laticínios e ovos', photo: 'manteiga.png', price: 9.9, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Banana', category: 'Frutas', photo: 'banana.png', price: 6.9, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Maçã', category: 'Frutas', photo: 'maca.png', price: 8.9, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Laranja', category: 'Frutas', photo: 'laranja.png', price: 4.9, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Tomate', category: 'Legumes', photo: 'tomate.png', price: 7.9, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Cebola', category: 'Legumes', photo: 'cebola.png', price: 5.9, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Batata', category: 'Legumes', photo: 'batata.png', price: 6.5, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Cenoura', category: 'Legumes', photo: 'cenoura.png', price: 5.5, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Alface', category: 'Verduras', photo: 'alface.png', price: 3.5, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Alho', category: 'Temperos e especiarias', photo: 'alho.png', price: 4.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Sal', category: 'Temperos e especiarias', photo: 'sal.png', price: 3.2, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Orégano', category: 'Temperos e especiarias', photo: 'oregano.png', price: 4.5, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Açúcar', category: 'Açúcares e adoçantes', photo: 'acucar.png', price: 6.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Mel', category: 'Açúcares e adoçantes', photo: 'mel.png', price: 18.9, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Café em Pó', category: 'Chás e cafés', photo: 'cafeEmPo.png', price: 14.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Pão de Forma', category: 'Padaria', photo: 'paoDeForma.png', price: 8.9, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Pão Francês', category: 'Padaria', photo: 'paoFrances.png', price: 16.0, averageWeightGrams: 50, unitOfMeasure: 'Unidade', unitOfCalculation: 'KG' },
  { name: 'Molho de Tomate', category: 'Conservas e enlatados', photo: 'molhoDeTomate.png', price: 3.9, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Milho Enlatado', category: 'Conservas e enlatados', photo: 'milhoEnlatado.png', price: 5.5, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Cerveja', category: 'Bebidas', photo: 'cerveja.png', price: 4.5, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Refrigerante', category: 'Bebidas', photo: 'refrigerante.png', price: 8.9, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Suco de Uva', category: 'Bebidas', photo: 'sucoDeUva.png', price: 12.9, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Carne', category: 'Carnes', photo: 'carne.png', price: 45.9, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Peito de Frango', category: 'Carnes', photo: 'peitoDeFrango.png', price: 18.9, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Linguiça de Frango', category: 'Carnes', photo: 'linguicaDeFrango.png', price: 22.9, unitOfMeasure: 'KG', unitOfCalculation: 'KG' },
  { name: 'Detergente', category: 'Material de limpeza', photo: 'detergente.png', price: 2.5, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Sabão em Pó', category: 'Material de limpeza', photo: 'sabaoEmPo.png', price: 19.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Água Sanitária', category: 'Material de limpeza', photo: 'aguaSanitaria.png', price: 6.5, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Papel Higiênico', category: 'Material de higiene', photo: 'papelHigienico.png', price: 22.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Sabonete', category: 'Material de higiene', photo: 'sabonete.png', price: 2.9, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Pasta de Dente', category: 'Material de higiene', photo: 'pastaDeDente.png', price: 6.9, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Chocolate', category: 'Doces e guloseimas', photo: 'chocolate.png', price: 8.5, unitOfMeasure: 'Unidade', unitOfCalculation: 'Unidade' },
  { name: 'Bala', category: 'Doces e guloseimas', photo: 'bala.png', price: 4.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Biscoito Recheado', category: 'Biscoitos e salgadinhos', photo: 'biscoitoRecheado.png', price: 5.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Salgadinho', category: 'Biscoitos e salgadinhos', photo: 'salgadinho.png', price: 7.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Nuggets', category: 'Congelados', photo: 'nuggets.png', price: 16.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Batata Frita Congelada', category: 'Congelados', photo: 'batataFrita.png', price: 14.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Ração', category: 'Itens pra cachorro', photo: 'raçao.png', price: 89.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
  { name: 'Petisco', category: 'Itens pra cachorro', photo: 'petisco.png', price: 12.9, unitOfMeasure: 'Pacote', unitOfCalculation: 'Pacote' },
];

try {
  await sequelize.authenticate();

  for (const data of products) {
    await Product.findOrCreate({ where: { name: data.name }, defaults: data });
  }

  logger.info(`Seed concluído: ${products.length} produtos verificados/criados.`);
  process.exit(0);
} catch (error) {
  logger.error('Falha ao popular produtos', error);
  process.exit(1);
}
