import { Response, Request } from "express";
import knex from "../database/connection";

class OcorrenciasController{

    async search(request: Request, response: Response) {
        const ocorrencias = await knex('ocorrencias').select('*');

        const serializedItems = ocorrencias.map((ocorrencia) => {
            return {
                id: ocorrencia.id,
                dataa: ocorrencia.dataa,
                endereco: ocorrencia.endereco,
                status: ocorrencia.status,
                descricao: ocorrencia.descricao,
                latitude: ocorrencia.latitude,
                longitude: ocorrencia.longitude,
                foto: ocorrencia.foto
            };
        });

        console.log(ocorrencias);

        return response.json(serializedItems);
    }

    async delete(request: Request, response: Response){
        const { id } = request.params;

        try {
            await knex('ocorrencias').delete().where('id', id);
        } catch (error) {
            console.log(error);
        }
    }


    async create(request:Request, response: Response) {
        const {
            dataa,
            endereco,
            status,
            descricao,
            latitude,
            longitude,
            foto
        } = request.body

        const trx = await knex.transaction();

        const ocorrencia = {
            dataa,
            endereco,
            status,
            descricao,
            latitude,
            longitude,
            foto
        };

        await knex('ocorrencias').insert({
            dataa,
            endereco,
            status,
            descricao,
            latitude,
            longitude,
            foto,
        });
        
        const codigo = await trx('ocorrencias').insert(ocorrencia);

        await trx.commit();

        return response.json({
            codigo,
            ...ocorrencia
        })
    }

    async show(request:Request, response:Response){
        const ocorrencias = await knex('ocorrencias').select('*');

        const serializedOcorrencias = ocorrencias.map(ocorrencia =>{
            return{
                id:ocorrencia.id,
                dataa:ocorrencia.dataa,
                endereco: ocorrencia.endereco,
                status: ocorrencia.status,
                descricao: ocorrencia.descricao,
                latitude: ocorrencia.latitude,
                longitude: ocorrencia.longitude,
                foto:ocorrencia.foto,
            };
        });
        return response.json(serializedOcorrencias);
    }

    async showId(request:Request, response:Response){
        const {id} = request.params;
        
        const ocorrencia = await knex('ocorrencias').where('id', id).first();
        if(!ocorrencia){
            return response.status(400).json({message: 'Point not found.'});
        }
        const serializedOcorrencias ={
            ...ocorrencia
        }
        return response.json(serializedOcorrencias)
    }


    async update(request: Request, response: Response) {
        const {
            id,
            dataa,
            endereco,
            status,
            descricao,
            latitude,
            longitude,
            foto

        } = request.body;

        const trx = await knex.transaction();

        const ocorrencia = {
            id,
            dataa,
            endereco,
            status,
            descricao,
            latitude,
            longitude,
            foto
           
        };

        await trx('ocorrencias').where('id', id).update(ocorrencia);

        // const pointItems = items.map((items_id: number) => {
        //     return {
        //         points_id: id,
        //         items_id: items_id                
        //     };
        // });

        // await trx('points_items').where('points_id', id).delete();

        // await trx('points_items').insert(pointItems);

        await trx.commit();

        return response.json({
            ...ocorrencia
        });
    }

};
export default OcorrenciasController;