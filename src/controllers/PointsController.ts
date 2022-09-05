import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async search(request: Request, response: Response) {
        const points = await knex('points').select('*');

        const serializedItems = points.map((point) => {
            return {
                id: point.id,
                imagem: point.image,
                nome: point.nome,
                email: point.email,
                whatsapp: point.whatsapp,
                latitude: point.latitude,
                longitude: point.longitude,
                endereco: point.endereco,
                descricao: point.descricao
            };
        });

        console.log(points);

        return response.json(serializedItems);
    }

    async index(request: Request, response: Response) {
        const { items } = request.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .distinct()
            .select('points.*');

        const serializedPoints = points.map((point) => {
            return {
                ...points
            };
        });

        return response.json(points)

        return response.json({ ok: true });
    }

    async delete(request: Request, response: Response){
        const { id } = request.params;

        try {
            await knex('points').delete().where('id', id);
        } catch (error) {
            console.log(error);
        }
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found.' });
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point, items });
    }

    async create(request: Request, response: Response) {
        const {
            nome,
            email,
            whatsapp,
            latitude,
            longitude,
            endereco,
            descricao,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            imagem: 'https://images.unsplash.com/photo-1528733918455-5a59687cedf0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
            nome,
            email,
            whatsapp,
            latitude,
            longitude,
            endereco,
            descricao,
        };

        const insertedIds = await trx('points').insert(point);

        const points_id = insertedIds[0];

        const pointItems = items.map((items_id: number) => {
            return {
                items_id,
                points_id
            };
        })

        await trx('points_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: points_id,
            ...point,
        })
    }

    async update(request: Request, response: Response) {
        const {
            id,
            imagem,
            nome,
            email,
            whatsapp,
            latitude,
            longitude,
            endereco,
            descricao,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            id,
            imagem,
            nome,
            email,
            whatsapp,
            latitude,
            longitude,
            endereco,
            descricao,
        };

        await trx('points').where('id', id).update(point);

        const pointItems = items.map((items_id: number) => {
            return {
                items_id,
                id
            };
        });

        await trx('points_items').where('points_id', id).delete();

        await trx('points_items').insert(pointItems);

        await trx.commit();

        return response.json({
            ...point
        });
    }
}
export default PointsController;