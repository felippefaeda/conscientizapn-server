import { Request, Response } from 'express';
import knex from '../database/connection';

class ColetasController {

    async show (request: Request, response: Response){
        const { bairro } = request.params;
        const dia_semana = request.query.dia_semana;

        let coletas;

        if (dia_semana){
            coletas = await knex('coletas')
                .where('coletas.bairro', String(bairro))
                .where('coletas.dia_semana', Number(dia_semana))
                .select('coletas.*')
                .orderBy(['coletas.tipo', 'coletas.dia_semana', 'coletas.horario']);
        } else {
            coletas = await knex('coletas')
                .where('coletas.bairro', String(bairro))
                .select('coletas.*')
                .orderBy(['coletas.tipo', 'coletas.dia_semana', 'coletas.horario']);
        }  
        
        return response.json(coletas);        
    }

    async create(request: Request, response: Response) {
        const {
            tipo,
            bairro,
            dia_semana,
            periodo,
            horario,
        } = request.body;

        const trx = await knex.transaction();

        const coleta = {
            tipo,
            bairro,
            dia_semana,
            periodo,
            horario,
        };

        console.log(coleta);

        const codigo = await trx('coletas').insert(coleta);

        await trx.commit();

        return response.json({
            codigo,
            ...coleta,
        })
    }

    async delete(request: Request, response: Response){
        const { id } = request.params;

        try {
            await knex('coletas').delete().where('codigo', id);
        } catch (error) {
            console.log(error);
        }
    }
}

export default ColetasController;