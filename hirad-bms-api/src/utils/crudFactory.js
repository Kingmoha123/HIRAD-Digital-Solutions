// Generic CRUD factory — reduces boilerplate across all controllers
import mongoose from 'mongoose';

export const buildCRUD = (Model, options = {}) => {
  const { searchFields = [], defaultSort = '-createdAt', populate = '', scopeFilter = null } = options;

  // GET all with search, filter, sort, pagination
  const getAll = async (req, res) => {
    const {
      search, status, page = 1, limit = 50, sort = defaultSort,
      ...filters
    } = req.query;

    let query = {};

    if (search && searchFields.length) {
      query.$or = searchFields.map(f => ({
        [f]: { $regex: search, $options: 'i' },
      }));
    }

    if (status) query.status = status;

    // Extra filters
    Object.keys(filters).forEach(key => {
      if (!['page', 'limit', 'sort', 'mine'].includes(key)) {
        query[key] = filters[key];
      }
    });

    // Apply role-based and user-based scope filters if configured
    if (typeof scopeFilter === 'function') {
      const extra = scopeFilter(req);
      if (extra) {
        if (query.$or && extra.$or) {
          query = { $and: [{ $or: query.$or }, { $or: extra.$or }] };
        } else {
          query = { ...query, ...extra };
        }
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Model.countDocuments(query);

    let q = Model.find(query).sort(sort).skip(skip).limit(parseInt(limit));
    if (populate) q = q.populate(populate);

    const data = await q;

    res.json({
      success: true,
      count: data.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data,
    });
  };

  // GET single
  const getOne = async (req, res) => {
    let q = Model.findById(req.params.id);
    if (populate) q = q.populate(populate);
    const item = await q;

    if (!item) {
      return res.status(404).json({ success: false, message: `${Model.modelName} not found` });
    }

    res.json({ success: true, data: item });
  };

  // POST create
  const create = async (req, res) => {
    if (req.user) req.body.createdBy = req.user._id;
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item, message: `${Model.modelName} created` });
  };

  // PUT update
  const update = async (req, res) => {
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: `${Model.modelName} not found` });
    }

    res.json({ success: true, data: item, message: `${Model.modelName} updated` });
  };

  // DELETE
  const remove = async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: `${Model.modelName} not found` });
    }

    res.json({ success: true, message: `${Model.modelName} deleted` });
  };

  return { getAll, getOne, create, update, remove };
};
