const connection = require('../database/connection')

module.exports.addService = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { name, type, priceOptions } = req.body;
      const categoryResult = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
      const category = categoryResult.rows[0];
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      const newServiceResult = await connection.query('INSERT INTO services(category_id, name, type, price_options) VALUES($1, $2, $3, $4) RETURNING *', [categoryId, name, type, priceOptions]);
      const newService = newServiceResult.rows[0];
      return res.status(201).json({ message: 'Service added successfully', service: newService });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  module.exports.getServicesInCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const result = await connection.query('SELECT * FROM services WHERE category_id = $1', [categoryId]);
      const services = result.rows;
  
      return res.status(200).json({ services });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  module.exports.removeServiceFromCategory = async (req, res) => {
    try {
      const { categoryId, serviceId } = req.params;
      const serviceResult = await connection.query('SELECT * FROM services WHERE id = $1 AND category_id = $2', [serviceId, categoryId]);
      const service = serviceResult.rows[0];
  
      if (!service) {
        return res.status(404).json({ message: 'Service not found in the specified category' });
      }
      await connection.query('DELETE FROM services WHERE id = $1', [serviceId]);
  
      return res.status(200).json({ message: 'Service removed successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  module.exports.updateService = async (req, res) => {
    try {
      const { categoryId, serviceId } = req.params;
      const { name, type, priceOptions } = req.body;
      const serviceResult = await connection.query('SELECT * FROM services WHERE id = $1 AND category_id = $2', [serviceId, categoryId]);
      const service = serviceResult.rows[0];
      if (!service) {
        return res.status(404).json({ message: 'Service not found in the specified category' });
      }
      await connection.query('UPDATE services SET name = $1, type = $2, price_options = $3 WHERE id = $4', [name, type, priceOptions, serviceId]);
      return res.status(200).json({ message: 'Service updated successfully', service: { id: serviceId, name, type, priceOptions } });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };