import Service from '../models/service.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

// @desc    Create a new service
// @route   POST /api/v1/services
// @access  Private/Admin
export const createService = catchAsync(async (req, res, next) => {
  const newService = await Service.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      service: newService
    }
  });
});

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Public
export const getAllServices = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Service.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const services = await features.query;

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services
    }
  });
});

// @desc    Get a single service
// @route   GET /api/v1/services/:id
// @access  Public
export const getService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      service
    }
  });
});

// @desc    Update a service
// @route   PATCH /api/v1/services/:id
// @access  Private/Admin
export const updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      service
    }
  });
});

// @desc    Delete a service
// @route   DELETE /api/v1/services/:id
// @access  Private/Admin
export const deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Get service statistics
// @route   GET /api/v1/services/stats
// @access  Private/Admin
export const getServiceStats = catchAsync(async (req, res, next) => {
  const stats = await Service.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$category',
        numServices: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

// @desc    Get services within a radius
// @route   GET /api/v1/services/within/:distance/center/:latlng/unit/:unit
// @access  Public
export const getServicesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const services = await Service.find({
    isActive: true,
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      data: services
    }
  });
});

export default {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
  getServiceStats,
  getServicesWithin
};
