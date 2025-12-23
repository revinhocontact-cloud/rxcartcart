const sql = require('../config/dbConfig');

// GET /data?type=product
exports.getData = async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.user.user_id;

    if (!type) {
      return res.status(400).json({ message: "Parâmetro 'type' é obrigatório" });
    }

    const data = await sql`
      SELECT id, content, created_at 
      FROM app_data 
      WHERE user_id = ${userId} AND type = ${type}
      ORDER BY created_at DESC
    `;

    // Flattening: Retornar o conteúdo misturado com o ID para facilitar pro frontend
    const result = data.map(item => ({
      id: item.id,
      ...item.content,
      createdAt: item.created_at
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar dados" });
  }
};

// POST /data
exports.createData = async (req, res) => {
  try {
    const { type, ...content } = req.body;
    const userId = req.user.user_id;

    if (!type) {
      return res.status(400).json({ message: "Campo 'type' é obrigatório no corpo da requisição" });
    }

    const [newItem] = await sql`
      INSERT INTO app_data (user_id, type, content)
      VALUES (${userId}, ${type}, ${content})
      RETURNING id, content, created_at
    `;

    res.status(201).json({
      id: newItem.id,
      ...newItem.content,
      createdAt: newItem.created_at
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao salvar dados" });
  }
};

// PUT /data/:id
exports.updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, ...content } = req.body; // Remove type from update payload usually
    const userId = req.user.user_id;

    const [updatedItem] = await sql`
      UPDATE app_data 
      SET content = ${content}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id, content, created_at
    `;

    if (!updatedItem) {
      return res.status(404).json({ message: "Item não encontrado ou sem permissão" });
    }

    res.status(200).json({
      id: updatedItem.id,
      ...updatedItem.content,
      createdAt: updatedItem.created_at
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar dados" });
  }
};

// DELETE /data/:id
exports.deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const result = await sql`
      DELETE FROM app_data 
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Item não encontrado" });
    }

    res.status(200).json({ message: "Item deletado com sucesso", id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar dados" });
  }
};