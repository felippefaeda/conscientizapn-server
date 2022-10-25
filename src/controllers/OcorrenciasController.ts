import { Response, Request } from "express";
import knex from "../database/connection";

class OcorrenciasController{

    async search(request: Request, response: Response) {
        const { bairro, status } = request.params;
        let ocorrencias;

        if(bairro == "Todos" && status == "Todos"){
            ocorrencias = await knex('ocorrencias').select('*');
        } else if(bairro != "Todos" && status == "Todos"){
            ocorrencias = await knex('ocorrencias')
                .select('*')
                .where('bairro', bairro);
        } else if(bairro == "Todos" && status != "Todos"){
            ocorrencias = await knex('ocorrencias')
                .select('*')
                .where('status', status);
        } else {
            ocorrencias = await knex('ocorrencias').select('*')
                .where('bairro', bairro)
                .where('status', status);
        }

        const serializedItems = ocorrencias.map((ocorrencia) => {
            return {
                id: ocorrencia.id,
                descricao: ocorrencia.descricao,   
                foto: ocorrencia.foto,
                latitude: ocorrencia.latitude,
                longitude: ocorrencia.longitude,
                reportacoes: ocorrencia.reportacoes,
                nomeUsuario: ocorrencia.nomeUsuario,
                bairro: ocorrencia.bairro,
                rua: ocorrencia.rua, 
                status: ocorrencia.status,
                data: ocorrencia.data
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

        console.log(serializedOcorrencias);
        
        return response.json(serializedOcorrencias)
    }

    async update(request: Request, response: Response) {
        const {
            id,
            status
        } = request.body;

        const trx = await knex.transaction();

        const ocorrencia = {
            id,
            status           
        };

        await trx('ocorrencias').where('id', id).update(ocorrencia);

        await trx.commit();

        return response.json({
            ...ocorrencia
        });
    }

};
export default OcorrenciasController;