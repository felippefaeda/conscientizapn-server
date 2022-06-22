import {Knex} from 'knex';
export async function seed(knex: Knex){
    await knex('items').insert([
        {id:1, title: 'Orgânico', image:'organicos.svg'},
        {id:2, title: 'Papel', image:'papeis-papelao.svg'},
        {id:3, title: 'Óleo', image:'oleo.svg'},
        {id:4, title: 'Eletrônico', image:'eletronicos.svg'},
        {id:5, title: 'Pilhas', image:'baterias.svg'},
        {id:6, title: 'Lâmpadas', image:'lampadas.svg'},
    ]);
}