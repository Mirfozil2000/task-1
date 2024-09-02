const db = require('../db');

const logAction = async (req, res) => {
    const { shop_id, plu, action, date } = req.body;

    try {
        const result = await db('action_history').insert({
            shop_id,
            plu,
            action,
            date: new Date(date)
        }).returning('*');
        res.status(201).json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getActionHistory = async (req, res) => {
    const { shop_id, plu, startDate, endDate, action, page = 1, limit = 10 } = req.query;

    try {
        const query = db('action_history').select('*');

        if (shop_id) query.where('shop_id', shop_id);
        if (plu) query.where('plu', plu);
        if (startDate) query.where('date', '>=', new Date(startDate));
        if (endDate) query.where('date', '<=', new Date(endDate));
        if (action) query.where('action', action);

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const result = await query.offset(offset).limit(parseInt(limit));
        const total = await db('action_history').count('* as count').where({ shop_id, plu }).first();

        res.json({ total: total.count, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { logAction, getActionHistory };
